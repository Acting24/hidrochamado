# 📊 Análise de Dados Avançada — HidroChamado

Este documento descreve estratégias e implementações de análise de dados para o HidroChamado.

---

## 📈 O que Já Temos

### Endpoints Existentes (API)

1. **Dashboard** — `GET /api/relatorios/dashboard`
   ```json
   {
     "por_status": {...},      // Count por status
     "por_prioridade": {...},  // Count por prioridade
     "por_categoria": {...},   // Count por categoria
     "tempo_resolucao": {...}, // AVG horas para resolver
     "por_data": [...],        // Timeline 30 dias
     "totais": {...}           // Agregações globais
   }
   ```

2. **SLA Report** — `GET /api/relatorios/sla`
   ```json
   [
     {
       "numero_chamado": "HC-001",
       "status_sla": "No Prazo|Atendido|Vencido",
       "horas_aberto": 5,
       "sla_limite": 24
     }
   ]
   ```

3. **Desempenho Agentes** — `GET /api/relatorios/desempenho-agentes`
   ```json
   [
     {
       "agente": "Carlos",
       "total_chamados": 50,
       "resolvidos": 45,
       "taxa_resolucao": 90,
       "tempo_medio_horas": 12.5
     }
   ]
   ```

### Frontend Visualization

- **Chart.js** integrado (já no HTML)
- **Gráficos base:**
  - Pie chart (Status)
  - Bar chart (Categoria)
  - Line chart (Timeline)

---

## 🎯 Roadmap de Análises

### Nível 1: Estatísticas Básicas (✅ Existem)
- [x] Contagem por status
- [x] Contagem por prioridade
- [x] Tempo médio de resolução
- [x] Taxa de resolução por agente

### Nível 2: Análises Intermediárias (⏳ Implementar)
- [ ] Análise de tendências (30, 60, 90 dias)
- [ ] Previsão simples (regressão linear)
- [ ] Hotspots geográficos (CEP/bairro)
- [ ] Análise de sazonalidade (dia/hora)

### Nível 3: Machine Learning (🔬 Avançado)
- [ ] Classificação automática de categorias (NLP)
- [ ] Detecção de anomalias (Isolation Forest)
- [ ] Previsão de SLA breach (XGBoost)
- [ ] Clustering de problema (K-means)

### Nível 4: Insights Executivos (💼 Premium)
- [ ] Previsão de demanda (Prophet/ARIMA)
- [ ] Otimização de alocação de agentes
- [ ] Análise de satisfação predita
- [ ] ROI de investimentos em manutenção

---

## 🔧 Implementação — Nível 2

### 1. Análise de Tendências (30/60/90 dias)

#### Backend: Novo Endpoint
```javascript
// backend/routes/relatorios.js

router.get('/tendencias', autenticar, autorizar('admin', 'agente'), async (req, res) => {
  try {
    const dias = req.query.dias || 30; // 30, 60, 90

    const resultado = await pool.query(`
      SELECT 
        DATE(data_criacao) as data,
        COUNT(*) as total_chamados,
        SUM(CASE WHEN status = 'resolvido' THEN 1 ELSE 0 END) as resolvidos,
        AVG(EXTRACT(EPOCH FROM (data_resolucao - data_criacao))/3600)::numeric(10,2) 
          as tempo_medio_horas
      FROM chamados
      WHERE data_criacao >= NOW() - INTERVAL '1 day' * $1
      GROUP BY DATE(data_criacao)
      ORDER BY data DESC
    `, [dias]);

    res.json({
      periodo_dias: dias,
      dados: resultado.rows,
      total_chamados: resultado.rows.reduce((sum, row) => sum + parseInt(row.total_chamados), 0)
    });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});
```

