const mongoose = require('mongoose');

const telefoneSchema = new mongoose.Schema({
  telefone: { type: String, required: true },
  ddd: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
  nome: String,
  email: String,
  senha: String,
  telefone: [telefoneSchema]
});

const User = mongoose.model('User', userSchema);

module.exports = User;