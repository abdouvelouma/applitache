/**
 * Seeder: Ajouter des tâches de test
 */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    await queryInterface.bulkInsert('tasks', [
      {
        title: 'Finir la documentation',
        description: 'Compléter la documentation du projet',
        status: 'en cours',
        priority: 'haute',
        dueDate: tomorrow,
        userId: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        title: 'Corriger les bugs',
        description: 'Corriger les bugs identifiés lors des tests',
        status: 'à faire',
        priority: 'haute',
        dueDate: nextWeek,
        userId: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        title: 'Réviser le code',
        description: 'Effectuer une revue de code',
        status: 'terminée',
        priority: 'moyenne',
        dueDate: now,
        completedAt: now,
        userId: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        title: 'Implémenter authenfication',
        description: 'Ajouter le système d\'authentification JWT',
        status: 'terminée',
        priority: 'haute',
        dueDate: now,
        completedAt: now,
        userId: 2,
        createdAt: now,
        updatedAt: now
      },
      {
        title: 'Optimiser les performances',
        description: 'Optimiser les requêtes de base de données',
        status: 'à faire',
        priority: 'basse',
        dueDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        userId: 2,
        createdAt: now,
        updatedAt: now
      },
      {
        title: 'Mettre à jour les dépendances',
        description: 'Mettre à jour npm packages',
        status: 'en cours',
        priority: 'moyenne',
        dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        userId: 3,
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tasks', null, {});
  }
};
