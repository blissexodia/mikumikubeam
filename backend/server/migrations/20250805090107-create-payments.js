module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Payments', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      orderId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'Orders', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      paymentId: { type: Sequelize.STRING, allowNull: false, unique: true },
      paypalOrderId: { type: Sequelize.STRING, allowNull: false, unique: true },
      amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      currency: { type: Sequelize.STRING, allowNull: false, defaultValue: 'USD' },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'failed', 'refunded'),
        allowNull: false,
        defaultValue: 'pending'
      },
      isPaid: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      paymentMethod: {
        type: Sequelize.ENUM('paypal', 'qrCode', 'card', 'other'),
        allowNull: false
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Payments');
  }
};