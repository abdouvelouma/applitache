require('dotenv').config();

/**
 * Configuration de la base de données Sequelize
 * Supporte développement, test et production
 */
module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'task_user',
    password: process.env.DB_PASSWORD || 'task_password',
    database: process.env.DB_DATABASE || 'task_manager_db',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  test: {
    username: 'root',
    password: 'root',
    database: 'task_manager_test',
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    logging: false,
    storage: ':memory:',
    pool: {
      max: 1,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000
    }
  }
};
