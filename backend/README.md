# HidroChamado Backend API

API REST para o sistema de controle de chamados SABESP - PJI240 UNIVESP

## 🚀 Tecnologias

- **Node.js** com Express.js
- **PostgreSQL** para banco de dados
- **JWT** para autenticação
- **Jest** para testes
- **bcryptjs** para hash de senhas
- **Helmet** para segurança
- **CORS** para requisições cross-origin

## 📋 Pré-requisitos

- Node.js 16+
- PostgreSQL 12+
- npm ou yarn

## 🔧 Instalação

1. **Instalar dependências:**
```bash
cd backend
npm install
```

2. **Configurar banco de dados:**
```bash
# Criar banco de dados
psql -U postgres < database/schema.sql
```

3. **Configurar variáveis de ambiente:**
```bash
cp .env.example .env
# Editar .env com suas configurações
```

4. **Iniciar servidor:**
```bash
npm run dev
```

## 📚 API Endpoints

### Autenticação
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/registrar` - Registrar novo usuário

### Chamados
- `GET /api/chamados` - Listar chamados
- `POST /api/chamados` - Criar novo chamado
- `GET /api/chamados/:id` - Obter detalhes do chamado
- `PUT /api/chamados/:id` - Atualizar chamado

### Usuários
- `GET /api/usuarios/perfil` - Obter perfil autenticado
- `GET /api/usuarios` - Listar usuários (admin)
- `GET /api/usuarios/agentes` - Listar agentes

### Relatórios
- `GET /api/relatorios/dashboard` - Dados do painel
- `GET /api/relatorios/sla` - Relatório de SLA
- `GET /api/relatorios/desempenho-agentes` - Desempenho dos agentes

## 🧪 Testes

```bash
# Executar testes
npm test

# Modo watch
npm run test:watch

# Com cobertura
npm test -- --coverage
```

## 📖 Documentação de Autenticação

### Header Necessário
```
Authorization: Bearer <token_jwt>
```

### Funções de Usuário
- `admin` - Acesso total
- `agente` - Gerencia chamados atribuídos
- `solicitante` - Cria e acompanha seus chamados

## 🔐 Segurança

- Senhas hasheadas com bcryptjs
- Validação com express-validator
- Headers de segurança com Helmet
- CORS configurável
- JWT com expiração

## 🌐 Deployment

### Heroku
```bash
heroku create hidrochamado-api
git push heroku main
heroku config:set DATABASE_URL=...
```

### Railway/Render
Siga instruções específicas de cada plataforma.

## 📝 Licença

MIT
