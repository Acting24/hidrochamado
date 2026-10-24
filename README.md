# 🌊 HidroChamado — Sistema de Controle de Chamados SABESP

**PJI240 — UNIVESP 2026** | Eixo de Computação | Orientadora: Ana Luzia Gomes de O. Ispada

## 📋 Sobre o Projeto

**HidroChamado** é uma aplicação web completa para gerenciamento de chamados de manutenção e suporte da SABESP (Companhia de Saneamento Básico do Estado de São Paulo). O sistema permite que clientes abram chamados, acompanhem em tempo real, e permite que agentes atendam e resolvam os problemas.

### 👥 Equipe
- Allan Ferreira Soares (RA: 24214882)
- Aparecida Janikele P. dos Passos (RA: 2233057)
- Juliana Carla Araujo Gil (RA: 24216689)
- Kelly Cristina Nemesio Vallone (RA: 24203891)
- Lucas Damasceno (RA: 24210151)
- Marcelo Cassiano dos Santos (RA: 24215144)
- Marcio Manoel de Sousa (RA: 23201680)
- Vanessa Dias Fernandes (RA: 26101589)

---

## 🛠️ Tecnologias

### Frontend
- **HTML5** — Estrutura semântica com ARIA labels
- **CSS3** — Design responsivo e acessível
- **JavaScript ES6+** — Lógica dinâmica
- **Chart.js** — Visualização de dados
- **Font Awesome** — Ícones
- **ViaCEP API** — Integração de endereços

### Backend
- **Node.js** — Runtime JavaScript
- **Express.js** — Framework web
- **PostgreSQL** — Banco de dados relacional
- **JWT** — Autenticação segura
- **Helmet** — Headers de segurança
- **Jest** — Testes unitários
- **Bcryptjs** — Hash de senhas

### DevOps & Deploy
- **Git/GitHub** — Controle de versão
- **Docker** (opcional) — Containerização
- **Heroku/Render** — Cloud deployment
- **PostgreSQL Hosting** — Railway, Supabase, etc

---

## 🚀 Quick Start

### Pré-requisitos
- Node.js 16+
- PostgreSQL 12+
- Git

### Instalação Completa

#### 1️⃣ Clonar Repositório
```bash
git clone https://github.com/seu-usuario/hidrochamado.git
cd hidrochamado
```

#### 2️⃣ Setup do Backend
```bash
cd backend
npm install
```

**Configurar Banco de Dados:**
```bash
# Ver instruções detalhadas em backend/database/SETUP.md
psql -U postgres < database/schema.sql
```

**Configurar Ambiente:**
```bash
cp .env.example .env
# Editar .env com suas configurações
```

**Iniciar Backend:**
```bash
npm run dev  # Modo desenvolvimento com nodemon
# ou
npm start    # Modo produção
```

Backend estará em: `http://localhost:3000`

#### 3️⃣ Setup do Frontend
```bash
cd ../
# Abrir no navegador ou servir via HTTP server
python -m http.server 5000  # ou http-server, live-server, etc
```

Frontend estará em: `http://localhost:5000`

---

## 📚 Documentação

### API REST
- **Documentação:** [backend/README.md](./backend/README.md)
- **Endpoints:** Ver seção abaixo
- **Autenticação:** JWT Bearer Token

### Banco de Dados
- **Schema:** [backend/database/schema.sql](./backend/database/schema.sql)
- **Setup:** [backend/database/SETUP.md](./backend/database/SETUP.md)
- **Seed:** `node backend/database/seed.js`

### Testes
```bash
cd backend
npm test                 # Executar testes
npm run test:watch     # Modo watch
npm test -- --coverage # Com cobertura
```

---

## 🔌 API Endpoints

### Autenticação
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/login` | Fazer login |
| POST | `/api/auth/registrar` | Registrar novo usuário |

### Chamados
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/chamados` | Listar chamados (com filtros) |
| POST | `/api/chamados` | Criar novo chamado |
| GET | `/api/chamados/:id` | Obter detalhes |
| PUT | `/api/chamados/:id` | Atualizar status |

