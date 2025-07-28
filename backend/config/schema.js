const mongoose = require('mongoose');
const { Schema } = mongoose;

const Plano = require('../models/plano');

// Usuário
const usuarioSchema = new Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha_hash: { type: String, required: true },
  plano: { type: Schema.Types.ObjectId, ref: 'Plano' },
  subscriptionStatus: { type: String, enum: ['active', 'inactive', 'canceled'], default: 'inactive' },
  stripeCustomerId: { type: String },
  stripeSubscriptionId: { type: String },
  status: { type: String, default: 'ativo' },
  created_at: { type: Date, default: Date.now }
});
const Usuario = mongoose.model('Usuario', usuarioSchema);


// Favorito
const favoritoSchema = new Schema({
  usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  tipo: { type: String, enum: ['canal', 'filme', 'serie'], required: true },
  conteudo_id: { type: Schema.Types.ObjectId, required: true },
  created_at: { type: Date, default: Date.now }
});
const Favorito = mongoose.model('Favorito', favoritoSchema);

// Histórico de Visualização
const historicoVisualizacaoSchema = new Schema({
  usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  tipo: { type: String, enum: ['canal', 'filme', 'serie'], required: true },
  conteudo_id: { type: Schema.Types.ObjectId, required: true },
  data_visualizacao: { type: Date, default: Date.now }
});
const HistoricoVisualizacao = mongoose.model('HistoricoVisualizacao', historicoVisualizacaoSchema);

// Sessão de Usuário
const sessaoUsuarioSchema = new Schema({
  usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  ativo: { type: Boolean, default: true },
  expires_at: { type: Date, required: true },
  created_at: { type: Date, default: Date.now }
});
const SessaoUsuario = mongoose.model('SessaoUsuario', sessaoUsuarioSchema);

// Canal
const canalSchema = new Schema({
  nome: { type: String, required: true },
  url_stream: { type: String, required: true },
  logo_url: { type: String },
  ativo: { type: Boolean, default: true },
  categoria_id: { type: Schema.Types.ObjectId, ref: 'Categoria' },
  ordem: { type: Number, default: 0 }
});
const Canal = mongoose.model('Canal', canalSchema);

// Filme
const filmeSchema = new Schema({
  titulo: { type: String, required: true },
  descricao: { type: String },
  url_stream: { type: String, required: true },
  ativo: { type: Boolean, default: true }
});
const Filme = mongoose.model('Filme', filmeSchema);

// Série
const serieSchema = new Schema({
  titulo: { type: String, required: true },
  descricao: { type: String },
  temporadas: { type: Number, default: 1 },
  ativo: { type: Boolean, default: true }
});
const Serie = mongoose.model('Serie', serieSchema);

module.exports = {
  Usuario,
  Favorito,
  HistoricoVisualizacao,
  SessaoUsuario,
  Canal,
  Filme,
  Serie
};
