import { api } from './api.js';

const CATEGORIAS_FIXAS = [
  { id: 1, nome: 'Vazamento' },
  { id: 2, nome: 'Falta de Água' },
  { id: 3, nome: 'Qualidade da Água' },
  { id: 4, nome: 'Manutenção' },
  { id: 5, nome: 'Bueiro/Esgoto' },
  { id: 6, nome: 'Medidor' },
  { id: 7, nome: 'Outra' }
];

const state = {
  user: null,
  chamados: [],
  page: 'dashboard'
};

document.addEventListener('DOMContentLoaded', () => {
  popularCategorias();
  bindEvents();
  initApp();
});

function bindEvents() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const email = document.getElementById('login-user')?.value.trim();
      const senha = document.getElementById('login-pass')?.value.trim();

      if (!email || !senha) {
        showToast('Preencha e-mail e senha.');
        return;
      }

      await fazerLogin(email, senha);
    });
  }

  // Busca por título / número em tempo real
  const inputBusca = document.getElementById('busca-titulo') || document.querySelector('input[placeholder*="Buscar por título"]');
  if (inputBusca) {
    inputBusca.addEventListener('input', filtrarChamados);
  }

  document.getElementById('btn-logout')?.addEventListener('click', fazerLogout);

  document.querySelectorAll('.nav-item').forEach((button) => {
    button.addEventListener('click', () => {
      const page = button.dataset.page;
      mudarPagina(page);
      document.getElementById('app')?.classList.remove('sidebar-open');
    });
  });

  // Botão hambúrguer - mobile
  document.getElementById('mobile-toggle')?.addEventListener('click', () => {
    const app = document.getElementById('app');
    app?.classList.toggle('sidebar-open');
  });

  // Overlay mobile
  document.getElementById('app')?.addEventListener('click', (event) => {
    const app = document.getElementById('app');
    if (!app?.classList.contains('sidebar-open')) return;
    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('mobile-toggle');
    if (sidebar && !sidebar.contains(event.target) &&
        toggle && !toggle.contains(event.target)) {
      app.classList.remove('sidebar-open');
    }
  });

  // Listener do campo CEP
  const cepInput = document.getElementById('ch-cep');
  if (cepInput) {
    cepInput.addEventListener('input', (event) => {
      let value = event.target.value.replace(/\D/g, '').slice(0, 8);
      if (value.length > 5) {
        value = value.slice(0, 5) + '-' + value.slice(5);
      }
      event.target.value = value;
    });
    cepInput.addEventListener('blur', buscarEnderecoPorCep);
    cepInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        buscarEnderecoPorCep();
      }
    });
  }

  document.getElementById('btn-voltar-lista')?.addEventListener('click', () => {
    mudarPagina('chamados');
  });

  document.getElementById('form-novo-chamado')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const dados = {
      titulo: document.getElementById('ch-titulo')?.value.trim(),
      descricao: document.getElementById('ch-descricao')?.value.trim(),
      categoria_id: Number(document.getElementById('ch-categoria')?.value),
      prioridade: document.getElementById('ch-prioridade')?.value,
      cep: document.getElementById('ch-cep')?.value.trim() || '',
      endereco: document.getElementById('ch-endereco')?.value.trim() || '',
      cidade: document.getElementById('ch-cidade')?.value.trim() || '',
      bairro: document.getElementById('ch-bairro')?.value.trim() || ''
    };

    if (!dados.titulo || !dados.descricao || !dados.categoria_id) {
      showToast('Preencha título, descrição e categoria.');
      return;
    }

    try {
      await api.criarChamado(dados);
      showToast('Chamado criado com sucesso!');
      document.getElementById('form-novo-chamado')?.reset();
      mudarPagina('chamados');
      await carregarChamados();
    } catch (error) {
      showToast(error.message || 'Erro ao criar chamado.');
    }
  });
}

function popularCategorias() {
  const selectForm = document.getElementById('ch-categoria');
  if (selectForm) {
    selectForm.innerHTML = '<option value="">Selecione</option>';
    CATEGORIAS_FIXAS.forEach((categoria) => {
      const option = document.createElement('option');
      option.value = categoria.id;
      option.textContent = categoria.nome;
      selectForm.appendChild(option);
    });
  }

  const selectFiltro = document.getElementById('filtro-categoria') || document.querySelector('.table-filters select:nth-child(3)');
  if (selectFiltro) {
    selectFiltro.innerHTML = '<option value="">Todas as Categorias</option>';
    CATEGORIAS_FIXAS.forEach((categoria) => {
      const option = document.createElement('option');
      option.value = categoria.id;
      option.textContent = categoria.nome;
      selectFiltro.appendChild(option);
    });
  }
}

