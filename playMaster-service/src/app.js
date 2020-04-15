const express = require("express")
const http = require('http')
const socketio = require('socket.io')
require("./db/mongoose")

const app = express()

const port = process.env.PORT || 3007

const server = http.createServer(app)
const io = socketio(server)

io.on('connection', (socket) => {
    console.log('New websocket connection!')
})


server.listen(port, () => {
    console.log('Listening on ' + port)
})