/**
 * Routes d'authentification
 */
const express = require('express');
const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validation');
const authenticate = require('../middleware/auth');

const router = express.Router();

/**
 * POST /auth/register
 * Enregistrer un nouveau utilisateur
 * Body: { email, username, password, firstName?, lastName? }
 */
router.post('/register', validateRegister, authController.register);

/**
 * POST /auth/login
 * Connecter un utilisateur
 * Body: { email, password }
 */
router.post('/login', validateLogin, authController.login);

/**
 * GET /auth/profile
 * Récupérer le profil de l'utilisateur connecté
 * Headers: Authorization: Bearer <token>
 */
router.get('/profile', authenticate, authController.getProfile);

/**
 * PUT /auth/profile
 * Mettre à jour le profil de l'utilisateur
 * Headers: Authorization: Bearer <token>
 * Body: { firstName?, lastName?, username? }
 */
router.put('/profile', authenticate, authController.updateProfile);

/**
 * GET /auth/users
 * Récupérer tous les utilisateurs (admin)
 * Headers: Authorization: Bearer <token>
 */
router.get('/users', authenticate, authController.getAllUsers);

module.exports = router;
