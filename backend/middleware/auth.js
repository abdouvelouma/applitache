/**
 * Middleware d'authentification JWT
 * Vérifie la validité du token et attache l'utilisateur à la requête
 */
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    // Récupérer le token du header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token manquant ou format invalide'
      });
    }

    const token = authHeader.substring(7);

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production_12345');
    req.userId = decoded.id;
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expiré'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token invalide'
      });
    }

    res.status(401).json({
      success: false,
      message: 'Erreur d\'authentification'
    });
  }
};

module.exports = authenticate;
