// models/Product.js
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 200]
      }
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        is: /^[a-z0-9-]+$/i
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    shortDescription: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    originalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    type: {
      type: DataTypes.ENUM('subscription', 'giftcard'),
      allowNull: false
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: true, // e.g., "1 month", "3 months", "1 year"
    },
    features: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null // null means unlimited
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    }
  });

  // Virtual fields
  Product.prototype.getDiscountPercentage = function() {
    if (this.originalPrice && this.originalPrice > this.price) {
      return Math.round((1 - this.price / this.originalPrice) * 100);
    }
    return 0;
  };

  // Associations
  Product.associate = function(models) {
    Product.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category'
    });
    
    Product.hasMany(models.OrderItem, {
      foreignKey: 'productId',
      as: 'orderItems'
    });
  };

  return Product;
};