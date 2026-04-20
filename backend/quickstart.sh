#!/bin/bash

# 🚀 Quick Start Script - Task Manager API
# Usage: bash quickstart.sh

set -e

clear

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║         🚀 Task Manager API - Quick Start                ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Menu
echo "Choisissez votre option de démarrage:"
echo ""
echo "1) Docker (RECOMMANDÉ - Aucune dépendance locale requise)"
echo "2) Local (Nécessite Node.js, npm et MySQL)"
echo "3) Tests uniquement"
echo "4) Documentation"
echo ""

read -p "Entrez votre choix (1-4): " choice

case $choice in
  1)
    echo ""
    echo "🐳 Démarrage avec Docker Compose..."
    echo ""
    
    if ! command -v docker &> /dev/null; then
      echo "❌ Docker n'est pas installé"
      echo "   Téléchargez depuis: https://www.docker.com/products/docker-desktop"
      exit 1
    fi
    
    docker-compose up -d
    
    echo ""
    echo "⏳ Attente du démarrage de MySQL (10 secondes)..."
    sleep 10
    
    echo ""
    echo "✅ Services démarrés!"
    echo ""
    echo "📍 Endpoints disponibles:"
    echo "   • API: http://localhost:5000/api"
    echo "   • Health: http://localhost:5000/api/health"
    echo "   • MySQL: localhost:3306"
    echo ""
    echo "📊 Logs en temps réel:"
    echo "   docker-compose logs -f api"
    echo ""
    echo "🛑 Arrêter les services:"
    echo "   docker-compose down"
    echo ""
    echo "🧪 Importer dans Postman:"
    echo "   File → Import → postman_collection.json"
    ;;
    
  2)
    echo ""
    echo "💻 Démarrage en local..."
    echo ""
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
      echo "❌ Node.js n'est pas installé"
      echo "   Téléchargez depuis: https://nodejs.org/"
      exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
      echo "❌ npm n'est pas installé"
      exit 1
    fi
    
    echo "✓ Node.js: $(node --version)"
    echo "✓ npm: $(npm --version)"
    echo ""
    
    # Installer dépendances
    echo "📦 Installation des dépendances..."
    npm install --silent
    echo "✓ Dépendances installées"
    echo ""
    
    # Vérifier .env
    if [ ! -f ".env" ]; then
      echo "⚙️  Création .env..."
      cp .env.example .env
      echo "⚠️  Éditez .env avec vos paramètres MySQL"
      exit 1
    fi
    
    # Vérifier MySQL
    echo "🗄️  Vérification MySQL..."
    if ! command -v mysql &> /dev/null; then
      echo "⚠️  mysql CLI non trouvé (optionnel)"
      echo "   Vous pouvez utiliser un GUI MySQL (DBeaver, Workbench)"
    fi
    
    echo ""
    echo "🚀 Démarrage du serveur..."
    echo ""
    npm start
    ;;
    
  3)
    echo ""
    echo "🧪 Exécution des tests..."
    echo ""
    
    if [ ! -d "node_modules" ]; then
      echo "📦 Installation des dépendances..."
      npm install --silent
    fi
    
    echo ""
    npm test
    ;;
    
  4)
    echo ""
    echo "📖 Documentation disponible:"
    echo ""
    echo "  • README.md          - Documentation principale"
    echo "  • API.md             - Endpoints API"
    echo "  • DEPLOYMENT.md      - Guide déploiement"
    echo "  • CONTRIBUTING.md    - Guide contribution"
    echo "  • STRUCTURE.md       - Structure du projet"
    echo "  • REPORT.md          - Rapport génération"
    echo ""
    
    read -p "Imprimer quelle documentation? (ex: README): " file
    
    if [ -f "${file}.md" ]; then
      less "${file}.md"
    else
      echo "❌ Fichier ${file}.md non trouvé"
    fi
    ;;
    
  *)
    echo "❌ Option invalide"
    exit 1
    ;;
esac

echo ""
echo "✨ Vous êtes prêt!"
echo ""
