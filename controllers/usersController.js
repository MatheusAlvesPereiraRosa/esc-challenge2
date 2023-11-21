require('dotenv').config()

const User = require('../models/usersModel');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { SECRET_KEY } = process.env

// Definindo funções que envolvem a autenticação de usuário
module.exports = {
  registerUser: async (req, res) => {
    const { nome, senha, email } = req.body;

    if (nome === '' || undefined) {
      return res.status(500).json({ mensagem: 'O nome do usuário não foi informado' })
    }

    if (senha === '' || undefined) {
      return res.status(500).json({ mensagem: 'A senha não foi informada' })
    }

    if (email === '' || undefined) {
      return res.status(500).json({ mensagem: 'O email não foi informado' })
    }

    try {
      // Checando se o nome de usuário já existe
      const existingUser = await User.findOne({ nome });

      if (existingUser) {
        return res.status(400).json({ mensagem: 'Nome de usuário já existe' });
      }

      // Gerando hash da senha
      const hashedSenha = await bcrypt.hash(senha, 10);

      // Criando um novo usuário
      const newUser = new User({
        nome,
        senha: hashedSenha,
        email
      });

      // Salvando o usuário no banco de dados
      await newUser.save();

      return res.status(200).json({ mensagem: 'Usuário cadastrado com sucesso' });
    } catch (error) {
      console.error('Error registering user:', error);
      return res.status(500).json({ mensagem: 'Failed to register user' });
    }
  },

  loginUser: async (req, res) => {
    const { nome, email, senha } = req.body;

    if (nome === '' || undefined) {
      return res.status(500).json({ mensagem: 'O nome do usuário não foi informado' })
    }

    if (senha === '' || undefined) {
      return res.status(500).json({ mensagem: 'A senha não foi informada' })
    }

    if (email === '' || undefined) {
      return res.status(500).json({ mensagem: 'O email não foi informado' })
    }

    try {
      // Achando o usuário pelo nome
      const user = await User.findOne({ nome });

      if (!user) {
        return res.status(401).json({ mensagem: 'Usuário inválido' });
      }

      const email = await User.findOne({ email });

      if (!email) {
        return res.status(401).json({ mensagem: 'Usuário inválido' });
      }

      // Comparando as senhas
      const isSenhaValid = await bcrypt.compare(senha, user.senha);

      if (!isSenhaValid) {
        return res.status(401).json({ mensagem: 'Senha inválida' });
      }

      // Gerando o JWT para a autenticação
      const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
        expiresIn: '1800',
      });

      console.log("Login sucess")
      return res.status(200).cookie('token', token, { httpOnly: true }).json({ mensagem: 'Login bem sucedido', token })
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ mensagem: 'Falha ao logar' });
    }
  },

  resetPassword: async (req, res) => {
    const { nome } = req.body;

    if (nome === '' || undefined || !nome) {
      return res.status(400).json({ mensagem: 'O nome do usuário não foi informado' })
    }

    // Procurando usuário no banco de dados
    const user = await User.findOne({ nome });

    if (!user) {
      return res.status(404).json({ mensagem: 'Usuário inexistente' });
    }

    // Gerando o token para redefinir a senha
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({ mensagem: 'Token para resetar senha enviado', token });
  },

  changePassword: async (req, res) => {
    const { token, senha } = req.body;

    if (senha === '' || undefined) {
      return res.status(400).json({ mensagem: 'A senha não foi informada' })
    }

    try {
      // Verificando o token
      const decodedToken = jwt.verify(token, SECRET_KEY);

      // Checando se o token expirou
      if (decodedToken.exp < Date.now() / 1000) {
        return res.status(400).json({ mensagem: 'Token expirado' });
      }

      // Achando usuário por ID
      const user = await User.findById(decodedToken.userId);

      if (!user) {
        return res.status(404).json({ mensagem: 'Usuário não achado' });
      }

      // Gerando hash da senha
      const hashedsenha = await bcrypt.hash(senha, 10);

      // Atualizando a senha do usuário
      user.senha = hashedsenha;
      await user.save();

      res.status(200).json({ mensagem: 'Senha mudada com sucesso' });
    } catch (error) {
      console.error('Erro durante o reset da senha', error);
      res.status(500).json({ mensagem: 'Falha ao resetar senha' });
    }
  }
};