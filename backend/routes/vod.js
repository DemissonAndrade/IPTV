const express = require('express');
const router = express.Router();
const vodController = require('../controllers/vodController');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { query } = require('../config/database');

console.log('vodController:', vodController);

router.get('/featured', vodController.getFeatured);
router.get('/movies', vodController.getMovies);
router.get('/movies/:id', vodController.getContentById);

router.get('/movies/:id/stream', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'ID inválido' });
    }
    const sql = `SELECT stream_url FROM vod_content WHERE id = $1;`;
    const result = await query(sql, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Stream não encontrado' });
    }

    const streamUrl = result.rows[0].stream_url;

    // Proxy da requisição para o streamUrl com headers CORS
    const proxy = createProxyMiddleware({
      target: streamUrl,
      changeOrigin: true,
      timeout: 30000,
      proxyTimeout: 30000,
      onProxyRes: function (proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization';
      },
      onError: function (err, req, res) {
        console.error('Erro no proxy do stream:', err);
        if (!res.headersSent) {
          res.status(500).json({ success: false, error: 'Erro no proxy do stream' });
        }
      },
      logLevel: 'debug',
      pathRewrite: {
        [`^/movies/${id}/stream`]: '',
      },
    });

    proxy(req, res, next);
  } catch (error) {
    console.error('Erro ao obter stream para proxy:', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor' });
  }
});
router.get('/series', vodController.getSeries);
router.get('/series/:id', vodController.getContentById);
router.get('/series/:id/stream', vodController.getStream);

module.exports = router;
