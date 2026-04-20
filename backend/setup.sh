#!/bin/bash

# Script de setup initial du projet
# Usage: bash setup.sh

set -e

echo "🚀 Setup de Task Manager API"
echo "=============================="
echo ""

# Vérifier les prérequis
echo "📋 Vérification des prérequis..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi

echo "✓ Node.js: $(node --version)"
echo "✓ npm: $(npm --version)"
echo ""

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install
echo "✓ Dépendances installées"
echo ""

# Configurer .env
if [ ! -f ".env" ]; then
    echo "⚙️  Création du fichier .env..."
    cp .env.example .env
    echo "✓ Fichier .env créé (veuillez le configurer)"
else
    echo "ℹ️  Fichier .env existe déjà"
fi
echo ""

# Créer les tables Sequelize
echo "🗄️  Configuration de la base de données..."

if command -v sequelize &> /dev/null; then
    echo "✓ Sequelize CLI détecté"
    echo "  Exécutez: npm run db:migrate && npm run db:seed"
else
    echo "ℹ️  Sequelize CLI non trouvé globalement"
    echo "  Exécutez: npm run db:migrate && npm run db:seed"
fi
echo ""

echo ""
echo "✅ Setup terminé!"
echo ""
echo "📚 Prochaines étapes:"
echo "  1. Configurer .env avec vos paramètres"
echo "  2. Exécuter: npm run db:migrate"
echo "  3. Exécuter: npm run db:seed (optionnel)"
echo "  4. Lancer: npm start"
echo ""
echo "🐳 Avec Docker:"
echo "  1. docker-compose up -d"
echo "  2. docker-compose logs -f"
echo ""
