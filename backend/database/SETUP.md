# Setup do Banco de Dados PostgreSQL

## Pré-requisitos
- PostgreSQL 12 ou superior instalado
- psql CLI disponível

## Passos para Configuração

### 1. Criar Banco de Dados

```bash
# Windows (cmd)
psql -U postgres

# macOS/Linux (terminal)
sudo -u postgres psql
```

Dentro do psql:
```sql
CREATE DATABASE hidrochamado_db;
CREATE USER hidrochamado WITH PASSWORD 'senha_segura';
ALTER ROLE hidrochamado SET client_encoding TO 'utf8';
ALTER ROLE hidrochamado SET default_transaction_isolation TO 'read committed';
ALTER ROLE hidrochamado SET default_transaction_deferrable TO on;
ALTER ROLE hidrochamado SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE hidrochamado_db TO hidrochamado;
\q
```

### 2. Executar Schema

```bash
# A partir do diretório backend
psql -U hidrochamado -d hidrochamado_db -f database/schema.sql
```

### 3. Adicionar Dados de Teste (Opcional)

```bash
node database/seed.js
```

## Verificar Conexão

```bash
psql -U hidrochamado -d hidrochamado_db -c "SELECT version();"
```

## Variáveis de Ambiente

Atualizar `.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hidrochamado_db
DB_USER=hidrochamado
DB_PASSWORD=senha_segura
```

## Troubleshooting

**Erro: "role hidrochamado does not exist"**
- Criar o usuário novamente com os comandos ALTER ROLE

**Erro: "permission denied"**
- Verificar se o usuário hidrochamado tem permissões no banco
- Re-executar GRANT ALL PRIVILEGES

**Erro ao conectar**
- Verificar se PostgreSQL está rodando
- Windows: Services -> PostgreSQL
- macOS: brew services list
- Linux: systemctl status postgresql
