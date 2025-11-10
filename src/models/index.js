'use strict';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

fs.readdirSync(__dirname)
  .filter(f => f !== path.basename(__filename) && f.endsWith('.js'))
  .forEach(f => {
    const model = require(path.join(__dirname, f))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(name => {
  if (db[name].associate) db[name].associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
