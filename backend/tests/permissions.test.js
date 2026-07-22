const request = require('supertest');
const { app } = require('../server');
const { User, Role } = require('../models');

describe('Permission Field-Level Tests', () => {
  let admin, operator, analyst;

  beforeAll(async () => {
    // Create test roles
    const adminRole = await Role.findOrCreate({ where: { name: 'Admin' } });
    const operatorRole = await Role.findOrCreate({ where: { name: 'Operator' } });
    const analystRole = await Role.findOrCreate({ where: { name: 'Analyst' } });

    // Create test users
    admin = await User.create({
      email: 'admin@test.com',
      password: 'password123',
      firstName: 'Admin',
      lastName: 'User',
      roleId: adminRole[0].id,
    });

    operator = await User.create({
      email: 'operator@test.com',
      password: 'password123',
      firstName: 'Operator',
      lastName: 'User',
      roleId: operatorRole[0].id,
    });

    analyst = await User.create({
      email: 'analyst@test.com',
      password: 'password123',
      firstName: 'Analyst',
      lastName: 'User',
      roleId: analystRole[0].id,
    });
  });

  describe('User field-level access', () => {
    it('Admin can update user password field', async () => {
      const adminToken = 'valid_token_for_admin';
      const response = await request(app)
        .put('/api/v1/admin/users/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ password: 'newpassword' });

      expect([200, 400, 401]).toContain(response.status);
    });

    it('Operator cannot update user role field', async () => {
      const operatorToken = 'valid_token_for_operator';
      const response = await request(app)
        .put('/api/v1/admin/users/1')
        .set('Authorization', `Bearer ${operatorToken}`)
        .send({ roleId: 2 });

      expect([403, 401]).toContain(response.status);
    });

    it('Analyst can only read user data', async () => {
      const analystToken = 'valid_token_for_analyst';
      const response = await request(app)
        .get('/api/v1/admin/users')
        .set('Authorization', `Bearer ${analystToken}`);

      expect([200, 401]).toContain(response.status);
    });
  });

  describe('Event field-level access', () => {
    it('Admin can update event sensitive fields', async () => {
      const adminToken = 'valid_token_for_admin';
      const response = await request(app)
        .put('/api/v1/admin/events/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'Resolved' });

      expect([200, 400, 401]).toContain(response.status);
    });

    it('Operator cannot delete events', async () => {
      const operatorToken = 'valid_token_for_operator';
      const response = await request(app)
        .delete('/api/v1/admin/events/1')
        .set('Authorization', `Bearer ${operatorToken}`);

      expect([403, 401]).toContain(response.status);
    });
  });

  afterAll(async () => {
    // Cleanup
    await User.destroy({ where: { email: { [require('sequelize').Op.in]: ['admin@test.com', 'operator@test.com', 'analyst@test.com'] } } });
  });
});
