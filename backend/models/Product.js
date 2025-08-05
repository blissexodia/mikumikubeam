module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 255]
      }
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      // You might want to add a custom validation to ensure slug is SEO friendly
      validate: {
        notEmpty: true,
        len: [2, 255]
      }
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true // You could change this to false if every product must have an image
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id'
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  }, {
    tableName: 'Products',
    timestamps: true
  });

  Product.associate = (models) => {
    Product.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category'
    });
    Product.hasMany(models.CartItem, {
      foreignKey: 'productId',
      as: 'cartItems'
    });
    Product.hasMany(models.OrderItem, {
      foreignKey: 'productId',
      as: 'orderItems'
    });
  };

  return Product;
};
