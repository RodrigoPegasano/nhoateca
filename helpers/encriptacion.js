// Bcrypt
const bcrypt = require('bcryptjs')

async function encriptar(password) {
    const salt = await bcrypt.genSalt(12)
    const hash = await bcrypt.hash(password, salt)
    return hash
}

async function comprobar(hash, password) {
    const resultado = await bcrypt.compare(password, hash)
    return resultado
}

module.exports = {
    encriptar,
    comprobar
}