const { success, error } = require('./response');
const { AuditLog } = require('../models');

const createCrudController = (Model, options = {}) => {
  const {
    name = Model.name,
    exclude = [],
    include = [],
    order = [['id', 'DESC']],
    searchFields = [],
    beforeCreate,
    beforeUpdate,
  } = options;

  const sanitize = (data) => {
    const out = { ...data };
    exclude.forEach((f) => delete out[f]);
    return out;
  };

  const audit = async (req, action, entityId, oldValue, newValue) => {
    if (!req.user) return;
    try {
      await AuditLog.create({
        userId: req.user.id,
        action,
        entity: name,
        entityId,
        oldValue,
        newValue,
        timestamp: new Date(),
      });
    } catch { /* non-blocking */ }
  };

  return {
    getAll: async (req, res) => {
      try {
        const { page = 1, limit = 50, search } = req.query;
        const where = {};
        if (search && searchFields.length) {
          const { Op } = require('sequelize');
          where[Op.or] = searchFields.map((f) => ({ [f]: { [Op.like]: `%${search}%` } }));
        }
        const { count, rows } = await Model.findAndCountAll({
          where,
          include,
          limit: Math.min(parseInt(limit), 200),
          offset: (parseInt(page) - 1) * parseInt(limit),
          order,
        });
        return success(res, { items: rows, total: count, page: parseInt(page), limit: parseInt(limit) });
      } catch (err) {
        return error(res, err.message, 500);
      }
    },

    getById: async (req, res) => {
      try {
        const item = await Model.findByPk(req.params.id, { include });
        if (!item) return error(res, `${name} not found`, 404);
        return success(res, item);
      } catch (err) {
        return error(res, err.message, 500);
      }
    },

    create: async (req, res) => {
      try {
        let data = sanitize(req.body);
        if (beforeCreate) data = await beforeCreate(data, req);
        const item = await Model.create(data);
        await audit(req, 'create', item.id, null, data);
        return success(res, item, `${name} created`, 201);
      } catch (err) {
        return error(res, err.message, 500);
      }
    },

    update: async (req, res) => {
      try {
        const item = await Model.findByPk(req.params.id);
        if (!item) return error(res, `${name} not found`, 404);
        const oldValue = item.toJSON();
        let data = sanitize(req.body);
        if (beforeUpdate) data = await beforeUpdate(data, req, item);
        await item.update(data);
        await audit(req, 'update', item.id, oldValue, data);
        return success(res, item, `${name} updated`);
      } catch (err) {
        return error(res, err.message, 500);
      }
    },

    remove: async (req, res) => {
      try {
        const item = await Model.findByPk(req.params.id);
        if (!item) return error(res, `${name} not found`, 404);
        const oldValue = item.toJSON();
        await item.destroy();
        await audit(req, 'delete', req.params.id, oldValue, null);
        return success(res, null, `${name} deleted`);
      } catch (err) {
        return error(res, err.message, 500);
      }
    },
  };
};

const createCrudRouter = (Model, options = {}) => {
  const express = require('express');
  const router = express.Router();
  const { authenticate, authorize } = require('../middlewares/auth');
  const controller = createCrudController(Model, options);
  const adminRoles = options.adminRoles || ['Super Admin', 'Admin', 'Operator'];

  router.get('/', authenticate, controller.getAll);
  router.get('/:id', authenticate, controller.getById);
  router.post('/', authenticate, authorize(...adminRoles), controller.create);
  router.put('/:id', authenticate, authorize(...adminRoles), controller.update);
  router.delete('/:id', authenticate, authorize('Super Admin', 'Admin'), controller.remove);

  return router;
};

module.exports = { createCrudController, createCrudRouter };
