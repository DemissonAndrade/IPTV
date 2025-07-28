const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

// Middleware para verificar token JWT
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Token de acesso requerido'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuário no banco para verificar se ainda existe e está ativo
    const result = await query(
      'SELECT id, nome, email, tipo, ativo FROM usuarios WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }

    const user = result.rows[0];

    if (!user.ativo) {
      return res.status(401).json({
        success: false,
        error: 'Usuário inativo'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return res.status(403).json({
      success: false,
      error: 'Token inválido'
    });
  }
};

// Middleware para verificar se é administrador
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.tipo !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Acesso negado. Privilégios de administrador requeridos.'
    });
  }
  next();
};

// Middleware para verificar assinatura ativa
const requireActiveSubscription = async (req, res, next) => {
  try {
    const result = await query(`
      SELECT a.*, p.nome as plano_nome 
      FROM assinaturas a 
      JOIN planos p ON a.plano_id = p.id 
      WHERE a.usuario_id = $1 
        AND a.status = 'ativa' 
        AND a.data_fim > NOW()
      ORDER BY a.data_fim DESC 
      LIMIT 1
    `, [req.user.id]);

    if (result.rows.length === 0) {
      return res.status(403).json({
        success: false,
        error: 'Assinatura ativa requerida'
      });
    }

    req.subscription = result.rows[0];
    next();
  } catch (error) {
    console.error('Erro ao verificar assinatura:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireActiveSubscription
};

