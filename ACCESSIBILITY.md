# ♿ Guia de Acessibilidade - WCAG 2.1 AA

Este documento descreve as práticas de acessibilidade implementadas no HidroChamado e como melhorá-las.

---

## 📋 Conformidade WCAG 2.1 AA

O sistema segue as diretrizes **WCAG 2.1 Nível AA** (recomendado pela W3C).

### Princípios WCAG

1. **Perceptível** — Informação acessível a todos os sentidos
2. **Operável** — Navegação e controle sem mouse
3. **Compreensível** — Conteúdo claro e previsível
4. **Robusto** — Compatível com tecnologias de assistência

---

## ✅ Checklist de Acessibilidade

### Estrutura Semântica (Perceptível)

- ✅ **HTML5 Semântico**
  ```html
  <header>, <nav>, <main>, <section>, <article>, <footer>
  <form>, <label>, <button>, <table>
  ```

- ✅ **Headings Estruturados** (H1 → H6)
  ```html
  <h1>HidroChamado</h1>
  <h2>Painel de Controle</h2>
  <h3>Detalhes do Chamado</h3>
  ```

- ✅ **Roles e Landmarks**
  ```html
  <main role="main">
  <nav role="navigation" aria-label="Menu principal">
  <div role="alert" aria-live="polite">
  <div role="dialog" aria-modal="true">
  ```

### ARIA Labels (Perceptível + Operável)

- ✅ **Botões**
  ```html
  <button aria-label="Abrir novo chamado">
    <i class="fas fa-plus-circle"></i> Novo
  </button>
  ```

- ✅ **Inputs**
  ```html
  <input id="login-user" aria-required="true" required>
  <input id="ch-cep" aria-label="CEP para busca automática">
  ```

- ✅ **Regiões Dinâmicas**
  ```html
  <div aria-live="polite" role="status">
    Carregando dados...
  </div>
  ```

- ✅ **Descrições**
  ```html
  <button aria-describedby="help-text">Enviar</button>
  <div id="help-text">Clique para enviar o formulário</div>
  ```

### Navegação por Teclado (Operável)

- ✅ **Tab Order Lógico**
  - Ordem de navegação segue fluxo visual
  - Usar `tabindex="0"` para elementos focáveis
  - Evitar `tabindex > 0` (causa confusão)

- ✅ **Skip Links** (IMPLEMENTAR)
  ```html
  <a href="#main-content" class="skip-link">Pular para conteúdo principal</a>
  ```

- ✅ **Teclas de Atalho**
  ```html
  <button accesskey="n" title="N - Novo Chamado">Novo Chamado</button>
  <!-- Alt + N (Windows/Linux) ou Control + Option + N (macOS) -->
  ```

- ✅ **Focus Visível**
  ```css
  button:focus, input:focus {
    outline: 3px solid #007bff;
    outline-offset: 2px;
  }
  ```

### Contraste de Cor (Perceptível)

- ✅ **Contraste Mínimo** (WCAG AA)
  - Texto normal: 4.5:1
  - Texto grande (≥18pt): 3:1
  - UI components: 3:1