#### Frontend: Visualização
```javascript
// js/app.js

async function mostrarTendencias() {
  const response = await api.get('/api/relatorios/tendencias?dias=30');
  const dados = response.dados;

  const ctx = document.getElementById('tendencias-chart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: dados.map(d => d.data),
      datasets: [
        {
          label: 'Total Chamados',
          data: dados.map(d => d.total_chamados),
          borderColor: '#007bff',
          backgroundColor: 'rgba(0,123,255,0.1)',
          tension: 0.4
        },
        {
          label: 'Resolvidos',
          data: dados.map(d => d.resolvidos),
          borderColor: '#28a745',
          backgroundColor: 'rgba(40,167,69,0.1)',
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: { text: 'Tendências de Chamados (Últimos 30 dias)' }
      }
    }
  });
}
```

### 2. Hotspots Geográficos

#### Backend
```javascript
router.get('/hotspots', autenticar, autorizar('admin'), async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT 
        bairro,
        cidade,
        COUNT(*) as total_chamados,
        COUNT(CASE WHEN status = 'resolvido' THEN 1 END)::numeric / 
        COUNT(*) * 100 as taxa_resolucao
      FROM chamados
      WHERE bairro IS NOT NULL AND cidade IS NOT NULL
      GROUP BY bairro, cidade
      ORDER BY total_chamados DESC
      LIMIT 20
    `);

    res.json({
      hotspots: resultado.rows
    });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});
