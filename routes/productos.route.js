// Express
const express = require('express')
const router = express.Router()

// Controllers
const { buscarTodos, buscarPor, agregarProducto, borrarProducto, editarProducto } = require('../controllers/productos.controller');

// GET: BUSCAR TODOS LOS PRODUCTOS O BUSCAR POR TÍTULO, AUTOR, GÉNERO, IDIOMA
/**
* Ejemplo para Postman:
* http://localhost:3000/productos
*/
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
/**
* Ejemplo para Postman:
* http://localhost:3000/productos
*
* En el body de Postman:
{
    "titulo": "Titulo del libro",
    "autor": "Autor del libro",
    "genero": "Genero del libro",
    "idioma": "Idioma del libro",
    "precio": "Precio del libro",
    "sinopsis": "Sinopsis del libro"
}
*/
router.post("/", async (req, res) => {
    await agregarProducto(
        req.body.titulo.charAt(0).toUpperCase() + req.body.titulo.slice(1),
        req.body.autor.charAt(0).toUpperCase() + req.body.autor.slice(1),
        req.body.genero.charAt(0).toUpperCase() + req.body.genero.slice(1),
        req.body.idioma.charAt(0).toUpperCase() + req.body.idioma.slice(1),
        req.body.precio,
        req.body.sinopsis.charAt(0).toUpperCase() + req.body.sinopsis.slice(1)
    )

    res.json({ mensaje: "Producto agregado!" })
})

// DELETE: ELIMINAR UN PRODUCTO
/**
* Ejemplo para Postman:
* http://localhost:3000/productos/id_number
*/
router.delete('/:id', async (req, res) => {
    const eliminarProducto = await borrarProducto(req.params.id)

    if (eliminarProducto) {
        res.json({ mensaje: "Producto borrado!" })
    } else {
        res.json({ mensaje: "Producto no encontrado!" })
    }
})

// PATCH: EDITAR UN PRODUCTO
/**
* Ejemplo para Postman:
* http://localhost:3000/productos/id_number
*
* En el body de Postman, agregamos lo que queremos editar:
{
    "titulo": "Titulo del libro",
    "autor": "Autor del libro",
    "genero": "Genero del libro",
    "idioma": "Idioma del libro",
    "precio": "Precio del libro",
    "sinopsis": "Sinopsis del libro"
}
*/
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