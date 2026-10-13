# HidroChamado — Sistema de Controle de Chamados SABESP

Sistema de chamados para a SABESP, desenvolvido como projeto PJI240 da UNIVESP.

## Status do Projeto

✅ **Projeto corrigido e funcionando** com SQLite (sem necessidade de PostgreSQL externo).

## Inconsistências Encontradas e Corrigidas

Durante a análise comparativa entre o arquivo local `HC.zip` e o repositório GitHub (`Acting24/hidrochamado`), foram identificadas as seguintes inconsistências:

### 1. Arquivos ausentes no `HC.zip` local

O `HC.zip` enviado pelo usuário continha apenas a pasta `backend/` sem as subpastas críticas. Os seguintes arquivos existiam no GitHub mas estavam ausentes no pacote local:

| Arquivo ausente no `HC.zip` | Função |
|------------------------------|--------|
| `backend/routes/auth.js` | Rotas de login/registro (CRÍTICO — importado por server.js) |
| `backend/routes/chamados.js` | Rotas de CRUD de chamados (CRÍTICO — importado por server.js) |
| `backend/routes/usuarios.js` | Rotas de usuários (CRÍTICO — importado por server.js) |
| `backend/routes/relatorios.js` | Rotas de relatórios/dashboard (CRÍTICO — importado por server.js) |
| `backend/__tests__/auth.test.js` | Testes de autenticação |
| `backend/__tests__/chamados.test.js` | Testes de chamados |
| `index.html` | Frontend da aplicação |
| `css/style.css` | Estilos do frontend |
| `js/app.js` | Lógica principal do frontend |
| `js/api.js` | Cliente da API no frontend |
| `js/app-api-integration.js` | Integração entre app e API |
| Documentação `.md` (12 arquivos) | Guias e documentação do projeto |

**Consequência direta**: o backend do `HC.zip` **não iniciava** — o `server.js` faz `import` de `./routes/*.js`, e esses arquivos não existiam no pacote local. A aplicação quebrava com erro `Cannot find module`.

### 2. Arquivos com conteúdo idêntico (apenas diferenças de CRLF)

Os arquivos comuns a ambos os pacotes (`server.js`, `package.json`, `config/database.js`, `database/schema.sql`, `database/seed.js`, `middleware/auth.js`, `jest.config.js`, `database/SETUP.md`, `README.md`) tinham **conteúdo idêntico**, apenas com diferenças de quebra de linha (CRLF no Windows vs. LF no GitHub). Nenhuma correção de conteúdo foi necessária para esses.

### 3. Arquivo `.env` apenas no `HC.zip`

O `HC.zip` local continha um `.env` configurado (com PostgreSQL), que estava corretamente ignorado no repositório público (via `.gitignore`). Este arquivo foi preservado e adaptado para suportar SQLite.

## Correções Aplicadas para Funcionamento

Como o ambiente de execução não tem PostgreSQL instalado, foi necessário adaptar o projeto para funcionar com SQLite (banco de dados embutido, sem dependências externas):

### A. Camada de banco de dados (`backend/config/database.js`)
Reescrita como adaptador SQLite com interface compatível com `pg.Pool`. Convertendo automaticamente:
- Placeholders `$1, $2, ...` → `?`
- `NOW()` → `datetime('now')`
- `INTERVAL 'X days'` → `'-X days'`
- Remove casts PostgreSQL (`::numeric`, `::INT`)

### B. Schema SQLite (`backend/database/schema-sqlite.sql`)
Novo arquivo de schema com sintaxe SQLite:
- `SERIAL` → `INTEGER PRIMARY KEY AUTOINCREMENT`
- Removido `CREATE DATABASE` e `\c` (comandos psql)
- Triggers adaptados para sintaxe SQLite
- `INSERT OR IGNORE` no lugar de `ON CONFLICT DO NOTHING`

### C. Script de inicialização (`backend/database/init-db.js`)
Script novo para criar todas as tabelas do schema SQLite.

### D. Seed atualizado (`backend/database/seed.js`)
Substituído `ON CONFLICT DO NOTHING` por `INSERT OR IGNORE` e adicionada criação de atividades de exemplo.

