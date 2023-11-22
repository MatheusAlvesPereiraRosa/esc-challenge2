require('dotenv').config()

const User = require('../models/usersModel');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { SECRET_KEY } = process.env

// Regular expression for basic email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isEmailValid = (email) => {
  return emailRegex.test(email);
};

// Definindo funções que envolvem a autenticação de usuário
module.exports = {
  registerUser: async (req, res) => {
    const { nome, senha, email, telefones } = req.body;

    if (nome === '' || undefined) {
      return res.status(500).json({ mensagem: 'O nome do usuário não foi informado' })
    }

    if (senha === '' || undefined) {
      return res.status(500).json({ mensagem: 'A senha não foi informada' })
    }

    if (email === '' || undefined) {
      return res.status(500).json({ mensagem: 'O email não foi informado' })
    }

    if (!isEmailValid(email)) {
      return res.status(400).json({ mensagem: 'Email inválido' });
    }

    try {
      // Checando se o nome de usuário já existe
      const existingUser = await User.findOne({ nome });

      if (existingUser) {
        return res.status(400).json({ mensagem: 'Nome de usuário já existe' });
      }

      const existingEmail = await User.findOne({ email });

      if (existingEmail) {
        return res.status(400).json({ mensagem: 'Email já existente' });
      }

      // Gerando hash da senha
      const hashedSenha = await bcrypt.hash(senha, 10);

      // Criando um novo usuário
      const newUser = new User({
        nome,
        senha: hashedSenha,
        email: email,
        ultimo_login: new Date(),
        data_criacao: new Date(),
        data_atualizacao: new Date(),
        telefones: telefones
      });

      // Salvando o usuário no banco de dados
      await newUser.save();

      // Gerando o JWT para a autenticação
      const token = jwt.sign({ userId: newUser._id }, SECRET_KEY, {
        expiresIn: '30m',
      });

      // Construindo a resposta com JSON
      const responseJson = {
        id: newUser._id,
        data_criacao: newUser.data_criacao,
        data_atualizacao: newUser.data_atualizacao,
        ultimo_login: newUser.ultimo_login,
        token: token
      };

      return res.status(200).json(responseJson);
    } catch (error) {
      console.error('Erro durante registro:', error);
      return res.status(500).json({ mensagem: 'Falha ao registrar usuário' });
    }
  },

  loginUser: async (req, res) => {
    const { email, senha } = req.body;

    if (email === '' || undefined) {
      return res.status(500).json({ mensagem: 'O email não foi informado' })
    }

    if (senha === '' || undefined) {
      return res.status(500).json({ mensagem: 'A senha não foi informada' })
    }

    try {
      // Achando o usuário por email
      const user = await User.findOne({ email });

      if (!user) {
        return res.json({ mensagem: 'Usuário e/ou senha inválidos' });
      }

      // Comparando as senhas
      const isSenhaValid = await bcrypt.compare(senha, user.senha);

      if (!isSenhaValid) {
        return res.status(401).json({ mensagem: 'Usuário e/ou senha inválidos' });
      }

      // Atualizando ultimo login
      user.ultimo_login = new Date();

      // Atualizando ultimo_login do usuário
      await user.save();

      // Gerando o JWT para a autenticação
      const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
        expiresIn: '30m',
      });

      const responseJson = {
        id: user._id,
        data_criacao: user.data_criacao,
        data_atualizacao: user.data_atualizacao,
        ultimo_login: user.ultimo_login,
        token: token
      }

      return res.status(200).json(responseJson)
    } catch (error) {
      console.error('Erro durante login:', error);
      return res.status(500).json({ mensagem: 'Falha ao logar' });
    }
  },

  getUsers: async (req, res) => {
    await User.find()
      .then((users) => {
        res.json(users)
      })
      .catch((error) => {
        console.error('mensagem:', error);
        res.status(500).send({mensagem: error})
      });
  },

  resetPassword: async (req, res) => {
    const { nome, email } = req.body;

    if (nome === '' || undefined || !nome) {
      return res.status(400).json({ mensagem: 'O nome do usuário não foi informado' })
    } else if (email === '' || undefined || !email) {
      return res.status(400).json({ mensagem: 'O email associado ao usuário não foi informado' })
    }

    // Procurando usuário no banco de dados
    const user = await User.findOne({ nome, email });

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
      user.data_atualizacao = new Date()
      await user.save();

      res.status(200).json({ mensagem: 'Senha mudada com sucesso' });
    } catch (error) {
      console.error('Erro durante o reset da senha', error);
      res.status(500).json({ mensagem: 'Falha ao resetar senha' });
    }
  }
};