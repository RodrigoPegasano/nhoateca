const Producto = require('../models/productos.model')

// GET: BUSCAR TODOS LOS PRODUCTOS
async function buscarTodos() {
    const productos = await Producto.find()
    return productos
}

// GET: BUSCAR PRODUCTOS POR TÍTULO, AUTOR, GÉNERO, IDIOMA
async function buscarPor(titulo, autor, genero, idioma) {
    const productos = await Producto.find({
        titulo: { "$regex": titulo, "$options": "i" },
        autor: { "$regex": autor, "$options": "i" },
        genero: { "$regex": genero, "$options": "i" },
        idioma: { "$regex": idioma, "$options": "i" },
    })

    return productos
}

// POST: AGREGAR NUEVO PRODUCTO
async function agregarProducto(titulo, autor, genero, idioma, precio, sinopsis) {
    const nuevoProducto = new Producto({
        titulo: titulo,
        autor: autor,
        genero: genero,
        idioma: idioma,
        precio: precio,
        sinopsis: sinopsis
    })

    await nuevoProducto.save()

    return nuevoProducto
}

// DELETE: ELIMINAR UN PRODUCTO
async function borrarProducto(id) {
    const eliminarProducto = await Producto.findByIdAndDelete(id)
    return eliminarProducto
}

// PATCH: EDITAR UN PRODUCTO
async function editarProducto(id, titulo, autor, genero, idioma, precio, sinopsis) {
    const modificarProducto = await Producto.findByIdAndUpdate(id, {
        titulo: titulo,
        autor: autor,
        genero: genero,
        idioma: idioma,
        precio: precio,
        sinopsis: sinopsis
    })

    return modificarProducto
}

module.exports = {
    buscarTodos,
    buscarPor,
    agregarProducto,
    borrarProducto,
    editarProducto
}