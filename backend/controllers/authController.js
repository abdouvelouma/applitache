/**
 * Controller d'authentification
 * Gère l'enregistrement, la connexion et les opérations utilisateur
 */
const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Enregistrement d'un nouvel utilisateur
 */
const register = async (req, res) => {
  try {
    const { email, username, password, firstName, lastName } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Cet utilisateur existe déjà'
      });
    }

    // Créer le nouvel utilisateur
    const newUser = await User.create({
      email,
      username,
      password,
      firstName: firstName || '',
      lastName: lastName || ''
    });

    // Générer le token JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production_12345',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: {
        user: newUser.toJSON(),
        token
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'enregistrement',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Connexion d'un utilisateur
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier que l'utilisateur existe
    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe invalide'
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe invalide'
      });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production_12345',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Récupérer le profil de l'utilisateur connecté
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil'
    });
  }
};

/**
 * Mettre à jour le profil de l'utilisateur
 */
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, username } = req.body;

    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Mettre à jour les champs
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (username !== undefined) {
      // Vérifier l'unicité du username
      const existingUser = await User.findOne({
        where: { username, id: { [require('sequelize').Op.ne]: req.userId } }
      });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Ce nom d\'utilisateur est déjà pris'
        });
      }
      user.username = username;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profil mis à jour',
      data: user.toJSON()
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du profil'
    });
  }
};

/**
 * Récupérer tous les utilisateurs (admin)
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des utilisateurs'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  getAllUsers
};
