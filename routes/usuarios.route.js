const express = require('express')
const router = express.Router()

// Controllers
const { buscarTodos, buscarPorId, buscarPorEmail, crearUsuario, eliminarUsuario, actualizarUsuario, loginUsuario } = require('../controllers/usuarios.controller')

// Middlewares
const { middlewareNuevoUsuario, middlewareValidarEmail, middlewareEmailUnico, middlewareLogin, middlewareAdmin } = require('../middlewares/usuarios.middleware')

// GET: BUSCAR TODOS LOS USUARIOS
router.get('/', async (req, res) => {
    try {
        let usuarios = []

        if (req.query.email) {
            usuarios = await buscarPorEmail(req.query.email)
        } else {
            usuarios = await buscarTodos()
        }

        res.json(usuarios)
    } catch (error) {
        res.status(500).json({ mensaje: "Error interno del servidor" })
    }
})

// GET PERFIL: ACCEDER AL PERFIL DEL USUARIO
// Ejemplo: /perfil/id_number?token=token_number
router.get('/perfil/:id', middlewareLogin, async (req, res) => {
    const usuarioLoggeado = await buscarPorId(req.params.id)
    res.json({ mensaje: "Bienvenido/a a tu perfil " + usuarioLoggeado.nombre })
})

// GET ADMIN: USUARIO CON PERMISOS DE ADMIN
// Ejemplo: /perfil/admin/id_number?token=token_number
router.get('/perfil/admin/:id', middlewareAdmin, async (req, res) => {
    res.json({ mensaje: "Bienvenido/a admin" })
})

// POST: CREAR NUEVO USUARIO
// Comprueba que todos los campos están, que el email es válido y que el email es único
router.post('/', middlewareNuevoUsuario, middlewareValidarEmail, middlewareEmailUnico, async (req, res) => {
    try {
        await crearUsuario(
            req.body.nombre.trim(),
            req.body.email.trim().toLowerCase(),
            req.body.password,
            req.body.rol.trim()
        )

        res.json({ mensaje: "Usuario creado!" })
    } catch (error) {
        res.status(500).json({ mensaje: "Error interno del servidor" })
    }
})

// POST LOGIN: ACCEDER AL PERFIL DEL USUARIO
router.post('/login', async (req, res) => {
    try {
        const resultadoLogin = await loginUsuario(req.body.email, req.body.password)
        res.json({ token: resultadoLogin.token, mensaje: resultadoLogin.mensaje })
    } catch (error) {
        res.status(500).json({ mensaje: "Error interno del servidor" })
    }
})

// DELETE: ELIMINAR UN USUARIO
router.delete("/:id", async (req, res) => {
    const borrarUsuario = await eliminarUsuario(req.params.id)

    if (borrarUsuario) {
        res.json({ mensaje: "Usuario borrado!" })
    } else {
        res.json({ mensaje: "Usuario no encontrado!" })
    }
})

// PATCH: ACTUALIZAR DATOS DE UN USUARIO
router.patch('/:id', async (req, res) => {
    let encontrado = null

    encontrado = await actualizarUsuario(
        req.params.id,
        req.body.nombre,
        req.body.email,
        req.body.password,
        req.body.rol
    )

    res.json(encontrado === null ? { mensaje: "Error: Usuario no encontrado" } : { dato: encontrado, mensaje: "Usuario modificado!" })
})

module.exports = router