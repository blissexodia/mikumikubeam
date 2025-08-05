module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CartItems', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      cartId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Carts', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      productId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Products', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      quantity: { type: Sequelize.INTEGER, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('CartItems');
  }
};