### E. Relatórios (`backend/routes/relatorios.js`)
Reescritas queries complexas para usar funções SQLite:
- `EXTRACT(EPOCH FROM (a-b))/3600` → `(julianday(a) - julianday(b)) * 24`
- `INTERVAL '30 days'` → `datetime('now','-30 days')`
- `ROUND(x::numeric, 2)` → `ROUND(x * 1.0, 2)`

### F. Server.js
Adicionada inicialização assíncrona — chama `connectDatabase()` antes de subir o servidor.

### G. `.env`
Atualizado com `DB_TYPE=sqlite` como padrão e caminho do arquivo do banco.

## Como Rodar o Projeto

```bash
cd backend

# 1. Instalar dependências
npm install

# 2. Inicializar banco de dados (cria tabelas + categorias)
npm run init-db

# 3. Popular com dados de teste (usuários + chamados)
npm run seed

# 4. Iniciar servidor
npm start
# ou em modo desenvolvimento:
npm run dev
```

Acesse: **http://localhost:3000**

## Credenciais de Teste

| Perfil | E-mail | Senha |
|--------|--------|-------|
| Admin | `admin@sabesp.com.br` | `admin123` |
| Agente | `carlos@sabesp.com.br` | `123456` |
| Agente | `maria@sabesp.com.br` | `123456` |
| Solicitante | `joao@test.com.br` | `123456` |
| Solicitante | `ana@test.com.br` | `123456` |

## Endpoints da API

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/api/auth/login` | Autenticação (retorna JWT) | Pública |
| POST | `/api/auth/registrar` | Registro de novo usuário | Pública |
| GET | `/api/usuarios/perfil` | Perfil do usuário autenticado | Autenticado |
| GET | `/api/usuarios` | Lista todos usuários | Admin |
| GET | `/api/usuarios/agentes` | Lista apenas agentes | Autenticado |
| GET | `/api/chamados` | Lista chamados (com filtros e paginação) | Autenticado |
| POST | `/api/chamados` | Cria novo chamado | Autenticado |
| GET | `/api/chamados/:id` | Detalhe de um chamado + atividades | Autenticado |
| PUT | `/api/chamados/:id` | Atualiza status/observações | Agente/Admin |
| GET | `/api/relatorios/dashboard` | Dados agregados para o dashboard | Autenticado |
| GET | `/api/relatorios/sla` | Relatório de SLA | Admin/Agente |
| GET | `/api/relatorios/desempenho-agentes` | Desempenho dos agentes | Admin |
| GET | `/api/health` | Health check | Pública |

## Tecnologias

- **Backend**: Node.js, Express, JWT, bcryptjs, express-validator, helmet, morgan
- **Banco**: SQLite (via `sqlite3` + `sqlite`) — originalmente PostgreSQL
- **Frontend**: HTML5, CSS3, JavaScript ES6+, Chart.js, Font Awesome, ViaCEP API

## Como Voltar para PostgreSQL

Se quiser usar PostgreSQL novamente:

1. Instale PostgreSQL e crie o banco `hidrochamado_db`
2. Edite o `.env`: troque `DB_TYPE=sqlite` para `DB_TYPE=postgres` e preencha credenciais
3. Restaure o `backend/config/database.js` original (usa o pacote `pg`)
4. Aplique o schema `backend/database/schema.sql` (PostgreSQL) com `psql -f schema.sql`
5. Rode o seed: `node database/seed.js`

## Estrutura de Diretórios

```
hidrochamado/
├── backend/
│   ├── server.js                  # Servidor Express
│   ├── package.json
│   ├── .env                       # Variáveis de ambiente
│   ├── config/
│   │   └── database.js            # Adaptador SQLite/PostgreSQL
│   ├── database/
│   │   ├── schema.sql              # Schema PostgreSQL original
│   │   ├── schema-sqlite.sql       # Schema SQLite
│   │   ├── init-db.js              # Inicializa SQLite
│   │   ├── seed.js                 # Dados de teste
│   │   └── hidrochamado.db         # Arquivo SQLite gerado
│   ├── middleware/
│   │   └── auth.js                # JWT + autorização por função
│   ├── routes/
│   │   ├── auth.js                # Login/registro
│   │   ├── chamados.js            # CRUD de chamados
│   │   ├── usuarios.js            # Usuários
│   │   └── relatorios.js          # Dashboard/relatórios
│   └── __tests__/                 # Testes Jest
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── api.js
│   └── app-api-integration.js
├── index.html                     # Frontend principal
└── *.md                           # Documentação
```
