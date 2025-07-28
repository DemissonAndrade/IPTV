const { query } = require('../config/database');

exports.getChannels = async (req, res) => {
  try {
    let { page = 1, limit = 20, search, categoria, qualidade, idioma, pais } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    let baseQuery = `
      SELECT c.id, c.nome, c.logo_url, c.qualidade, c.categoria_id, cat.nome AS categoria_nome, c.idioma, c.pais
      FROM canais c
      LEFT JOIN categorias cat ON c.categoria_id = cat.id
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (search) {
      baseQuery += ` AND (c.nome ILIKE $${paramIndex} OR c.descricao ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (categoria) {
      baseQuery += ` AND c.categoria_id = $${paramIndex}`;
      params.push(categoria);
      paramIndex++;
    }

    if (qualidade) {
      baseQuery += ` AND c.qualidade = $${paramIndex}`;
      params.push(qualidade);
      paramIndex++;
    }

    if (idioma) {
      baseQuery += ` AND c.idioma = $${paramIndex}`;
      params.push(idioma);
      paramIndex++;
    }

    if (pais) {
      baseQuery += ` AND c.pais = $${paramIndex}`;
      params.push(pais);
      paramIndex++;
    }

    const countQuery = `SELECT COUNT(*) FROM (${baseQuery}) AS count_table`;
    const countResult = await query(countQuery, params);
    const total = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(total / limit);

    baseQuery += ` ORDER BY c.nome ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await query(baseQuery, params);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Erro ao obter canais:', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor' });
  }
};

exports.getChannelById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const sql = `
      SELECT c.id, c.nome, c.logo_url, c.qualidade, c.categoria_id, cat.nome AS categoria_nome, c.idioma, c.pais
      FROM canais c
      LEFT JOIN categorias cat ON c.categoria_id = cat.id
      WHERE c.id = $1
    `;
    const result = await query(sql, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Canal não encontrado' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Erro ao obter canal por ID:', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor' });
  }
};

exports.getChannelStream = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const sql = `SELECT stream_url FROM canais WHERE id = $1`;
    const result = await query(sql, [id]);

    if (result.rows.length === 0 || !result.rows[0].stream_url) {
      return res.status(404).json({ success: false, error: 'Stream não encontrado' });
    }

    res.json({ success: true, streamUrl: result.rows[0].stream_url });
  } catch (error) {
    console.error('Erro ao obter stream do canal:', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor' });
  }
};

// Simulação simples para favoritos: armazenados em memória (substituir por tabela real depois)
const userFavorites = {
  1: [1, 3],
  2: [2],
};

exports.addToFavorites = async (req, res) => {
  try {
    const userId = req.user?.id || 1; // Simula usuário autenticado
    const channelId = parseInt(req.params.id);

    // Verifica se canal existe no banco
    const checkSql = 'SELECT id FROM canais WHERE id = $1';
    const checkResult = await query(checkSql, [channelId]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Canal não encontrado' });
    }

    if (!userFavorites[userId]) {
      userFavorites[userId] = [];
    }
    if (!userFavorites[userId].includes(channelId)) {
      userFavorites[userId].push(channelId);
    }

    res.json({ success: true, message: 'Canal adicionado aos favoritos' });
  } catch (error) {
    console.error('Erro ao adicionar canal aos favoritos:', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor' });
  }
};

exports.removeFromFavorites = async (req, res) => {
  try {
    const userId = req.user?.id || 1;
    const channelId = parseInt(req.params.id);

    if (!userFavorites[userId]) {
      return res.status(404).json({ success: false, error: 'Nenhum favorito encontrado para o usuário' });
    }

    userFavorites[userId] = userFavorites[userId].filter(id => id !== channelId);

    res.json({ success: true, message: 'Canal removido dos favoritos' });
  } catch (error) {
    console.error('Erro ao remover canal dos favoritos:', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor' });
  }
};

exports.getFavoriteChannels = async (req, res) => {
  try {
    const userId = req.user?.id || 1;
    const favorites = userFavorites[userId] || [];

    if (favorites.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const sql = `
      SELECT c.id, c.nome, c.logo_url, c.qualidade, c.categoria_id, cat.nome AS categoria_nome, c.idioma, c.pais
      FROM canais c
      LEFT JOIN categorias cat ON c.categoria_id = cat.id
      WHERE c.id = ANY($1)
    `;
    const result = await query(sql, [favorites]);

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Erro ao obter canais favoritos:', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor' });
  }
};

exports.getAllChannels = async (req, res) => {
  try {
    const sql = `
      SELECT c.id, c.nome, c.logo_url, c.qualidade, c.categoria_id, cat.nome AS categoria_nome, c.idioma, c.pais, c.stream_url
      FROM canais c
      LEFT JOIN categorias cat ON c.categoria_id = cat.id
      ORDER BY c.nome ASC
    `;
    const result = await query(sql);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Erro ao obter todos os canais:', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor' });
  }
};
