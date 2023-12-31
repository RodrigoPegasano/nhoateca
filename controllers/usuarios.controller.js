// Models
const Usuario = require('../models/usuarios.model')

// Json Web Token
const jwt = require('jsonwebtoken')

// .env
require('dotenv').config()

// Helpers
const { encriptar, comprobar } = require('../helpers/encriptacion')

// GET: BUSCAR TODOS LOS USUARIOS
async function buscarTodos() {
    const usuarios = await Usuario.find()
    return usuarios
}

// GET: BUSCAR POR ID
async function buscarPorId(id) {
    const usuarios = await Usuario.findById(id)
    return usuarios
}

// GET: BUSCAR POR EMAIL
async function buscarPorEmail(email) {
    const usuarios = await Usuario.findOne({ email: email })
    return usuarios
}

// POST: CREAR NUEVO USUARIO
async function crearUsuario(nombre, email, password, rol) {
    const hash = await encriptar(password)
    const nuevoUsuario = new Usuario({
        nombre: nombre,
        email: email,
        password: hash,
        rol: rol
    })

    await nuevoUsuario.save()

    return nuevoUsuario
}

// DELETE: ELIMINAR UN USUARIO
async function eliminarUsuario(id) {
    const borrarUsuario = await Usuario.findByIdAndDelete(id)
    return borrarUsuario
}

// PATCH: ACTUALIZAR DATOS DE UN USUARIO
async function actualizarUsuario(id, nombre, email, password, rol) {
    const modificarUsuario = await Usuario.findByIdAndUpdate(id, { nombre: nombre, email: email, password: password, rol: rol })
    return modificarUsuario
}

// LOGIN
async function loginUsuario(email, password) {
    const usuarioEncontrado = await Usuario.findOne({ email: email })

    if (usuarioEncontrado) {
        const resultadoComprobacion = await comprobar(usuarioEncontrado.password, password)
        if (resultadoComprobacion) {
            const token = jwt.sign({ id: usuarioEncontrado._id, name: usuarioEncontrado.email }, process.env.JWTSECRET, { expiresIn: '1h' })

            return {
                usuario: usuarioEncontrado,
                token: token,
                mensaje: null
            }
        } else {

            return {
                usuario: null,
                token: null,
                mensaje: "Contraseña incorrecta"
            }

        }
    } else {
        return {
            usuario: null,
            token: null,
            mensaje: "Email no encontrado"
        }
    }
}

module.exports = {
    buscarTodos,
    buscarPorId,
    buscarPorEmail,
    crearUsuario,
    eliminarUsuario,
    actualizarUsuario,
    loginUsuario
}