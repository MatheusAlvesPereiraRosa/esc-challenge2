// importes do backend
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

const databaseConfig = require('./config/dbconfig')

const authRoutes = require("./routes/authRoutes")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors({
  "origin": "*",
}))

const port = process.env.PORT || 5000

app.get("/", function(req, res) {
  res.send("Olá, seja bem vindo ao meu teste!!!")
})

app.use('/auth', authRoutes)

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`)
});