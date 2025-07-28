const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

// Gerar token JWT
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      tipo: user.tipo 
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Registro de usuário
const register = async (req, res) => {
  try {
    const { nome, email, senha, planoId } = req.body;

    // Verificar se email já existe
    const existingUser = await query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Email já está em uso'
      });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Criar usuário
    const result = await query(
      `INSERT INTO usuarios (nome, email, senha, tipo) 
       VALUES ($1, $2, $3, 'user') 
       RETURNING id, nome, email, tipo, ativo, data_criacao`,
      [nome, email, hashedPassword]
    );

    const user = result.rows[0];

    // Se planoId foi fornecido, criar assinatura
    if (planoId) {
      const planoResult = await query(
        'SELECT * FROM planos WHERE id = $1 AND ativo = true',
        [planoId]
      );

      if (planoResult.rows.length > 0) {
        const plano = planoResult.rows[0];
        const dataFim = new Date();
        dataFim.setDate(dataFim.getDate() + plano.duracao_dias);

        await query(
          `INSERT INTO assinaturas (usuario_id, plano_id, data_fim, status) 
           VALUES ($1, $2, $3, 'ativa')`,
          [user.id, planoId, dataFim]
        );
      }
    }

    // Gerar token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: {
        token,
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          tipo: user.tipo,
          ativo: user.ativo
        }
      }
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

// Login de usuário
const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Buscar usuário
    const result = await query(
      'SELECT id, nome, email, senha, tipo, ativo FROM usuarios WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas'
      });
    }

    const user = result.rows[0];

    // Verificar se usuário está ativo
    if (!user.ativo) {
      return res.status(401).json({
        success: false,
        error: 'Conta desativada'
      });
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(senha, user.senha);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas'
      });
    }

    // Gerar token
    const token = generateToken(user);

    // Buscar assinatura ativa
    const subscriptionResult = await query(`
      SELECT a.*, p.nome as plano_nome, p.qualidade_maxima, p.max_dispositivos
      FROM assinaturas a 
      JOIN planos p ON a.plano_id = p.id 
      WHERE a.usuario_id = $1 
        AND a.status = 'ativa' 
        AND a.data_fim > NOW()
      ORDER BY a.data_fim DESC 
      LIMIT 1
    `, [user.id]);

    const subscription = subscriptionResult.rows[0] || null;

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          tipo: user.tipo,
          ativo: user.ativo
        },
        subscription
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

// Verificar token
const verifyToken = async (req, res) => {
  try {
    // O middleware authenticateToken já validou o token e adicionou o usuário ao req
    const user = req.user;

    // Buscar assinatura ativa
    const subscriptionResult = await query(`
      SELECT a.*, p.nome as plano_nome, p.qualidade_maxima, p.max_dispositivos
      FROM assinaturas a 
      JOIN planos p ON a.plano_id = p.id 
      WHERE a.usuario_id = $1 
        AND a.status = 'ativa' 
        AND a.data_fim > NOW()
      ORDER BY a.data_fim DESC 
      LIMIT 1
    `, [user.id]);

    const subscription = subscriptionResult.rows[0] || null;

    res.json({
      success: true,
      data: {
        user,
        subscription
      }
    });

  } catch (error) {
    console.error('Erro na verificação do token:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

// Logout (invalidar token - em uma implementação real, você manteria uma blacklist)
const logout = async (req, res) => {
  try {
    // Em uma implementação real, você adicionaria o token a uma blacklist
    // Por simplicidade, apenas retornamos sucesso
    res.json({
      success: true,
      message: 'Logout realizado com sucesso'
    });
  } catch (error) {
    console.error('Erro no logout:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  register,
  login,
  verifyToken,
  logout
};

