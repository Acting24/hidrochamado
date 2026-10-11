# Pautas do Projeto

🟢 **Quinzena 0: Formação da Equipe e Contato Inicial**
* **Início:** 27/07/2026 *(estimado)*
* **Objetivo da Etapa:** Espera-se que ao final desta quinzena, os alunos tenham localizado seus colegas de grupo e iniciado a comunicação com eles e com o mediador/facilitador.
* **Etapas do Relatório:** Localização da equipe e abertura dos canais de comunicação.

---

🚀 **Quinzena 1: Kickoff, Organização Inicial e Análise do Cenário**
* **Início:** 10/08/2026
* **Objetivo da Etapa:** Realizar a análise do cenário e iniciar o levantamento bibliográfico para abordar o problema.
* **Etapas do Relatório:** Análise do cenário da pesquisa | Início do Levantamento Bibliográfico.
* **Live de Alinhamento da Equipe:** 11/08/2026 (Terça-feira) às 19:30
  * 🔗 **Plataforma:** Google Meet | **Link da Reunião:** [Inserir o link aqui]
* **Pautas da Live:**
  * Apresentação dos integrantes e definição de papéis (Front-end, Back-end, Banco de Dados, Documentação).
  * Alinhamento do tema escolhido (HidroChamado - Sistema de Controle de Chamados para SABESP — Gestão de Ocorrências Hidráulicas e SLA).
  * Discussão sobre a análise do cenário e início do levantamento bibliográfico.
  * Configuração inicial do ambiente de desenvolvimento (HTML5, CSS3, JavaScript ES6+, Git/GitHub e Editor de código).
* **📄 Documentos e Entregáveis da Etapa:**
  * Proposta individual (alinhamento das ideias antes de unificar o tema).
  * Início do Levantamento Bibliográfico.
* **📚 Exemplo de Levantamento Bibliográfico (Modelo para a Equipe):**

