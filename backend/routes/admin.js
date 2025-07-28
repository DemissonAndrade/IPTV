const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
// Importar todos os modelos Mongoose necessários
const { Usuario, Canal, Filme, Serie, SessaoUsuario, HistoricoVisualizacao } = require('../config/schema'); // Adicionado

const router = express.Router();

// Middleware admin
router.use(authenticateToken);
router.use(requireAdmin);

router.get('/dashboard', async (req, res) => {
  try {
    const [
      usuarios_ativos,
      novos_usuarios_hoje,
      total_canais,
      total_filmes,
      total_series,
      sessoes_ativas
    ] = await Promise.all([
      Usuario.countDocuments({ status: 'ativo' }),
      Usuario.countDocuments({ created_at: { $gte: new Date().setHours(0, 0, 0, 0) } }),
      Canal.countDocuments({ ativo: true }),
      Filme.countDocuments({ ativo: true }),
      Serie.countDocuments({ ativo: true }),
      SessaoUsuario.countDocuments({ ativo: true, expires_at: { $gte: new Date() } }) // Usar SessaoUsuario
    ]);

    const usuarios_por_plano = await Usuario.aggregate([
      { $match: { status: 'ativo' } },
      {
        $group: {
          _id: '$plano', // Usar 'plano' que é o campo ObjectId no schema
          usuarios: { $sum: 1 }
        }
      },
      {
        $lookup: { // Opcional: para obter o nome do plano
          from: 'planos', // Nome da coleção no MongoDB (geralmente pluralizado e em minúsculas)
          localField: '_id',
          foreignField: '_id',
          as: 'detalhes_plano'
        }
      },
      {
        $unwind: { // Desestrutura o array de detalhes_plano
          path: '$detalhes_plano',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: { // Projeta os campos desejados
          _id: 0,
          plano_id: '$_id',
          plano_nome: '$detalhes_plano.nome',
          usuarios: '$usuarios'
        }
      }
    ]);

    const top_content = await HistoricoVisualizacao.aggregate([ // Usar HistoricoVisualizacao
      {
        $match: {
          data_visualizacao: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: { tipo: '$tipo', conteudo_id: '$conteudo_id' },
          visualizacoes: { $sum: 1 }
        }
      },
      { $sort: { visualizacoes: -1 } },
      { $limit: 10 },
      // Opcional: $lookup para obter detalhes do conteúdo (Filme, Serie, Canal)
      {
        $lookup: {
          from: 'filmes', // Nome da coleção de filmes
          localField: '_id.conteudo_id',
          foreignField: '_id',
          as: 'filme_detalhes'
        }
      },
      {
        $lookup: {
          from: 'series', // Nome da coleção de séries
          localField: '_id.conteudo_id',
          foreignField: '_id',
          as: 'serie_detalhes'
        }
      },
      {
        $lookup: {
          from: 'canais', // Nome da coleção de canais
          localField: '_id.conteudo_id',
          foreignField: '_id',
          as: 'canal_detalhes'
        }
      },
      {
        $project: {
          _id: 0,
          tipo: '$_id.tipo',
          conteudo_id: '$_id.conteudo_id',
          visualizacoes: 1,
          titulo: {
            $cond: {
              if: { $eq: ['$tipo', 'filme'] },
              then: { $arrayElemAt: ['$filme_detalhes.titulo', 0] },
              else: {
                $cond: {
                  if: { $eq: ['$tipo', 'serie'] },
                  then: { $arrayElemAt: ['$serie_detalhes.titulo', 0] },
                  else: { $arrayElemAt: ['$canal_detalhes.nome', 0] }
                }
              }
            }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        estatisticas: {
          usuarios_ativos,
          novos_usuarios_hoje,
          total_canais,
          total_filmes,
          total_series,
          sessoes_ativas
        },
        usuarios_por_plano,
        conteudo_mais_assistido: top_content
      }
    });
  } catch (error) {
    console.error('Erro ao buscar dashboard:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
