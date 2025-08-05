const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true, len: [2, 50] }},
    lastName: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true, len: [2, 50] }},
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true }},
    password: { type: DataTypes.STRING, allowNull: false, validate: { len: [6, 255] }},
    role: { type: DataTypes.STRING, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    lastLogin: DataTypes.DATE,
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
    deletedAt: DataTypes.DATE
  }, {
    hooks: {
      beforeCreate: async user => {
        if (user.password) {
          const salt = await bcrypt.genSalt(12);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async user => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(12);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    },
    defaultScope: { attributes: { exclude: ['password'] }},
    scopes: { withPassword: { attributes: {} }},
    tableName: 'users',
    timestamps: true,
    paranoid: true
  });

  User.prototype.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
  };

  User.prototype.toJSON = function() {
    const values = {...this.get()};
    delete values.password;
    return values;
  };

  User.associate = models => {
    User.hasMany(models.Order, { foreignKey: 'userId', as: 'orders' });
    User.hasOne(models.Cart, { foreignKey: 'userId', as: 'cart' });
  };

  return User;
};