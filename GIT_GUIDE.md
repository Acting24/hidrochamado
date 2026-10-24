# 📚 Guia: Controle de Versão com Git/GitHub

## Pré-requisitos
- Git instalado
- Conta GitHub
- SSH key configurada (opcional mas recomendado)

---

## Inicializar Repositório Local

```bash
# A partir da raiz do projeto
cd c:\Users\dell\Desktop\HC

# Inicializar git
git init

# Adicionar arquivo gitignore (já existe)
# git add .gitignore

# Configurar seu usuário Git (primeiro commit)
git config user.name "Seu Nome"
git config user.email "seu.email@example.com"

# Adicionar todos os arquivos
git add .

# Primeiro commit
git commit -m "Initial commit: HidroChamado - PJI240 UNIVESP"
```

---

## Criar Repositório no GitHub

1. Abrir [github.com/new](https://github.com/new)
2. Nome: `hidrochamado`
3. Descrição: "Sistema de Controle de Chamados SABESP"
4. **NÃO** inicializar com README (já temos um)
5. Clicar **Create repository**

---

## Conectar Local com GitHub

```bash
# Copie uma das opções do GitHub:

# Opção 1: HTTPS (mais simples para começar)
git remote add origin https://github.com/SEU-USUARIO/hidrochamado.git
git branch -M main
git push -u origin main

# Opção 2: SSH (mais seguro, requer config prévia)
git remote add origin git@github.com:SEU-USUARIO/hidrochamado.git
git branch -M main
git push -u origin main
```

---

## Workflow Diário

### Verificar Status
```bash
git status
```

### Fazer Commits Pequenos e Frequentes
```bash
# Adicionar arquivo específico
git add backend/routes/chamados.js

# Ou adicionar todos os arquivos
git add .

# Commit com mensagem descritiva
git commit -m "Feat: Add GET /api/chamados endpoint with filters"
```

### Enviar para GitHub
```bash
git push origin main
```

### Trazer Mudanças do GitHub
```bash
git pull origin main
```

---

## Boas Práticas de Commits

### Formato de Mensagem
```
<tipo>: <descrição breve>

<descrição detalhada (opcional)>

<referências (opcional)>
```

### Tipos Comuns
- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Documentação
- **style**: Formatação (não afeta código)
- **refactor**: Refatoração
- **test**: Testes
- **chore**: Manutenção
- **ci**: CI/CD

### Exemplos
```bash
git commit -m "feat: Add JWT authentication to API"
git commit -m "fix: Fix SLA calculation logic for status updates"
git commit -m "docs: Update API documentation with examples"
git commit -m "style: Format code with prettier"
git commit -m "test: Add test coverage for chamados endpoint"
git commit -m "chore: Update dependencies to latest versions"
```

---

## Branches (Para Trabalho em Equipe)

### Criar Feature Branch
```bash
# Criar e mudar para branch
git checkout -b feature/login-api
# ou (Git 2.23+)
git switch -c feature/login-api

# Trabalhar normalmente
git add .
git commit -m "Implement login endpoint"

# Enviar para GitHub
git push origin feature/login-api
```

### Volta para Main
```bash
git checkout main
# ou
git switch main
```

### Listar Branches
```bash
git branch -a              # Local e remoto
git branch -l              # Apenas local
```

### Deletar Branch
```bash
git branch -d feature/login-api              # Local
git push origin --delete feature/login-api   # Remoto
```

---

## Pull Requests (Revisão de Código)

### Criar PR no GitHub
1. Enviar feature branch para GitHub
2. GitHub detecta novo branch
3. Clicar **Compare & pull request**
4. Preencher título e descrição
5. Clicar **Create pull request**

### Template de PR
```markdown
## Descrição
Breve descrição do que foi feito

## Tipo de Mudança
- [ ] Bug fix
- [ ] Novo recurso
- [ ] Breaking change
- [ ] Documentação

## Como Testar
Instruções para testar as mudanças

## Checklist
- [ ] Código testado localmente
- [ ] Sem erros de linting
- [ ] Documentação atualizada
- [ ] Testes adicionados
```

### Mergear PR
1. Revisar mudanças
2. Clicar **Merge pull request**
3. Clicar **Confirm merge**
4. Opcionalmente deletar branch

---

## Resolver Conflitos

```bash
# Trazer mudanças do remoto
git fetch origin

# Tentar mergear
git merge origin/main
# Se houver conflitos...

# Ver conflitos
git status

# Editar arquivos com conflitos (procure por <<<, ==>, >>>)

# Após resolver:
git add .
git commit -m "Resolve merge conflicts"
git push origin seu-branch
```

---

## Ver Histórico

```bash
# Ver últimos commits
git log
git log --oneline -10          # Últimos 10, formato curto
git log --graph --oneline --all # Gráfico visual

# Ver mudanças
git diff                       # Vs arquivo anterior
git diff HEAD~1               # Vs commit anterior
git show <commit-hash>        # Ver commit específico
```

---

## Desfazer Mudanças

```bash
# Desfazer mudanças não staged
git restore arquivo.js
# ou (Git antigo)
git checkout -- arquivo.js

# Desfazer commit (manter mudanças)
git reset --soft HEAD~1

# Desfazer commit (descartar mudanças)
git reset --hard HEAD~1

# Revert (criar novo commit que desfaz anterior)
git revert <commit-hash>
```

---

## Stash (Salvar Trabalho Temporário)

```bash
# Guardar mudanças sem commitar
git stash

# Listar stashes
git stash list

# Recuperar stash
git stash pop                  # Último
git stash apply stash@{0}     # Específico

# Descartar stash
git stash drop
git stash clear               # Todos
```

---

## GitHub Actions (CI/CD Automático)

### Criar Workflow de Testes

Arquivo: `.github/workflows/tests.yml`

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '16'
      
      - name: Install dependencies
        run: cd backend && npm install
      
      - name: Run tests
        run: cd backend && npm test
        env:
          DATABASE_URL: postgres://postgres:postgres@localhost:5432/test_db
```

---

## Dicas Úteis

```bash
# Alias para comandos longos (adicionar no .gitconfig)
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.ci commit
git config --global alias.br branch
git config --global alias.lg "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"

# Verificar configuração
git config --global --list

# Ignorar arquivo já versionado
git rm --cached arquivo
echo "arquivo" >> .gitignore
git commit -m "Stop tracking arquivo"
```

---

## Recursos Externos

- [Git Docs](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Interactive Git Tutorial](https://learngitbranching.js.org/)
- [GitHub CLI Docs](https://cli.github.com/manual/)

---

**Próximo Passo:** Reforçar acessibilidade (Ver ACCESSIBILITY.md)
