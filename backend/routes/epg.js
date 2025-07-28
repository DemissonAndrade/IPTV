const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { query } = require('../config/database');

const router = express.Router();

// Buscar EPG por data
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { date, canalId, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    let filters = [];
    let params = [];

    if (date) {
      filters.push(`data_inicio BETWEEN $${params.length + 1} AND $${params.length + 2}`);
      params.push(`${date} 00:00:00`, `${date} 23:59:59`);
    } else {
      filters.push(`data_inicio >= CURRENT_DATE AND data_inicio < CURRENT_DATE + INTERVAL '1 day'`);
    }

    if (canalId) {
      filters.push(`canal_id = $${params.length + 1}`);
      params.push(canalId);
    }

    const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

    const epgDataQuery = `
      SELECT * FROM epg_programas
      ${whereClause}
      ORDER BY canal_id, data_inicio
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    params.push(limit, offset);

        const countQuery = `
          SELECT COUNT(*) FROM epg_programas
          ${whereClause}
        `;

    const epgDataResult = await query(epgDataQuery, params);
    const countResult = await query(countQuery, params.slice(0, params.length - 2));

    const total = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: epgDataResult.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar EPG:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Programação atual
router.get('/now', authenticateToken, async (req, res) => {
  try {
    const { canalId } = req.query;

    let filters = [`data_inicio <= NOW()`, `data_fim >= NOW()`];
    let params = [];

    if (canalId) {
      filters.push(`canal_id = $${params.length + 1}`);
      params.push(canalId);
    }

    const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

    const queryText = `
      SELECT * FROM epg_programas
      ${whereClause}
      ORDER BY canal_id
    `;

    const result = await query(queryText, params);

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Erro ao buscar programação atual:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Próximos programas
router.get('/next', authenticateToken, async (req, res) => {
  try {
    const { canalId, hours = 6 } = req.query;

    let filters = [`inicio > NOW()`, `inicio <= NOW() + INTERVAL '${hours} hours'`];
    let params = [];

    if (canalId) {
      filters.push(`canal_id = $${params.length + 1}`);
      params.push(canalId);
    }

    const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

    const queryText = `
      SELECT * FROM epg
      ${whereClause}
      ORDER BY inicio
      LIMIT 50
    `;

    const result = await query(queryText, params);

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Erro ao buscar próximos programas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar programação por categoria
router.get('/category/:categoria', authenticateToken, async (req, res) => {
  try {
    const { categoria } = req.params;
    const { date, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let filters = [`categoria_programa = $1`];
    let params = [categoria];

    if (date) {
      filters.push(`data_inicio BETWEEN $${params.length + 1} AND $${params.length + 2}`);
      params.push(`${date} 00:00:00`, `${date} 23:59:59`);
    }

    const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

    const epgDataQuery = `
      SELECT * FROM epg_programas
      ${whereClause}
      ORDER BY data_inicio
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    params.push(limit, offset);

    const countQuery = `
      SELECT COUNT(*) FROM epg
      ${whereClause}
    `;

    const epgDataResult = await query(epgDataQuery, params);
    const countResult = await query(countQuery, params.slice(0, params.length));

    const total = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: epgDataResult.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar programação por categoria:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar programa específico
router.get('/program/:id', authenticateToken, async (req, res) => {
  try {
    const queryText = `
      SELECT epg_programas.*, c.nome as canal_nome, c.logo_url, c.url_stream
      FROM epg_programas
      JOIN canais c ON epg_programas.canal_id = c.id
      WHERE epg_programas.id = $1
    `;
    const result = await query(queryText, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Programa não encontrado' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Erro ao buscar programa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Categorias de programas
router.get('/categories', authenticateToken, async (req, res) => {
  try {
    const queryText = `
      SELECT categoria_programa, COUNT(*) as total_programas
      FROM epg_programas
      WHERE categoria_programa IS NOT NULL AND categoria_programa <> ''
      GROUP BY categoria_programa
      ORDER BY categoria_programa
    `;
    const result = await query(queryText);

    res.json({
      success: true,
      data: result.rows.map(c => ({
        categoria: c.categoria_programa,
        total_programas: parseInt(c.total_programas, 10)
      }))
    });
  } catch (error) {
    console.error('Erro ao buscar categorias de programas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
