# 📋 Task Manager API

API RESTful complète pour la gestion de tâches avec authentification JWT et Sequelize ORM.

## 📚 Table des matières

1. [Description du projet](#description-du-projet)
2. [Choix techniques](#choix-techniques)
3. [Architecture](#architecture)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Utilisation](#utilisation)
7. [Endpoints API](#endpoints-api)
8. [Guide utilisateur](#guide-utilisateur)
9. [Maintenance et Rollback](#maintenance-et-rollback)
10. [Tests](#tests)

---

## Description du projet

**Task Manager API** est une application backend Node.js/Express pour la gestion de tâches personnelles ou d'équipe. Elle offre une expérience complète et sécurisée avec :

- ✅ Authentification JWT
- ✅ CRUD complet des tâches
- ✅ Assignation des tâches aux utilisateurs
- ✅ Statuts (à faire, en cours, terminée)
- ✅ Priorités (basse, moyenne, haute)
- ✅ Filtrage et recherche avancée
- ✅ Relations MySQL (User hasMany Task)
- ✅ Tests complets (Jest + Supertest)
- ✅ Docker & Docker Compose prêts à l'emploi
- ✅ CI/CD avec GitHub Actions

---

## 🛠 Choix techniques

### Backend
| Technologie | Version | Raison |
|---|---|---|
| **Node.js** | 20 LTS | Performance, écosystème npm mature |
| **Express.js** | ^5.2.1 | Framework web minimaliste et flexible |
| **Sequelize** | ^6.35.2 | ORM MySQL puissant avec migrations |
| **MySQL** | 8.0 | Base de données relationnelle fiable |
| **JWT** | ^9.1.2 | Authentification stateless sécurisée |
| **Bcryptjs** | ^2.4.3 | Hachage sécurisé des mots de passe |
| **Joi** | ^17.11.0 | Validation de données robuste |
| **Jest** | ^29.7.0 | Framework de test complet et rapide |
| **Docker** | Latest | Containerisation et déploiement |

### Justifications

- **Sequelize** : Offre un ORM complet avec migrations, relations automatiques et transactions
- **MySQL** : Performante pour les opérations transactionnelles et relationnnelles
- **JWT** : Pas d'état serveur, scalable horizontalement
- **Jest** : Couverture de tests complète, snapshots, mocking facile

---

## 🏗 Architecture

### Diagramme en couches

```
┌─────────────────────────────────────────┐
│         HTTP Client (Postman)           │
└────────────────────┬────────────────────┘
                     │
┌─────────────────────────────────────────┐
│ Routes (REST Endpoints)                 │
│ /api/auth/*, /api/tasks/*               │
└────────────────────┬────────────────────┘
                     │
┌─────────────────────────────────────────┐
│ Middleware Layer                        │
│ • Authentication (JWT)                  │
│ • Validation (Joi)                      │
│ • Error Handling                        │
└────────────────────┬────────────────────┘
                     │
┌─────────────────────────────────────────┐
│ Controllers                             │
│ • authController.js                     │
│ • taskController.js                     │
└────────────────────┬────────────────────┘
                     │
┌─────────────────────────────────────────┐
│ Models (Sequelize ORM)                  │
│ • User                                  │
│ • Task                                  │
└────────────────────┬────────────────────┘
                     │
┌─────────────────────────────────────────┐
│ Database (MySQL 8.0)                    │
│ • users table                           │
│ • tasks table                           │
└─────────────────────────────────────────┘
```

### Diagramme ERD (Entity Relationship Diagram)

```
┌──────────────────────┐         ┌──────────────────────┐
│       Users          │         │      Tasks           │
├──────────────────────┤         ├──────────────────────┤
│ • id (PK)            │ 1    N  │ • id (PK)            │
│ • email (UNIQUE)     ├─────────┤ • title              │
│ • username (UNIQUE)  │         │ • description        │
│ • password           │         │ • status (ENUM)      │
│ • firstName          │         │ • priority (ENUM)    │
│ • lastName           │         │ • dueDate            │
│ • avatar             │         │ • userId (FK)        │
│ • isActive           │         │ • completedAt        │
│ • createdAt          │         │ • createdAt          │
│ • updatedAt          │         │ • updatedAt          │
└──────────────────────┘         └──────────────────────┘

Relations:
- User hasMany Tasks (1:N)
- Task belongsTo User (N:1)
- Cascade delete: Quand un User est supprimé, toutes ses Tasks sont supprimées
```

---

## 📦 Installation

### Prérequis locaux

- **Node.js** >= 18.0.0 ([Télécharger](https://nodejs.org/))
- **npm** >= 8.0.0 (inclus avec Node.js)
- **MySQL** >= 8.0 ([Télécharger](https://www.mysql.com/)) OU Docker

### Installation locale (sans Docker)

#### 1. Cloner le projet

```bash
git clone <votre-repo>
cd backend
```

#### 2. Installer les dépendances

```bash
npm install
```

#### 3. Configurer les variables d'environnement

Créer un fichier `.env` :

```bash
cp .env.example .env
# Éditer .env (voir section Configuration)
```

#### 4. Créer la base de données

```bash
# Si MySQL est en local
mysql -u root -p
CREATE DATABASE task_manager_db;
CREATE USER 'task_user'@'localhost' IDENTIFIED BY 'task_secure_password_123';
GRANT ALL PRIVILEGES ON task_manager_db.* TO 'task_user'@'localhost';
FLUSH PRIVILEGES;
```

#### 5. Exécuter les migrations et seeders

```bash
npm run db:migrate
npm run db:seed
```

#### 6. Lancer le serveur

```bash
npm start
# Ou en développement avec rechargement automatique
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

---

### Installation avec Docker

#### 1. Cloner le projet

```bash
git clone <votre-repo>
cd backend
```

#### 2. Démarrer avec Docker Compose

```bash
# Démarrer les services
docker-compose up -d

# Attendre que MySQL soit prêt (5-10 secondes)
sleep 10

# Exécuter les migrations
docker-compose exec api npm run db:migrate

# Ajouter les données de test
docker-compose exec api npm run db:seed
```

#### 3. Vérifier l'installation

```bash
# Vérifier l'état des conteneurs
docker-compose ps

# Tester l'API
curl http://localhost:5000/api/health
```

#### 4. Arrêter les services

```bash
docker-compose down

# Supprimer les données (et démarrer du zéro)
docker-compose down -v
```

---

## ⚙️ Configuration

### Variables d'environnement (.env)

```bash
# Application
NODE_ENV=development              # development | production | test
PORT=5000                         # Port du serveur
APP_URL=http://localhost:5000    # URL de l'application

# Database
DB_HOST=localhost                 # Hôte MySQL (docker: mysql)
DB_PORT=3306                      # Port MySQL
DB_USERNAME=task_user             # Utilisateur MySQL
DB_PASSWORD=task_secure_password_123  # Mot de passe
DB_DATABASE=task_manager_db       # Nom de la base

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production_12345
JWT_EXPIRES_IN=7d                 # Expiration du token

# Logs
LOG_LEVEL=debug                   # debug | info | warn | error
```

### Structure des dossiers

```
backend/
├── config/                    # Configuration
│   └── database.js           # Config Sequelize
├── controllers/              # Logique métier
│   ├── authController.js    # Authentification
│   └── taskController.js    # Tâches
├── middleware/              # Middlewares
│   ├── auth.js             # Vérification JWT
│   └── validation.js       # Validation Joi
├── models/                  # Modèles Sequelize
│   ├── User.js             # Modèle User
│   ├── Task.js             # Modèle Task
│   └── index.js            # Association et export
├── routes/                  # Routes
│   ├── authRoutes.js       # Routes auth
│   └── taskRoutes.js       # Routes tasks
├── migrations/              # Migrations Sequelize
├── seeders/                 # Données de test
├── tests/                   # Tests
├── server.js               # Point d'entrée
├── package.json            # Dépendances
├── docker-compose.yml      # Orchestration Docker
├── Dockerfile              # Image Docker
├── .env                    # Variables d'environnement
└── .sequelizerc            # Config Sequelize CLI
```

---

## 🚀 Utilisation

### Démarrage rapide

#### Avec Docker (recommandé)

```bash
# Démarrer
docker-compose up -d

# Attendre 5-10 secondes, puis tester
curl http://localhost:5000/api/health

# Arrêter
docker-compose down
```

#### Sans Docker (local)

```bash
npm install
npm run db:migrate
npm run db:seed
npm start
```

### API Health Check

```bash
curl http://localhost:5000/api/health
```

Réponse :
```json
{
  "success": true,
  "message": "Serveur en bon état",
  "timestamp": "2024-04-20T12:00:00.000Z"
}
```

---

## 📡 Endpoints API

### Authentification (`/api/auth`)

#### 1. Enregistrer un nouvel utilisateur
```http
POST /api/auth/register

Body:
{
  "email": "user@example.com",
  "username": "username",
  "password": "SecurePassword123",
  "firstName": "John",
  "lastName": "Doe"
}

Response (201):
{
  "success": true,
  "message": "Utilisateur créé avec succès",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "username",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "eyJhbGc..."
  }
}
```

#### 2. Se connecter
```http
POST /api/auth/login

Body:
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}

Response (200):
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "user": { ... },
    "token": "eyJhbGc..."
  }
}
```

#### 3. Récupérer le profil
```http
GET /api/auth/profile
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### 4. Mettre à jour le profil
```http
PUT /api/auth/profile
Authorization: Bearer {token}

Body:
{
  "firstName": "Jane",
  "lastName": "Smith"
}

Response (200):
{
  "success": true,
  "message": "Profil mis à jour",
  "data": { ... }
}
```

#### 5. Récupérer tous les utilisateurs
```http
GET /api/auth/users
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": [ ... ]
}
```

---

### Tâches (`/api/tasks`)

#### 1. Créer une tâche
```http
POST /api/tasks
Authorization: Bearer {token}

Body:
{
  "title": "Ma première tâche",
  "description": "Description optionnelle",
  "status": "à faire",           # optionnel, défaut: "à faire"
  "priority": "haute",           # optionnel, défaut: "moyenne"
  "dueDate": "2024-05-01T18:00Z" # optionnel
}

Response (201):
{
  "success": true,
  "message": "Tâche créée avec succès",
  "data": {
    "id": 1,
    "title": "Ma première tâche",
    "description": "Description optionnelle",
    "status": "à faire",
    "priority": "haute",
    "dueDate": "2024-05-01T18:00:00.000Z",
    "userId": 1,
    "completedAt": null,
    "createdAt": "2024-04-20T12:00:00.000Z",
    "updatedAt": "2024-04-20T12:00:00.000Z",
    "assignedTo": { ... }
  }
}
```

#### 2. Récupérer toutes les tâches
```http
GET /api/tasks
Authorization: Bearer {token}

Query Parameters:
- status: "à faire" | "en cours" | "terminée" | "all"
- priority: "basse" | "moyenne" | "haute" | "all"
- page: 1 (par défaut)
- limit: 10 (par défaut)

Exemple:
GET /api/tasks?status=en cours&priority=haute&page=1&limit=10

Response (200):
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "pages": 3
  }
}
```

#### 3. Récupérer une tâche spécifique
```http
GET /api/tasks/:id
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": { ... }
}
```

#### 4. Mettre à jour une tâche
```http
PUT /api/tasks/:id
Authorization: Bearer {token}

Body:
{
  "title": "Titre mis à jour",
  "description": "Description mise à jour",
  "status": "en cours",
  "priority": "moyenne",
  "dueDate": "2024-05-05T18:00Z"
}

Response (200):
{
  "success": true,
  "message": "Tâche mise à jour",
  "data": { ... }
}
```

#### 5. Changer le statut d'une tâche
```http
PATCH /api/tasks/:id/status
Authorization: Bearer {token}

Body:
{
  "status": "terminée"
}

Response (200):
{
  "success": true,
  "message": "Statut mis à jour",
  "data": { ... }
}

Note: Quand status = "terminée", completedAt est automatiquement défini à la date/heure actuelle
```

#### 6. Récupérer les statistiques
```http
GET /api/tasks/stats
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "total": 10,
    "completed": 3,
    "byStatus": [
      { "status": "à faire", "count": 4 },
      { "status": "en cours", "count": 3 },
      { "status": "terminée", "count": 3 }
    ],
    "byPriority": [
      { "priority": "basse", "count": 2 },
      { "priority": "moyenne", "count": 5 },
      { "priority": "haute", "count": 3 }
    ]
  }
}
```

#### 7. Supprimer une tâche
```http
DELETE /api/tasks/:id
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Tâche supprimée"
}
```

---

## 👥 Guide utilisateur

### Scénario typique

#### 1. Enregistrement
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "username": "alice",
    "password": "SecurePassword123",
    "firstName": "Alice",
    "lastName": "Dupont"
  }'
```

Réponse :
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "eyJhbGc..."
  }
}
```

Sauvegarder le token !

#### 2. Connexion (si nécessaire)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "SecurePassword123"
  }'
```

#### 3. Créer une première tâche
```bash
TOKEN="votre_token_ici"

curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Terminer le projet",
    "description": "Finir la mise en place du système",
    "priority": "haute",
    "dueDate": "2024-05-01T18:00:00Z"
  }'
```

#### 4. Afficher toutes les tâches
```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer $TOKEN"
```

#### 5. Filtrer par statut
```bash
curl -X GET "http://localhost:5000/api/tasks?status=en cours" \
  -H "Authorization: Bearer $TOKEN"
```

#### 6. Mettre à jour une tâche
```bash
TASK_ID=1

curl -X PUT http://localhost:5000/api/tasks/$TASK_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "en cours"
  }'
```

#### 7. Marquer comme terminée
```bash
curl -X PATCH http://localhost:5000/api/tasks/$TASK_ID/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "terminée"
  }'
```

### Utiliser Postman

L'API inclut une collection Postman complète :

1. Ouvrir Postman
2. Importer le fichier `postman_collection.json`
3. Configurer l'environnement :
   - `base_url`: `http://localhost:5000/api`
   - `token`: Sera défini automatiquement après login
4. Exécuter les requêtes

---

## 🛠 Maintenance et Rollback

### Backup de la base de données

#### Backup local (MySQL)

```bash
# Créer un backup
mysqldump -u task_user -p task_manager_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurer un backup
mysql -u task_user -p task_manager_db < backup_20240420_120000.sql
```

#### Backup Docker

```bash
# Dump depuis le conteneur
docker-compose exec mysql mysqldump -u root -proot task_manager_db > backup_docker.sql

# Restaurer depuis le conteneur
docker-compose exec -T mysql mysql -u root -proot task_manager_db < backup_docker.sql
```

### Rollback de la base de données

#### Rollback avec Sequelize

```bash
# Afficher les migrations exécutées
npm run db:migrate -- --list

# Annuler la dernière migration
npm run db:migrate:undo

# Annuler une migration spécifique
npm run db:migrate:undo -- --name 20240420120100-create-tasks-table.js

# Revenir à une migration spécifique
npm run db:migrate -- --to 20240420120000-create-users-table.js
```

#### Rollback Docker

```bash
# Redémarrer la base de données (attention: supprime les données)
docker-compose down -v
docker-compose up -d mysql

# Attendre que MySQL soit prêt
sleep 10

# Ré-exécuter les migrations
docker-compose exec api npm run db:migrate
docker-compose exec api npm run db:seed
```

### Processus de déploiement

#### Avant déploiement
```bash
# 1. Exécuter les tests
npm test

# 2. Faire un backup de production
mysqldump -u task_user -p task_manager_db > backup_prod_$(date +%Y%m%d_%H%M%S).sql

# 3. Vérifier les migrants pending
npm run db:migrate -- --list
```

#### Déploiement
```bash
# 1. Pull des changements
git pull origin main

# 2. Installer les nouvelles dépendances
npm install

# 3. Exécuter les migrations
npm run db:migrate

# 4. Redémarrer l'application
npm restart
# ou avec Docker:
docker-compose up -d --build
```

#### En cas de problème
```bash
# Rollback rapide
npm run db:migrate:undo

# Redémarrer le serveur
npm start

# Ou restaurer depuis backup
mysql -u task_user -p task_manager_db < backup_prod_20240420_120000.sql
```

### Gestion des secrets

**IMPORTANT** : Les fichiers `.env` ne doivent JAMAIS être commités !

```bash
# .env inclut dans .gitignore
echo ".env" >> .gitignore

# En production, utiliser des variables d'environnement:
export NODE_ENV=production
export JWT_SECRET="votre-clé-super-secrète"
export DB_PASSWORD="mot-de-passe-sécurisé"

# Ou avec Docker Secrets:
docker secret create jwt_secret jwt_secret.txt
```

---

## 🧪 Tests

### Configuration Jest

Jest est configuré dans `jest.config.js` avec :
- Tests en `tests/**/*.test.js`
- Couverture complète des controllers et routes
- Rapport de couverture en HTML

### Exécuter les tests

```bash
# Tous les tests
npm test

# Avec affichage continu
npm run test:watch

# Rapport de couverture
npm run test:coverage

# Tests spécifiques
npm test -- tests/auth.test.js
```

### Suite de tests

#### Tests d'authentification (15 scénarios)
```
✓ POST /auth/register - Créer un nouvel utilisateur
✓ POST /auth/register - Rejeter l'email existant
✓ POST /auth/register - Valider les données
✓ POST /auth/login - Connexion réussie
✓ POST /auth/login - Email invalide
✓ POST /auth/login - Mot de passe invalide
✓ GET /auth/profile - Récupérer le profil
✓ GET /auth/profile - Rejeter sans token
✓ GET /auth/profile - Token invalide
✓ PUT /auth/profile - Mettre à jour le profil
✓ GET /auth/users - Récupérer tous les utilisateurs
... (5 tests supplémentaires)
```

#### Tests des tâches (15+ scénarios)
```
✓ POST /tasks - Créer une tâche
✓ POST /tasks - Rejeter sans token
✓ POST /tasks - Rejeter données invalides
✓ GET /tasks - Récupérer les tâches
✓ GET /tasks - Filtrer par statut
✓ GET /tasks - Filtrer par priorité
✓ GET /tasks - Pagination
✓ GET /tasks/:id - Récupérer une tâche
✓ GET /tasks/:id - Tâche non trouvée
✓ PUT /tasks/:id - Mettre à jour
✓ PUT /tasks/:id - Définir completedAt
✓ PATCH /tasks/:id/status - Changer statut
✓ GET /tasks/stats - Récupérer statistiques
✓ DELETE /tasks/:id - Supprimer tâche
✓ DELETE /tasks/:id - Vérifier suppression
```

### Couverture cible

```
Statements   : 90%+
Branches     : 85%+
Functions    : 90%+
Lines        : 90%+
```

---

## 🐳 Docker - Commandes utiles

```bash
# Démarrer les services
docker-compose up -d

# Arrêter les services
docker-compose down

# Voir les logs
docker-compose logs -f api
docker-compose logs -f mysql

# Accéder au shell MySQL
docker-compose exec mysql mysql -u root -proot

# Accéder au shell Node
docker-compose exec api /bin/sh

# Redémarrer un service
docker-compose restart api

# Supprimer tout et recommencer
docker-compose down -v
docker-compose up -d
```

---

## 🔐 Sécurité

### Bonnes pratiques implémentées

- ✅ Hachage bcrypt des mots de passe (10 rounds)
- ✅ Validation avec Joi
- ✅ JWT avec expiration (7 jours par défaut)
- ✅ CORS activé mais config à ajuster en production
- ✅ Erreurs génériques (pas de détails sensibles)
- ✅ Rate limiting recommandé (non implémenté, voir express-rate-limit)
- ✅ HTTPS obligatoire en production

### À faire pour la production

```javascript
// 1. Ajouter rate limiting
npm install express-rate-limit

// 2. HTTPS/SSL
# Entre load balancer/reverse proxy et API

// 3. Valider JWT_SECRET
# Utiliser un vrai secret aléatoire et complexe

// 4. CORS restrictif
app.use(cors({
  origin: ['https://yourdomain.com'],
  credentials: true
}));

// 5. Helmet pour les headers de sécurité
npm install helmet
const helmet = require('helmet');
app.use(helmet());

// 6. Logging sécurisé
# Logger les erreurs, pas les données sensibles
```

---

## 📋 Checklist de déploiement

- [ ] Tests passent (`npm test`)
- [ ] Changements versionnés du .sequelizerc
- [ ] Backup créé avant migration
- [ ] Migrations testées en staging
- [ ] Variables d'environnement production configurées
- [ ] JWT_SECRET changé
- [ ] DB_PASSWORD sécurisé
- [ ] HTTPS activé
- [ ] CORS configuré correctement
- [ ] Rate limiting activé
- [ ] Logging en place
- [ ] Monitoring configuré
- [ ] Plan de rollback prêt

---

## 🤝 Support et Contribution

Pour les questions ou bugs :
1. Vérifier les logs : `docker-compose logs -f`
2. Exécuter les tests : `npm test`
3. Consulter les endpoints : `GET /api/`

---

## 📝 License

MIT

---

**Créé avec ❤️ pour la gestion efficace de tâches**
