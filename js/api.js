// API Service - Integração com Backend

const API_URL = process.env.API_URL || 'http://localhost:3000/api';

class APIService {
  constructor() {
    this.token = localStorage.getItem('token') || null;
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async handleResponse(response) {
    if (!response.ok) {
      if (response.status === 401) {
        this.clearToken();
        window.location.href = '/index.html';
      }
      const error = await response.json();
      throw new Error(error.error || 'Erro na requisição');
    }
    return response.json();
  }

  // ===== AUTENTICAÇÃO =====
  async login(email, senha) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, senha })
    });

    const data = await this.handleResponse(response);
    this.setToken(data.token);
    return data.usuario;
  }

  async registrar(nome, email, senha, funcao) {
    const response = await fetch(`${API_URL}/auth/registrar`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ nome, email, senha, funcao })
    });

    return this.handleResponse(response);
  }

  // ===== CHAMADOS =====
  async criarChamado(dadosChamado) {
    const response = await fetch(`${API_URL}/chamados`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(dadosChamado)
    });

    return this.handleResponse(response);
  }

  async listarChamados(filtros = {}) {
    const params = new URLSearchParams(filtros);
    const response = await fetch(`${API_URL}/chamados?${params}`, {
      method: 'GET',
      headers: this.getHeaders()
    });

    return this.handleResponse(response);
  }

  async obterChamado(id) {
    const response = await fetch(`${API_URL}/chamados/${id}`, {
      method: 'GET',
      headers: this.getHeaders()
    });

    return this.handleResponse(response);
  }

  async atualizarChamado(id, atualizacoes) {
    const response = await fetch(`${API_URL}/chamados/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(atualizacoes)
    });

    return this.handleResponse(response);
  }

  // ===== USUÁRIOS =====
  async obterPerfil() {
    const response = await fetch(`${API_URL}/usuarios/perfil`, {
      method: 'GET',
      headers: this.getHeaders()
    });

    return this.handleResponse(response);
  }

  async listarAgentes() {
    const response = await fetch(`${API_URL}/usuarios/agentes`, {
      method: 'GET',
      headers: this.getHeaders()
    });

    return this.handleResponse(response);
  }

  async listarUsuarios() {
    const response = await fetch(`${API_URL}/usuarios`, {
      method: 'GET',
      headers: this.getHeaders()
    });

    return this.handleResponse(response);
  }

  // ===== RELATÓRIOS =====
  async obterDashboard() {
    const response = await fetch(`${API_URL}/relatorios/dashboard`, {
      method: 'GET',
      headers: this.getHeaders()
    });

    return this.handleResponse(response);
  }

  async obterRelatoriSLA() {
    const response = await fetch(`${API_URL}/relatorios/sla`, {
      method: 'GET',
      headers: this.getHeaders()
    });

    return this.handleResponse(response);
  }

  async obterDesempenhoAgentes() {
    const response = await fetch(`${API_URL}/relatorios/desempenho-agentes`, {
      method: 'GET',
      headers: this.getHeaders()
    });

    return this.handleResponse(response);
  }

  // ===== HEALTH CHECK =====
  async verificarConexao() {
    try {
      const response = await fetch(`${API_URL}/health`, {
        method: 'GET'
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export const api = new APIService();
