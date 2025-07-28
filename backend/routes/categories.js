const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Listar todas as categorias
router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT * FROM categorias
      WHERE ativo = true
      ORDER BY ordem ASC, nome ASC
    `);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Erro ao buscar categorias:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar categoria por ID
router.get('/:id', async (req, res) => {
  try {
    const result = await query(`
      SELECT * FROM categorias
      WHERE id = $1 AND ativo = true
    `, [req.params.id]);

    if (result.rowCount === 0) return res.status(404).json({ error: 'Categoria não encontrada' });

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Erro ao buscar categoria por ID:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Listar canais da categoria
router.get('/:id/channels', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 20);
    const offset = (page - 1) * limit;

    // Verificar se a categoria existe
    const catResult = await query(`SELECT * FROM categorias WHERE id = $1 AND ativo = true`, [id]);
    if (catResult.rowCount === 0) return res.status(404).json({ error: 'Categoria não encontrada' });

    // Buscar canais da categoria
    const channels = await query(`
      SELECT * FROM canais
      WHERE categoria_id = $1 AND ativo = true
      ORDER BY ordem ASC, nome ASC
      LIMIT $2 OFFSET $3
    `, [id, limit, offset]);

    const total = await query(`
      SELECT COUNT(*) FROM canais WHERE categoria_id = $1 AND ativo = true
    `, [id]);

    res.json({
      success: true,
      data: channels.rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(parseInt(total.rows[0].count) / limit),
        totalItems: parseInt(total.rows[0].count),
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Erro ao buscar canais da categoria:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
