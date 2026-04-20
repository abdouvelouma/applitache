/**
 * Migration: Créer la table des tâches
 */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tasks', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('à faire', 'en cours', 'terminée'),
        defaultValue: 'à faire',
        allowNull: false
      },
      priority: {
        type: Sequelize.ENUM('basse', 'moyenne', 'haute'),
        defaultValue: 'moyenne',
        allowNull: false
      },
      dueDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      completedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Créer les indexes
    await queryInterface.addIndex('tasks', ['userId']);
    await queryInterface.addIndex('tasks', ['status']);
    await queryInterface.addIndex('tasks', ['priority']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tasks');
  }
};
