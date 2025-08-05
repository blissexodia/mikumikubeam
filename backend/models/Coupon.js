module.exports = (sequelize, DataTypes) => {
  const Coupon = sequelize.define('Coupon', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,  // Ensure the coupon code isn't empty
      }
    },
    discount: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 100 // Discount percentage should be between 0 and 100
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true // Default is true, making coupons active by default
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,  // Ensure the expiryDate is a valid date
        isAfter: new Date().toISOString()  // Ensure the expiry date is in the future
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW // Default to current timestamp
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW // Default to current timestamp
    }
  }, {
    tableName: 'Coupons',
    timestamps: true, // Ensures timestamps (createdAt, updatedAt) are included
    paranoid: true  // Enable soft deletion
  });

  return Coupon;
};