```

#### Frontend: Tabela de Hotspots
```javascript
async function mostrarHotspots() {
  const response = await api.get('/api/relatorios/hotspots');
  const tabela = document.getElementById('hotspots-table');

  response.hotspots.forEach(hotspot => {
    const row = tabela.insertRow();
    row.innerHTML = `
      <td>${hotspot.bairro}</td>
      <td>${hotspot.cidade}</td>
      <td>${hotspot.total_chamados}</td>
      <td>${hotspot.taxa_resolucao.toFixed(1)}%</td>
    `;
  });
}
```

### 3. Análise por Hora/Dia da Semana

#### Backend
```javascript
router.get('/sazonalidade', autenticar, autorizar('admin'), async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT 
        EXTRACT(DOW FROM data_criacao)::int as dia_semana,  -- 0=Domingo
        EXTRACT(HOUR FROM data_criacao)::int as hora,
        COUNT(*) as total_chamados,
        AVG(EXTRACT(EPOCH FROM (data_resolucao - data_criacao))/3600)::numeric(10,2)
          as tempo_medio_horas
      FROM chamados
      GROUP BY EXTRACT(DOW FROM data_criacao), EXTRACT(HOUR FROM data_criacao)
      ORDER BY dia_semana, hora
    `);

    res.json({
      sazonalidade: resultado.rows
    });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});
```

---

## 🤖 Implementação — Nível 3 (ML Básico)

### 1. Detecção de Anomalias (Simples)

```javascript
// backend/utils/anomaly-detection.js

/**
 * Detecta anomalias usando Z-score
 * Valores com |z-score| > 2.5 são considerados anomalias
 */
function detectarAnomalias(dados) {
  const valores = dados.map(d => d.valor);
  const media = valores.reduce((a, b) => a + b) / valores.length;
  const desvio = Math.sqrt(
    valores.reduce((sum, v) => sum + Math.pow(v - media, 2), 0) / valores.length
  );

  return dados.map((d, i) => ({
    ...d,
    z_score: (valores[i] - media) / desvio,
    eh_anomalia: Math.abs((valores[i] - media) / desvio) > 2.5
  }));
}

module.exports = { detectarAnomalias };
```

### 2. Previsão Simples (Regressão Linear)

```javascript
// backend/utils/forecasting.js

/**
 * Regressão linear simples para previsão
 */
function preverProximos30Dias(dados) {
  const n = dados.length;
  const x = Array.from({ length: n }, (_, i) => i + 1);
  const y = dados.map(d => d.total_chamados);

  const sumX = x.reduce((a, b) => a + b);
  const sumY = y.reduce((a, b) => a + b);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

  const b = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const a = (sumY - b * sumX) / n;

  const previsoes = [];
  for (let i = n + 1; i <= n + 30; i++) {
    previsoes.push({
      dia: i,
      previsao: Math.round(a + b * i)
    });
  }

  return previsoes;
}

module.exports = { preverProximos30Dias };
```

### 3. Classificação de Prioridade com ML.js

Instalação:
```bash
cd backend
npm install ml-classify-text-iris
```

```javascript
// backend/utils/priority-classifier.js
const { NaiveBayes } = require('ml-classify-text-iris');

const classifier = new NaiveBayes();

// Dados de treino
const dadosTreino = [
  { texto: 'vazamento crítico rua principal', prioridade: 'critica' },
  { texto: 'sem água há 3 dias', prioridade: 'critica' },
  { texto: 'lentidão na pressão água', prioridade: 'media' },
  { texto: 'conta está errada', prioridade: 'baixa' },
  { texto: 'medidor quebrado', prioridade: 'media' }
];

// Treinar
dadosTreino.forEach(d => {
  classifier.addDocument(d.texto, d.prioridade);
});
classifier.train();

function classificarPrioridade(descricao) {
  return classifier.classify(descricao);
}

module.exports = { classificarPrioridade };
```

---

## 📊 Dashboard Avançado

### Nova Página: `dashboard-avancado.html`

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard Avançado | HidroChamado</title>
  <link rel="stylesheet" href="css/style.css">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>
</head>
<body>
  <div class="container">
    <h1>📊 Dashboard Avançado</h1>
    
    <!-- Tendências -->
    <section class="dashboard-section">
      <h2>Tendências (30 dias)</h2>
      <canvas id="tendencias-chart"></canvas>
    </section>

    <!-- Hotspots -->
    <section class="dashboard-section">
      <h2>Hotspots Geográficos</h2>
      <table id="hotspots-table">
        <thead>
          <tr>
            <th>Bairro</th>
            <th>Cidade</th>
            <th>Total Chamados</th>
            <th>Taxa Resolução</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </section>

    <!-- Sazonalidade -->
    <section class="dashboard-section">
      <h2>Padrão de Demanda (Dia/Hora)</h2>
      <canvas id="sazonalidade-chart"></canvas>
    </section>

    <!-- Previsões -->
    <section class="dashboard-section">
      <h2>Previsão: Próximos 30 Dias</h2>
      <canvas id="previsao-chart"></canvas>
    </section>

    <!-- Anomalias -->
    <section class="dashboard-section">
      <h2>⚠️ Anomalias Detectadas</h2>
      <ul id="anomalias-list"></ul>
    </section>
  </div>

  <script src="js/api.js"></script>
  <script src="js/dashboard-avancado.js"></script>
</body>
</html>
```

### Script: `js/dashboard-avancado.js`

```javascript
// Carregar tudo
async function inicializarDashboardAvancado() {
  await mostrarTendencias();
  await mostrarHotspots();
  await mostrarSazonalidade();
  await mostrarPrevisoes();
  await mostrarAnomalias();
}

async function mostrarTendencias() {
  try {
    const dados = await api.get('/api/relatorios/tendencias?dias=30');
    
    const ctx = document.getElementById('tendencias-chart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: dados.dados.map(d => d.data),
        datasets: [
          {
            label: 'Total Chamados',
            data: dados.dados.map(d => parseInt(d.total_chamados)),
            borderColor: '#007bff',
            backgroundColor: 'rgba(0,123,255,0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Resolvidos',
            data: dados.dados.map(d => parseInt(d.resolvidos) || 0),
            borderColor: '#28a745',
            backgroundColor: 'rgba(40,167,69,0.1)',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `Tendências - Últimos ${dados.periodo_dias} dias`
          }
        }
      }
    });
  } catch (erro) {
    console.error('Erro ao carregar tendências:', erro);
  }
}

async function mostrarHotspots() {
  try {
    const dados = await api.get('/api/relatorios/hotspots');
    const tabela = document.querySelector('#hotspots-table tbody');
    
    dados.hotspots.forEach(hotspot => {
      const row = tabela.insertRow();
      row.innerHTML = `
        <td>${hotspot.bairro}</td>
        <td>${hotspot.cidade}</td>
        <td>${hotspot.total_chamados}</td>
        <td>
          <div class="progress">
            <div class="progress-bar" style="width: ${hotspot.taxa_resolucao}%">
              ${hotspot.taxa_resolucao.toFixed(1)}%
            </div>
          </div>
        </td>
      `;
    });
  } catch (erro) {
    console.error('Erro ao carregar hotspots:', erro);
  }
}

