const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const authenticateUser = require('../middleware/userAuth');

// Definindo as rotas para autenticação
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/resetPassword', userController.resetPassword);
router.post('/changePassword', userController.changePassword);

module.exports = router;