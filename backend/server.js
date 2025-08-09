require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const path = require('path');

// Database
const { testConnection } = require('./config/database');
const { createTables, insertSampleData } = require('./migrations/init');

// Inicialização do Express
const app = express();
const PORT = process.env.PORT || 3000;

// =====================================
// 🔒 CONFIGURAÇÕES DE SEGURANÇA
// =====================================

// 1. CORS (Permitindo apenas o frontend no Render)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // URL do frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Se usar autenticação
}));

// 2. Helmet (Proteção contra headers maliciosos)
app.use(helmet());

// 3. Rate Limiting (Evitar ataques de força bruta)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 requisições por IP
  message: {
    success: false,
    error: "Muitas requisições. Tente novamente mais tarde."
  }
});
app.use('/api/', limiter); // Aplica apenas nas rotas /api/

// 4. Logs em produção
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined')); // Logs detalhados
}

// =====================================
// 📦 MIDDLEWARES
// =====================================

// 1. Parse JSON e URL Encoded
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 2. Header customizado (opcional)
app.use((req, res, next) => {
  res.header('X-Powered-By', 'IPTV API');
  next();
});

// =====================================
// 🚀 ROTAS DA API
// =====================================

// Rotas principais
app.use('/api/auth', require('./routes/auth'));
app.use('/api/channels', require('./routes/channels'));
app.use('/api/vod', require('./routes/vod')); // Rota dos filmes/séries
app.use('/api/plans', require('./routes/plans'));
app.use('/api/users', require('./routes/users'));

// Health Check (para o Render monitorar)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    db_connected: !!testConnection(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rota raiz (documentação da API)
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bem-vindo à API IPTV',
    endpoints: {
      auth: '/api/auth',
      channels: '/api/channels',
      vod: '/api/vod',
      health: '/api/health'
    }
  });
});

// =====================================
// ❌ TRATAMENTO DE ERROS GLOBAL
// =====================================

// Rota não encontrada (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada',
    available_endpoints: [
      'GET /',
      'GET /api/health',
      'GET /api/vod/movies',
      'GET /api/vod/series',
      'GET /api/channels'
    ]
  });
});

// Erros internos (500)
app.use((err, req, res, next) => {
  console.error('❌ Erro interno:', err);
  res.status(500).json({
    success: false,
    error: 'Erro interno no servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// =====================================
// ⚡ INICIALIZAÇÃO DO SERVIDOR
// =====================================

const startServer = async () => {
  try {
    // Testa conexão com PostgreSQL
    const dbConnected = await testConnection();
    if (!dbConnected) throw new Error('❌ Banco de dados não conectado');

    // Cria tabelas (se não existirem)
    await createTables();
    await insertSampleData();

    // Inicia o servidor
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Falha ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app; // Para testes