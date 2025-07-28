// backend/routes/plans.js
const express = require('express');
const { query } = require('../config/database'); // ✅ importa a função de consulta

const router = express.Router();

// Listar todos os planos
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT DISTINCT ON (nome) * FROM planos WHERE ativo = true ORDER BY nome, preco ASC');
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Erro ao buscar planos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Buscar plano por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('SELECT * FROM planos WHERE id = $1 AND ativo = true', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Plano não encontrado'
      });
    }
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao buscar plano:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router;
