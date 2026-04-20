/**
 * Serveur principal Express avec Sequelize
 * API de gestion de tâches avec authentification JWT
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importer les modèles et la configuration Sequelize
const { sequelize } = require('./models');

// Importer les routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Initialiser Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: process.env.APP_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging simple
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

/**
 * Routes de l'API
 */
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

/**
 * Route de santé
 */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Serveur en bon état',
    timestamp: new Date().toISOString()
  });
});

/**
 * Route de racine
 */
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API de gestion de tâches',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile',
        updateProfile: 'PUT /api/auth/profile',
        users: 'GET /api/auth/users'
      },
      tasks: {
        create: 'POST /api/tasks',
        list: 'GET /api/tasks',
        stats: 'GET /api/tasks/stats',
        get: 'GET /api/tasks/:id',
        update: 'PUT /api/tasks/:id',
        delete: 'DELETE /api/tasks/:id',
        updateStatus: 'PATCH /api/tasks/:id/status'
      }
    }
  });
});

/**
 * Middleware de gestion des erreurs 404
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint non trouvé'
  });
});

/**
 * Middleware de gestion des erreurs globales
 */
app.use((err, req, res, next) => {
  console.error('Erreur globale:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur interne du serveur',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

/**
 * Démarrer le serveur et synchroniser la base de données
 */
const start = async () => {
  try {
    // Synchroniser la base de données
    await sequelize.authenticate();
    console.log('✓ Connexion à la base de données réussie');

    // Synchroniser les modèles avec la base de données
    // En production, utiliser les migrations Sequelize
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✓ Modèles synchronisés');
    } else {
      // En production, s'assurer que la base de données est à jour
      console.log('✓ Environnement production');
    }

    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log(`✓ Serveur lancé sur http://localhost:${PORT}`);
      console.log(`✓ Environnement: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('✗ Erreur au démarrage:', error);
    process.exit(1);
  }
};

// Gérer les erreurs non attrapées
process.on('unhandledRejection', (reason, promise) => {
  console.error('Promise rejetée non traitée:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Exception non attrapée:', error);
  process.exit(1);
});

// Lancer le serveur
start();

module.exports = app;