### Usuários
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/usuarios/perfil` | Perfil autenticado |
| GET | `/api/usuarios` | Listar usuários (admin) |
| GET | `/api/usuarios/agentes` | Listar agentes |

### Relatórios
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/relatorios/dashboard` | Dados do painel |
| GET | `/api/relatorios/sla` | Relatório SLA |
| GET | `/api/relatorios/desempenho-agentes` | Desempenho dos agentes |

---

## ✅ Requisitos Cumpridos

- ✅ **Resolução de Problemas** — Sistema resolve problema de fila de chamados
- ✅ **Levantamento de Requisitos** — Análise completa realizada
- ✅ **Framework Web** — Express.js
- ✅ **HTML** — HTML5 semântico
- ✅ **CSS** — CSS3 responsivo
- ✅ **JavaScript** — ES6+ com módulos
- ✅ **Banco de Dados** — PostgreSQL com schema completo
- ✅ **Controle de Versão** — Git/GitHub
- ✅ **Nuvem** — Deploy em Heroku/Render/AWS (instruções incluídas)
- ✅ **API** — RESTful com 12+ endpoints
- ✅ **Acessibilidade** — WCAG 2.1 AA compliance
- ✅ **Testes** — Jest com cobertura
- ✅ **Análise de Dados** — Relatórios com gráficos Chart.js

---

## 🔐 Segurança

- Senhas hasheadas com bcryptjs (10 salt rounds)
- Validação com express-validator
- Headers HTTP com Helmet
- CORS configurável
- JWT com expiração (24h padrão)
- SQL parametrizado (proteção contra SQL injection)

---

## ♿ Acessibilidade

O sistema segue **WCAG 2.1 AA** com:
- Navegação por teclado completa
- ARIA labels em todos os elementos interativos
- Contraste adequado (AAA em vários elementos)
- Estrutura semântica com HTML5
- Suporte a screen readers
- Validação de formulários acessível

Teste com: [WAVE](https://wave.webaim.org/), [axe DevTools](https://www.deque.com/axe/devtools/)

---

## 📊 Análise de Dados

O sistema inclui:
- Dashboard com KPIs em tempo real
- Gráficos de chamados por status/prioridade/categoria
- Relatório de SLA com alertas
- Desempenho individual de agentes
- Timeline de 30 dias de volume
- Análise de tempo médio de resolução

---

## 🚢 Deploy na Nuvem

### Heroku
```bash
heroku create seu-app-hidrochamado
heroku buildpacks:add heroku/nodejs
heroku config:set DATABASE_URL=postgres://...
git push heroku main
```

### Railway
```bash
railway login
railway link
railway up
```

### Render
1. Conectar repositório GitHub
2. Criar Web Service
3. Criar PostgreSQL Database
4. Configurar variáveis de ambiente
5. Deploy automático

---

## 🐛 Troubleshooting

### "Connection refused" ao iniciar backend
- Verificar se PostgreSQL está rodando
- Verificar se porta 5432 está aberta
- Verificar credenciais no `.env`

### "Módulo não encontrado" ao fazer login
- Rodar `npm install` no backend
- Verificar se `api.js` está em `js/` do frontend
- Verificar URLs da API no arquivo

### Testes falhando
- Rodar `npm test` com `NODE_ENV=test`
- Verificar se todas as dependências foram instaladas
- Verificar conexão com banco de testes

---

## 📝 Licença

MIT License © 2026 UNIVESP PJI240

---

## 📞 Contato & Suporte

Para dúvidas sobre o projeto, entre em contato com a orientadora:
**Ana Luzia Gomes de O. Ispada**

---

## 🎯 Roadmap Futuro

- [ ] Integração com SMS/WhatsApp
- [ ] App mobile (React Native)
- [ ] Integração com sistemas legados SABESP
- [ ] Machine Learning para previsão de demanda
- [ ] Chat em tempo real
- [ ] Geolocalização de chamados
- [ ] Integração com IoT de medidores

---

**Última atualização:** 15/08/2026
