# 📋 Plano de Ação — HidroChamado

## 🎯 Visão Geral do Projeto

**Sistema de Controle de Chamados para SABESP (PJI240)**

O HidroChamado é um sistema web integrado desenvolvido para gerenciar ocorrências hidráulicas e requisições de atendimento junto à SABESP (Companhia de Saneamento Básico do Estado de São Paulo). O projeto implementa funcionalidades de autenticação JWT, gestão de chamados com priorização, acompanhamento de SLA, geração de relatórios analíticos e conformidade WCAG 2.1 AA.

---

## 📊 Status do Projeto

| Área | Status | Progresso |
|------|--------|-----------|
| **Backend (Node.js + Express)** | ✅ Completo | 100% |
| **Banco de Dados (PostgreSQL)** | ✅ Completo | 100% |
| **Frontend (HTML5 + CSS3 + JS ES6+)** | ✅ Completo | 100% |
| **Testes (Jest + Supertest)** | ✅ Completo | 100% |
| **Documentação** | ✅ Completo | 100% |
| **GitHub + Versionamento** | ✅ Completo | 100% |
| **Acessibilidade (WCAG 2.1 AA)** | ✅ Completo | 100% |

---

## 🏗️ Arquitetura Técnica

### Stack Tecnológico

#### **Backend**
- **Runtime:** Node.js 16+
- **Framework:** Express.js 4.18.2
- **Autenticação:** JWT (jsonwebtoken 9.1.2)
- **Criptografia:** bcryptjs 2.4.3 (10-salt rounds)
- **Segurança:** Helmet.js (headers segurnos)
- **Logging:** Morgan 1.10.0
- **Validação:** express-validator 7.0.0
- **CORS:** habilitado para requisições cross-origin

#### **Banco de Dados**
- **SGBD:** PostgreSQL 12+
- **Tabelas:** 5 (usuarios, categorias, chamados, atividades, anexos)
- **Índices:** 7 estratégicos em campos de busca frequente
- **Triggers:** Para timestamps automáticos (created_at, updated_at)
- **SLA Tracking:** Cálculos automáticos em horas por categoria

#### **Frontend**
- **Linguagem:** HTML5 semântico + CSS3 responsivo + JavaScript ES6+
- **Estilo:** CSS Grid + Flexbox
- **Gráficos:** Chart.js 4.4.0
- **Ícones:** Font Awesome 6.5.1
- **Tipografia:** Google Fonts (Inter + JetBrains Mono)
- **Armazenamento:** localStorage (tokens JWT)
- **API Client:** Fetch API com classe servidora centralizada

#### **Testing**
- **Framework:** Jest 29.7.0
- **HTTP Testing:** Supertest 6.3.3
- **Cobertura:** 20+ testes em autenticação, CRUD, autorização

#### **DevOps/Deployment**
- **Versionamento:** Git + GitHub
- **Plataformas:** Heroku, Railway ou Render
- **Variáveis de Ambiente:** .env (config/database.js)

---

## 🔐 Segurança e Autenticação

### Modelo de Autorização

3 roles com permissões distintas:

| Role | Permissões | Casos de Uso |
|------|-----------|-------------|
| **admin** | CRUD total em chamados, usuários, categorias; visibilidade de todos os chamados; acesso a relatórios globais | Supervisor SABESP; gestão de equipes |
| **agente** | Leitura de chamados atribuídos/não-atribuídos; atualização de status; criação de atividades (comentários); sem acesso a relatórios | Técnico de campo; equipe de atendimento |
| **solicitante** | Criação de novos chamados; visualização de próprios chamados; visualização de atividades | Cidadão; região da SABESP |

### JWT Token
- **Duração:** 24 horas
- **Payload:** `{ id, email, role, iat, exp }`
- **Armazenamento:** localStorage (frontend)
- **Revogação:** Logout limpa localStorage

---

## 📈 Estrutura de Dados

### Tabelas Principais

#### **usuarios**
```sql
id (PK) | email | password_hash | role | nome | created_at | updated_at
```

#### **chamados**
```sql
id (PK) | numero | titulo | descricao | categoria_id (FK) | status | prioridade | 
solicitante_id (FK) | agente_atribuido_id (FK) | data_abertura | data_conclusao | 
sla_horas | percentual_sla | created_at | updated_at
```

