module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false, // Changed to false because an order should generally be tied to a user
      references: {
        model: 'users',
        key: 'id'
      }
    },
    totalAmount: { 
      type: DataTypes.DECIMAL(10, 2), 
      allowNull: false, 
      defaultValue: 0, // Default value added to prevent null values
      validate: { min: 0 }
    },
    status: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      defaultValue: 'pending', 
      validate: {
        isIn: [['pending', 'completed', 'shipped', 'cancelled']] // Added possible statuses
      }
    },
    shippingInfo: { 
      type: DataTypes.TEXT, 
      allowNull: false, 
      validate: { notEmpty: true }
    },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
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
