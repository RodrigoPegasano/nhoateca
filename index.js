// INDEX DE LA NHOATECA

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

/* // Json Web Token
app.set("secretKey", process.env.JWTSECRET) */

const app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(process.env.CONNECTIONSTRING)
    .then(() => console.log('Servidor conectado'))
    .catch(error => console.log('Error'))

// Importar index
app.use('/', indexRoute)
// Importar productos
app.use('/productos', productosRoute);

app.listen(process.env.PORT)