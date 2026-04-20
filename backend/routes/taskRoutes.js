/**
 * Routes des tâches
 */
const express = require('express');
const taskController = require('../controllers/taskController');
const authenticate = require('../middleware/auth');
const { validateCreateTask, validateUpdateTask } = require('../middleware/validation');

const router = express.Router();

// Tous les middlewares requirent une authentification
router.use(authenticate);

/**
 * POST /tasks
 * Créer une nouvelle tâche
 * Body: { title, description?, status?, priority?, dueDate? }
 */
router.post('/', validateCreateTask, taskController.createTask);

/**
 * GET /tasks
 * Récupérer les tâches de l'utilisateur avec filtrage
 * Query: { status?, priority?, page?, limit? }
 */
router.get('/', taskController.getTasks);

/**
 * GET /tasks/stats
 * Récupérer les statistiques des tâches
 */
router.get('/stats', taskController.getTaskStats);

/**
 * GET /tasks/:id
 * Récupérer une tâche spécifique
 */
router.get('/:id', taskController.getTaskById);

/**
 * PUT /tasks/:id
 * Mettre à jour une tâche
 * Body: { title?, description?, status?, priority?, dueDate? }
 */
router.put('/:id', validateUpdateTask, taskController.updateTask);

/**
 * DELETE /tasks/:id
 * Supprimer une tâche
 */
router.delete('/:id', taskController.deleteTask);

/**
 * PATCH /tasks/:id/status
 * Changer le statut d'une tâche
 * Body: { status }
 */
router.patch('/:id/status', taskController.updateTaskStatus);

module.exports = router;