**Status Workflow:** `Aberto` → `Em Atendimento` → `Aguardando Terceiro` → `Resolvido` → `Fechado`

**Prioridades:** `Baixa` (24h), `Média` (8h), `Alta` (4h), `Crítica` (1h)

#### **categorias**
```sql
id (PK) | nome | descricao | sla_horas | ativo | created_at | updated_at
```

**Categorias Pré-configuradas:**
1. Falta de Água (8h SLA)
2. Vazamento de Água (24h SLA)
3. Qualidade da Água (48h SLA)
4. Esgoto (24h SLA)
5. Hidrômetro (72h SLA)
6. Comercial/Faturamento (48h SLA)
7. Infraestrutura (120h SLA)

#### **atividades**
```sql
id (PK) | chamado_id (FK) | usuario_id (FK) | tipo | descricao | created_at
```

#### **anexos**
```sql
id (PK) | chamado_id (FK) | url_arquivo | nome_original | tamanho_bytes | created_at
```

---

## 🎨 Interface e UX

### Temas Visuais

**Cores Principais:**
- Primária: `#2E7D32` (verde água)
- Secundária: `#0c1e33` (azul escuro)
- Fundo: `#f0f5fa` (azul claro neutro)
- Sucesso: `#4caf50`
- Aviso: `#ff9800`
- Erro: `#f44336`

### Componentes da Interface

#### **Dashboard Principal**
- Cards de resumo (Total Chamados, Taxa Resolução, SLA Cumprido)
- Tabela de chamados filtrados por role
- Gráficos interativos (Chart.js)
- Filtros por status, prioridade, categoria, período

#### **Formulários**
- Criar novo chamado (3 campos obrigatórios: título, descrição, categoria)
- Editar chamado (apenas admin/agente)
- Atualizar status com transições validadas
- Adicionar comentário/atividade

#### **Modais**
- Confirmação de ações destrutivas
- Detalhes expandidos de chamados
- Histórico de atividades
- Upload de anexos (simulado em frontend)

#### **Sidebar Navegação**
- Menu com ícones e labels
- Links para Dashboard, Chamados, Relatórios, Usuários
- Indicador de role do usuário logado
- Botão Logout

---

## 📊 Relatórios e Analytics

### KPIs Monitorados

1. **Total de Chamados** — Contagem geral
2. **Taxa de Resolução (%)** — (Resolvidos + Fechados) / Total × 100
3. **Tempo Médio de Resolução (horas)** — AVG(data_conclusao - data_abertura)
4. **Cumprimento de SLA (%)** — Chamados dentro do prazo SLA / Total × 100

### Visualizações

| Gráfico | Tipo | Descrição |
|---------|------|-----------|
| **Desempenho dos Agentes** | Barras agrupadas | Chamados por agente + taxa resolução |
| **Cumprimento de SLA** | Doughnut/Pizza | Percentual dentro vs. fora do SLA |
| **Volume por Período** | Linha com área | Chamados diários (últimos 30 dias) |
| **Resolução por Categoria** | Barras horizontais | Tempo médio por categoria |

---

## 📝 Endpoints da API

### Autenticação
```
POST   /api/auth/login        → Login com credentials
POST   /api/auth/register     → Registro de novo usuário
```

### Chamados
```
GET    /api/chamados          → Listar (filtrado por role)
GET    /api/chamados/:id      → Detalhes do chamado
POST   /api/chamados          → Criar novo chamado
PUT    /api/chamados/:id      → Atualizar chamado
DELETE /api/chamados/:id      → Deletar chamado (admin)
GET    /api/chamados/:id/atividades → Histórico de atividades
POST   /api/chamados/:id/atividades → Adicionar comentário
```

### Usuários
```
GET    /api/usuarios/perfil   → Dados do usuário logado
PUT    /api/usuarios/perfil   → Atualizar perfil
GET    /api/usuarios          → Listar (admin)
```

### Relatórios
```
GET    /api/relatorios/dashboard    → KPIs resumidos
GET    /api/relatorios/agentes      → Desempenho por agente
GET    /api/relatorios/sla          → Análise de SLA
GET    /api/relatorios/categorias   → Volume por categoria
```

