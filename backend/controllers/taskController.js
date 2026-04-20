/**
 * Controller des tâches
 * Gère le CRUD complet des tâches avec filtrage
 */
const { Task, User } = require('../models');
const { Op } = require('sequelize');

/**
 * Créer une nouvelle tâche
 */
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description: description || '',
      status: status || 'à faire',
      priority: priority || 'moyenne',
      dueDate: dueDate || null,
      userId: req.userId
    });

    const taskWithUser = await Task.findByPk(task.id, {
      include: [{
        model: User,
        as: 'assignedTo',
        attributes: { exclude: ['password'] }
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Tâche créée avec succès',
      data: taskWithUser
    });
  } catch (error) {
    console.error('Erreur lors de la création de la tâche:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la tâche'
    });
  }
};

/**
 * Récupérer toutes les tâches de l'utilisateur avec filtrage
 */
const getTasks = async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Construire les filtres
    const where = { userId: req.userId };

    if (status && status !== 'all') {
      where.status = status;
    }

    if (priority && priority !== 'all') {
      where.priority = priority;
    }

    // Récupérer les tâches
    const { count, rows } = await Task.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'assignedTo',
        attributes: { exclude: ['password'] }
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des tâches'
    });
  }
};

/**
 * Récupérer une tâche spécifique
 */
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByPk(id, {
      include: [{
        model: User,
        as: 'assignedTo',
        attributes: { exclude: ['password'] }
      }]
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tâche non trouvée'
      });
    }

    // Vérifier que l'utilisateur a accès à cette tâche
    if (task.userId !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la tâche:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la tâche'
    });
  }
};

/**
 * Mettre à jour une tâche
 */
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tâche non trouvée'
      });
    }

    // Vérifier que l'utilisateur a accès à cette tâche
    if (task.userId !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé'
      });
    }

    // Mettre à jour les champs fournis
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) {
      task.status = status;
      // Marquer comme complétée si le statut est "terminée"
      if (status === 'terminée' && !task.completedAt) {
        task.completedAt = new Date();
      } else if (status !== 'terminée') {
        task.completedAt = null;
      }
    }
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();

    const updatedTask = await Task.findByPk(id, {
      include: [{
        model: User,
        as: 'assignedTo',
        attributes: { exclude: ['password'] }
      }]
    });

    res.json({
      success: true,
      message: 'Tâche mise à jour',
      data: updatedTask
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la tâche:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la tâche'
    });
  }
};

/**
 * Supprimer une tâche
 */
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tâche non trouvée'
      });
    }

    // Vérifier que l'utilisateur a accès à cette tâche
    if (task.userId !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé'
      });
    }

    await task.destroy();

    res.json({
      success: true,
      message: 'Tâche supprimée'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la tâche:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la tâche'
    });
  }
};

/**
 * Changer le statut d'une tâche (raccourci)
 */
const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['à faire', 'en cours', 'terminée'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide'
      });
    }

    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tâche non trouvée'
      });
    }

    // Vérifier que l'utilisateur a accès à cette tâche
    if (task.userId !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé'
      });
    }

    task.status = status;
    if (status === 'terminée' && !task.completedAt) {
      task.completedAt = new Date();
    } else if (status !== 'terminée') {
      task.completedAt = null;
    }

    await task.save();

    const updatedTask = await Task.findByPk(id, {
      include: [{
        model: User,
        as: 'assignedTo',
        attributes: { exclude: ['password'] }
      }]
    });

    res.json({
      success: true,
      message: 'Statut mis à jour',
      data: updatedTask
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut'
    });
  }
};

/**
 * Récupérer les statistiques des tâches
 */
const getTaskStats = async (req, res) => {
  try {
    const stats = await Task.findAll({
      where: { userId: req.userId },
      attributes: [
        'status',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    const priorityStats = await Task.findAll({
      where: { userId: req.userId },
      attributes: [
        'priority',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['priority'],
      raw: true
    });

    const total = await Task.count({ where: { userId: req.userId } });
    const completed = await Task.count({ where: { userId: req.userId, status: 'terminée' } });

    res.json({
      success: true,
      data: {
        total,
        completed,
        byStatus: stats,
        byPriority: priorityStats
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des stats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des stats'
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getTaskStats
};
