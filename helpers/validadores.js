// VALIDAR NUEVO PRODUCTO
function validarNuevoProducto(body) {
    if (body.titulo === undefined || body.titulo === "" ||
        body.autor === undefined || body.autor === "" ||
        body.genero === undefined || body.genero === "" ||
        body.idioma === undefined || body.idioma === "" ||
        body.precio === undefined || body.precio === ""
    ) {

        return {
            valido: false,
            mensaje: "Falta titulo, autor, genero, idioma o precio"
        }

    } else {

        return {
            valido: true,
            mensaje: null
        }

    }
}

// VALIDAR NUEVO USUARIO
function validarNuevoUsuario(body) {
    if (body.email === undefined || body.email.trim() === "" ||
        body.nombre === undefined || body.nombre.trim() === "" ||
        body.password === undefined || body.password === "" ||
        body.rol === undefined || body.rol.trim() === ""
    ) {

        return {
            valido: false,
            mensaje: "Falta nombre, email, password o rol"
        }

    } else {

        return {
            valido: true,
            mensaje: null
        }

    }
}

module.exports = {
    validarNuevoProducto,
    validarNuevoUsuario
}