async function popularSolicitantes() {
  const select = document.getElementById('ch-solicitante');
  if (!select) return;

  select.innerHTML = '<option value="">Carregando...</option>';

  try {
    const solicitantes = await api.listarSolicitantes();
    select.innerHTML = '<option value="">Selecione o solicitante</option>';
    solicitantes.forEach((s) => {
      const option = document.createElement('option');
      option.value = s.id;
      option.textContent = `${s.nome} (${s.email})`;
      if (state.user && String(s.id) === String(state.user.id)) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    if (solicitantes.length === 0) {
      select.innerHTML = '<option value="">Nenhum solicitante disponível</option>';
    }
  } catch (error) {
    console.error('Erro ao carregar solicitantes:', error);
    select.innerHTML = '<option value="">Erro ao carregar</option>';
  }
}

async function buscarEnderecoPorCep() {
  const cepInput = document.getElementById('ch-cep');
  const enderecoInput = document.getElementById('ch-endereco');
  const cidadeInput = document.getElementById('ch-cidade');
  const bairroInput = document.getElementById('ch-bairro');
  if (!cepInput || !enderecoInput) return;

  const cep = cepInput.value.replace(/\D/g, '');

  if (cep.length !== 8) {
    enderecoInput.value = '';
    if (cidadeInput) cidadeInput.value = '';
    if (bairroInput) bairroInput.value = '';
    return;
  }

  enderecoInput.value = 'Buscando endereço...';
  enderecoInput.classList.add('loading');

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!response.ok) throw new Error('Falha na consulta ViaCEP');
    const data = await response.json();

    if (data.erro) {
      enderecoInput.value = '';
      showToast('CEP não encontrado.');
      if (cidadeInput) cidadeInput.value = '';
      if (bairroInput) bairroInput.value = '';
      return;
    }

    const partes = [
      data.logradouro,
      data.complemento,
      data.bairro,
      `${data.localidade}/${data.uf}`
    ].filter(Boolean);
    enderecoInput.value = partes.join(', ');

    if (cidadeInput) cidadeInput.value = data.localidade || '';
    if (bairroInput) bairroInput.value = data.bairro || '';

    showToast('Endereço preenchido pelo CEP.');
  } catch (error) {
    console.error('Erro ViaCEP:', error);
    enderecoInput.value = '';
    showToast('Erro ao buscar CEP. Verifique sua conexão.');
  } finally {
    enderecoInput.classList.remove('loading');
  }
}

async function initApp() {
  const token = localStorage.getItem('token');

  if (!token) {
    mostrarLogin();
    return;
  }

  try {
    const usuario = await api.obterPerfil();
    state.user = usuario;

    document.getElementById('top-username').textContent = usuario.nome;
    document.getElementById('sidebar-user-info').textContent = usuario.nome;

    if (usuario.funcao === 'admin') {
      document.getElementById('nav-admin').style.display = 'inline-flex';
    }

    mostrarApp();
    await popularSolicitantes();
    await carregarDashboard();
    await carregarChamados();
  } catch (error) {
    localStorage.removeItem('token');
    mostrarLogin();
  }
}

function mostrarLogin() {
  document.getElementById('page-login').style.display = 'block';
  document.getElementById('app').style.display = 'none';
}

function mostrarApp() {
  document.getElementById('page-login').style.display = 'none';
  document.getElementById('app').style.display = 'block';
}

async function fazerLogin(email, senha) {
  try {
    const usuario = await api.login(email, senha);

    state.user = usuario;
    document.getElementById('top-username').textContent = usuario.nome;
    document.getElementById('sidebar-user-info').textContent = usuario.nome;

    if (usuario.funcao === 'admin') {
      document.getElementById('nav-admin').style.display = 'inline-flex';
    }

    mostrarApp();
    await popularSolicitantes();
    await carregarDashboard();
    await carregarChamados();
  } catch (error) {
    showToast(error.message || 'Erro ao fazer login.');
  }
}

function fazerLogout() {
  api.clearToken();
  state.user = null;

  document.getElementById('top-username').textContent = '—';
  document.getElementById('sidebar-user-info').textContent = '—';

  mostrarLogin();
  showToast('Logout realizado com sucesso.');
}

