# Contributing to Task Manager API

## Code Style Guide

### Conventions de nommage
- **variables/fonctions** : camelCase (`const taskId`, `function getTasks()`)
- **classes/modèles** : PascalCase (`class User`, `const User = sequelize.define()`)
- **constantes** : UPPER_SNAKE_CASE (`const MAX_RETRIES = 3`)
- **fichiers** : kebab-case pour les config, camelCase pour le code (`config/database.js`, `taskController.js`)

### Structure des fichiers

```javascript
// 1. Imports
const express = require('express');
const { Model, DataTypes } = require('sequelize');

// 2. Commentaire de description
/**
 * Description du fichier
 */

// 3. Code
// ...

// 4. Exports
module.exports = { /* ... */ };
```

### Commentaires

```javascript
/**
 * Fonction: Créer une tâche
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @returns {void}
 */
const createTask = async (req, res) => {
  // ...
};
```

### Indentation et formatage
- Indentation: 2 espaces
- Citations: simples (')
- Points-virgules: toujours
- Longueur max des lignes: 100 caractères (recommandé)

## Workflow de développement

### 1. Créer une branche
```bash
git checkout -b feature/nouvelle-fonctionnalite
# ou
git checkout -b fix/nom-du-bug
# ou
git checkout -b refactor/amelioration
```

### 2. Développer et tester
```bash
npm run dev           # Développement
npm test              # Tests
npm run lint          # Validation
npm run lint:fix      # Correction auto
```

### 3. Committer
```bash
git add .
git commit -m "feat: description courte (#123)"
# ou
git commit -m "fix: décrire le bug corrigé"
```

### 4. Push et Pull Request
```bash
git push origin feature/nouvelle-fonctionnalite
```

## Messages de commit

Format : `<type>(<scope>): <message>`

### Types
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage (pas de logique)
- `refactor`: Restructuration du code
- `test`: Ajout/modification de tests
- `chore`: Dépendances, config, etc.

### Exemple
```
feat(tasks): ajouter le filtrage par priorité
fix(auth): corriger la vérification JWT
docs(readme): mettre à jour les instructions
```

## Tests

Tous les changements doivent inclure des tests :

```bash
# Avant de committer
npm test

# Vérifier la couverture
npm run test:coverage
```

### Structure d'un test
```javascript
describe('Feature', () => {
  beforeAll(async () => {
    // Setup
  });

  afterAll(async () => {
    // Cleanup
  });

  test('Devrait faire quelque chose', async () => {
    // Arrange
    const input = { /* ... */ };
    
    // Act
    const result = await functionToTest(input);
    
    // Assert
    expect(result).toBeDefined();
  });
});
```

## Migration de la base de données

Pour ajouter une table ou modifier une structure :

```bash
# Générer une migration
npx sequelize-cli migration:generate --name describe-change

# Éditer la migration dans migrations/
# Exécuter
npm run db:migrate

# Annuler si nécessaire
npm run db:migrate:undo
```

## Versioning

Utiliser [Semantic Versioning](https://semver.org/) :
- `MAJOR.MINOR.PATCH` (ex: 1.2.3)
- `MAJOR`: Changements incompatibles
- `MINOR`: Nouvelles fonctionnalités (compatibles)
- `PATCH`: Corrections de bugs

Mettre à jour dans `package.json` :
```json
{
  "version": "1.0.0"
}
```

## Documentation

- Mettre à jour README.md pour les nouvelles fonctionnalités
- Documenter les APIs dans les commentaires JSDoc
- Ajouter des exemples dans Postman

## Checklist avant Pull Request

- [ ] Tests passent (`npm test`)
- [ ] Linting ok (`npm run lint`)
- [ ] README.md mis à jour si nécessaire
- [ ] Collection Postman mise à jour
- [ ] Pas de `console.log` en production
- [ ] Pas de `TODO` temporaires
- [ ] Variables d'environnement documentées
- [ ] Erreurs gérées proprement

## Questions?

Consulter la documentation : [README.md](README.md)
