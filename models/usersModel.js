const mongoose = require('mongoose');

const telefoneSchema = new mongoose.Schema({
  numero: { type: String, required: true },
  ddd: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
  nome: String,
  email: String,
  senha: String,
  ultimo_login: String,
  data_criacao: String,
  data_atualizacao: String,
  telefones: [telefoneSchema]
});

const User = mongoose.model('User', userSchema);

module.exports = User;