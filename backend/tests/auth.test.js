/**
 * Tests d'authentification
 */
const request = require('supertest');
const app = require('../server');
const { sequelize, User, Task } = require('../models');

// Données de test
const testUser = {
  email: 'test@example.com',
  username: 'testuser',
  password: 'TestPassword123',
  firstName: 'Test',
  lastName: 'User'
};

const loginUser = {
  email: 'test@example.com',
  password: 'TestPassword123'
};

describe('Authentication Tests', () => {
  // Avant tous les tests
  beforeAll(async () => {
    try {
      await sequelize.sync({ force: true });
      console.log('Base de données réinitialisée');
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
    }
  });

  // Après tous les tests
  afterAll(async () => {
    try {
      await sequelize.close();
    } catch (error) {
      console.error('Erreur lors de la fermeture:', error);
    }
  });

  describe('POST /api/auth/register', () => {
    test('Devrait créer un nouvel utilisateur avec succès', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user.email).toBe(testUser.email);
    });

    test('Devrait rejeter l\'enregistrement avec un email existant', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.statusCode).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('existe déjà');
    });

    test('Devrait valider les données d\'entrée', async () => {
      const invalidData = {
        email: 'not-an-email',
        username: 'ab',
        password: 'short'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(invalidData);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    test('Devrait se connecter avec succès', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send(loginUser);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user.email).toBe(loginUser.email);
    });

    test('Devrait rejeter avec un email invalide', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    test('Devrait rejeter avec un mot de passe invalide', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/profile', () => {
    let authToken;

    beforeAll(async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send(loginUser);
      authToken = res.body.data.token;
    });

    test('Devrait récupérer le profil avec un token valide', async () => {
      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(testUser.email);
      expect(res.body.data).not.toHaveProperty('password');
    });

    test('Devrait rejeter sans token', async () => {
      const res = await request(app)
        .get('/api/auth/profile');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    test('Devrait rejeter avec un token invalide', async () => {
      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid_token');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/auth/profile', () => {
    let authToken;

    beforeAll(async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send(loginUser);
      authToken = res.body.data.token;
    });

    test('Devrait mettre à jour le profil', async () => {
      const updateData = {
        firstName: 'UpdatedName',
        lastName: 'UpdatedLast'
      };

      const res = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.firstName).toBe(updateData.firstName);
    });
  });
});
