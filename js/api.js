const API_URL = 'http://localhost:3000/api';

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
        window.location.reload();
      }

      let message = 'Erro na requisição';
      try {
        const err = await response.json();
        message = err.error || err.message || message;
      } catch (_) {}
      throw new Error(message);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

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

  async listarChamados(filtros = {}) {
    const params = new URLSearchParams(filtros);
    const response = await fetch(`${API_URL}/chamados?${params}`, {
      method: 'GET',
      headers: this.getHeaders()
    });

    return this.handleResponse(response);
  }

  async criarChamado(dados) {
    const response = await fetch(`${API_URL}/chamados`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(dados)
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

  async atualizarChamado(id, dados) {
    const response = await fetch(`${API_URL}/chamados/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(dados)
    });

    return this.handleResponse(response);
  }

  async obterPerfil() {
    const response = await fetch(`${API_URL}/usuarios/perfil`, {
      method: 'GET',
      headers: this.getHeaders()
    });

    return this.handleResponse(response);
  }

  async obterDashboard() {
    const response = await fetch(`${API_URL}/relatorios/dashboard`, {
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
}

export const api = new APIService();