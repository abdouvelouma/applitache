/**
 * Seeder: Ajouter des utilisateurs de test
 */
'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword1 = await bcrypt.hash('password123', 10);
    const hashedPassword2 = await bcrypt.hash('password456', 10);
    const hashedPassword3 = await bcrypt.hash('password789', 10);

    await queryInterface.bulkInsert('users', [
      {
        email: 'alice@example.com',
        username: 'alice',
        password: hashedPassword1,
        firstName: 'Alice',
        lastName: 'Dupont',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'bob@example.com',
        username: 'bob',
        password: hashedPassword2,
        firstName: 'Bob',
        lastName: 'Martin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'carol@example.com',
        username: 'carol',
        password: hashedPassword3,
        firstName: 'Carol',
        lastName: 'Pierre',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