---

## ✅ Testes Automatizados

### Cobertura de Testes (20+ casos)

**Backend Tests (Jest + Supertest)**

| Módulo | Casos | Objetivo |
|--------|-------|----------|
| **auth.test.js** | 5 | Login, registro, validação |
| **chamados.test.js** | 15+ | CRUD, filtros, autorização, SLA |

**Exemplo:** 
```javascript
describe('POST /api/chamados', () => {
  it('should create chamado com campos válidos', async () => {
    const res = await request(server)
      .post('/api/chamados')
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Vazamento', descricao: '...', categoria_id: 1 });
    expect(res.status).toBe(201);
  });
});
```

---

## 🚀 Plano de Execução por Fase

### Fase 1: Setup (Semana 1)
- ✅ Configurar Node.js + npm
- ✅ Criar projeto Express
- ✅ Inicializar Git + GitHub
- ✅ Estruturar pastas backend/frontend

### Fase 2: Backend Estrutural (Semanas 2-3)
- ✅ Conectar PostgreSQL
- ✅ Criar schema com 5 tabelas
- ✅ Implementar middleware de autenticação JWT
- ✅ Buildear 4 arquivos de rotas

### Fase 3: Frontend Base (Semanas 3-4)
- ✅ HTML5 semântico
- ✅ CSS3 responsivo (mobile-first)
- ✅ JavaScript ES6+ (api.js service class)
- ✅ Navegação entre telas (login → app → dashboard)

### Fase 4: Features Avançadas (Semanas 4-5)
- ✅ Dashboard com gráficos Chart.js
- ✅ Filtros e paginação
- ✅ Relatórios analíticos
- ✅ Validação de SLA

### Fase 5: Testes e Qualidade (Semana 5)
- ✅ Jest + Supertest
- ✅ Audit de acessibilidade (WCAG 2.1 AA)
- ✅ Code review
- ✅ Documentação final

### Fase 6: Deployment (Semana 6)
- ✅ GitHub final push
- ✅ Deploy em Heroku/Railway/Render
- ✅ Teste em produção
- ✅ Entrega e apresentação

---

## 📚 Documentação Auxiliar

| Documento | Propósito |
|-----------|-----------|
| **README.md** | Visão geral + instruções de setup |
| **QUICKSTART.md** | 5 min para rodar o projeto |
| **GIT_GUIDE.md** | Workflow Git + GitHub para equipe |
| **DEPLOYMENT.md** | Deploy em 3 plataformas (Heroku, Railway, Render) |
| **ACCESSIBILITY.md** | Checklist WCAG 2.1 AA |
| **DATA_ANALYSIS.md** | Endpoints de relatórios + ML concepts |
| **CHAT_HISTORY.md** | Histórico completo de desenvolvimento |

---

## 👥 Papéis e Responsabilidades

| Papel | Responsabilidade | Entrega |
|-------|-----------------|---------|
| **Frontend Lead** | Componentes HTML/CSS/JS, UX | index.html, css/style.css, js/api.js |
| **Backend Lead** | API REST, autenticação, lógica | backend/server.js, backend/routes/* |
| **Database Admin** | Schema, índices, triggers | backend/database/schema.sql |
| **QA/Tester** | Testes, acessibilidade | backend/__tests__/* |
| **DevOps** | Versionamento, deployment | .gitignore, deploy scripts |

---

## ⚠️ Checklist Final de Entrega

- [ ] Todos os 37 arquivos commitados no GitHub
- [ ] Backend rodando em `http://localhost:5000`
- [ ] Frontend acessível em navegador sem erros
- [ ] 20+ testes passando com `npm test`
- [ ] Acessibilidade validada (WCAG 2.1 AA)
- [ ] Documentação completa (10 arquivos .md)
- [ ] Deploy funcional em plataforma cloud
- [ ] Apresentação para SABESP (stakeholder)

---

## 📞 Suporte e Contatos

**Repositório GitHub:** https://github.com/Acting24/hidrochamado

**Tecnicamente Responsável:** @Acting24

**Última Atualização:** 15/08/2026

---

*Documento atualizado de acordo com o status atual do projeto HidroChamado — PJI240 UNIVESP.*
