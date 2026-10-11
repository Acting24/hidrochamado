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

  document.getElementById('btn-logout')?.addEventListener('click', fazerLogout);

  document.querySelectorAll('.nav-item').forEach((button) => {
    button.addEventListener('click', () => {
      const page = button.dataset.page;
      mudarPagina(page);
    });
  });

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
      cidade: document.getElementById('ch-city')?.value.trim() || '',
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
  const select = document.getElementById('ch-categoria');
  if (!select) return;

  select.innerHTML = '<option value="">Selecione</option>';

  CATEGORIAS_FIXAS.forEach((categoria) => {
    const option = document.createElement('option');
    option.value = categoria.id;
    option.textContent = categoria.nome;
    select.appendChild(option);
  });
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
  } catch (error) {
    showToast('Não foi possível carregar o dashboard.');
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

    row.innerHTML = `
      <td>${chamado.numero_chamado || '-'}</td>
      <td>${chamado.titulo || '-'}</td>
      <td>${chamado.categoria_id || '-'}</td>
      <td>${chamado.prioridade || '-'}</td>
      <td>${chamado.status || '-'}</td>
      <td>${chamado.usuario_solicitante_id || '-'}</td>
      <td>${chamado.usuario_agente_id || '-'}</td>
      <td>${formatDate(chamado.data_criacao)}</td>
      <td>${chamado.sla_limite ? 'Sim' : 'Não'}</td>
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
        <strong>Data:</strong> ${formatDate(chamado.data_criacao)}
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