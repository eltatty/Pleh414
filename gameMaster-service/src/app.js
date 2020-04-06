const express = require("express")

require("../src/db/mongoose")

const app = express()

app.get('/', (req, res) => {
    res.send('Game Master Service')
})

module.exports = app