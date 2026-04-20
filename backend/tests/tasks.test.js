/**
 * Tests des tâches
 */
const request = require('supertest');
const app = require('../server');
const { sequelize, User, Task } = require('../models');

let authToken;
let userId;
let taskId;

const testUser = {
  email: 'tasktest@example.com',
  username: 'tasktestuser',
  password: 'TestPassword123',
  firstName: 'Task',
  lastName: 'Tester'
};

const newTask = {
  title: 'Test Task',
  description: 'Test task description',
  status: 'à faire',
  priority: 'haute',
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
};

describe('Task Tests', () => {
  beforeAll(async () => {
    try {
      await sequelize.sync({ force: true });
      
      // Créer l'utilisateur de test
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);
      
      authToken = res.body.data.token;
      userId = res.body.data.user.id;
    } catch (error) {
      console.error('Erreur lors de la setup:', error);
    }
  });

  afterAll(async () => {
    try {
      await sequelize.close();
    } catch (error) {
      console.error('Erreur lors de la fermeture:', error);
    }
  });

  describe('POST /api/tasks', () => {
    test('Devrait créer une nouvelle tâche', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newTask);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.title).toBe(newTask.title);
      expect(res.body.data.userId).toBe(userId);

      taskId = res.body.data.id;
    });

    test('Devrait rejeter sans token', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send(newTask);

      expect(res.statusCode).toBe(401);
    });

    test('Devrait rejeter avec données invalides', async () => {
      const invalidTask = {
        title: 'ab', // Trop court
        description: 'Test'
      };

      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidTask);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/tasks', () => {
    test('Devrait récupérer les tâches de l\'utilisateur', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.pagination).toHaveProperty('total');
    });

    test('Devrait filtrer par statut', async () => {
      const res = await request(app)
        .get('/api/tasks?status=à faire')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      if (res.body.data.length > 0) {
        expect(res.body.data[0].status).toBe('à faire');
      }
    });

    test('Devrait filtrer par priorité', async () => {
      const res = await request(app)
        .get('/api/tasks?priority=haute')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      if (res.body.data.length > 0) {
        expect(res.body.data[0].priority).toBe('haute');
      }
    });

    test('Devrait supporter la pagination', async () => {
      const res = await request(app)
        .get('/api/tasks?page=1&limit=5')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.limit).toBe(5);
    });
  });

  describe('GET /api/tasks/:id', () => {
    test('Devrait récupérer une tâche spécifique', async () => {
      const res = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(taskId);
    });

    test('Devrait retourner 404 pour une tâche inexistante', async () => {
      const res = await request(app)
        .get('/api/tasks/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    test('Devrait mettre à jour une tâche', async () => {
      const updateData = {
        title: 'Updated Task Title',
        status: 'en cours',
        priority: 'moyenne'
      };

      const res = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(updateData.title);
      expect(res.body.data.status).toBe(updateData.status);
    });

    test('Devrait définir completedAt quand le statut est terminée', async () => {
      const res = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'terminée' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.status).toBe('terminée');
      expect(res.body.data.completedAt).not.toBeNull();
    });
  });

  describe('PATCH /api/tasks/:id/status', () => {
    test('Devrait changer le statut d\'une tâche', async () => {
      const res = await request(app)
        .patch(`/api/tasks/${taskId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'à faire' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('à faire');
    });
  });

  describe('GET /api/tasks/stats', () => {
    test('Devrait récupérer les statistiques des tâches', async () => {
      const res = await request(app)
        .get('/api/tasks/stats')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('total');
      expect(res.body.data).toHaveProperty('completed');
      expect(res.body.data).toHaveProperty('byStatus');
      expect(res.body.data).toHaveProperty('byPriority');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    test('Devrait supprimer une tâche', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test('Devrait retourner 404 après suppression', async () => {
      const res = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(404);
    });
  });
});
