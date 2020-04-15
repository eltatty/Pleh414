const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()

const socketport = process.env.PORT || 3004
const webport =  process.env.PORT || 3005

const server = http.createServer(app)
const io = socketio(server)

const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))
app.use(express.json())

let count = 0

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.emit('countUpdated', count)

    socket.on('increment', () => {
        count++
        io.emit('countUpdated', count)
    })
})

// app.get('/test', async (req, res) => {
//     res.status(200).send("OK")
// })

server.listen(socketport, () => {
    console.log(`Socket is up on port ${socketport}!`)
})

// app.listen(webport, () => {
//     console.log('Server is on port ' + webport)
// })