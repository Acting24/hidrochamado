/**
 * GUIA DE INTEGRAÇÃO: Frontend com Backend API
 * 
 * Este arquivo mostra como integrar o app.js existente com a API do backend.
 * Substitua as funções de localStorage pelas chamadas API correspondentes.
 */

import { api } from './api.js';

// ===== EXEMPLO 1: LOGIN =====
// ANTES (localStorage):
// function fazerLogin(email, senha) {
//   const usuario = usuarios_fake[email];
//   if (usuario) {
//     localStorage.setItem('usuario_autenticado', JSON.stringify(usuario));
//   }
// }

// DEPOIS (API):
async function fazerLogin(email, senha) {
  try {
    const usuario = await api.login(email, senha);
    localStorage.setItem('usuario_autenticado', JSON.stringify(usuario));
    // Redirecionar para o app
    document.getElementById('page-login').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    carregarPerfil();
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    mostrarErro('Email ou senha incorretos');
  }
}

// ===== EXEMPLO 2: CARREGAR DASHBOARD =====
// ANTES (localStorage):
// function carregarDashboard() {
//   const chamados_data = JSON.parse(localStorage.getItem('chamados')) || [];
//   // Processar dados locais
// }

// DEPOIS (API):
async function carregarDashboard() {
  try {
    const dados = await api.obterDashboard();
    
    // Atualizar gráficos com dados reais
    atualizarGraficoStatus(dados.por_status);
    atualizarGraficoCategoria(dados.por_categoria);
    atualizarGraficoPrioridade(dados.por_prioridade);
    
    // Atualizar estatísticas
    document.getElementById('stats-grid').innerHTML = `
      <div class="stat-card">
        <i class="fas fa-tasks" aria-hidden="true"></i>
        <div>
          <h3>${dados.totais.total_chamados}</h3>
          <p>Total de Chamados</p>
        </div>
      </div>
      <div class="stat-card">
        <i class="fas fa-check-circle" aria-hidden="true"></i>
        <div>
          <h3>${dados.totais.resolvidos}</h3>
          <p>Resolvidos</p>
        </div>
      </div>
      <div class="stat-card">
        <i class="fas fa-fire" aria-hidden="true"></i>
        <div>
          <h3>${dados.totais.criados_ultima_semana}</h3>
          <p>Esta Semana</p>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error);
    mostrarErro('Erro ao carregar dados');
  }
}

// ===== EXEMPLO 3: CRIAR CHAMADO =====
// ANTES (localStorage):
// document.getElementById('form-novo-chamado').addEventListener('submit', (e) => {
//   const chamado = {
//     id: Date.now(),
//     titulo: document.getElementById('ch-titulo').value,
//     // ...
//   };
//   localStorage.setItem('chamado_' + chamado.id, JSON.stringify(chamado));
// });

// DEPOIS (API):
document.getElementById('form-novo-chamado')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  try {
    const novoChamado = {
      titulo: document.getElementById('ch-titulo').value,
      descricao: document.getElementById('ch-descricao').value,
      categoria_id: parseInt(document.getElementById('ch-categoria').value),
      prioridade: document.getElementById('ch-prioridade').value,
      cep: document.getElementById('ch-cep').value,
      endereco: document.getElementById('ch-endereco').value,
      cidade: document.getElementById('ch-city').value,
      bairro: document.getElementById('ch-bairro').value
    };

    const resultado = await api.criarChamado(novoChamado);
    
    mostrarSucesso(`Chamado ${resultado.chamado.numero_chamado} criado com sucesso!`);
    
    // Limpar formulário e voltar para lista
    e.target.reset();
    mudarPagina('chamados');
    carregarChamados();
  } catch (error) {
    console.error('Erro ao criar chamado:', error);
    mostrarErro('Erro ao criar chamado');
  }
});

// ===== EXEMPLO 4: LISTAR CHAMADOS =====
// ANTES (localStorage):
// function carregarChamados() {
//   const chamados = [];
//   for (let key in localStorage) {
//     if (key.startsWith('chamado_')) {
//       chamados.push(JSON.parse(localStorage[key]));
//     }
//   }
// }

// DEPOIS (API):
async function carregarChamados(filtros = {}) {
  try {
    const resultado = await api.listarChamados(filtros);
    
    const tbody = document.querySelector('#table-chamados tbody');
    tbody.innerHTML = '';

    resultado.chamados.forEach(chamado => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${chamado.numero_chamado}</td>
        <td><strong>${chamado.titulo}</strong></td>
        <td>${chamado.categoria_id}</td>
        <td><span class="badge badge-${chamado.prioridade}">${chamado.prioridade}</span></td>
        <td><span class="badge badge-${chamado.status}">${chamado.status}</span></td>
        <td>${chamado.usuario_solicitante_id}</td>
        <td>${chamado.usuario_agente_id || '-'}</td>
        <td>${new Date(chamado.data_criacao).toLocaleDateString('pt-BR')}</td>
        <td>${verificarSLA(chamado)}</td>
        <td>
          <button onclick="abrirChamado(${chamado.id})" class="btn btn-sm btn-primary">
            <i class="fas fa-external-link-alt"></i>
          </button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error('Erro ao listar chamados:', error);
    mostrarErro('Erro ao carregar chamados');
  }
}

// ===== EXEMPLO 5: OBTER DETALHE DO CHAMADO =====
// ANTES (localStorage):
// function abrirChamado(id) {
//   const chamado = JSON.parse(localStorage.getItem('chamado_' + id));
//   // Exibir detalhes
// }

// DEPOIS (API):
async function abrirChamado(id) {
  try {
    const dados = await api.obterChamado(id);
    
    document.getElementById('page-chamado-detalhe').style.display = 'block';
    document.getElementById('detalhe-title').innerText = `Chamado #${dados.chamado.numero_chamado}`;
    
    // Exibir atividades/interações
    const interacoesList = document.getElementById('interactions-list');
    interacoesList.innerHTML = '';
    
    dados.atividades.forEach(atividade => {
      const div = document.createElement('div');
      div.className = 'interaction-item';
      div.innerHTML = `
        <div class="interaction-header">
          <span class="interaction-user">${atividade.usuario_id}</span>
          <span class="interaction-date">${new Date(atividade.data_atividade).toLocaleString('pt-BR')}</span>
        </div>
        <div class="interaction-content">${atividade.descricao}</div>
      `;
      interacoesList.appendChild(div);
    });
  } catch (error) {
    console.error('Erro ao abrir chamado:', error);
    mostrarErro('Erro ao carregar chamado');
  }
}

