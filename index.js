// INDEX DE LA NHOATECA

/** En este proyecto la idea es crear una biblioteca donde tenemos:
* Ruta de la página inicial
* Ruta de productos
* Ruta de usuarios
*/

// .env
require('dotenv').config()
// Express
const express = require('express')
const bodyParser = require('body-parser')
// Mongoose
const mongoose = require('mongoose')
// Importar routes
const indexRoute = require('./routes/index.route')
const productosRoute = require('./routes/productos.route')
const usuariosRoute = require('./routes/usuarios.route')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(process.env.CONNECTIONSTRING)
    .then(() => console.log('Servidor conectado'))
    .catch(error => console.log('Error'))

// Json Web Token
app.set("secretKey", process.env.JWTSECRET)

// Importar index
app.use('/', indexRoute)
// Importar productos
app.use('/productos', productosRoute)
// Importar usuarios
app.use('/usuarios', usuariosRoute)

// Puerta para utiliar el servidor
app.listen(process.env.PORT)