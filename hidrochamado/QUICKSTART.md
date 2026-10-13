# 🚀 QUICK START — Começar em 5 Minutos

## Pré-requisitos (Instalar Primeiro)
- [Node.js 16+](https://nodejs.org)
- [PostgreSQL 12+](https://www.postgresql.org/download/)
- [Git](https://git-scm.com)

---

## 1️⃣ Clonar e Instalar

```bash
# Clonar
git clone https://github.com/seu-usuario/hidrochamado.git
cd hidrochamado

# Backend
cd backend
npm install

# Frontend (já pronto, serve via navegador)
cd ..
```

---

## 2️⃣ Configurar Banco de Dados

### Windows (PowerShell)
```powershell
# Abrir psql
psql -U postgres

# No psql:
CREATE DATABASE hidrochamado;
\c hidrochamado
\i 'C:\Users\seu-usuario\Desktop\HC\backend\database\schema.sql'
SELECT * FROM categorias;  # Verificar
```

### macOS/Linux
```bash
# Abrir psql
psql -U postgres

# No psql:
CREATE DATABASE hidrochamado;
\c hidrochamado
\i backend/database/schema.sql
SELECT * FROM categorias;
```

---

## 3️⃣ Configurar Variáveis (.env)

Arquivo: `backend/.env`
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hidrochamado
DB_USER=postgres
DB_PASSWORD=sua_senha_postgres
NODE_ENV=development
PORT=3000
JWT_SECRET=sua-chave-secreta-super-segura-123456
JWT_EXPIRE=24h
FRONTEND_URL=http://localhost:5000
```

---

## 4️⃣ Seedar Dados de Teste (Opcional)

```bash
cd backend
node database/seed.js
# Criará 5 usuários + 3 chamados de exemplo
```

**Usuários de Teste:**
| Email | Senha | Função |
|-------|-------|--------|
| admin@sabesp.com.br | admin123 | admin |
| carlos@sabesp.com.br | 123456 | agente |
| joao@test.com.br | 123456 | solicitante |

---

## 5️⃣ Iniciar Servidores

### Terminal 1: Backend
```bash
cd backend
npm run dev
# Backend em http://localhost:3000
# Logs: npm start
```

### Terminal 2: Frontend
```bash
# Na raiz do projeto
python -m http.server 5000
# ou
npx http-server -p 5000
# ou abra index.html diretamente

# Frontend em http://localhost:5000
```

---

## 6️⃣ Testar

```bash
# Fazer login
# URL: http://localhost:5000
# Email: admin@sabesp.com.br
# Senha: admin123
```

**Testes Automáticos:**
```bash
cd backend
npm test              # Executar
npm run test:watch   # Modo watch
```

---

## 📋 Checklist de Primeira Execução

- [ ] Node.js instalado (`node -v`)
- [ ] PostgreSQL rodando (`psql --version`)
- [ ] Banco criado (`CREATE DATABASE hidrochamado`)
- [ ] Schema carregado (`\i schema.sql`)
- [ ] `.env` configurado com credenciais
- [ ] `npm install` no backend
- [ ] Backend rodando (`npm run dev`)
- [ ] Frontend rodando (`http-server` ou navegador)
- [ ] Login funciona
- [ ] Criar um chamado de teste

---

## 🐛 Problemas Comuns

### "Connection refused"
```bash
# Verificar se PostgreSQL está rodando
pg_isready -h localhost

# Se não estiver, iniciar:
# Windows: Services → PostgreSQL
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql
```

### "Database does not exist"
```bash
# Recriar banco
psql -U postgres
CREATE DATABASE hidrochamado;
\c hidrochamado
\i backend/database/schema.sql
```

### "Port 3000 already in use"
```bash
# Mudar porta em .env
PORT=3001

# Ou matar processo:
# Windows: taskkill /PID 1234 /F
# macOS/Linux: kill -9 1234
```

### "Module not found: pg"
```bash
cd backend
npm install
```

---

## 📚 Próximas Leituras

1. **Entender a API** → `backend/README.md`
2. **Usar Git** → `GIT_GUIDE.md`
3. **Deploy** → `DEPLOYMENT.md`
4. **Acessibilidade** → `ACCESSIBILITY.md`
5. **Análise de Dados** → `DATA_ANALYSIS.md`

---

## 🎯 Objetos Principais

### Usuario (Login)
```json
{
  "email": "admin@sabesp.com.br",
  "senha": "admin123"
}
```

### Chamado (Criar)
```json
{
  "titulo": "Vazamento na Rua X",
  "descricao": "Água saindo do hidrante",
  "categoria_id": 1,
  "prioridade": "critica",
  "cep": "01310100",
  "endereco": "Av. Paulista, 1000",
  "cidade": "São Paulo",
  "bairro": "Bela Vista"
}
```

---

## 🔑 Comandos Úteis

```bash
# Backend
npm start              # Produção
npm run dev           # Desenvolvimento
npm test              # Testes
npm test -- --coverage # Com cobertura

# Git
git status
git add .
git commit -m "msg"
git push origin main

# Database
psql -U postgres      # Abrir console
\l                    # Listar databases
\c hidrochamado       # Conectar
\dt                   # Listar tabelas
SELECT * FROM usuarios; # Ver dados
```

---

## 🎉 Sucesso!

Se chegou aqui, o sistema está funcionando! 🚀

Agora explore:
- Criar chamados
- Mudar status
- Ver dashboard
- Testar com outros usuários

---

**Próximo:** Faça commit no GitHub!

```bash
git add .
git commit -m "Initial commit: HidroChamado sistema completo"
git remote add origin https://github.com/seu-usuario/hidrochamado.git
git push -u origin main
```
