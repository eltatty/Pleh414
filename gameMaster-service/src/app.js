const express = require("express")
const http = require('http')
const socketio = require('socket.io')
require("./db/mongoose")

const { addUser, removeUser, getUser, findToPlay } = require('./utils/room')

const app = express()

const sockPort = process.env.PORT || 3006

const userRouter = require("./routers/user")

const sockServer = http.createServer(app)
const io = socketio(sockServer)

const room = "live"

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', (options, callback) => {
        console.log(options)

        const { error, user } = addUser({ id: socket.id, ...options })

        if (error) {
            return callback(error)
        }

        socket.join(room)
        socket.broadcast.to(room).emit('message','Next in room is ' + user.username + '!')
        callback()
    })

    socket.on('play', (callback) => {
        const { error, user } = getUser(socket.id)

        if (error) {
            return callback(error)
        } else {
            const player1 = user.username
            const player2 = findToPlay(user.id)
            console.log(`${player1} wants to play with ${player2.username}`)
            io.to(player2.id).emit('invite', player1)
        }
        callback()
    })

    // socket.on('disconnect', () => {
    //     try {
    //         const user = removeUser(socket.id)
    //         console.log(`[+] ${user.username} has disconnected!`)
    //     } catch (e) {
    //         console.log(e)
    //     }
    // })

})

app.get('/', (req, res) => {
    res.send('Game Master Service')
})

sockServer.listen(sockPort, () => {
    console.log(`Socket is up on port ${sockPort}!`)
})

app.use(express.json())
app.use(userRouter)


module.exports = app