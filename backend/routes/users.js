const express = require('express');
const bcrypt = require('bcryptjs');
const { authenticateToken } = require('../middleware/auth');
// Importar os modelos Mongoose necessários com os nomes corretos
const { Usuario, Favorito, HistoricoVisualizacao, SessaoUsuario } = require('../config/schema'); // Adicionado

const router = express.Router();

// Obter perfil do usuário
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user._id; // Usar _id do objeto Mongoose
        const user = await Usuario.findById(userId).populate('plano').lean(); // Popula o campo 'plano'
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

        const favoritos = await Favorito.find({ usuario: userId }).lean(); // Filtrar por 'usuario'
        const historico = await HistoricoVisualizacao.find({ usuario: userId }).lean(); // Filtrar por 'usuario'
        const sessoes = await SessaoUsuario.find({ usuario: userId, ativo: true, expires_at: { $gt: new Date() } }).lean(); // Filtrar por 'usuario'

        const estatisticas = {
            canais_favoritos: favoritos.filter(f => f.tipo === 'canal').length,
            filmes_favoritos: favoritos.filter(f => f.tipo === 'filme').length,
            series_favoritas: favoritos.filter(f => f.tipo === 'serie').length,
            total_visualizacoes: historico.length
        };

        res.json({
            success: true,
            data: {
                ...user, // user já é um objeto JS puro devido ao .lean()
                plano_nome: user.plano?.nome,
                plano_preco: user.plano?.preco,
                qualidade_max: user.plano?.qualidade_max,
                dispositivos_simultaneos: user.plano?.dispositivos_simultaneos,
                estatisticas,
                dispositivos_conectados: sessoes
            }
        });
    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Atualizar perfil
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user._id;
        const { nome, email } = req.body;
        if (!nome || !email) return res.status(400).json({ error: 'Nome e email são obrigatórios' });

        const emailExistente = await Usuario.findOne({ email, _id: { $ne: userId } });
        if (emailExistente) return res.status(409).json({ error: 'Email já está em uso' });

        await Usuario.findByIdAndUpdate(userId, { nome, email });
        res.json({ success: true, message: 'Perfil atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Alterar senha
router.put('/password', authenticateToken, async (req, res) => {
    try {
        const userId = req.user._id;
        const { senhaAtual, novaSenha } = req.body;
        if (!senhaAtual || !novaSenha) return res.status(400).json({ error: 'Senha atual e nova são obrigatórias' });

        const user = await Usuario.findById(userId); // Não usar .lean() aqui se for salvar o documento
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

        const senhaValida = await bcrypt.compare(senhaAtual, user.senha_hash);
        if (!senhaValida) return res.status(400).json({ error: 'Senha atual incorreta' });

        const novaSenhaHash = await bcrypt.hash(novaSenha, 12);
        user.senha_hash = novaSenhaHash;
        await user.save(); // Salvar o documento Mongoose

        res.json({ success: true, message: 'Senha alterada com sucesso' });
    } catch (error) {
        console.error('Erro ao alterar senha:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Listar favoritos
router.get('/favorites', authenticateToken, async (req, res) => {
    try {
        const userId = req.user._id;
        const { tipo, page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        let filtro = { usuario: userId }; // Filtrar por 'usuario'
        if (tipo && ['canal', 'filme', 'serie'].includes(tipo)) filtro.tipo = tipo;

        const favoritos = await Favorito.find(filtro).sort({ created_at: -1 }).skip(skip).limit(parseInt(limit));
        const total = await Favorito.countDocuments(filtro);

        res.json({
            success: true,
            data: favoritos,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Erro ao buscar favoritos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Histórico
router.get('/history', authenticateToken, async (req, res) => {
    try {
        const userId = req.user._id;
        const { page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        const historico = await HistoricoVisualizacao.find({ usuario: userId }).sort({ data_visualizacao: -1 }).skip(skip).limit(parseInt(limit)); // Filtrar por 'usuario'
        const total = await HistoricoVisualizacao.countDocuments({ usuario: userId });

        res.json({
            success: true,
            data: historico,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Erro ao buscar histórico:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Desconectar dispositivo
router.delete('/devices/:sessionId', authenticateToken, async (req, res) => {
    try {
        const userId = req.user._id;
        const { sessionId } = req.params;

        const result = await SessaoUsuario.updateOne({ _id: sessionId, usuario: userId }, { ativo: false }); // Filtrar por 'usuario'
        if (result.nModified === 0) return res.status(404).json({ error: 'Sessão não encontrada' });

        res.json({ success: true, message: 'Dispositivo desconectado com sucesso' });
    } catch (error) {
        console.error('Erro ao desconectar dispositivo:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;
