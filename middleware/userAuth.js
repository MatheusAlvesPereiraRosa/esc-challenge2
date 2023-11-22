const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env;

function authenticateUser(req, res, next) {
  const token = req.header('Authorization');

  if (!token || token === undefined) {
    return res.status(401).json({ mensagem: 'Token de autenticação faltando' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    req.user = decoded.user;

    // Se o token for válido, passa adiante
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      // Token expirado
      return res.status(401).json({ mensagem: 'Sessão inválida' });
    } else if (err.name === 'JsonWebTokenError') {
      // Token inválido
      return res.status(401).json({ mensagem: 'Não autorizado' });
    } else {
      // Other errors (e.g., malformed token)
      return res.status(401).json({ mensagem: 'Erro no token' });
    }
  }
}

module.exports = authenticateUser;