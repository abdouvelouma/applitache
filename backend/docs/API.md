# API Documentation Complète

## Vue d'ensemble

L'API Task Manager est une API RESTful qui expose les endpoints suivants :

- **Base URL** : `http://localhost:5000/api`
- **Port** : 5000
- **Version** : 1.0.0
- **Authentification** : JWT (Bearer token)

---

## Codes de statut HTTP

| Code | Description |
|------|-------------|
| 200 | ✅ OK - Requête réussie |
| 201 | ✅ Created - Ressource créée |
| 400 | ❌ Bad Request - Données invalides |
| 401 | ❌ Unauthorized - Authentification nécessaire |
| 403 | ❌ Forbidden - Accès refusé |
| 404 | ❌ Not Found - Ressource inexistante |
| 409 | ❌ Conflict - Conflit (ex: email existe déjà) |
| 500 | ❌ Server Error - Erreur serveur |

---

## Structure de réponse

### Succès

```json
{
  "success": true,
  "message": "Description optionnelle",
  "data": { /* payload */ },
  "pagination": { /* optionnel */ }
}
```

### Erreur

```json
{
  "success": false,
  "message": "Description de l'erreur",
  "errors": [ /* détails optionnels */ ]
}
```

---

## Authentification

### Header requis

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token JWT

Le token contient :
- `id` : Identifiant utilisateur
- `email` : Email de l'utilisateur
- `iat` : Timestamp de création
- `exp` : Timestamp d'expiration (7 jours par défaut)

---

## Endpoints publics

### 1. POST `/auth/register`

**Description** : Enregistrer un nouvel utilisateur

**Body**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "SecurePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Réponse 201**
```json
{
  "success": true,
  "message": "Utilisateur créé avec succès",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "username",
      "firstName": "John",
      "lastName": "Doe",
      "isActive": true,
      "createdAt": "2024-04-20T12:00:00.000Z"
    },
    "token": "eyJhbGc..."
  }
}
```

**Erreurs possibles**
- 400 : Données invalides
- 409 : Email/username déjà utilisé

---

### 2. POST `/auth/login`

**Description** : Connecter un utilisateur

**Body**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Réponse 200**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "user": { /* ... */ },
    "token": "eyJhbGc..."
  }
}
```

**Erreurs possibles**
- 401 : Email ou mot de passe invalide

---

## Endpoints protégés (nécessitent un token)

### 3. GET `/auth/profile`

**Description** : Récupérer le profil de l'utilisateur connecté

**Headers**
```
Authorization: Bearer {token}
```

**Réponse 200**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "firstName": "John",
    "lastName": "Doe",
    "isActive": true
  }
}
```

---

### 4. PUT `/auth/profile`

**Description** : Mettre à jour le profil de l'utilisateur

**Headers**
```
Authorization: Bearer {token}
```

**Body** (tous optionnels)
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "username": "newusername"
}
```

**Réponse 200**
```json
{
  "success": true,
  "message": "Profil mis à jour",
  "data": { /* profil mis à jour */ }
}
```

---

### 5. GET `/auth/users`

**Description** : Récupérer tous les utilisateurs (admin)

**Headers**
```
Authorization: Bearer {token}
```

**Réponse 200**
```json
{
  "success": true,
  "data": [ /* liste des utilisateurs */ ]
}
```

---

### 6. POST `/tasks`

**Description** : Créer une nouvelle tâche

**Headers**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**
```json
{
  "title": "Titre la tâche",
  "description": "Description optionnelle",
  "status": "à faire",
  "priority": "haute",
  "dueDate": "2024-05-01T18:00:00Z"
}
```

**Champs**
| Champ | Type | Requis | Options |
|-------|------|--------|---------|
| title | string | ✅ Oui | 3-255 caractères |
| description | string | Non | Max 2000 caractères |
| status | enum | Non | "à faire", "en cours", "terminée" (défaut: "à faire") |
| priority | enum | Non | "basse", "moyenne", "haute" (défaut: "moyenne") |
| dueDate | date | Non | Format ISO 8601 |

**Réponse 201**
```json
{
  "success": true,
  "message": "Tâche créée avec succès",
  "data": {
    "id": 1,
    "title": "Titre la tâche",
    "description": "Description",
    "status": "à faire",
    "priority": "haute",
    "dueDate": "2024-05-01T18:00:00.000Z",
    "userId": 1,
    "completedAt": null,
    "createdAt": "2024-04-20T12:00:00.000Z",
    "updatedAt": "2024-04-20T12:00:00.000Z",
    "assignedTo": { /* user data */ }
  }
}
```

**Erreurs possibles**
- 401 : Token manquant ou invalide
- 400 : Données invalides

---

### 7. GET `/tasks`

**Description** : Récupérer les tâches de l'utilisateur

**Headers**
```
Authorization: Bearer {token}
```

**Query Parameters**
| Paramètre | Type | Description |
|-----------|------|-------------|
| status | string | Filtrer par statut (à faire, en cours, terminée, all) |
| priority | string | Filtrer par priorité (basse, moyenne, haute, all) |
| page | number | Numéro de page (défaut: 1) |
| limit | number | Nombre de résultats par page (défaut: 10) |

**Exemples**
```
GET /tasks
GET /tasks?status=en cours
GET /tasks?priority=haute&page=2&limit=20
GET /tasks?status=terminée&priority=basse
```

**Réponse 200**
```json
{
  "success": true,
  "data": [ /* array de tâches */ ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "pages": 3
  }
}
```

---

### 8. GET `/tasks/{id}`

**Description** : Récupérer une tâche spécifique

**Headers**
```
Authorization: Bearer {token}
```

**Path Parameters**
| Paramètre | Type | Description |
|-----------|------|-------------|
| id | number | Identifiant de la tâche |

**Réponse 200**
```json
{
  "success": true,
  "data": { /* tâche */ }
}
```

**Erreurs possibles**
- 404 : Tâche non trouvée
- 403 : Accès refusé (tâche d'un autre utilisateur)

---

### 9. PUT `/tasks/{id}`

**Description** : Mettre à jour une tâche

**Headers**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body** (tous optionnels)
```json
{
  "title": "Titre mis à jour",
  "description": "Description mise à jour",
  "status": "en cours",
  "priority": "moyenne",
  "dueDate": "2024-05-05T18:00:00Z"
}
```

**Réponse 200**
```json
{
  "success": true,
  "message": "Tâche mise à jour",
  "data": { /* tâche mise à jour */ }
}
```

**Comportement spécial**
- Si `status` = "terminée" : `completedAt` est défini à la date/heure actuelle
- Si `status` ≠ "terminée" : `completedAt` devient null

---

### 10. PATCH `/tasks/{id}/status`

**Description** : Changer rapidement le statut d'une tâche

**Headers**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**
```json
{
  "status": "terminée"
}
```

**Réponse 200**
```json
{
  "success": true,
  "message": "Statut mis à jour",
  "data": { /* tâche */ }
}
```

---

### 11. GET `/tasks/stats`

**Description** : Récupérer les statistiques des tâches

**Headers**
```
Authorization: Bearer {token}
```

**Réponse 200**
```json
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

