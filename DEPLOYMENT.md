# 🚀 Guia de Deploy em Nuvem

Este guia explica como fazer deploy do HidroChamado em diferentes plataformas de nuvem.

---

## 🎯 Opções de Deploy

| Plataforma | Custo | Backend | BD | Facilidade | Recomendado |
|-----------|-------|---------|-----|-----------|------------|
| **Heroku** | $7-50/mês | ✅ | ✅ | ⭐⭐⭐⭐ | ✅ Iniciantes |
| **Railway** | $5+/mês | ✅ | ✅ | ⭐⭐⭐⭐⭐ | ✅ Melhor relação |
| **Render** | Gratuito* | ✅ | ✅ | ⭐⭐⭐⭐ | ✅ Gratuito |
| **AWS** | $0-100+/mês | ✅ | ✅ | ⭐⭐ | Para escala |
| **DigitalOcean** | $5+/mês | ✅ | ✅ | ⭐⭐⭐ | VPS tradicional |
| **Google Cloud** | $0-100+/mês | ✅ | ✅ | ⭐⭐ | Enterprise |

*Render oferece tier gratuito limitado (10GB BD, 0.5 CPU)

---

## 1️⃣ HEROKU (Mais Popular)

### Pré-requisitos
- Conta [Heroku](https://www.heroku.com)
- Heroku CLI instalada
- Repositório Git

### Instalação do Heroku CLI

**Windows (PowerShell):**
```powershell
choco install heroku-cli
# ou download em https://devcenter.heroku.com/articles/heroku-cli
```

**macOS:**
```bash
brew tap heroku/brew && brew install heroku
```

**Linux:**
```bash
curl https://cli-assets.heroku.com/install.sh | sh
```

### Deploy Passo a Passo

#### 1. Login
```bash
heroku login
# Abre navegador para autenticação
```

#### 2. Criar App
```bash
cd c:\Users\dell\Desktop\HC

heroku create seu-app-hidrochamado
# Exemplo: hidrochamado-univesp-2026
```

#### 3. Criar Banco de Dados
```bash
# Adicionar addon PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev --app seu-app-hidrochamado
# hobby-dev = gratuito (limitado)
# standard-0 = pago ($50/mês)
```

Heroku fornecerá `DATABASE_URL` automaticamente.

#### 4. Configurar Variáveis de Ambiente
```bash
heroku config:set NODE_ENV=production --app seu-app-hidrochamado
heroku config:set JWT_SECRET=sua_chave_super_secreta_aqui --app seu-app-hidrochamado
heroku config:set FRONTEND_URL=https://seu-app-hidrochamado.herokuapp.com --app seu-app-hidrochamado

# Verificar
heroku config --app seu-app-hidrochamado
```

#### 5. Criar Procfile

Arquivo: `Procfile` (na raiz)
```
web: npm start --prefix backend
```

#### 6. Deploy
```bash
# Heroku detecta que está tudo no repositório
git push heroku main

# Acompanhar logs
heroku logs --tail --app seu-app-hidrochamado
```

#### 7. Inicializar Banco de Dados
```bash
# Executar schema SQL no Heroku
heroku pg:psql --app seu-app-hidrochamado < backend/database/schema.sql

# Seedar dados (opcional)
heroku run "node backend/database/seed.js" --app seu-app-hidrochamado
```

#### 8. Acessar
```
https://seu-app-hidrochamado.herokuapp.com/
```

### Monitoramento
```bash
heroku logs --tail                      # Logs em tempo real
heroku logs --tail -a seu-app           # Específico do app
heroku ps                               # Processos rodando
heroku open                             # Abrir app no navegador
```

### Escalar Dyno
```bash
# Aumentar capacidade (pago)
heroku ps:scale web=2  # 2 processes
```

---

## 2️⃣ RAILWAY.APP (Recomendado)

Railway é mais novo e oferece melhor experiência.

### Pré-requisitos
- Conta [Railway](https://railway.app)
- Railway CLI (ou GitHub login)

### Deploy Passo a Passo

#### 1. Instalar Railway CLI
```powershell
npm i -g @railway/cli
```

#### 2. Login
```bash
railway login
# Abre navegador
```

#### 3. Inicializar Projeto
```bash
cd c:\Users\dell\Desktop\HC
railway init
# Seguir instruções interativas
```

#### 4. Criar PostgreSQL
```bash
railway add
# Selecionar PostgreSQL
```

#### 5. Configurar Variáveis
```bash
railway variables
# Adicionar:
NODE_ENV=production
JWT_SECRET=sua_chave_aqui
FRONTEND_URL=https://seu-dominio.com
```

#### 6. Deploy
```bash
railway up
# ou
git push  # Se usando GitHub
```

#### 7. Ver Status
```bash
railway status
railway logs
```

#### 8. Acessar
```
https://seu-projeto-xxxxx.railway.app/
```

**Vantagens:**
- Melhor UX que Heroku
- Pricing mais justo
- Sem "dyno hours" limitadas
- Dashboard intuitivo

---

## 3️⃣ RENDER (Gratuito)

### Pré-requisitos
- Conta [Render](https://render.com)
- Repositório GitHub conectado

### Deploy via GUI

1. **Conectar GitHub**
   - Ir em Dashboard → New Web Service
   - Conectar repositório GitHub
   - Selecionar branch `main`

2. **Configurar Build**
   - Build Command: `npm install --prefix backend`
   - Start Command: `npm start --prefix backend`

3. **Adicionar PostgreSQL**
   - Dashboard → New PostgreSQL
   - Name: `hidrochamado-db`
   - Render fornecerá `DATABASE_URL`

4. **Configurar Variáveis**
   - Environment → Add Environment Variable
   - NODE_ENV: `production`
   - JWT_SECRET: `sua_chave_aqui`
   - DATABASE_URL: (automático)

5. **Deploy**
   - Clicar "Deploy"
   - Acompanhar build
   - Render fornecerá URL

---

## 4️⃣ DOCKER + AWS/GOOGLE CLOUD

Para maior controle e escalabilidade.

### Criar Dockerfile

Arquivo: `Dockerfile` (raiz)
```dockerfile
FROM node:16-alpine

WORKDIR /app

# Backend
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production

# Frontend
COPY . .

EXPOSE 3000

CMD ["npm", "start", "--prefix", "backend"]
```

### Build Localmente
```bash
docker build -t hidrochamado:latest .
docker run -p 3000:3000 hidrochamado:latest
```

### Deploy em AWS (Elastic Beanstalk)
```bash
# Instalar EB CLI
pip install awsebcli

# Inicializar
eb init -p "Node.js 16 running on 64bit Amazon Linux 2" hidrochamado

# Deploy
eb create hidrochamado-env
eb deploy
```

### Deploy em Google Cloud (Cloud Run)
```bash
gcloud run deploy hidrochamado \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## 📊 Comparação Rápida: Qual Escolher?

### Para Aprender (Aluno)
✅ **Railway** ou **Render**
- Gratuito ou barato
- Fácil de usar
- Dashboard amigável

### Para Produção Pequena
✅ **Railway** ou **Heroku**
- Confiável
- Pricing previsível
- Suporte bom

### Para Escala
✅ **AWS** ou **Google Cloud**
- Auto-scaling
- Mais controle
- Integração com serviços

### Para Aprender DevOps
✅ **Docker + DigitalOcean VPS**
- Controle total
- Melhor aprendizado
- Mais barato em escala

---

## 🔄 Automação: GitHub Actions Deploy

### Arquivo: `.github/workflows/deploy.yml`

```yaml
name: Deploy to Railway

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Railway
        run: |
          npm i -g @railway/cli
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

### Configurar Secret
1. GitHub → Settings → Secrets
2. Add `RAILWAY_TOKEN`
3. Gerar token em Railway → Account → API Token

---

## 🌍 Configurar Domínio Customizado

### Em Heroku
```bash
heroku domains:add seu-dominio.com.br
# Heroku fornecerá CNAME
```

Ir em seu registrador de domínio (GoDaddy, NameCheap, etc):
- Adicionar CNAME → `seu-app.herokuapp.com`

### Em Railway
- Railway → Settings → Custom Domain
- Adicionar domínio
- Copiar CNAME que é fornecido
- Adicionar em seu registrador

### SSL/TLS (HTTPS)
- Heroku: Automático (*.herokuapp.com)
- Railway: Automático para custom domain
- Render: Automático via Let's Encrypt

---

## 📈 Monitoramento em Produção

### Logs
```bash
# Heroku
heroku logs --tail

# Railway
railway logs

# Render (via Dashboard)
```

### Métricas
- **CPU/Memória:** Dashboard da plataforma
- **Erro:** Integrar Sentry
- **Performance:** Integrar New Relic ou Datadog

### Alertas
```bash
# Heroku (pago)
heroku alerts:create --threshold=95 --ops=gte

# Railway/Render: Usar Uptime Robot (gratuito)
```

---

## 🔐 Segurança em Produção

```bash
# Gerar JWT Secret seguro
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Resultado (exemplo):
# a3f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0

# Copiar para variável de ambiente
heroku config:set JWT_SECRET=<saída_do_comando>
```

### Checklist Segurança
- ✅ JWT_SECRET aleatório e forte
- ✅ Variáveis sensíveis em Environment
- ✅ CORS configurado (não '*')
- ✅ Helmet headers ativado
- ✅ HTTPS forçado
- ✅ SQL parametrizado (sem injeção)
- ✅ Rate limiting em endpoints
- ✅ Validação de entrada

---

## 🐛 Troubleshooting

### "Conexão com BD falhou"
```bash
# Verificar DATABASE_URL
heroku config:get DATABASE_URL

# Testar conexão
heroku pg:psql
```

### "Application Error"
```bash
# Ver logs detalhados
heroku logs --tail

# Verificar dyno status
heroku ps
```

### "Build falhou"
```bash
# Ver build log
git push heroku main -v

# Limpar cache
heroku builds:cache:purge
```

### "Timeout ao conectar BD"
- Aumentar `timeout` no connection pool
- Usar `pool.max` menor se em tier gratuito
- Considerar upgrade de plano

---

## 📞 URLs de Referência

- [Heroku Docs](https://devcenter.heroku.com)
- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [Docker Docs](https://docs.docker.com)
- [GitHub Actions](https://docs.github.com/en/actions)

---

**Status:** ✅ Pronto para Deploy

**Próximo Passo:** Análise de Dados Avançada