| Conceito (surge da conversa com o grupo) | Referência bibliográfica (em formato ABNT) | Como o autor define o(s) conceito(s) | Como este conceito ajuda a entender o problema e a propor soluções |
| :--- | :--- | :--- | :--- |
| **Sistema de Chamados (Helpdesk)** | SALVIANO, Clênio F. *Gerenciamento de Serviços de TI: uma abordagem prática baseada no ITIL*. São Paulo: Visual Books, 2010. | O autor explica que a Central de Serviços (Service Desk) funciona como o ponto único de contato entre usuários e a área de tecnologia, responsável por registrar, acompanhar e encerrar incidentes e requisições, conforme práticas de gerenciamento de serviços de TI. A obra detalha como estruturar fluxos de atendimento com priorização, catálogo de serviços e métricas de desempenho. | Este conceito ajuda a entender que o problema das equipes de manutenção da SABESP não é apenas "registrar reclamações de água", mas sim gerenciar o fluxo de trabalho e o tempo de resposta de ocorrências hidráulicas. O HidroChamado implementa 5 status de fluxo (Aberto, Em Atendimento, Aguardando Terceiro, Resolvido, Fechado), 4 níveis de prioridade (Baixa, Média, Alta, Crítica) e alertas automáticos de SLA no Painel de Controle, garantindo rastreamento completo do ciclo de vida de cada chamado. |
| **Acordos de Nível de Serviço (SLA)** | DANTAS, Marcelo. *Governança de TI: na prática*. 2. ed. São Paulo: Brasport, 2014. | O autor aborda a governança de tecnologia da informação com foco na entrega de valor ao negócio, explicando que Acordos de Nível de Serviço (SLA) estabelecem metas formais de qualidade entre provedores e clientes, incluindo indicadores de desempenho, prazos de resposta e resolução, mecanismos de monitoramento e consequências pelo descumprimento dos acordos. | No HidroChamado, cada categoria de ocorrência possui um SLA diferenciado em horas: Falta de Água (8h), Vazamento de Água (24h), Esgoto (24h), Qualidade da Água (48h), Comercial/Faturamento (48h), Hidrômetro (72h) e Infraestrutura (120h). O sistema calcula automaticamente o percentual consumido do SLA e exibe alertas visuais (barras de progresso coloridas e badges) quando o prazo está próximo de vencer (≥80%) ou já venceu, tanto no Painel quanto na lista de chamados. |
| **Sistemas de Informação Gerenciais** | REZENDE, Denis Alcides; ABREU, Aline França de. *Sistemas de Informação Organizacionais: guia prático para projetos de cursos de TI, Administração e áreas correlatas*. 4. ed. São Paulo: Atlas, 2018. | Os autores definem os sistemas de informação organizacionais como conjuntos estruturados de componentes que captam, processam, armazenam e distribuem informações para apoiar a tomada de decisão, o controle e a coordenação em organizações, destacando seu papel estratégico na gestão eficiente de processos operacionais e gerenciais. | Este conceito fundamenta a escolha por desenvolver um sistema web com dashboard analítico. O HidroChamado implementa 4 KPIs no módulo de Relatórios (Total de Chamados, Taxa de Resolução %, Tempo Médio de Resolução em horas, Cumprimento de SLA %) e 4 gráficos interativos via Chart.js: Desempenho dos Agentes (barras agrupadas), Cumprimento de SLA (doughnut), Volume por Período nos últimos 30 dias (linha com área) e Tempo Médio de Resolução por Categoria (barras horizontais), transformando dados brutos em informações visuais para a tomada de decisão gerencial. |
| **Saneamento Básico e Gestão de Recursos Hídricos** | REBOUÇAS, Aldo da C. *Água Doce no Século XXI*. 2. ed. São Paulo: Escrituras, 2006. | O autor discute a gestão dos recursos hídricos no Brasil, abordando os desafios do saneamento básico, a distribuição de água tratada e a necessidade de sistemas eficientes para a manutenção da infraestrutura hidráulica. | Este conceito contextualiza o HidroChamado dentro do cenário do saneamento brasileiro. As 7 categorias do sistema refletem ocorrências reais do dia a dia da SABESP: Vazamento de Água, Falta de Água, Qualidade da Água, Esgoto, Hidrômetro, Comercial/Faturamento e Infraestrutura. A priorização por gravidade (Baixa, Média, Alta, Crítica) com SLAs diferenciados garante que ocorrências de maior impacto social (ex.: falta d'água em região completa com SLA de 8h) sejam atendidas com urgência proporcional. |
| **Acessibilidade na Web (WCAG 2.1)** | W3C BRASIL. *Cartilha de Acessibilidade na Web*. Brasília: W3C, 2012. | A acessibilidade web significa que pessoas com deficiências podem perceber, entender, navegar e interagir com a web. Envolve padrões de contraste, navegação por teclado e textos alternativos. | O HidroChamado implementa acessibilidade nível WCAG 2.1 AA em todo o sistema: HTML5 semântico com `role`, `aria-label`, `aria-required`, `aria-current`, `aria-modal` e `aria-live` (para toasts); navegação completa por teclado com `:focus-visible`; classe `.sr-only` para leitores de tela; fechamento de modal e sidebar via tecla `Escape`; e contraste adequado entre texto (`#0c1e33`) e fundo (`#f0f5fa`). |

> ⚠️ **ATENÇÃO:** A configuração inicial do ambiente é a tarefa mais importante da **Quinzena 1**. Se todos da equipe começarem com o ambiente certo, o desenvolvimento flui sem problemas. O protótipo do HidroChamado utiliza **arquivos separados** (HTML + CSS + JS), e este guia cobre desde a instalação das ferramentas até o sistema funcionando no navegador. Peçam para todos os integrantes seguirem o guia completo abaixo, do zero, para configurar o ambiente de desenvolvimento frontend.

### 🛠️ Guia Passo a Passo: Configuração Completa do Projeto HidroChamado

Este guia acompanha a equipe desde a instalação das ferramentas até o sistema rodando no navegador com todos os arquivos separados (`index.html` + `css/style.css` + `js/app.js`). Siga cada passo na ordem — não pule nenhum.

---

#### Passo 1: Instalar o Git e criar conta no GitHub

1. Acessem [git-scm.com/downloads](https://git-scm.com/downloads) e baixem o Git para o sistema operacional de vocês.
2. Instalem com as opções padrão (basta clicar em "Next" em tudo).
3. Quem não tiver, crie uma conta no [github.com](https://github.com/).
4. Configurem o nome e email no terminal (façam isso **apenas uma vez** no computador):
   ```bash
   git config --global user.name "Seu Nome"
   git config --global user.email "seu_email@example.com"
   ```

---

#### Passo 2: Escolher e Configurar o Editor de Código

1. Recomendação: [Visual Studio Code](https://code.visualstudio.com/) (gratuito).
2. Instalem as extensões essenciais:
   * **Live Server** (Ritwick Dey) — para abrir o HTML diretamente no navegador com auto-reload a cada alteração salva. Sem essa extensão, não terão servidor local.
   * **HTML CSS Support** (ecmel) — para autocompletar classes CSS ao digitar no HTML.
   * **Prettier** (Prettier) — para formatar o código automaticamente (padroniza o estilo da equipe).

---

#### Passo 3: Criar o repositório no GitHub

1. No GitHub, cliquem em **New repository**.
2. Nome: `hidro_chamado`
3. Descrição: `Projeto Integrador Univesp - HidroChamado - Sistema de Controle de Chamados SABESP - PJI240`
4. Marquem como **Public** (ou Private, se preferirem).
5. **NÃO** marquem "Add a README file" (vamos criar os arquivos localmente primeiro).
6. Cliquem em **Create repository**.
7. Na página do repositório criado, cliquem no botão verde **Code** e copiem o link HTTPS.

---

#### Passo 4: Clonar o repositório para o computador

No terminal, naveguem até a pasta onde desejam guardar o projeto (ex: Área de Trabalho) e digitem:

```bash
git clone https://github.com/seu-usuario/hidro_chamado.git
cd hidro_chamado
```

*(Substituam o link pelo que copiaram no Passo 3.)*

---

#### Passo 5: Criar a estrutura de pastas do projeto

Dentro da pasta `hidro_chamado`, criem as pastas `css` e `js` usando o terminal:

```bash
mkdir css
mkdir js
```

A estrutura final do projeto deve ficar **exatamente** assim:

```
hidro_chamado/
├── index.html          # Estrutura HTML do sistema (338 linhas)
├── css/
│   └── style.css       # Todos os estilos do sistema
├── js/
│   └── app.js          # Toda a lógica JavaScript do sistema
├── .gitignore          # Arquivos que o Git deve ignorar
└── README.md           # Descrição do projeto (criar depois)
```

> 💡 **Por que arquivos separados?** O código original era um único arquivo `index.html` com tudo embutido (HTML + CSS + JS em ~1490 linhas). Separar em 3 arquivos melhora a organização, facilita o trabalho em equipe (cada integrante edita seu arquivo sem conflitos) e segue boas práticas de desenvolvimento frontend.

---

#### Passo 6: Criar o arquivo `.gitignore`

Na raiz do projeto, criem um arquivo chamado `.gitignore` com o seguinte conteúdo:

```text
# Configurações de editor
.vscode/
.idea/

# Arquivos de sistema
.DS_Store
Thumbs.db

# Logs e temporários
*.log
```

**Como criar:** Abram o VS Code, cliquem em **File > New File**, digitem `.gitignore` e colem o conteúdo acima. Salvem com `Ctrl+S`.

---

#### Passo 7: Criar o arquivo `index.html`

Na raiz do projeto, criem o arquivo `index.html` e colem **todo o código abaixo** (é a estrutura HTML completa do sistema):

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HidroChamado — SABESP | Controle de Chamados PJI240</title>
  <!-- Fontes Google -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <!-- Ícones Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <!-- Chart.js (gráficos) -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <!-- CSS do projeto -->
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

<!-- ===== TELA DE LOGIN ===== -->
<div id="page-login" role="main" aria-label="Tela de login do sistema HidroChamado">
  <div class="login-card">
    <div class="login-logo">
      <i class="fas fa-water" aria-hidden="true"></i>
      <h1>HidroChamado</h1>
      <p>SABESP — Sistema de Controle de Chamados</p>
    </div>
    <form id="login-form" aria-label="Formulário de login">
      <div class="form-group">
        <label for="login-user">Usuário</label>
        <input id="login-user" class="form-input" type="text" placeholder="Digite seu usuário" required aria-required="true" autocomplete="username">
      </div>
      <div class="form-group">
        <label for="login-pass">Senha</label>
        <input id="login-pass" class="form-input" type="password" placeholder="Digite sua senha" required aria-required="true" autocomplete="current-password">
      </div>
      <button type="submit" class="btn btn-primary btn-block" aria-label="Entrar no sistema">
        <i class="fas fa-sign-in-alt" aria-hidden="true"></i> Entrar
      </button>
    </form>
    <div class="login-hint" role="note">
      <strong>Acesso rápido:</strong><br>
      Admin: <code>admin</code> / <code>admin123</code><br>
      Agente: <code>carlos</code> ou <code>maria</code> / <code>123456</code><br>
      Solicitante: <code>joao</code> ou <code>ana</code> / <code>123456</code>
    </div>
  </div>
</div>

<!-- ===== APP PRINCIPAL ===== -->
<div id="app" role="application" aria-label="Sistema HidroChamado">
  <div class="water-bg" aria-hidden="true"></div>
  <button class="mobile-toggle" id="mobile-toggle" aria-label="Abrir menu de navegação">
    <i class="fas fa-bars" aria-hidden="true"></i>
  </button>

  <!-- Sidebar -->
  <aside class="sidebar" id="sidebar" role="navigation" aria-label="Menu principal do sistema">
    <div class="sidebar-header">
      <i class="fas fa-water" aria-hidden="true"></i>
      <span>HidroChamado</span>
    </div>
    <nav>
      <a href="#" class="nav-link active" data-page="dashboard" aria-current="page">
        <i class="fas fa-tachometer-alt" aria-hidden="true"></i> Painel
      </a>
      <a href="#" class="nav-link" data-page="novo-chamado">
        <i class="fas fa-plus-circle" aria-hidden="true"></i> Novo Chamado
      </a>
      <a href="#" class="nav-link" data-page="chamados">
        <i class="fas fa-list-alt" aria-hidden="true"></i> Chamados
      </a>
      <a href="#" class="nav-link" data-page="relatorios">
        <i class="fas fa-chart-pie" aria-hidden="true"></i> Relatórios
      </a>
      <a href="#" class="nav-link" data-page="equipe">
        <i class="fas fa-users" aria-hidden="true"></i> Equipe
      </a>
      <a href="#" class="nav-link" data-page="admin" id="nav-admin">
        <i class="fas fa-cog" aria-hidden="true"></i> Admin
      </a>
    </nav>
    <div class="sidebar-footer">
      <a href="#" id="btn-logout" aria-label="Sair do sistema">
        <i class="fas fa-sign-out-alt" aria-hidden="true"></i> Sair
      </a>
    </div>
  </aside>

  <!-- Overlay mobile -->
  <div class="sidebar-overlay" id="sidebar-overlay"></div>

  <!-- Conteúdo Principal -->
  <main class="main-content" id="main-content">

    <!-- ===== PAINEL (DASHBOARD) ===== -->
    <section id="page-dashboard" class="page active" aria-label="Painel de controle">
      <div class="page-header">
        <h2>Painel de Controle</h2>
      </div>
      <!-- Os cards de estatísticas, alertas SLA, gráficos e tabela são renderizados via JavaScript -->
    </section>

    <!-- ===== NOVO CHAMADO ===== -->
    <section id="page-novo-chamado" class="page" aria-label="Formulário de novo chamado">
      <div class="page-header">
        <h2>Novo Chamado</h2>
      </div>
      <!-- O formulário completo é renderizado via JavaScript -->
    </section>

    <!-- ===== CHAMADOS ===== -->
    <section id="page-chamados" class="page" aria-label="Lista de chamados">
      <div class="page-header">
        <h2>Chamados</h2>
      </div>
      <!-- Filtros e tabela são renderizados via JavaScript -->
    </section>

    <!-- ===== RELATÓRIOS ===== -->
    <section id="page-relatorios" class="page" aria-label="Relatórios">
      <div class="page-header">
        <h2>Relatórios</h2>
      </div>
      <!-- KPIs e gráficos são renderizados via JavaScript -->
    </section>

    <!-- ===== EQUIPE ===== -->
    <section id="page-equipe" class="page" aria-label="Equipe">
      <div class="page-header">
        <h2>Equipe</h2>
      </div>
      <!-- Conteúdo da equipe renderizado via JavaScript -->
    </section>

    <!-- ===== ADMIN ===== -->
    <section id="page-admin" class="page" aria-label="Administração do sistema">
      <div class="page-header">
        <h2>Administração</h2>
      </div>
      <!-- Tabelas de categorias e usuários renderizadas via JavaScript -->
    </section>

    <!-- ===== DETALHE DO CHAMADO ===== -->
    <section id="page-chamado-detail" class="page" aria-label="Detalhe do chamado">
      <!-- Renderizado via JavaScript -->
    </section>

  </main>
</div>

<!-- Toast de notificações -->
<div id="toast-container" aria-live="polite" aria-atomic="true"></div>

<!-- Modal -->
<div class="modal-overlay" id="modal-overlay" role="dialog" aria-modal="true">
  <div class="modal-box" id="modal-box"></div>
</div>

<!-- JavaScript do projeto -->
<script src="js/app.js"></script>
</body>
</html>
```

> 💡 **O que este arquivo faz:** Contém **apenas a estrutura HTML** do sistema. Nele estão: (1) os links para as bibliotecas externas via CDN (Google Fonts, Font Awesome, Chart.js); (2) o link para o CSS do projeto (`css/style.css`); (3) a estrutura das páginas (Login, Sidebar, Dashboard, Novo Chamado, Chamados, Relatórios, Equipe, Admin); (4) o link para o JavaScript (`js/app.js`) no final do `<body>`. O conteúdo dinâmico (cards, tabelas, gráficos, formulário) é renderizado pelo JavaScript.

---

#### Passo 8: Criar o arquivo `css/style.css`

Dentro da pasta `css/`, criem o arquivo `style.css`. Este arquivo contém **todos os estilos** do sistema (variáveis de cor, layout, sidebar, cards, formulários, tabelas, modal, responsividade, animações). Copiem o conteúdo completo do arquivo CSS do protótipo para cá.

**Como proceder:** Abram o arquivo `css/style.css` que está na pasta `css/` do projeto original e copiem todo o seu conteúdo para este novo arquivo.

> 💡 **O que este arquivo faz:** Define a identidade visual do HidroChamado: paleta de cores com tema hidráulico/SABESP (azul água `#00a8e8` como acento, azul escuro `#0d2137` na sidebar), layout SPA com Grid e Flexbox, sidebar fixa à esquerda, cards de estatísticas com bordas coloridas, badges de status/prioridade, barra de progresso do SLA (verde/amarelo/vermelho), modal com overlay, toast de notificações, responsividade mobile com sidebar colapsável e `@keyframes` para animações de entrada.

---

#### Passo 9: Criar o arquivo `js/app.js`

Dentro da pasta `js/`, criem o arquivo `app.js`. Este arquivo contém **toda a lógica** do sistema (autenticação, navegação SPA, camada de dados com localStorage, renderização de todas as páginas, gráficos Chart.js, integração ViaCEP, polling do dashboard).

**Como proceder:** Abram o arquivo `js/app.js` que está na pasta `js/` do projeto original e copiem todo o seu conteúdo para este novo arquivo.

> 💡 **O que este arquivo faz:** É o "cérebro" do HidroChamado. Contém: (1) **Camada `DB`** — persistência via `localStorage` com dados seed de 7 categorias, 5 usuários e chamados de exemplo; (2) **Sistema de Login** — autenticação por 3 perfis (admin, agente, solicitante) com credenciais hardcoded; (3) **Navegação SPA** — troca de páginas sem recarregar, com `data-page` nos links da sidebar; (4) **Renderização dinâmica** — Dashboard (4 KPIs + 2 gráficos + alertas SLA + tabela), Formulário de Novo Chamado (com busca ViaCEP), Lista de Chamados (filtros), Detalhe (timeline + barra SLA), Relatórios (4 KPIs + 4 gráficos), Equipe e Admin; (5) **Polling** — `setInterval` a cada 60 segundos para atualizar o Dashboard automaticamente.

---

#### Passo 10: Criar o arquivo `README.md`

Na raiz do projeto, criem o arquivo `README.md` com uma descrição básica:

```markdown
# HidroChamado — SABESP | Sistema de Controle de Chamados

Projeto Integrador II (PJI240) — Univesp

## Sobre
Sistema web SPA para gestão de ocorrências hidráulicas da SABESP, com controle de SLA diferenciado por categoria.

## Tecnologias
- HTML5, CSS3, JavaScript ES6+
- Chart.js 4.4.0 (CDN)
- Font Awesome 6.5.1 (CDN)
- Google Fonts (Inter + JetBrains Mono)
- ViaCEP API (busca de endereço por CEP)
- localStorage (persistência de dados)

## Estrutura de Arquivos
```
hidro_chamado/
├── index.html       # Estrutura HTML do sistema
├── css/
│   └── style.css    # Estilos completos do sistema
├── js/
│   └── app.js       # Lógica JavaScript do sistema
├── .gitignore
└── README.md
```

## Como Executar
1. Abra o projeto no VS Code
2. Instale a extensão "Live Server"
3. Clique com o botão direito em `index.html` > "Open with Live Server"
4. O sistema abrirá no navegador em `http://127.0.0.1:5500/`

## Credenciais de Acesso
| Perfil | Usuário | Senha |
|--------|---------|-------|
| Admin | admin | admin123 |
| Agente | carlos | 123456 |
| Agente | maria | 123456 |
| Solicitante | joao | 123456 |
| Solicitante | ana | 123456 |
```

---

#### Passo 11: Testar o sistema no navegador

1. Abram o VS Code e, nele, abram a pasta do projeto (`hidro_chamado`):
   ```bash
   code .
   ```
   *(Se o comando `code` não funcionar, abram o VS Code normalmente e usem **File > Open Folder**, selecionando a pasta do projeto.)*

2. Cliquem com o botão direito no arquivo `index.html` e selecionem **"Open with Live Server"**.

3. O navegador deve abrir automaticamente em `http://127.0.0.1:5500/` com a **tela de login** do HidroChamado.

4. Façam o primeiro teste de login:
   * **Usuário:** `admin`
   * **Senha:** `admin123`
   * Cliquem em **Entrar**.

5. Se o sistema abrir o **Painel de Controle (Dashboard)** com os cards de estatísticas e gráficos, o ambiente está **100% correto**.

6. Testem os outros perfis (`carlos`/`123456` para agente, `joao`/`123456` para solicitante) e naveguem pelas seções da sidebar.

> ⚠️ **Se der erro:** Verifiquem se a estrutura de pastas está exatamente como no Passo 5. O erro mais comum é o arquivo `style.css` ou `app.js` não estar na pasta correta. Abram o console do navegador (F12 > Console) para ver mensagens de erro.

---

#### Passo 12: Enviar tudo para o GitHub

Com o sistema funcionando, enviem os arquivos para o repositório remoto:

```bash
git add .
git commit -m "Protótipo HidroChamado com arquivos separados (HTML + CSS + JS)"
git push origin main
```

> 💡 **Dica:** Se o `git push` pedir para configurar o branch principal, executem:
> ```bash
> git branch -M main
> git push -u origin main
> ```

---

### 📝 Dica para a Equipe (Trabalho Colaborativo com Git)

**Quando um integrante for clonar o projeto (depois que já estiver no GitHub):**

1. Clonar o repositório:
   ```bash
   git clone https://github.com/seu-usuario/hidro_chamado.git
   cd hidro_chamado
   ```
2. Abrir no VS Code e usar o Live Server (Passo 11).
3. Antes de começar a trabalhar, **sempre** fazer `git pull` para pegar as últimas alterações.

**Divisão sugerida de arquivos por integrante (para evitar conflitos):**

| Arquivo | Responsável sugerido | Motivo |
| :--- | :--- | :--- |
| `index.html` | 1 integrante (Front-end estrutural) | Alterações na estrutura HTML são menos frequentes |
| `css/style.css` | 1-2 integrantes (Front-end visual) | Estilização e responsividade |
| `js/app.js` | 2-3 integrantes (Lógica/Funcionalidades) | Maior parte do código; dividir por seção (login, dashboard, formulário, relatórios) |

**Fluxo de trabalho diário (resumido):**

```bash
# 1. Sempre começar puxando as alterações dos colegas
git pull

# 2. Trabalhar nos seus arquivos, salvar frequentemente

# 3. Antes de enviar, verificar o que foi alterado
git status

# 4. Adicionar, commitar e enviar
git add .
git commit -m "Descrição curta do que foi feito"
git push
```

> ⚠️ **Regra de ouro:** **Nunca** editem o mesmo arquivo ao mesmo tempo sem combinar antes. Se dois integrantes editarem `app.js` simultaneamente, o Git gerará conflitos que precisam ser resolvidos manualmente. **Combinem** quem faz o quê antes de cada sessão de trabalho.

### 🎨 Tecnologias Utilizadas no Protótipo
O protótipo do HidroChamado utiliza as seguintes tecnologias (conforme implementado):

| Tecnologia | Versão/Fonte | Uso no Projeto |
| :--- | :--- | :--- |
| **HTML5** | — | Estrutura semântica com `role`, `aria-label`, `aria-required`, `section`, `nav`, `main` |
| **CSS3** | — | Estilização completa com variáveis CSS (`:root`), Grid, Flexbox, animações (`@keyframes`), media queries para mobile |
| **JavaScript ES6+** | — | Lógica SPA (Single Page Application), manipulação do DOM, `fetch` API, `localStorage`, `setInterval` para polling |
| **Chart.js** | 4.4.0 (CDN) | 6 gráficos: 2 no Dashboard (doughnut categorias + barras status) e 4 nos Relatórios (barras agentes, doughnut SLA, linha volume, barras horizontais tempo) |
| **Font Awesome** | 6.5.1 (CDN) | Ícones em toda a interface (fa-water, fa-chart-pie, fa-plus-circle, fa-list-alt, etc.) |
| **Google Fonts** | — | Família **Inter** (toda a interface) + **JetBrains Mono** (códigos/username no admin) |
| **ViaCEP API** | viacep.com.br | Busca automática de endereço pelo CEP no formulário de novo chamado (`fetch`) |
| **localStorage** | Web API | Persistência de dados no navegador (categorias, usuários, chamados, interações) com camada `DB` |

### 📊 Paleta de Cores do Sistema (tema hidráulico/SABESP)

| Variável CSS | Cor | Uso |
| :--- | :--- | :--- |
| `--bg` | `#f0f5fa` | Fundo geral (azul claro) |
| `--fg` | `#0c1e33` | Texto principal (azul escuro) |
| `--muted` | `#5a7089` | Texto secundário |
| `--accent` | `#00a8e8` | Cor de destaque (azul água) |
| `--accent2` | `#0077b6` | Cor primária (azul mais escuro) |
| `--primary` | `#0d2137` | Sidebar e fundos escuros |
| `--success` | `#06d6a0` | Status resolvido/SLA ok |
| `--warning` | `#ffd166` | SLA vencendo/em atendimento |
| `--danger` | `#ef476f` | SLA vencido/aguardando |
| `--critical` | `#d90429` | Prioridade crítica |

---

📝 **Quinzena 2: Plano de Ação, Definição do Problema e Comunidade Externa**
* **Início:** 24/08/2026
* **Objetivo da Etapa:** Interagir com a comunidade externa, definir e estudar o problema, e criar o plano de ação.
* **Etapas do Relatório:** Definição do Problema | Entrega do Plano de Ação.
* **Live de Acompanhamento:** 25/08/2026 (Terça-feira) às 19:30
  * 🔗 **Plataforma:** Google Meet | **Link da Reunião:** [Inserir o link aqui]
* **Pautas da Live:**
  * Discussão sobre o feedback da interação com a comunidade externa (equipes de manutenção/operacionais de unidades da SABESP ou empresas de saneamento).
  * Validação do modelo de dados inicial do sistema:
    * **Categorias** (7 tipos): Vazamento de Água (SLA 24h), Falta de Água (SLA 8h), Qualidade da Água (SLA 48h), Esgoto (SLA 24h), Hidrômetro (SLA 72h), Comercial/Faturamento (SLA 48h), Infraestrutura (SLA 120h).
    * **Prioridades** (4 níveis): Baixa, Média, Alta, Crítica.
    * **Status de chamado** (5 estados): Aberto, Em Atendimento, Aguardando Terceiro, Resolvido, Fechado.
    * **Perfis de usuário** (3 tipos): admin, agente, solicitante.
    * **Interações** (3 tipos): Resposta, Nota Interna (visível só para agentes), Encaminhamento.
    * **Campos do chamado**: id, título, descrição, categoria_id, prioridade, status, solicitante_id, agente_id, data_abertura, data_resolucao, CEP, endereço.
  * Divisão das tarefas de estruturação do escopo para o Plano de Ação.
* **📄 Documentos e Entregáveis da Etapa:**
  * Plano de Ação.
  * Termo de empresa/instituição (para formalizar a parceria com a unidade da SABESP ou empresa de saneamento/local de pesquisa).
  * Termo de consentimento livre e esclarecido (TCLE) (para entrevistar a comunidade externa).
  * Termo de autorização de uso de imagem (caso gravem vídeos/fotos com a comunidade).
* **⚠️ Lembrete Oficial:** Utilizar os modelos próprios oficiais da instituição (disponíveis no menu da disciplina no AVA) para o Plano de Ação e os Termos.
* **📊 Critérios de Avaliação do Plano de Ação (Rubrica Oficial - Total 10,0):**

| Item Avaliado | O que fazer para atingir a Pontuação Máxima | Pontuação Máxima |
| :--- | :--- | :--- |
| **Descrição da visita/conversa com a comunidade externa** | Descrever a primeira visita, identificando: qual(is) pessoa(s) conversou(ram) e sua posição na empresa; descreveu o local da visita; e as percepções do grupo quanto ao primeiro contato. | 1,0 |
| **Identificação de problemas relacionados ao tema norteador** | Descrever ao menos um problema e **relacioná-lo** com o tema norteador definido pela Univesp. | 1,0 |
| **Identificação do tema específico do PI** | Descrever o tema que será trabalhado no projeto integrador e **relacioná-lo** com o tema norteador definido pela Univesp. | 2,0 |
| **Planejamento das atividades em cada quinzena** | Identificar em **todas** as quinzenas: as atividades, os responsáveis por elas (todos os integrantes em todas as semanas), as datas de início e finalização. Cada atividade deve ter breve descrição e relação com o objetivo da quinzena. | 3,0 |
| **Normas da língua portuguesa** | O texto deve ser claro e seguir as normas da língua portuguesa. | 2,0 (Média 1,0 / Mínima 0,0) |

* **🚨 Marcos Importantes:**
  * Vencimento das Atividades (AA): 01/09/2026 às 23:59
  * Período de Carência: Até 06/09/2026 às 23:59

---

📚 **Quinzena 3: Título do Trabalho, Levantamento Bibliográfico e Configuração**
* **Início:** 07/09/2026
* **Objetivo da Etapa:** Definir o título do trabalho e iniciar o desenvolvimento técnico.
* **Etapas do Relatório:** Definição do Título do trabalho | Desenvolvimento.
* **Live de Acompanhamento:** 08/09/2026 (Terça-feira) às 19:30
  * 🔗 **Plataforma:** Google Meet | **Link da Reunião:** [Inserir o link aqui]
* **Pautas da Live:**
  * Definição oficial do título do trabalho/projeto.
  * Revisão da fundamentação teórica (utilizar a tabela modelo da Quinzena 1 para redigir os parágrafos do texto).
  * Status da implementação da estrutura base do sistema: tela de Login com autenticação por perfil (admin/agente/solicitante), layout SPA com sidebar de navegação e 6 seções (Painel, Novo Chamado, Chamados, Relatórios, Equipe, Admin).
* **📄 Documentos e Entregáveis da Etapa:**
  * Consolidação do Levantamento Bibliográfico.

---

📄 **Quinzena 4: Solução Inicial, Relatório Parcial e Feedback Externo**
* **Início:** 21/09/2026
* **Objetivo da Etapa:** Construir a solução inicial, coletar sugestões com a comunidade externa e escrever o relatório parcial.
* **Etapas do Relatório:** Solução inicial | Entrega do Relatório Parcial.
* **Live de Acompanhamento:** 22/09/2026 (Terça-feira) às 19:30
  * 🔗 **Plataforma:** Google Meet | **Link da Reunião:** [Inserir o link aqui]
* **Pautas da Live:**
  * Apresentação da solução inicial e revisão das sugestões coletadas com a comunidade externa.
  * Teste das funcionalidades implementadas no protótipo:
    * **Tela de Login** com 3 perfis de acesso (admin: `admin`/`admin123`, agente: `carlos`/`123456` ou `maria`/`123456`, solicitante: `joao`/`123456` ou `ana`/`123456`).
    * **Painel de Controle (Dashboard)** com 4 cards de estatísticas (Abertos, Em Atendimento, Resolvidos Hoje, SLAs Vencidos), alertas de SLA no topo, 2 gráficos (Chamados por Categoria - doughnut, Chamados por Status - barras) e tabela dos Últimos Chamados.
    * **Formulário de Novo Chamado** com campos: Título, Categoria (com SLA visível), Prioridade (4 níveis), Descrição, CEP (com busca automática via ViaCEP API), Endereço (auto-preenchido), Solicitante.
    * **Lista de Chamados** com filtros por Status, Prioridade, Categoria e busca por título, com badges coloridos e indicador visual de SLA.
    * **Detalhe do Chamado** com header completo (status, prioridade, SLA com barra de progresso), timeline de interações (resposta, nota interna, encaminhamento) e botão "Assumir Atendimento" para agentes.
    * **Sidebar** responsiva com menu de navegação (Painel, Novo Chamado, Chamados, Relatórios, Equipe, Admin — este último visível só para admin).
  * Consolidação do Relatório Parcial.
* **📄 Documentos e Entregáveis da Etapa:**
  * Relatório Parcial.
* **⚠️ Lembrete Oficial:** Utilizar o modelo próprio oficial da instituição (disponível no menu da disciplina no AVA) para a redação e formatação do Relatório Parcial.
* **📌 Estrutura Detalhada do Relatório Parcial (Padrão Univesp):**
  * **Título do trabalho:** Frase curta que sintetize o foco do trabalho.
  * **1. Introdução:** Explicar o assunto de forma a:
    * Desenvolver o tema;
    * Anunciar a ideia básica;
    * Delimitar o foco da pesquisa;
    * Situar o tema dentro do contexto geral da sua área de trabalho;
    * Descrever as motivações que levaram à escolha do tema;
    * Indicar o objeto do trabalho: o que será estudado?
  * **2. Desenvolvimento:**
    * **2.1 Objetivos:** O objetivo geral define o que se pretende atingir. Os específicos definem as etapas para alcançá-lo. Usar verbos no infinitivo (Exploratórios: conhecer, identificar; Descritivos: caracterizar, descrebir; Explicativos: analisar, avaliar).
    * **2.2 Justificativa e Delimitação do Problema:** Elaborar uma pergunta que norteará a pesquisa. Trazer razões/práticas que justifiquem a proposta (relevância social, cultural, acadêmica e contribuições para o local do projeto).
    * **2.3 Fundamentação Teórica:** Buscar em fontes confiáveis. Citações nas regras da ABNT 6023/2002. (Indiretas: (AUTOR, ano); Diretas curtas: entre aspas; Diretas longas: sem aspas, fonte 10, recuo 4cm, espaçamento simples).
    * **2.4 Metodologia:** Descrever os passos e estratégias adotados em cada etapa:
      * *Ouvir e interpretar o contexto:* Descrição do contexto, perfil dos sujeitos, como as informações foram coletadas (observação, entrevista, formulário).
      * *Criar / Prototipar:* Análise dos dados, descrição das soluções desenvolvidas.
      * *Implementar / Testar:* Como a solução foi testada, devolutivas coletadas, melhorias indicadas.
    * **2.5 Resultados Preliminares: Solução Inicial:** Demonstrar a criação com base na metodologia (ouvir, criar, implementar). *Incluir imagens, storyboards ou ilustrações* que demonstrem a solução visualmente. *(Atenção: proibido fotos de crianças/adolescentes sem autorização dos responsáveis).*
  * **Referências:** Indicação dos textos usados na construção do relatório.
* **📊 Critérios de Avaliação do Relatório Parcial (Rubrica Oficial - Total 10,0):**

| Item Avaliado | O que fazer para atingir a Pontuação Máxima | Pontuação Máxima |
| :--- | :--- | :--- |
| **Introdução** | Desenvolver o tema; anunciar a ideia básica do trabalho; situar o tema no contexto da área; descrever as motivações; e indicar o objeto do trabalho. Tudo com clareza. | 1,0 |
| **Objetivos** | Delimitar objetivos gerais e específicos (claros, não abrangentes demais) com relação ao tema norteador da Univesp. | 1,0 |
| **Justificativa e Problema** | Delimitar um problema de pesquisa real relacionado ao tema norteador. Abordar relevância social, cultural, acadêmica e contribuições para o local do projeto. | 1,0 |
| **Fundamentação Teórica** | Usar fontes confiáveis (artigos, livros, TCCs). A fundamentação deve ser condizente e suficiente para o problema. Sintetizar teorias com citações indiretas. | 2,0 |
| **Metodologia** | Indicar estratégias de coleta de dados e análise (quali/quanti). Detalhar a comunidade externa, o contexto e o perfil dos sujeitos. Demonstrar os passos do Design Thinking (ouvir, criar, prototipar). | 1,5 |
| **Solução Inicial** | Apresentar a solução inicial para o problema (primeira aplicação do protótipo), não apenas a ideia. | 1,5 |
| **Linguagem e Referências** | Apresentar capa, sumário, resumo, palavras-chave e listas. Texto com coesão, coerência, gramática correta e normas ABNT (citações e referências) adequadas. | 2,0 |

* **🚨 Marcos Importantes:**
  * Vencimento das Atividades (AA): 30/09/2026 às 23:59
  * Período de Carência: Até 04/10/2026 às 23:59

---

💻 **Quinzena 5: Solução Final, Funcionalidades Avançadas e Acessibilidade**
* **Início:** 05/10/2026
* **Objetivo da Etapa:** Construir a solução final, com base nas sugestões recebidas.
* **Etapas do Relatório:** Solução final.
* **Live de Acompanhamento:** 06/10/2026 (Terça-feira) às 19:30
  * 🔗 **Plataforma:** Google Meet | **Link da Reunião:** [Inserir o link aqui]
* **Pautas da Live:**
  * Implementação das melhorias na solução final baseadas no feedback da comunidade externa.
  * Funcionalidades avançadas a implementar/consolidar:
    * **Módulo de Relatórios completo** com 4 KPIs (Total de Chamados, Taxa de Resolução %, Tempo Médio de Resolução em horas, Cumprimento de SLA %) e 4 gráficos Chart.js (Desempenho dos Agentes, Cumprimento de SLA, Volume por Período 30 dias, Tempo Médio por Categoria).
    * **Painel de Admin** com tabelas de gerenciamento de Categorias (ID, Nome, SLA em horas, Status ativa/inativa) e Usuários (ID, Username, Nome, Perfil, Departamento).
    * **Notificação simulada para chamados críticos** — ao abrir um chamado com prioridade "Crítica", o sistema exibe toast de alerta simulando notificação.
    * **Botão "Assumir Atendimento"** para que agentes assumam chamados sem agente atribuído, alterando automaticamente o status para "Em Atendimento".
    * **Interações com 3 tipos**: Resposta (visível para todos), Nota Interna (visível só para agentes/admins, destacada em amarelo), Encaminhamento.
    * **Barra de progresso do SLA** na página de detalhe do chamado (verde ≤80%, amarelo ≥80%, vermelho = vencido).
    * **Polling automático** do Dashboard a cada 60 segundos para atualizar estatísticas e alertas.
  * Verificação da acessibilidade WCAG 2.1 AA: `aria-label` em todos os elementos interativos, `role` nas seções, `aria-live` no container de toasts, navegação por teclado (Escape fecha modal/sidebar), `:focus-visible` com outline de 3px.

---

☁️ **Quinzena 6: Finalização, Análise de Dados, Vídeo e Avaliação Colaborativa**
* **Início:** 19/10/2026
* **Objetivo da Etapa:** Finalizar a aplicação da solução, escrever a análise dos resultados, iniciar o vídeo e realizar a avaliação colaborativa.
* **Etapas do Relatório:** Análise dos resultados | Início do vídeo | Avaliação Colaborativa.
* **Live de Acompanhamento:** 20/10/2026 (Terça-feira) às 19:30
  * 🔗 **Plataforma:** Google Meet | **Link da Reunião:** [Inserir o link aqui]
* **Pautas da Live:**
  * Consolidação do módulo de Relatórios com gráficos analíticos via Chart.js: Desempenho dos Agentes (barras agrupadas: resolvidos vs. em atendimento), Cumprimento de SLA (doughnut: dentro vs. fora do SLA), Volume por Período nos últimos 30 dias (linha com área: abertos vs. fechados por dia) e Tempo Médio de Resolução por Categoria (barras horizontais em horas).
  * Escrita e consolidação da análise dos resultados para o relatório.
  * Testes finais de todas as funcionalidades: fluxo completo de abertura → atendimento → interação → resolução → fechamento de chamados.
  * Testes de responsividade mobile (sidebar colapsável via botão hamburger, grid adaptativo, tabelas com scroll horizontal).
  * Verificação da persistência de dados via localStorage (camada `DB` com seed data para categorias, usuários, chamados e interações).
  * Planejamento e início da gravação do vídeo de apresentação.
* **🤝 Reunião de Avaliação Colaborativa (com Orientador):**
  * **Etapa 1:** Definir até 3 indicadores que serão a base para a avaliação do trabalho em equipe, justificando cada escolha.
  * **Etapa 2:** Indicar o nome de cada integrante, discutir o papel desempenhado por eles, justificando e indicando aspectos que precisam ser melhorados e as conquistas de cada membro.
  * *Dica:* Usar o Plano de Ação (Quinzena 2) como base para retomar como se deu o desenvolvimento do trabalho, verificando ações pendentes ou que demandaram mais tempo.
* **📄 Documentos e Entregáveis da Etapa:**
  * Formulário de avaliação colaborativa (preenchido em grupo com o orientador).
* **⚠️ Lembrete Oficial:** Utilizar o modelo próprio oficial da instituição (disponível no menu da disciplina no AVA) para o preenchimento do Formulário de Avaliação Colaborativa.
* **📋 Formulário de Avaliação Colaborativa (Modelo para Preenchimento):**
  * **Orientadora:** Ana Luzia Gomes de O. Ispada
  * **Polo:** [Nome do Polo]
  * **Curso:** [Nome do Curso]
  * **Data em que foi feita a reunião:** [Data]
  * **Integrantes:**
    * Allan Ferreira Soares — RA: 24214882 — Polo Itapecerica da Serra/SP
    * Aparecida Janikele Pereira dos Passos — RA: 2233057 — Polo [a definir]
    * Juliana Carla Araujo Gil — RA: 24216689 — Polo Santana de Parnaíba/SP
    * Kelly Cristina Nemesio Vallone — RA: 24203891 — Polo Ribeirão Pires/SP
    * Lucas Damasceno — RA: 24210151 — Polo [a definir]
    * Marcelo Cassiano dos Santos — RA: 24215144 — Polo Santa Isabel/SP
    * Marcio Manoel de Sousa — RA: 23201680 — Polo Jandira/SP
    * Vanessa Dias Fernandes — RA: 26101589 — Polo Cajamar/SP

  **Levantamento de indicadores para avaliação colaborativa**
  *(Em grupo, identifiquem os indicadores que nortearão as avaliações).*

  | Critério | Justificativa |
  | :--- | :--- |
  | [Ex: Assiduidade nas reuniões] | [Justificativa do grupo] |
  | [Ex: Cumprimento de prazos] | [Justificativa do grupo] |
  | [Ex: Qualidade técnica das entregas] | [Justificativa do grupo] |

  **Avaliação Colaborativa**
  *(Pensando nos critérios elencados acima, atribuam nota de 0 a 5 para cada participante).*

  | Nome dos Integrantes | Nota (0 a 5) | Justificativa |
  | :--- | :--- | :--- |
  | Allan Ferreira Soares | [Nota] | [Justificativa da nota] |
  | Aparecida Janikele P. dos Passos | [Nota] | [Justificativa da nota] |
  | Juliana Carla Araujo Gil | [Nota] | [Justificativa da nota] |
  | Kelly Cristina Nemesio Vallone | [Nota] | [Justificativa da nota] |
  | Lucas Damasceno | [Nota] | [Justificativa da nota] |
  | Marcelo Cassiano dos Santos | [Nota] | [Justificativa da nota] |
  | Marcio Manoel de Sousa | [Nota] | [Justificativa da nota] |
  | Vanessa Dias Fernandes | [Nota] | [Justificativa da nota] |

* **📊 Critérios de Avaliação Colaborativa (Rubrica Oficial - Total 10,0):**

| Item Avaliado | O que fazer para atingir a Pontuação Máxima | Pontuação Máxima |
| :--- | :--- | :--- |
| **Nota do grupo ao aluno** | Avaliação feita em grupo junto aos estudantes. Eles devem levantar até 3 critérios para uma avaliação de cada um dos integrantes do grupo. | 5,0 |
| **Nota do orientador ao aluno** | Comunicar-se frequentemente com o orientador do PI. Organizar-se de acordo com o plano de ação elaborado pelo grupo, entregando as atividades no prazo combinado. Participar ativamente da elaboração do trabalho e demonstrar interesse e participação junto ao grupo. | 5,0 |

---

🎬 **Quinzena 7: Relatório Final, Vídeo e Entrega da Avaliação**
* **Início:** 02/11/2026
* **Objetivo da Etapa:** Revisar e terminar o relatório final e o vídeo.
* **Etapas do Relatório:** Revisão e entrega do Relatório Final | Entrega do Vídeo | Entrega da Avaliação Colaborativa.
* **Live de Alinhamento Final:** 03/11/2026 (Terça-feira) às 19:30
  * 🔗 **Plataforma:** Google Meet | **Link da Reunião:** [Inserir o link aqui]
* **Pautas da Live:**
  * Revisão final do código e do repositório no GitHub.
  * Finalização da edição do vídeo de apresentação do sistema.
  * Consolidação final do Relatório e envio dos documentos.
* **⚠️ ATENÇÃO (REGRA DE OURO):** É obrigatório descrever o protótipo realizado e a sua aplicação no Relatório Final. A correção do relatório está vinculada à entrega da ficha de prototipagem e do vídeo (link válido). **Caso o protótipo não seja descrito, a nota do Relatório Final será ZERO.**
* **📄 Documentos e Entregáveis da Etapa:**
  * Relatório Final (com link do vídeo na capa).
  * Ficha de prototipagem e de vídeo.
  * Formulário de avaliação colaborativa (envio final no AVA).
* **⚠️ Lembrete Oficial:** Utilizar os modelos próprios oficiais da instituição (disponíveis no menu da disciplina no AVA) para o Relatório Final e a Ficha de Prototipagem e de Vídeo.
* **📋 Ficha de Prototipagem e de Vídeo (Modelo para Preenchimento):**
  * **Grupo:** Allan Ferreira Soares (RA: 24214882 — Polo Itapecerica da Serra/SP), Aparecida Janikele Pereira dos Passos (RA: 2233057), Juliana Carla Araujo Gil (RA: 24216689 — Polo Santana de Parnaíba/SP), Kelly Cristina Nemesio Vallone (RA: 24203891 — Polo Ribeirão Pires/SP), Lucas Damasceno (RA: 24210151), Marcelo Cassiano dos Santos (RA: 24215144 — Polo Santa Isabel/SP), Marcio Manoel de Sousa (RA: 23201680 — Polo Jandira/SP), Vanessa Dias Fernandes (RA: 26101589 — Polo Cajamar/SP)
  * **REGIONAL:** [Indicar o polo do grupo]
  * **Curso:** [Indicar o curso]
  * **Disciplina:** [Indicar a disciplina]
  * **Orientadora do PI:** Ana Luzia Gomes de O. Ispada
  * **Título do trabalho:** [Indicar o título definido pelo grupo]
  * **Link do vídeo:** [Indicar o link do vídeo no Youtube]
  * **Descrição do protótipo e análise da sua viabilidade (Até 250 palavras):**
    > O protótipo desenvolvido, intitulado HidroChamado, é uma aplicação web SPA (Single Page Application) construída com HTML5, CSS3 e JavaScript ES6+, voltada para o controle de ocorrências hidráulicas no contexto da SABESP. A solução implementa tela de Login com autenticação por 3 perfis (admin, agente, solicitante), Painel de Controle com 4 KPIs em tempo real (Abertos, Em Atendimento, Resolvidos Hoje, SLAs Vencidos) e alertas automáticos de SLA, formulário de Novo Chamado com busca de endereço via API ViaCEP, lista filtrável de Chamados (por status, prioridade, categoria e busca textual), página de Detalhe com timeline de interações (resposta, nota interna e encaminhamento) e barra de progresso do SLA. O módulo de Relatórios oferece 4 KPIs gerenciais (Total, Taxa de Resolução, Tempo Médio, Cumprimento SLA) e 4 gráficos interativos via Chart.js (Desempenho dos Agentes, Cumprimento SLA, Volume 30 dias, Tempo por Categoria). O painel Admin permite gerenciar 7 categorias de ocorrência (Vazamento de Água, Falta de Água, Qualidade da Água, Esgoto, Hidrômetro, Comercial/Faturamento, Infraestrutura) com SLAs diferenciados (8h a 120h) e 5 níveis de status (Aberto, Em Atendimento, Aguardando Terceiro, Resolvido, Fechado). A persistência é feita via localStorage com camada DB e dados seed. O sistema segue diretrizes WCAG 2.1 AA com ARIA labels, navegação por teclado e contraste adequado. A viabilidade é alta pois utiliza tecnologias gratuitas e de ampla compatibilidade. *(198 palavras)*
* **📌 Estrutura Detalhada do Relatório Final (Padrão Univesp):**
  * **Título:** Frase curta que sintetize o foco do trabalho.
  * **Resumo:** Breve síntese do que tratou o trabalho, em até 250 palavras.
  * **1. Introdução:** Apresentação do tema a ser tratado e do problema a ser pesquisado. Deve explicar o assunto de forma a:
    * Desenvolver o tema;
    * Anunciar a ideia básica;
    * Delimitar o foco da pesquisa;
    * Situar o tema dentro do contexto geral da sua área de trabalho;
    * Descrever as motivações que levaram à escolha do tema;
    * Indicar o objeto do trabalho: o que será estudado?
  * **2. Desenvolvimento:**
    * **2.1 Objetivos:** O objetivo geral define o que se pretende atingir. Os específicos definem as etapas para alcançá-lo. Usar verbos no infinitivo (Exploratórios: conhecer, identificar; Descritivos: caracterizar, descrebir; Explicativos: analisar, avaliar).
    * **2.2 Justificativa e Delimitação do Problema:** Elaborar uma pergunta que norteará a pesquisa. Trazer razões/práticas que justifiquem a proposta (relevância social, cultural, acadêmica e contribuições para o local do projeto).
    * **2.3 Fundamentação Teórica:** Buscar em fontes confiáveis. Citações nas regras da ABNT 6023/2002. (Indiretas: (AUTOR, ano); Diretas curtas: entre aspas; Diretas longas: sem aspas, fonte 10, recuo 4cm, espaçamento simples).
    * **2.4 Aplicação das Disciplinas no PI:** Indicar os conteúdos das disciplinas estudadas no curso que foram abordados no projeto. Relacionar de forma clara e coerente os conteúdos estudados à solução desenvolvida. Indique materiais e conteúdos específicos usados na construção do trabalho.
    * **2.5 Metodologia:** Descrever os passos e estratégias adotadas em cada etapa:
      * *Ouvir e Interpretar o Contexto:* Descrição do contexto, perfil dos sujeitos, como as informações foram coletadas (observação, entrevista, formulário).
      * *Criar / Prototipar:* Análise dos dados, descrição das soluções desenvolvidas.
      * *Implementar / Testar:* Como a solução foi testada, devolutivas coletadas, melhorias indicadas.
  * **3. Resultados: Solução Final:** Demonstrar a criação com base na metodologia (ouvir, criar, implementar). Identificar os resultados obtidos em cada passo. *Incluir imagens, storyboards ou ilustrações*. Descrição detalhada do protótipo e de sua aplicação. Demonstrar quais foram as melhorias realizadas na solução final a partir dos feedbacks coletados junto à comunidade. *(Atenção: proibido fotos de crianças/adolescentes sem autorização dos responsáveis).*
  * **4. Considerações Finais:** Retomar os objetivos e o contexto do PI. Apresentar:
    * Retomada dos resultados à luz das referências estudadas;
    * Contribuições e limitações do trabalho realizado;
    * Impacto da solução na comunidade externa.
  * **Referências:** Indicação dos textos usados na construção do relatório.
* **📊 Critérios de Avaliação do Relatório Final (Rubrica Oficial - Total 10,0):**

| Item Avaliado | O que fazer para atingir a Pontuação Máxima | Pontuação Máxima |
| :--- | :--- | :--- |
| **Adequações** | Realizar todas as correções e melhorias indicadas na avaliação do Relatório Parcial. | 1,0 |
| **Título** | O título deve sintetizar o foco do trabalho (não pode ser abrangente demais). | 0,5 |
| **Relação com as disciplinas** | Indicar conteúdo de **mais de 3 disciplinas** cursadas, fazendo referência a materiais específicos e relacionando-os ao tema em estudo. | 2,0 |
| **Adequação ao Design Thinking** | Demonstrar na metodologia como foram realizados os passos: **ouvir, prototipar e implementar**, apresentando a relação de cada passo com o desenvolvimento da solução. | 2,0 |
| **Solução final e aplicação** | Apresentar descrição **detalhada com imagens** sobre a construção da solução final. Demonstrar as melhorias realizadas a partir dos feedbacks da comunidade externa. | 3,0 |
| **Considerações Finais** | Retomar objetivos e contexto. Retomar resultados à luz das referências. Apontar contribuições, limitações e impacto na comunidade externa. Fazer balanço entre solução inicial e final. | 0,5 |
| **Linguagem e Referências** | Apresentar capa, sumário, resumo, palavras-chave, listas. Texto com coesão, coerência, gramática correta e normas ABNT (citações e referências) adequadas. | 1,0 |

* **📊 Critérios de Avaliação do Vídeo e Ficha de Prototipagem (Rubrica Oficial - Total 10,0):**

| Item Avaliado | O que fazer para atingir a Pontuação Máxima | Pontuação Máxima |
| :--- | :--- | :--- |
| **Identificação do grupo** | O vídeo deve contemplar dados do grupo, título do projeto e outras informações relevantes (incluindo o Polo). | 1,0 |
| **Apresentação do problema** | Apresentar o problema de pesquisa, destacar sua relevância para a comunidade externa e relacioná-lo ao tema norteador da Univesp. | 1,0 |
| **Apresentação da solução** | **Mostrar a solução em pleno funcionamento** (vídeo do sistema rodando), não apenas descrever com imagens. | 3,0 |
| **Implementação na comunidade externa** | Relatar de forma profunda a implementação na comunidade externa, incluindo os impactos gerados. | 2,0 |
| **Utilização dos recursos** | Apresentar recursos variados: slides, imagens e vídeos externos (não utilizar apenas um slideshow). | 2,0 |
| **Tempo** | Respeitar rigorosamente o tempo: **mínimo de 5 e máximo de 10 minutos**. | 1,0 |

* **🚨 Marcos Importantes:**
  * Vencimento das Atividades (AA): 06/11/2026 às 23:59
  * Período de Carência: Até 15/11/2026 às 23:59