// Express
const express = require('express')
const router = express.Router()

// GET: PÁGINA INICIAL DE LA BIBLIOTECA
/**
* Ejemplo para Postman:
* http://localhost:3000
*/

router.get("/", (req, res) => {
    res.json({ mensaje: "Bienvenido a la Nhoateca :)" })
})

module.exports = router