async function mostrarSazonalidade() {
  try {
    const dados = await api.get('/api/relatorios/sazonalidade');
    
    // Agrupar por hora
    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    
    const ctx = document.getElementById('sazonalidade-chart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: dados.sazonalidade.map(d => 
          `${diasSemana[d.dia_semana]} ${d.hora}h`
        ),
        datasets: [{
          label: 'Chamados por Hora',
          data: dados.sazonalidade.map(d => d.total_chamados),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      }
    });
  } catch (erro) {
    console.error('Erro ao carregar sazonalidade:', erro);
  }
}

async function mostrarPrevisoes() {
  try {
    const dados = await api.get('/api/relatorios/previsoes');
    
    const ctx = document.getElementById('previsao-chart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: dados.previsoes.map(p => `Dia ${p.dia}`),
        datasets: [{
          label: 'Chamados Previstos',
          data: dados.previsoes.map(p => p.previsao),
          borderColor: '#ff6b6b',
          backgroundColor: 'rgba(255,107,107,0.1)',
          borderDash: [5, 5],
          tension: 0.4
        }]
      }
    });
  } catch (erro) {
    console.error('Erro ao carregar previsões:', erro);
  }
}

async function mostrarAnomalias() {
  try {
    const dados = await api.get('/api/relatorios/anomalias');
    const lista = document.getElementById('anomalias-list');
    
    dados.anomalias.forEach(anom => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${anom.data}</strong>: ${anom.descricao}
        <br><small>Desvio: ${anom.z_score.toFixed(2)}σ</small>
      `;
      lista.appendChild(li);
    });
  } catch (erro) {
    console.error('Erro ao carregar anomalias:', erro);
  }
}

// Inicializar ao carregar página
window.addEventListener('load', inicializarDashboardAvancado);
```

---

## 📦 Dependências para ML (Opcional)

```bash
cd backend
npm install simple-statistics
npm install ml-regression
npm install ml-classify-text-iris
npm install exponential-smoothing  # Para ARIMA simples
```

---

## 🔄 Integração com Frontend Existente

### Adicionar Link no Menu

```html
<!-- index.html -->
<nav>
  <ul>
    <li><a href="index.html">Home</a></li>
    <li><a href="dashboard.html">Dashboard</a></li>
    <li><a href="dashboard-avancado.html">📊 Análises Avançadas</a></li>
    <li><a href="chamados.html">Chamados</a></li>
  </ul>
</nav>
```

---

## 📚 Ferramentas Recomendadas

### Para Análise Própria
- **Metabase** — BI open source
- **Superset** — Dashboards avançados
- **Grafana** — Monitoramento em tempo real
- **Datadog** — APM completo

### Cloud Services
- **Google Analytics** — Web traffic
- **Mixpanel** — Event analytics
- **Amplitude** — Product analytics
- **Segment** — Data collection

---

## 📈 Próximos Passos

1. ✅ Implementar endpoints de análise (Nível 2)
2. ⏳ Adicionar gráficos no frontend
3. ⏳ Explorar bibliotecas ML simples
4. ⏳ Criar dashboard executivo
5. ⏳ Integrar com ferramentas de BI

---

## 🎓 Recursos de Aprendizado

- [Scikit-learn (Python ML)](https://scikit-learn.org/)
- [TensorFlow.js (JavaScript ML)](https://www.tensorflow.org/js)
- [ML.js Library](https://mljs.github.io/)
- [Time Series Analysis](https://otexts.com/fpp2/)
- [Kaggle Datasets](https://www.kaggle.com/datasets)

---

**Status:** ✅ Análise básica implementada | ⏳ Análise avançada em roadmap

**Última atualização:** 15/08/2026
