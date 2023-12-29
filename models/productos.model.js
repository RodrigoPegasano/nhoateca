const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productoSchema = new Schema({
    titulo: {
        type: String,
        required: true
    },
    autor: {
        type: String,
        required: true
    },
    genero: {
        type: String,
        required: true
    },
    idioma: {
        type: String,
        required: true
    },
    precio: {
        type: String,
        required: true
    },
    sinopsis: {
        type: String
    }
})

const Productos = mongoose.model("productos", productoSchema)

module.exports = Productos