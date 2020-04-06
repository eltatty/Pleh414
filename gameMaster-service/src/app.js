const express = require("express")

require("./db/mongoose")

const app = express()
const userRouter = require("./routers/user")

app.get('/', (req, res) => {
    res.send('Game Master Service')
})

app.use(express.json())
app.use(userRouter)

module.exports = app