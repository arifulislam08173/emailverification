
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('emailverification', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err));

module.exports = sequelize;