// Configuração do banco de dados
require('dotenv').config()

const mongoose = require('mongoose');

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS
const dbName = process.env.DB_NAME

const uri = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.o1gr5ky.mongodb.net/${dbName}?retryWrites=true&w=majority`;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection.useDb('escribo');

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to the MongoDB Atlas cluster');
})