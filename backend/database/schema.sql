-- Criar database
CREATE DATABASE hidrochamado_db;

-- Conectar ao banco de dados
\c hidrochamado_db

-- Tabela de usuários
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  cpf_cnpj VARCHAR(20),
  funcao VARCHAR(50) NOT NULL CHECK (funcao IN ('admin', 'agente', 'solicitante')),
  departamento VARCHAR(100),
  ativo BOOLEAN DEFAULT true,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(email)
);

-- Tabela de categorias
CREATE TABLE categorias (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE,
  descricao TEXT,
  ativa BOOLEAN DEFAULT true,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de chamados
CREATE TABLE chamados (
  id SERIAL PRIMARY KEY,
  numero_chamado VARCHAR(50) UNIQUE NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  categoria_id INTEGER REFERENCES categorias(id),
  usuario_solicitante_id INTEGER NOT NULL REFERENCES usuarios(id),
  usuario_agente_id INTEGER REFERENCES usuarios(id),
  prioridade VARCHAR(20) NOT NULL CHECK (prioridade IN ('baixa', 'media', 'alta', 'critica')) DEFAULT 'media',
  status VARCHAR(20) NOT NULL CHECK (status IN ('aberto', 'em_andamento', 'em_pausa', 'resolvido', 'fechado')) DEFAULT 'aberto',
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_resolucao TIMESTAMP,
  sla_limite TIMESTAMP,
  observacoes TEXT,
  endereco VARCHAR(255),
  cep VARCHAR(20),
  cidade VARCHAR(100),
  bairro VARCHAR(100)
);

-- Tabela de atividades/histórico
CREATE TABLE atividades (
  id SERIAL PRIMARY KEY,
  chamado_id INTEGER NOT NULL REFERENCES chamados(id) ON DELETE CASCADE,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
  tipo_atividade VARCHAR(50) NOT NULL,
  descricao TEXT,
  status_anterior VARCHAR(20),
  status_novo VARCHAR(20),
  data_atividade TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de anexos
CREATE TABLE anexos (
  id SERIAL PRIMARY KEY,
  chamado_id INTEGER NOT NULL REFERENCES chamados(id) ON DELETE CASCADE,
  nome_arquivo VARCHAR(255) NOT NULL,
  url_arquivo VARCHAR(500),
  tipo_arquivo VARCHAR(50),
  tamanho_arquivo INTEGER,
  usuario_id INTEGER REFERENCES usuarios(id),
  data_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX idx_chamados_usuario_solicitante ON chamados(usuario_solicitante_id);
CREATE INDEX idx_chamados_usuario_agente ON chamados(usuario_agente_id);
CREATE INDEX idx_chamados_status ON chamados(status);
CREATE INDEX idx_chamados_prioridade ON chamados(prioridade);
CREATE INDEX idx_chamados_data_criacao ON chamados(data_criacao);
CREATE INDEX idx_atividades_chamado ON atividades(chamado_id);
CREATE INDEX idx_anexos_chamado ON anexos(chamado_id);

-- Inserir categorias padrão
INSERT INTO categorias (nome, descricao) VALUES
('Vazamento', 'Problemas de vazamento de água'),
('Falta de Água', 'Sem fornecimento de água'),
('Qualidade da Água', 'Problemas com qualidade ou cor da água'),
('Manutenção', 'Serviços de manutenção geral'),
('Bueiro/Esgoto', 'Problemas em bueiros ou sistema de esgoto'),
('Medidor', 'Problemas com medidor de água'),
('Outra', 'Outras categorias não especificadas');

-- Função para atualizar data_atualizacao
CREATE OR REPLACE FUNCTION update_data_atualizacao()
RETURNS TRIGGER AS $$
BEGIN
  NEW.data_atualizacao = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar data_atualizacao
CREATE TRIGGER trigger_usuarios_atualiza
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION update_data_atualizacao();

CREATE TRIGGER trigger_chamados_atualiza
BEFORE UPDATE ON chamados
FOR EACH ROW
EXECUTE FUNCTION update_data_atualizacao();