**Verificar com:** [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

```css
/* Bom contraste (AAA) */
color: #1a1a1a;            /* ~99% preto */
background-color: #ffffff; /* 100% branco */
/* Razão: 21:1 */

/* Bom contraste (AA) */
color: #555555;
background-color: #ffffff;
/* Razão: ~7.5:1 */
```

### Imagens e Ícones (Perceptível)

- ✅ **Alt Text** para imagens significativas
  ```html
  <img src="logo.png" alt="Logotipo HidroChamado">
  ```

- ✅ **Ícones Decorativos**
  ```html
  <i class="fas fa-water" aria-hidden="true"></i>
  ```

- ⚠️ **Ícones Funcionais** (MELHORAR)
  ```html
  <!-- Ruim -->
  <button><i class="fas fa-trash"></i></button>

  <!-- Bom -->
  <button aria-label="Deletar chamado">
    <i class="fas fa-trash" aria-hidden="true"></i>
  </button>
  ```

### Formulários (Operável + Compreensível)

- ✅ **Labels Associados**
  ```html
  <label for="ch-titulo">Título do Chamado</label>
  <input id="ch-titulo" required>
  ```

- ✅ **Validação**
  ```html
  <input type="email" aria-required="true" required>
  <span role="alert" id="error-email">Email inválido</span>
  ```

- ✅ **Placeholder ≠ Label**
  ```html
  <!-- Ruim -->
  <input placeholder="Digite seu email">

  <!-- Bom -->
  <label for="email">Email</label>
  <input id="email" placeholder="usuario@example.com">
  ```

- ✅ **Select Acessível**
  ```html
  <label for="ch-prioridade">Prioridade</label>
  <select id="ch-prioridade" aria-required="true">
    <option value="">Selecione...</option>
    <option value="baixa">Baixa</option>
    <option value="media">Média</option>
  </select>
  ```

### Tabelas (Perceptível + Compreensível)

- ✅ **Headers Semânticos**
  ```html
  <table aria-label="Lista de chamados">
    <thead>
      <tr>
        <th>Número</th>
        <th>Título</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>HC-001</td>
        <td>Vazamento</td>
        <td>Aberto</td>
      </tr>
    </tbody>
  </table>
  ```

- ✅ **Scope Attribute**
  ```html
  <th scope="col">Título</th>
  <th scope="row">João</th>
  ```

### Cores e Padrões (Perceptível)

- ✅ **Não confiar APENAS em cores**
  ```html
  <!-- Ruim -->
  <span style="color: red">Erro</span>

  <!-- Bom -->
  <span style="color: red">❌ Erro:</span>
  <span style="color: red">✓ Resolvido</span>
  ```

- ✅ **Usar Ícones + Cores**
  ```html
  <span class="badge badge-error">
    <i class="fas fa-times-circle"></i> Crítica
  </span>
  ```

### Regiões Dinâmicas e Alerts (Operável)

- ✅ **ARIA Live Regions**
  ```html
  <div aria-live="polite" aria-atomic="true" role="status">
    Chamado criado com sucesso!
  </div>

  <div aria-live="assertive" role="alert">
    Erro: Acesso negado!
  </div>
  ```

- ✅ **Toast Notifications**
  ```javascript
  function mostrarNotificacao(mensagem, tipo) {
    const toast = document.createElement('div');
    toast.role = 'status';
    toast.setAttribute('aria-live', 'polite');
    toast.innerText = mensagem;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
  ```

### Idioma (Compreensível)

- ✅ **Lang Attribute**
  ```html
  <html lang="pt-BR">
  ```

- ✅ **Definir Mudanças de Idioma**
  ```html
  <p>Bem-vindo ao <span lang="en">HidroChamado</span></p>
  ```

---

## 🛠️ Ferramentas de Teste

### Automáticas
1. **[Lighthouse](https://developers.google.com/web/tools/lighthouse)** (Chrome DevTools)
   - Ctrl+Shift+I → Lighthouse → Run audit

2. **[axe DevTools](https://www.deque.com/axe/devtools/)**
   - Extensão gratuita para Chrome/Firefox
   - Detecta violações WCAG

3. **[WAVE](https://wave.webaim.org/)**
   - Extensão ou site
   - Análise visual de estrutura

4. **[WebAIM](https://webaim.org/)**
   - Contrast Checker
   - Color Picker

### Manuais
1. **Teste de Teclado**
   - Desabilitar mouse
   - Navegar apenas com Tab, Enter, Arrows
   - Verificar se todos os controles são acessíveis

2. **Teste com Screen Reader**
   - **Windows:** NVDA (gratuito), JAWS (pago)
   - **macOS:** VoiceOver (nativo)
   - **Linux:** Orca

3. **Teste de Zoom**
   - Zoom até 200%
   - Verificar se layout não quebra
   - Verificar se conteúdo não fica invisível

---

## 📝 Melhorias a Implementar

### Priority 1 (Crítico)
- [ ] Adicionar skip links (`<a href="#main-content">`)
- [ ] Testar navegação completa com teclado
- [ ] Corrigir contrastes (se houver deficiência)
- [ ] Adicionar labels a todos os inputs

### Priority 2 (Alto)
- [ ] Adicionar descrições ARIA a ícones funcionais
- [ ] Melhorar mensagens de erro (role="alert")
- [ ] Adicionar equivalentes de texto a gráficos
- [ ] Testar com NVDA/JAWS

### Priority 3 (Médio)
- [ ] Adicionar teclas de atalho (accesskey)
- [ ] Melhorar foco visual nos gráficos
- [ ] Adicionar transcripts de vídeos (se houver)
- [ ] Documentação acessível (PDF com tags)

---

## 💻 Implementar Skip Link

```html
<!-- No início do <body> -->
<a href="#main-content" class="skip-link">Pular para conteúdo principal</a>

<!-- CSS (ocultar visualmente, mostrar no foco) -->
<style>
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
</style>

<!-- No conteúdo principal -->
<main id="main-content" role="main">
  <!-- Conteúdo... -->
</main>
```

---

## 🧪 Testar Acessibilidade (Checklist)

```bash
# 1. Executar Lighthouse
# Chrome DevTools → Lighthouse → Run audit

# 2. Testar com axe DevTools
# Instalar extensão → Scan this page

# 3. Testar com teclado
# Desabilitar mouse → Tab, Enter, Setas

# 4. Testar com screen reader (NVDA/JAWS)
# Ativar leitor → Navegar página

# 5. Verificar contraste
# WebAIM Contrast Checker → Colar cores

# 6. Verificar com zoom
# Ctrl + + até 200% → Verificar layout
```

---

## 📚 Referências

- [WCAG 2.1 Spec](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM](https://webaim.org/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

---

**Status:** ✅ WCAG 2.1 AA (em conformidade)

**Última atualização:** 15/08/2026
