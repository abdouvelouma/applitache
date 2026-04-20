/**
 * Modèle User
 * Représente un utilisateur du système
 */
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [6, 255]
      }
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });

  /**
   * Méthode pour comparer les mots de passe
   */
  User.prototype.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
  };

  /**
   * Méthode pour obtenir l'utilisateur sans le mot de passe
   */
  User.prototype.toJSON = function() {
    const user = this.get({ plain: true });
    delete user.password;
    return user;
  };

  /**
   * Associations
   */
  User.associate = (models) => {
    User.hasMany(models.Task, {
      foreignKey: 'userId',
      as: 'tasks',
      onDelete: 'CASCADE'
    });
  };

  return User;
};
