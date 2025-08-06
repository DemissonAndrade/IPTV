// server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
require('dotenv').config();
const path = require('path');
const fs = require('fs');


const { testConnection } = require('./config/database');
const { createTables, insertSampleData, createVodContentTable, populateVodContentTable, isVodContentPopulated } = require('./migrations/init');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware segurança
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: false
}));

// Limite requisições
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: {
    success: false,
    error: 'Muitas tentativas. Tente novamente em alguns minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// Middleware para logar corpo JSON
// app.use((req, res, next) => {
//   console.log(`Req: ${req.method} ${req.originalUrl} - Content-Type: ${req.headers['content-type']}`);
//   if (req.headers['content-type']?.includes('application/json')) {
//     let bodyData = '';
//     req.on('data', chunk => bodyData += chunk.toString());
//     req.on('end', () => {
//       console.log('Body recebido:', bodyData.length > 0 ? bodyData : '(vazio)');
//       next();
//     });
//   } else {
//     next();
//   }
// });

// Middleware para parsear JSON (com tolerância a corpo vazio)
app.use(bodyParser.json({
  strict: false,
  verify: (req, res, buf) => {
    if (!buf.length) req.body = {};
  },
}));

// Middleware para parsear urlencoded
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Header customizado
app.use((req, res, next) => {
  res.header('X-Powered-By', 'IPTV Pro API');
  next();
});

const plansRouter = require('./routes/plans');
const epgRouter = require('./routes/epg');
const usersRouter = require('./routes/users');
const categoriesRouter = require('./routes/categories');
const adminRouter = require('./routes/admin');
const tmdbRouter = require('./routes/tmdb');
const paymentRouter = require('./routes/payment');

// Rotas API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/channels', require('./routes/channels'));
app.use('/api/vod', require('./routes/vod'));
app.use('/api/plans', plansRouter);
app.use('/api/epg', epgRouter);
app.use('/api/users', usersRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/admin', adminRouter);
app.use('/api/tmdb', tmdbRouter);
app.use('/api/payment', paymentRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rota raiz API
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'IPTV Pro Backend API',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        verify: 'GET /api/auth/verify',
        logout: 'POST /api/auth/logout'
      },
      channels: {
        list: 'GET /api/channels',
        details: 'GET /api/channels/:id',
        stream: 'GET /api/channels/:id/stream',
        favorite: 'POST /api/channels/:id/favorite',
        unfavorite: 'DELETE /api/channels/:id/favorite',
        favorites: 'GET /api/channels/favorites/list'
      },
      plans: {
        list: 'GET /api/plans',
        detail: 'GET /api/plans/:id'
      },
      vod: {
        featured: 'GET /api/vod/featured',
        movies: 'GET /api/vod/movies',
        series: 'GET /api/vod/series'
      },
      categories: {
        list: 'GET /api/categories'
      }
    }
  });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      error: 'JSON inválido ou corpo vazio'
    });
  }

  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      error: 'Dados inválidos',
      details: err.details
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, error: 'Token inválido' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, error: 'Token expirado' });
  }

  if (err.code) {
    console.error('Erro do banco:', err.code, err.message);
    return res.status(500).json({ success: false, error: 'Erro no banco de dados' });
  }

  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Rota não encontrada
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada',
    path: req.originalUrl,
    method: req.method,
    available_endpoints: [
      'GET /',
      'GET /health',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/channels',
      'GET /api/plans',
      'GET /api/vod/movies',
      'GET /api/vod/series',
      'GET /api/vod/featured',
      'GET /api/categories'
    ]
  });
});


// Serve arquivos estáticos do frontend
const distPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  // Rota fallback para SPA do Vite
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Inicialização do servidor
const startServer = async () => {
  try {
    console.log('🔄 Iniciando servidor IPTV Pro...');
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.log('⚠️  PostgreSQL não disponível.');
    } else {
      await createTables();
      await insertSampleData();
    
    }

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor rodando: http://localhost:${PORT}`);
    });

    process.on('SIGTERM', () => {
      console.log('Encerrando servidor...');
      server.close(() => process.exit(0));
    });

    process.on('SIGINT', () => {
      console.log('Encerrando servidor...');
      server.close(() => process.exit(0));
    });

  } catch (error) {
    console.error('❌ Erro ao iniciar:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
