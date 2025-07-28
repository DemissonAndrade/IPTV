const mongoose = require('mongoose');
const { Schema } = mongoose;

const planoSchema = new Schema({
  nome: { type: String, required: true },
  descricao: { type: String },
  preco: { type: Number, required: true },
  stripePriceId: { type: String, required: true }, // Stripe Price ID for subscription
  ativo: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now }
});

const Plano = mongoose.model('Plano', planoSchema);

module.exports = Plano;