---

### 12. DELETE `/tasks/{id}`

**Description** : Supprimer une tâche

**Headers**
```
Authorization: Bearer {token}
```

**Réponse 200**
```json
{
  "success": true,
  "message": "Tâche supprimée"
}
```

**Erreurs possibles**
- 404 : Tâche non trouvée
- 403 : Accès refusé

---

## Validation des données

### Email
- Format : email valide (RFC 5322)
- Exemple : `user@example.com`

### Mot de passe
- Minimum : 6 caractères
- Recommendation : 12+ caractères avec majuscules/chiffres/symboles

### Titre de tâche
- Minimum : 3 caractères
- Maximum : 255 caractères

### Status
```
"à faire"     # Tâche pas encore commencée
"en cours"    # Tâche en progression
"terminée"    # Tâche complétée
```

### Priority
```
"basse"       # Peut attendre
"moyenne"     # Normal
"haute"       # Urgent
```

### Date
- Format : ISO 8601
- Exemples :
  - `2024-05-01T18:00:00Z` (UTC)
  - `2024-05-01T20:00:00+02:00` (avec timezone)

---

## Gestion des erreurs

### Format d'erreur détaillé
```json
{
  "success": false,
  "message": "Erreur de validation",
  "errors": [
    {
      "field": "email",
      "message": "\"email\" doit être un email valide"
    },
    {
      "field": "password",
      "message": "\"password\" doit avoir au moins 6 caractères"
    }
  ]
}
```

### Erreurs communes

**401 Unauthorized**
```json
{
  "success": false,
  "message": "Token manquant ou format invalide"
}
```

**409 Conflict**
```json
{
  "success": false,
  "message": "Cet utilisateur existe déjà"
}
```

**404 Not Found**
```json
{
  "success": false,
  "message": "Tâche non trouvée"
}
```

---

## Rate Limiting (à implémenter)

**À ajouter pour la production** :

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1640888400
```

---

## Exemples d'utilisation

### cURL

```bash
# Enregistrement
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "user",
    "password": "Password123"
  }'

# Connexion
RESPONSE=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123"
  }')

TOKEN=$(echo $RESPONSE | jq -r '.data.token')

# Créer une tâche
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Ma tâche",
    "priority": "haute"
  }'
```

### JavaScript/Fetch

```javascript
// Enregistrement
const register = async () => {
  const res = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'user@example.com',
      username: 'user',
      password: 'Password123'
    })
  });
  return res.json();
};

// Récupérer les tâches
const getTasks = async (token) => {
  const res = await fetch('http://localhost:5000/api/tasks', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
};
```

---

## OpenAPI/Swagger

Pour générer la documentation Swagger automatiquement :

```bash
npm install swagger-jsdoc swagger-ui-express
```

Consulter les commentaires JSDoc dans les routes pour la spécification OpenAPI.

---

**Dernière mise à jour** : 20 Avril 2024
