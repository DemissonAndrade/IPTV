const Joi = require('joi');

// Middleware para validar dados de entrada
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    
    next();
  };
};

// Schemas de validação
const schemas = {
  // Validação para registro de usuário
  userRegister: Joi.object({
    nome: Joi.string().min(2).max(255).required().messages({
      'string.min': 'Nome deve ter pelo menos 2 caracteres',
      'string.max': 'Nome deve ter no máximo 255 caracteres',
      'any.required': 'Nome é obrigatório'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Email deve ter um formato válido',
      'any.required': 'Email é obrigatório'
    }),
    senha: Joi.string().min(6).required().messages({
      'string.min': 'Senha deve ter pelo menos 6 caracteres',
      'any.required': 'Senha é obrigatória'
    }),
    planoId: Joi.number().integer().positive().optional()
  }),

  // Validação para login
  userLogin: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email deve ter um formato válido',
      'any.required': 'Email é obrigatório'
    }),
    senha: Joi.string().required().messages({
      'any.required': 'Senha é obrigatória'
    })
  }),

  // Validação para criação de canal
  channelCreate: Joi.object({
    nome: Joi.string().min(1).max(255).required(),
    descricao: Joi.string().max(1000).optional(),
    categoria_id: Joi.number().integer().positive().required(),
    logo_url: Joi.string().uri().optional(),
    stream_url: Joi.string().uri().required(),
    qualidade: Joi.string().valid('SD', 'HD', '4K').default('HD'),
    idioma: Joi.string().max(10).default('pt-BR'),
    pais: Joi.string().max(10).default('BR'),
    ordem: Joi.number().integer().min(0).default(0)
  }),

  // Validação para criação de filme
  movieCreate: Joi.object({
    titulo: Joi.string().min(1).max(255).required(),
    titulo_original: Joi.string().max(255).optional(),
    descricao: Joi.string().max(2000).optional(),
    ano: Joi.number().integer().min(1900).max(new Date().getFullYear() + 5).optional(),
    duracao: Joi.number().integer().min(1).optional(),
    genero: Joi.string().max(255).optional(),
    diretor: Joi.string().max(255).optional(),
    elenco: Joi.string().max(1000).optional(),
    classificacao: Joi.string().max(50).optional(),
    nota_imdb: Joi.number().min(0).max(10).optional(),
    capa_url: Joi.string().uri().optional(),
    trailer_url: Joi.string().uri().optional(),
    video_url: Joi.string().uri().optional(),
    qualidade: Joi.string().valid('SD', 'HD', '4K').default('HD'),
    idioma: Joi.string().max(10).default('pt-BR'),
    destaque: Joi.boolean().default(false)
  }),

  // Validação para criação de plano
  planCreate: Joi.object({
    nome: Joi.string().min(1).max(255).required(),
    descricao: Joi.string().max(1000).optional(),
    preco: Joi.number().positive().required(),
    duracao_dias: Joi.number().integer().positive().default(30),
    max_dispositivos: Joi.number().integer().positive().default(2),
    qualidade_maxima: Joi.string().valid('SD', 'HD', '4K').default('HD'),
    recursos: Joi.array().items(Joi.string()).optional()
  })
};

module.exports = {
  validate,
  schemas
};

