/**
 * Index des modèles Sequelize
 * Charge automatiquement tous les modèles et établit les associations
 */
const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

const config = require('../config/database.js');

const env = process.env.NODE_ENV || 'development';
const sequelize = new Sequelize(
  config[env].database,
  config[env].username,
  config[env].password,
  config[env]
);

const models = {};

// Charger tous les modèles
fs.readdirSync(__dirname)
  .filter(file => file.endsWith('.js') && file !== 'index.js')
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    models[model.name] = model;
  });

// Établir les associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
