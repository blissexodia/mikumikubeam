const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const db = {};

// Import models
db.User = require('./User')(sequelize, Sequelize.DataTypes);
db.Category = require('./Category')(sequelize, Sequelize.DataTypes);
db.Product = require('./Product')(sequelize, Sequelize.DataTypes);
db.Order = require('./Order')(sequelize, Sequelize.DataTypes);
db.OrderItem = require('./OrderItem')(sequelize, Sequelize.DataTypes);
db.Coupon = require('./Coupon')(sequelize, Sequelize.DataTypes);
db.Payment = require('./Payment')(sequelize, Sequelize.DataTypes);
const { Cart, CartItem } = require('./Cart')(sequelize, Sequelize.DataTypes);
db.Cart = Cart;
db.CartItem = CartItem;

// Define associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;