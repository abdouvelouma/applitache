# 🚀 Guide de Déploiement

## Environnements

Ce projet supporte 3 environnements :

1. **Development** - Développement local
2. **Staging** - Pré-production pour tests
3. **Production** - Environnement utilisateurs finaux

---

## ✅ Checklist Pré-Déploiement

### 1. Tests et validation

```bash
# Tests automatisés
npm test -- --coverage

# Vérifier que la couverture est > 90%
cat coverage/coverage-summary.json

# Linting
npm run lint

# Vérifier les imports/exports
npm run dev
# Ctrl+C après vérification
```

### 2. Versions et documentation

```bash
# Vérifier la version du package.json
cat package.json | grep version

# Mettre à jour si nécessaire
npm version patch  # ou minor/major

# Vérifier les migrations pending
npm run db:migrate -- --list

# Documentation à jour
git diff HEAD -- README.md
```

### 3. Sécurité

```bash
# Vérifier les vulnérabilités npm
npm audit

# Corriger les critiques
npm audit fix

# Vérifier les secrets dans le code
grep -r "password:" . --include="*.js" --exclude-dir=node_modules
grep -r "secret:" . --include="*.js" --exclude-dir=node_modules
```

### 4. Performance

```bash
# Vérifier la taille des dépendances
npm ls --depth 0

# Analyser les temps de démarrage
time npm start
```

---

## 🗄️ Préparation de la base de données

### Backup et versioning

```bash
# Créer un backup horodaté
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mysqldump -u task_user -p task_manager_db > backups/backup_$TIMESTAMP.sql

# Versionner le backup (Git LFS recommandé en production)
git add backups/backup_$TIMESTAMP.sql
git commit -m "backup: snapshot avant déploiement"

# Ou avec S3/storage cloud
aws s3 cp backups/backup_$TIMESTAMP.sql s3://my-bucket/backups/
```

### Migrations

```bash
# En staging: Tester les migrations
npm run db:migrate

# Vérifier le schéma
mysql -u task_user -p task_manager_db -e "DESCRIBE users; DESCRIBE tasks;"

# Si OK, créer un script de migration pour production
cat > deploy/migrate-prod.sh << 'EOF'
#!/bin/bash
npm run db:migrate
if [ $? -ne 0 ]; then
  npm run db:migrate:undo
  exit 1
fi
EOF

chmod +x deploy/migrate-prod.sh
```

---

## 🏗️ Déploiement avec Docker

### Préparation

```bash
# Vérifier le Dockerfile
docker build -t task-manager-api:1.0.0 .

# Tester l'image
docker run -p 5000:5000 \
  -e NODE_ENV=production \
  -e JWT_SECRET="prod-secret" \
  task-manager-api:1.0.0

# Arrêter le test
docker stop $(docker ps -q)
```

### Déploiement production

#### Option 1: Docker Compose sur VPS

```bash
# SSH sur le serveur
ssh user@your-server.com

# Cloner le repo (ou faire un pull)
git clone https://github.com/yourname/task-manager.git
cd task-manager/backend

# Créer .env production
cat > .env.production << 'EOF'
NODE_ENV=production
PORT=5000
DB_HOST=mysql
DB_DATABASE=task_manager_db
DB_USERNAME=task_user
DB_PASSWORD=$(pwgen 20 1)  # Générer un mot de passe
JWT_SECRET=$(openssl rand -base64 32)  # Générer une clé JWT
EOF

# Démarrer les services
docker-compose -f docker-compose.prod.yml up -d

# Vérifier les logs
docker-compose logs -f api
```

#### Option 2: Kubernetes

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: task-manager-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: task-manager-api
  template:
    metadata:
      labels:
        app: task-manager-api
    spec:
      containers:
      - name: api
        image: task-manager-api:1.0.0
        ports:
        - containerPort: 5000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DB_HOST
          value: "mysql-service"
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: api-secrets
              key: jwt-secret
        resources:
          requests:
            cpu: 200m
            memory: 512Mi
          limits:
            cpu: 500m
            memory: 1Gi
```

### Reverse Proxy (Nginx)

```nginx
# /etc/nginx/sites-available/task-manager-api
upstream api {
    server localhost:5000;
}

