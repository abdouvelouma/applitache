#!/bin/bash

# Script de lancement du projet
# Usage: bash start.sh

set -e

echo "🚀 Démarrage de Task Manager API"
echo "===================================="
echo ""

# Vérifier si .env existe
if [ ! -f ".env" ]; then
    echo "⚠️  Fichier .env non trouvé!"
    echo "   Créez-le avec: cp .env.example .env"
    exit 1
fi

# Vérifier les dépendances
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Exécuter les migrations
echo "🗄️  Vérification des migrations..."
npm run db:migrate || echo "⚠️  Migration échouée (la DB peut avoir besoin d'être créée)"

# Lancer le serveur
echo ""
echo "✅ Démarrage du serveur..."
echo ""
npm start