// ===== EXEMPLO 6: ATUALIZAR STATUS DO CHAMADO =====
// ANTES (localStorage):
// function atualizarStatus(chamado_id, novo_status) {
//   const chamado = JSON.parse(localStorage.getItem('chamado_' + chamado_id));
//   chamado.status = novo_status;
//   localStorage.setItem('chamado_' + chamado_id, JSON.stringify(chamado));
// }

// DEPOIS (API):
async function atualizarStatus(chamado_id, novo_status, observacoes = '') {
  try {
    await api.atualizarChamado(chamado_id, {
      status: novo_status,
      observacoes: observacoes
    });
    
    mostrarSucesso('Chamado atualizado com sucesso!');
    abrirChamado(chamado_id); // Recarregar detalhes
  } catch (error) {
    console.error('Erro ao atualizar chamado:', error);
    mostrarErro('Erro ao atualizar chamado');
  }
}

// ===== EXEMPLO 7: BUSCAR CEP COM VIAÇÃO =====
// Isso continua igual, chamada externa
async function buscarCEP(cep) {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    
    if (data.erro) {
      mostrarErro('CEP não encontrado');
      return;
    }
    
    document.getElementById('ch-endereco').value = `${data.logradouro}, ${data.bairro}`;
    document.getElementById('ch-city').value = data.localidade;
    document.getElementById('ch-bairro').value = data.bairro;
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
  }
}

// ===== EXEMPLO 8: CARREGAR RELATÓRIOS =====
// ANTES (localStorage):
// function carregarRelatorios() {
//   const chamados = [];
//   for (let key in localStorage) {
//     if (key.startsWith('chamado_')) {
//       chamados.push(JSON.parse(localStorage[key]));
//     }
//   }
//   // Processar dados
// }

// DEPOIS (API):
async function carregarRelatorios() {
  try {
    const dashboard = await api.obterDashboard();
    const desempenho = await api.obterDesempenhoAgentes();
    
    // Atualizar gráfico de agentes
    const ctxAgentes = document.getElementById('chart-agentes').getContext('2d');
    new Chart(ctxAgentes, {
      type: 'bar',
      data: {
        labels: desempenho.map(a => a.nome),
        datasets: [{
          label: 'Chamados Resolvidos',
          data: desempenho.map(a => a.resolvidos),
          backgroundColor: '#007bff'
        }]
      }
    });
  } catch (error) {
    console.error('Erro ao carregar relatórios:', error);
    mostrarErro('Erro ao carregar relatórios');
  }
}

// ===== EXEMPLO 9: CARREGAR PERFIL DO USUÁRIO =====
async function carregarPerfil() {
  try {
    const perfil = await api.obterPerfil();
    document.getElementById('sidebar-user-info').innerText = `👤 ${perfil.nome}`;
    document.getElementById('top-username').innerText = perfil.nome;
    
    // Se for admin, mostrar menu admin
    if (perfil.funcao === 'admin') {
      document.getElementById('nav-admin').style.display = 'block';
    }
    
    localStorage.setItem('usuario_autenticado', JSON.stringify(perfil));
  } catch (error) {
    console.error('Erro ao carregar perfil:', error);
  }
}

// ===== EXEMPLO 10: LOGOUT =====
// ANTES:
// function fazerLogout() {
//   localStorage.removeItem('usuario_autenticado');
// }

// DEPOIS:
function fazerLogout() {
  api.clearToken();
  localStorage.removeItem('usuario_autenticado');
  
  document.getElementById('page-login').style.display = 'block';
  document.getElementById('app').style.display = 'none';
  
  mostrarSucesso('Logout realizado com sucesso!');
}

// ===== FUNÇÕES AUXILIARES =====

function mostrarSucesso(mensagem) {
  const toast = document.createElement('div');
  toast.className = 'toast toast-success';
  toast.innerText = mensagem;
  document.getElementById('toast-container').appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function mostrarErro(mensagem) {
  const toast = document.createElement('div');
  toast.className = 'toast toast-error';
  toast.innerText = mensagem;
  document.getElementById('toast-container').appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function verificarSLA(chamado) {
  if (!chamado.sla_limite) return 'Sem SLA';
  const agora = new Date();
  const limite = new Date(chamado.sla_limite);
  return limite > agora ? '✅ No Prazo' : '❌ Vencido';
}

// Export para uso em outros módulos
export {
  fazerLogin,
  carregarDashboard,
  carregarChamados,
  abrirChamado,
  atualizarStatus,
  carregarRelatorios,
  carregarPerfil,
  fazerLogout
};
