/**
 * Modèle Task
 * Représente une tâche du système
 */
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [3, 255]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('à faire', 'en cours', 'terminée'),
      defaultValue: 'à faire',
      allowNull: false
    },
    priority: {
      type: DataTypes.ENUM('basse', 'moyenne', 'haute'),
      defaultValue: 'moyenne',
      allowNull: false
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true
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
    tableName: 'tasks',
    timestamps: true,
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['status']
      },
      {
        fields: ['priority']
      }
    ]
  });

  /**
   * Associations
   */
  Task.associate = (models) => {
    Task.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'assignedTo'
    });
  };

  return Task;
};
