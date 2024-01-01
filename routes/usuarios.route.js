// Express
const express = require('express')
const router = express.Router()

// Controllers
const { buscarTodos, buscarPorId, buscarPorEmail, crearUsuario, eliminarUsuario, actualizarUsuario, loginUsuario } = require('../controllers/usuarios.controller')

// Middlewares
const { middlewareNuevoUsuario, middlewareValidarEmail, middlewareEmailUnico, middlewareLogin, middlewareAdmin } = require('../middlewares/usuarios.middleware')

// GET: BUSCAR TODOS LOS USUARIOS
/**
* Ejemplo para Postman:
* http://localhost:3000/usuarios
*/
router.get('/', async (req, res) => {
    try {
        let usuarios = []

        // Podemos buscar un usuario por el email:
        // http://localhost:3000/usuarios?email=user_email
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
/**
* Ejemplo para Postman:
* Ejemplo: http://localhost:3000/usuarios/perfil/id_number?token=token_number
*/
router.get('/perfil/:id', middlewareLogin, async (req, res) => {
    const usuarioLoggeado = await buscarPorId(req.params.id)
    res.json({ mensaje: "Bienvenido/a a tu perfil " + usuarioLoggeado.nombre })
})

// GET ADMIN: USUARIO CON PERMISOS DE ADMIN
/**
* Ejemplo para Postman:
* Ejemplo: http://localhost:3000/usuarios/perfil/admin/id_number?token=token_number
*/
router.get('/perfil/admin/:id', middlewareAdmin, async (req, res) => {
    const usuarioAdmin = await buscarPorId(req.params.id)
    res.json({ mensaje: "Bienvenido/a " + usuarioAdmin.nombre })
})

// POST: CREAR NUEVO USUARIO
// Comprueba que todos los campos están, que el email es válido y que el email es único
/**
* Ejemplo para Postman:
* http://localhost:3000/usuarios
*
* En el body de Postman:
{
    "nombre": "nombre",
    "email": "email",
    "password": "password",
    "rol": "User/Admin"
}
*/
router.post('/', middlewareNuevoUsuario, middlewareValidarEmail, middlewareEmailUnico, async (req, res) => {
    try {
        await crearUsuario(
            req.body.nombre.trim().charAt(0).toUpperCase() + req.body.nombre.slice(1),
            req.body.email.trim().toLowerCase(),
            req.body.password,
            req.body.rol.trim().charAt(0).toUpperCase() + req.body.rol.slice(1)
        )

        res.json({ mensaje: "Usuario creado!" })
    } catch (error) {
        res.status(500).json({ mensaje: "Error interno del servidor" })
    }
})

// POST LOGIN: ACCEDER AL PERFIL DEL USUARIO
/**
* Ejemplo para Postman:
* http://localhost:3000/usuarios/login
*
* En el body de Postman:
{
    "email": "email",
    "password": "password"
}
*/
router.post('/login', async (req, res) => {
    try {
        const resultadoLogin = await loginUsuario(req.body.email, req.body.password)
        res.json({ token: resultadoLogin.token, mensaje: resultadoLogin.mensaje })
    } catch (error) {
        res.status(500).json({ mensaje: "Error interno del servidor" })
    }
})

// DELETE: ELIMINAR UN USUARIO
/**
* Ejemplo para Postman:
* Ejemplo: http://localhost:3000/usuarios/id_number
*/
router.delete("/:id", async (req, res) => {
    const borrarUsuario = await eliminarUsuario(req.params.id)

    if (borrarUsuario) {
        res.json({ mensaje: "Usuario borrado!" })
    } else {
        res.json({ mensaje: "Usuario no encontrado!" })
    }
})

// PATCH: ACTUALIZAR DATOS DE UN USUARIO
/**
* Ejemplo para Postman:
* Ejemplo: http://localhost:3000/usuarios/id_number
*
* En el body de Postman:
{
    "nombre": "nombre",
    "email": "email",
    "password": "password",
    "rol": "User/Admin"
}
*/
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