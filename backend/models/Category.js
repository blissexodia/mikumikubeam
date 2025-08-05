module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [2, 100] // Ensure the name is between 2 and 100 characters
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true // Default is true, meaning the category is active by default
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
    tableName: 'Categories', 
    timestamps: true,
    paranoid: true // Enables soft deletion (adds deletedAt field)
  });

  // Associations
  Category.associate = (models) => {
    Category.hasMany(models.Product, {
      foreignKey: 'categoryId',
      as: 'products'
    });
  };

  return Category;
};
