const express = require('express')
const router = express.Router()

// Controllers
const { buscarTodos, buscarPor, agregarProducto, borrarProducto, editarProducto } = require('../controllers/productos.controller');

// GET: BUSCAR TODOS LOS PRODUCTOS O BUSCAR POR TÍTULO, AUTOR, GÉNERO, IDIOMA
router.get('/', async (req, res) => {
    try {
        let productos = [];

        // Para buscar libros por nombre, autor, genero o idioma
        if (req.query.titulo || req.query.autor || req.query.genero || req.query.idioma) {
            const titulo = req.query.titulo ? req.query.titulo : ""
            const autor = req.query.autor ? req.query.autor : ""
            const genero = req.query.genero ? req.query.genero : ""
            const idioma = req.query.idioma ? req.query.idioma : ""

            productos = await buscarPor(titulo, autor, genero, idioma)
        } else {
            productos = await buscarTodos()
        }

        res.json(productos)
    } catch (error) {
        res.status(500).json({ mensaje: "Error interno del servidor" })
    }
})

// POST: AGREGAR NUEVO PRODUCTO
router.post("/", async (req, res) => {
    await agregarProducto(
        req.body.titulo,
        req.body.autor,
        req.body.genero,
        req.body.idioma,
        req.body.precio,
        req.body.sinopsis
    )

    res.json({ mensaje: "Producto agregado!" })
})

// DELETE: ELIMINAR UN PRODUCTO
router.delete('/:id', async (req, res) => {
    const eliminarProducto = await borrarProducto(req.params.id)

    if (eliminarProducto) {
        res.json({ mensaje: "Producto borrado!" })
    } else {
        res.json({ mensaje: "Producto no encontrado!" })
    }
})

// PATCH: EDITAR UN PRODUCTO
router.patch('/:id', async (req, res) => {
    let encontrado = null

    encontrado = await editarProducto(
        req.params.id,
        req.body.titulo,
        req.body.autor,
        req.body.genero,
        req.body.idioma,
        req.body.precio,
        req.body.sinopsis
    )

    res.json(encontrado === null ? { mensaje: "Producto no encontrado" } : { dato: encontrado, mensaje: "Producto modificado!" })
})

module.exports = router