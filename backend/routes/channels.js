const express = require('express');
const router = express.Router();
const channelsController = require('../controllers/channelsController');
const { authenticateToken, requireActiveSubscription } = require('../middleware/auth');

// Rota fixa para lista de favoritos — deve vir antes das rotas com parâmetros dinâmicos
router.get('/favorites/list', authenticateToken, channelsController.getFavoriteChannels);

// Listar canais (pode ter query params)
router.get('/', channelsController.getChannels);

// Obter todos os canais (nova rota)
router.get('/all', channelsController.getAllChannels);

// Obter stream do canal (requer autenticação e assinatura ativa)
router.get('/:id/stream', authenticateToken, requireActiveSubscription, channelsController.getChannelStream);

// Obter canal por ID (pública)
router.get('/:id', channelsController.getChannelById);

// Adicionar canal aos favoritos (requer autenticação)
router.post('/:id/favorite', authenticateToken, channelsController.addToFavorites);

// Remover canal dos favoritos (requer autenticação)
router.delete('/:id/favorite', authenticateToken, channelsController.removeFromFavorites);

module.exports = router;
