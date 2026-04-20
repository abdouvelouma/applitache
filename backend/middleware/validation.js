/**
 * Middleware de validation des données
 * Valide les données d'entrée avec Joi
 */
const Joi = require('joi');

/**
 * Valide les données d'enregistrement (register)
 */
const validateRegister = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().max(100),
    lastName: Joi.string().max(100)
  });

  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: error.details.map(e => ({
        field: e.path[0],
        message: e.message
      }))
    });
  }

  req.body = value;
  next();
};

/**
 * Valide les données de connexion (login)
 */
const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: error.details.map(e => ({
        field: e.path[0],
        message: e.message
      }))
    });
  }

  req.body = value;
  next();
};

/**
 * Valide les données de création de tâche
 */
const validateCreateTask = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    description: Joi.string().max(2000).allow(''),
    status: Joi.string().valid('à faire', 'en cours', 'terminée'),
    priority: Joi.string().valid('basse', 'moyenne', 'haute'),
    dueDate: Joi.date().allow(null)
  });

  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: error.details.map(e => ({
        field: e.path[0],
        message: e.message
      }))
    });
  }

  req.body = value;
  next();
};

/**
 * Valide les données de mise à jour de tâche
 */
const validateUpdateTask = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(255),
    description: Joi.string().max(2000).allow(''),
    status: Joi.string().valid('à faire', 'en cours', 'terminée'),
    priority: Joi.string().valid('basse', 'moyenne', 'haute'),
    dueDate: Joi.date().allow(null)
  });

  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: error.details.map(e => ({
        field: e.path[0],
        message: e.message
      }))
    });
  }

  req.body = value;
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateCreateTask,
  validateUpdateTask
};
