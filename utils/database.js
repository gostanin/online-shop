const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'nodejs', 'nodejspassword', { dialect: 'mysql', host: 'localhost' })

module.exports = sequelize;