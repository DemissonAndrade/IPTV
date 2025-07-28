const { query } = require('../config/database'); // Cliente PG configurado

// Conteúdo em destaque
const getFeatured = async (req, res) => {
  try {
    const sql = `
      SELECT id, titulo, descricao, capa_url, tipo, ano, duracao, genero
      FROM vod_content
      WHERE destaque = true
      ORDER BY ano DESC
      LIMIT 20;
    `;
    const result = await query(sql);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Erro ao buscar conteúdos em destaque:', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor' });
  }
};

// Obter conteúdo por ID
const getContentById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'ID inválido' });
    }
    const sql = `
      SELECT id, titulo, descricao, capa_url, tipo, ano, duracao, genero, stream_url
      FROM vod_content
      WHERE id = $1;
    `;
    const result = await query(sql, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Conteúdo não encontrado' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Erro ao obter conteúdo:', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor' });
  }
};

// Obter URL de stream por conteúdo
const getStream = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const sql = `SELECT stream_url FROM vod_content WHERE id = $1;`;
    const result = await query(sql, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Conteúdo não encontrado' });
    }

    res.json({ success: true, streamUrl: result.rows[0].stream_url });
  } catch (error) {
    console.error('Erro ao obter stream:', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor' });
  }
};

// Listar filmes
const getMovies = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, genre } = req.query;
    const offset = (page - 1) * limit;

    let sql = `
      SELECT id, titulo, descricao, capa_url, ano, duracao, genero
      FROM filmes
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (search) {
      sql += ` AND (titulo ILIKE $${paramIndex} OR descricao ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (genre) {
      sql += ` AND genero ILIKE $${paramIndex}`;
      params.push(`%${genre}%`);
      paramIndex++;
    }

    sql += ` ORDER BY ano DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await query(sql, params);

    // Contar total de registros para paginação
    let countSql = `SELECT COUNT(*) FROM filmes WHERE 1=1`;
    const countParams = [];
    if (search) {
      countSql += ` AND (titulo ILIKE $1 OR descricao ILIKE $1)`;
      countParams.push(`%${search}%`);
    }
    if (genre) {
      const paramPos = countParams.length + 1;
      countSql += search ? ` AND genero ILIKE $${paramPos}` : ` AND genero ILIKE $1`;
      countParams.push(`%${genre}%`);
    }
    const countResult = await query(countSql, countParams);
    const total = parseInt(countResult.rows[0].count, 10);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar filmes:', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor' });
  }
};

// Listar séries
const getSeries = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, genre } = req.query;
    const offset = (page - 1) * limit;

    let sql = `
      SELECT id, titulo, descricao, capa_url, ano_inicio, genero
      FROM series
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (search) {
      sql += ` AND (titulo ILIKE $${paramIndex} OR descricao ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (genre) {
      sql += ` AND genero ILIKE $${paramIndex}`;
      params.push(`%${genre}%`);
      paramIndex++;
    }

    sql += ` ORDER BY id DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await query(sql, params);

    // Contar total de registros para paginação
    let countSql = `SELECT COUNT(*) FROM series WHERE 1=1`;
    const countParams = [];
    if (search) {
      countSql += ` AND (titulo ILIKE $1 OR descricao ILIKE $1)`;
      countParams.push(`%${search}%`);
    }
    if (genre) {
      const paramPos = countParams.length + 1;
      countSql += search ? ` AND genero ILIKE $${paramPos}` : ` AND genero ILIKE $1`;
      countParams.push(`%${genre}%`);
    }
    const countResult = await query(countSql, countParams);
    const total = parseInt(countResult.rows[0].count, 10);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar séries:', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor' });
  }
};

module.exports = {
  getFeatured,
  getContentById,
  getStream,
  getMovies,
  getSeries
};
