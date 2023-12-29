const express = require('express')
const router = express.Router()

router.get("/", (req, res) => {
    res.json({ mensaje: "Bienvenido a la Nhoateca :)" })
})

module.exports = router