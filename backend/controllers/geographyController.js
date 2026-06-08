const { Continent, Country, Region, City, District } = require('../models');
const { success, error } = require('../utils/response');

exports.getContinents = async (req, res) => {
  try {
    const continents = await Continent.findAll({ order: [['name', 'ASC']] });
    return success(res, continents);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getCountries = async (req, res) => {
  try {
    const where = {};
    if (req.query.continentId) where.continentId = req.query.continentId;
    const countries = await Country.findAll({ where, order: [['name', 'ASC']] });
    return success(res, countries);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getRegions = async (req, res) => {
  try {
    const where = {};
    if (req.query.countryId) where.countryId = req.query.countryId;
    const regions = await Region.findAll({ where, order: [['name', 'ASC']] });
    return success(res, regions);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getCities = async (req, res) => {
  try {
    const where = {};
    if (req.query.regionId) where.regionId = req.query.regionId;
    const cities = await City.findAll({ where, order: [['name', 'ASC']] });
    return success(res, cities);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getDistricts = async (req, res) => {
  try {
    const where = {};
    if (req.query.cityId) where.cityId = req.query.cityId;
    const districts = await District.findAll({ where, order: [['name', 'ASC']] });
    return success(res, districts);
  } catch (err) {
    return error(res, err.message, 500);
  }
};
