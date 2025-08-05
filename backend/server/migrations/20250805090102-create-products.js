module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Products', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      slug: { type: Sequelize.STRING, allowNull: false, unique: true },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      stock: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      image: { type: Sequelize.STRING, allowNull: true },
      categoryId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Categories', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Products');
  }
};