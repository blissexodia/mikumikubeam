// models/Order.js
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',  // <== lowercase to match User tableName
        key: 'id'
      }
    },
    total: { type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: { min: 0 }},
    status: { type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'), allowNull: false, defaultValue: 'pending' },
    shippingInfo: { type: DataTypes.JSONB, allowNull: false, validate: { notEmpty: true }}
  }, {
    tableName: 'Orders',
    timestamps: true
  });

  Order.associate = models => {
    Order.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'orderItems' });
    Order.hasOne(models.Payment, { foreignKey: 'orderId', as: 'payment' });
  };

  return Order;
};