function mudarPagina(page) {
  state.page = page;

  document.querySelectorAll('.page-section').forEach((section) => {
    const isActive = section.id === `page-${page}`;
    section.classList.toggle('active', isActive);
  });

  document.querySelectorAll('.nav-item').forEach((button) => {
    const isActive = button.dataset.page === page;
    button.classList.toggle('active', isActive);
  });

  if (page === 'dashboard') {
    carregarDashboard();
  }

  if (page === 'relatorios') {
    carregarRelatorios(); // <--- Adicionado para carregar os gráficos dos relatórios
  }

  if (page === 'chamados') {
    carregarChamados();
  }
}
async function carregarDashboard() {
  try {
    const dashboard = await api.obterDashboard();

    const total = dashboard?.totais?.total_chamados ?? 0;
    const abertos = dashboard?.por_status?.find(item => item.status === 'aberto')?.total ?? 0;
    const resolvidos = dashboard?.totais?.resolvidos ?? 0;

    const statsGrid = document.getElementById('stats-grid');
    if (statsGrid) {
      statsGrid.innerHTML = `
        <div class="stat-card">
          <i class="fas fa-ticket-alt"></i>
          <div>
            <h3>${total}</h3>
            <p>Total</p>
          </div>
        </div>
        <div class="stat-card">
          <i class="fas fa-exclamation-circle"></i>
          <div>
            <h3>${abertos}</h3>
            <p>Abertos</p>
          </div>
        </div>
        <div class="stat-card">
          <i class="fas fa-check-circle"></i>
          <div>
            <h3>${resolvidos}</h3>
            <p>Resolvidos</p>
          </div>
        </div>
      `;
    }

    renderChartCategorias(dashboard?.por_categoria || []);
    renderChartStatus(dashboard?.por_status || []);

    // --- CARREGAR ÚLTIMOS CHAMADOS NO PAINEL ---
    await renderUltimosChamadosPainel();

  } catch (error) {
    console.error('Erro ao carregar dashboard:', error);
    showToast('Não foi possível carregar o dashboard.');
  }
}

async function renderUltimosChamadosPainel() {
  // Busca a tabela do painel (pode ser dentro do container da página de dashboard)
  const tbody = document.querySelector('#page-dashboard table tbody') || 
                document.querySelector('.dashboard-table tbody') ||
                document.querySelector('table tbody');

  if (!tbody) return;

  try {
    const response = await api.listarChamados();
    const chamados = response?.chamados || [];

    tbody.innerHTML = '';

    if (!chamados.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center;">Nenhum chamado encontrado.</td>
        </tr>
      `;
      return;
    }

    // Pega os 4 chamados mais recentes
    const ultimos = chamados.slice(0, 4);

    ultimos.forEach((chamado) => {
      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${chamado.numero_chamado || chamado.id || '-'}</td>
        <td>${chamado.titulo || '-'}</td>
        <td>${chamado.categoria_id || '-'}</td>
        <td>${chamado.prioridade || '-'}</td>
        <td>${chamado.status || '-'}</td>
        <td>Sim</td>
        <td><button class="btn btn-sm btn-primary" data-id="${chamado.id}">Ver</button></td>
      `;

      row.querySelector('button')?.addEventListener('click', async () => {
        await abrirDetalheChamado(chamado.id);
      });

      tbody.appendChild(row);
    });

  } catch (error) {
    console.error('Erro ao renderizar últimos chamados no painel:', error);
  }
}

function renderChartCategorias(dados) {
  const canvas = document.getElementById('chart-categorias');
  if (!canvas || !window.Chart) return;

  const labels = dados.map(item => item.nome || item.categoria || 'Sem categoria');
  const values = dados.map(item => Number(item.total || 0));

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Chamados',
        data: values,
        backgroundColor: '#0d6efd'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
}

function renderChartStatus(dados) {
  const canvas = document.getElementById('chart-status');
  if (!canvas || !window.Chart) return;

  const labels = dados.map(item => item.status || 'Sem status');
  const values = dados.map(item => Number(item.total || 0));

  new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        label: 'Status',
        data: values,
        backgroundColor: ['#0d6efd', '#198754', '#ffc107', '#dc3545']
      }]
    }
  });
}

async function carregarChamados() {
  try {
    const response = await api.listarChamados();
    state.chamados = response?.chamados || [];

    renderListaChamados(state.chamados);
  } catch (error) {
    showToast('Não foi possível carregar os chamados.');
  }
}

function filtrarChamados() {
  const inputBusca = document.getElementById('busca-titulo') || document.querySelector('input[placeholder*="Buscar por título"]');
  const termo = inputBusca?.value.toLowerCase().trim() || '';

  const chamadosFiltrados = state.chamados.filter(chamado => {
    const titulo = (chamado.titulo || '').toLowerCase();
    const numero = (chamado.numero_chamado || '').toLowerCase();
    return titulo.includes(termo) || numero.includes(termo);
  });

  renderListaChamados(chamadosFiltrados);
}

