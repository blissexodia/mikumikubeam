module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true, // This remains true for cases where a payment might not yet be associated with an order
      references: {
        model: 'Orders',
        key: 'id'
      }
    },
    paypalOrderId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending'
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'Payments',
    timestamps: true
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' });
  };

  return Payment;
};