server {
    listen 80;
    server_name api.example.com;

    # Rediriger HTTP vers HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.example.com;

    ssl_certificate /etc/letsencrypt/live/api.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.example.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        proxy_pass http://api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 📊 Monitoring et Logs

### Logs structurés

```javascript
// utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

module.exports = logger;
```

### Health Check

```bash
# Vérifier que l'API répond
curl https://api.example.com/api/health

# Monitoring avec Uptime Robot / Healthchecks.io
# URL: https://healthchecks.io/ping/uuid
curl https://hc-ping.com/uuid
```

### Metrics (Prometheus optionnel)

```javascript
// npm install prom-client
const prometheus = require('prom-client');

const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

app.get('/metrics', (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(prometheus.register.metrics());
});
```

---

## 🔄 Rollback d'urgence

### Rollback complet

```bash
# Si quelque chose s'est mal passé:

# 1. Arrêter l'application
docker-compose down

# 2. Restaurer la base de données
mysql -u task_user -p task_manager_db < backups/backup_ANCIEN.sql

# 3. Checkout la version précédente
git checkout v1.0.0
git reset --hard HEAD

# 4. Redémarrer
docker-compose up -d
```

### Rollback sans downtime

```bash
# Gardez 2 instances en prod

# 1. Démarrer nouvelle version sur port 5001
npm start --port 5001

# 2. Vérifier qu'elle marche
curl http://localhost:5001/api/health

# 3. Basculer le load balancer
# Dans Nginx: changer upstream vers nouveau port

# 4. Si pb: revenir au port 5000
# npm start --port 5000
```

---

## 📈 Scaling horizontal

### Load Balancing avec Nginx

```nginx
# /etc/nginx/sites-available/task-manager-lb
upstream api_cluster {
    least_conn;  # Round-robin recommandé pour stateless
    server api1.internal:5000;
    server api2.internal:5000;
    server api3.internal:5000;

    # Health check
    check interval=3000 rise=2 fall=5 timeout=1000 type=http;
    check_http_send "GET /api/health HTTP/1.0\r\n\r\n";
    check_http_expect_alive http_2xx;
}

server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://api_cluster;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Auto-scaling avec Docker Swarm

```bash
# Créer un service
docker service create \
  --name task-manager-api \
  --replicas 3 \
  --publish 5000:5000 \
  task-manager-api:latest

# Mettre à jour
docker service update \
  --image task-manager-api:1.1.0 \
  task-manager-api

# Scaler
docker service scale task-manager-api=5
```

---

## 🔐 Configuration Sécurité Production

```bash
# .env production - JAMAIS committer!
NODE_ENV=production

# Générer les secrets
JWT_SECRET=$(openssl rand -base64 32)
DB_PASSWORD=$(pwgen 20 1)

# Stocker de manière sécurisée:
# - Hashicorp Vault
# - AWS Secrets Manager
# - Docker Secrets (Swarm)
# - Variables d'environnement (restreint)
```

### SSL/TLS

```bash
# Certbot (Let's Encrypt)
sudo certbot certonly --standalone -d api.example.com

# Renouvellement automatique (cron)
0 0 * * * /usr/bin/certbot renew --quiet
```

---

## 📋 Checklist Post-Déploiement

- [ ] API répond: `curl https://api.example.com/api/health`
- [ ] Authentification marche: Test login
- [ ] Tests CRUD marche: Créer/lire/modifier/supprimer une tâche
- [ ] Logs regardés: `docker-compose logs -f api`
- [ ] Backup sauvegardé hors site
- [ ] Monitoring activé
- [ ] Alertes configurées
- [ ] Documentation mise à jour
- [ ] Équipe notifiée

---

## 📞 Procédure d'Urgence

**INCIDENT CRITIQUE** → Rollback IMMÉDIAT

```bash
# 1. Alerter l'équipe
# 2. Arrêter la version en prod
docker-compose down

# 3. Restaurer le backup
mysql -u task_user -p < backup_stable.sql

# 4. Démarrer l'ancienne version
git checkout v1.0.0
docker-compose up -d

# 5. Vérifier
curl https://api.example.com/api/health

# 6. Post-mortem (dans les 24h)
cat > incident-report-DATE.md << 'EOF'
# Incident Report
- Heure: ...
- Durée: ...
- Cause: ...
- Resolution: ...
- Prevention: ...
EOF
```

---

**Maintenu par : L'équipe DevOps**