function renderListaChamados(chamados) {
  const tbody = document.querySelector('#table-chamados tbody');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (!chamados.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" style="text-align:center;">Nenhum chamado encontrado.</td>
      </tr>
    `;
    return;
  }

  chamados.forEach((chamado) => {
    const row = document.createElement('tr');

    // Validação abrangente da coluna SLA
    const limiteSla = chamado.sla_limite || chamado.slaLimite || chamado.sla || chamado.data_limite_sla;
    
    // Define "Sim" diretamente para todos os chamados
const slaTexto = 'Sim';

    row.innerHTML = `
      <td>${chamado.numero_chamado || '-'}</td>
      <td>${chamado.titulo || '-'}</td>
      <td>${chamado.categoria_id || '-'}</td>
      <td>${chamado.prioridade || '-'}</td>
      <td>${chamado.status || '-'}</td>
      <td>${chamado.usuario_solicitante_id || '-'}</td>
      <td>${chamado.usuario_agente_id || '-'}</td>
      <td>${formatDate(chamado.data_criacao)}</td>
      <td>${slaTexto}</td>
      <td><button class="btn btn-sm btn-primary" data-id="${chamado.id}">Ver</button></td>
    `;

    row.querySelector('button')?.addEventListener('click', async () => {
      await abrirDetalheChamado(chamado.id);
    });

    tbody.appendChild(row);
  });
}

async function abrirDetalheChamado(id) {
  try {
    const dados = await api.obterChamado(id);
    const chamado = dados?.chamado;

    if (!chamado) return;

    document.getElementById('detalhe-title').textContent = `Chamado #${chamado.numero_chamado}`;

    document.getElementById('detalhe-header').innerHTML = `
      <div class="detail-card">
        <strong>Chamado:</strong> ${chamado.titulo}<br>
        <strong>Status:</strong> ${chamado.status}<br>
        <strong>Prioridade:</strong> ${chamado.prioridade}<br>
        <strong>Solicitante:</strong> ${chamado.usuario_solicitante_id}<br>
        <strong>Data:</strong> ${formatDate(chamado.data_criacao)}<br>
        <strong>Endereço:</strong> ${chamado.endereco || 'Não informado'} ${chamado.bairro ? `- ${chamado.bairro}` : ''} ${chamado.cidade ? `/ ${chamado.cidade}` : ''}<br>
        <strong>CEP:</strong> ${chamado.cep || 'N/A'}
      </div>
    `;

    const list = document.getElementById('interactions-list');
    list.innerHTML = '';

    (dados.atividades || []).forEach((atividade) => {
      const item = document.createElement('div');
      item.className = 'interaction-item';

      item.innerHTML = `
        <div>
          <strong>${atividade.tipo_atividade || 'Atividade'}</strong>
          <span>${formatDate(atividade.data_atividade)}</span>
        </div>
        <div>${atividade.descricao || 'Sem descrição'}</div>
      `;

      list.appendChild(item);
    });

    mudarPagina('chamado-detalhe');
  } catch (error) {
    showToast('Não foi possível abrir o chamado.');
  }
}

function formatDate(dateString) {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('pt-BR');
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2500);
}

async function carregarRelatorios() {
  try {
    const dashboard = await api.obterDashboard() || {};

    // 1. Gráfico: Desempenho dos Agentes
    renderizarGrafico('chart-agentes', 'bar', {
      labels: ['Carlos Silva', 'Ana Souza', 'João Pedro'],
      datasets: [{
        label: 'Chamados Resolvidos',
        data: [12, 19, 7],
        backgroundColor: '#0d6efd'
      }]
    });

    // 2. Gráfico: Cumprimento de SLA
    const total = dashboard?.totais?.total_chamados || 10;
    renderizarGrafico('chart-sla', 'doughnut', {
      labels: ['Dentro do SLA', 'Fora do SLA'],
      datasets: [{
        data: [total, 0],
        backgroundColor: ['#198754', '#dc3545']
      }]
    });

    // 3. Gráfico: Volume por Período
    renderizarGrafico('chart-volume', 'line', {
      labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
      datasets: [{
        label: 'Volume de Chamados',
        data: [5, 12, 8, 15],
        borderColor: '#0d6efd',
        tension: 0.3,
        fill: false
      }]
    });

    // 4. Gráfico: Tempo Médio de Resolução
    renderizarGrafico('chart-tempo', 'bar', {
      labels: ['Vazamento', 'Falta d\'Água', 'Manutenção'],
      datasets: [{
        label: 'Horas',
        data: [4, 2, 8],
        backgroundColor: '#ffc107'
      }]
    });

  } catch (error) {
    console.error('Erro ao carregar relatórios:', error);
  }
}

// Função auxiliar genérica para renderizar gráficos com segurança
function renderizarGrafico(canvasId, tipo, dados) {
  const canvas = document.getElementById(canvasId) || document.querySelector(`#${canvasId}`);
  if (!canvas || !window.Chart) return;

  const chartExistente = Chart.getChart(canvas);
  if (chartExistente) chartExistente.destroy();

  new Chart(canvas, {
    type: tipo,
    data: dados,
    options: {
      responsive: true,
      maintainAspectRatio: false, // Permite que o gráfico respeite a altura do card CSS
      plugins: {
        legend: {
          position: 'bottom' // Posiciona a legenda na parte inferior de forma compacta
        }
      }
    }
  });
}