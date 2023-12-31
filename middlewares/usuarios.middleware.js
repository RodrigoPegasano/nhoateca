// Json Web Token
const jwt = require('jsonwebtoken')
// .env
require('dotenv').config()

// Controllers
const { buscarPorId, buscarPorEmail } = require('../controllers/usuarios.controller')

// Helpers
const { validarNuevoUsuario } = require('../helpers/validadores')

// CREAR NUEVO USUARIO
// Validar que todos los campos obligatorios están completos
function middlewareNuevoUsuario(req, res, next) {
    const resultadoValidacion = validarNuevoUsuario(req.body)

    if (resultadoValidacion.valido) {
        next()
    } else {
        res.status(400).json({ mensaje: resultadoValidacion.mensaje })
    }
}

// VALIDACIÓN DEL EMAIL
// Validar que el email es realmente un email
function middlewareValidarEmail(req, res, next) {
    if (req.body.email.includes("@")) {
        next()
    } else {
        res.status(400).json({ mensaje: "El email no es válido" })
    }
}

// VALIDACIÓN EMAIL YA EXISTE
// Validar que al crear un usuario, el email no está en uso y es único
async function middlewareEmailUnico(req, res, next) {
    const emailExiste = await buscarPorEmail(req.body.email)

    if (emailExiste) {
        res.json({ mensaje: "Este email ya existe" })
    } else {
        next()
    }
}

// VERIFICAR SI ESTÁ LOGGEADO
function middlewareLogin(req, res, next) {
    if (req.query.token) {
        try {
            const resultado = jwt.verify(req.query.token, process.env.JWTSECRET)
            if (resultado.id === req.params.id) {
                next()
            } else {
                res.status(403).json({ mensaje: "Lo siento, no tienes permiso para acceder a esta página" })
            }
        } catch (error) {
            res.status(401).json({ mensaje: "Token invalido" })
        }
    } else {
        res.status(400).json({ mensaje: "No has proporcionado el token" })
    }
}

// VERIFICAR SI ES ADMIN
async function middlewareAdmin(req, res, next) {
    if (req.query.token) {

        try {
            const resultado = jwt.verify(req.query.token, process.env.JWTSECRET)
            const usuarioEncontrado = await buscarPorId(resultado.id)

            if (usuarioEncontrado.rol == "Admin") {
                next()
            } else {
                res.status(403).json({ mensaje: "No tienes permiso para acceder a este perfil" })
            }
        } catch (error) {
            res.status(401).json({ mensaje: "Token no valido" })
        }

    } else {
        res.status(400).json({ mensaje: "No has proporcionado el token" })
    }
}

module.exports = {
    middlewareNuevoUsuario,
    middlewareValidarEmail,
    middlewareEmailUnico,
    middlewareLogin,
    middlewareAdmin
}