const { Sequelize } = require('sequelize');
const config = require('./config/config.json').development;

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  port: config.port,
  dialect: config.dialect,
  dialectModule: require('pg'),
  logging: false
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection successful!');
    await sequelize.close();
  } catch (error) {
    console.error('Connection failed:', error);
  }
}

testConnection();