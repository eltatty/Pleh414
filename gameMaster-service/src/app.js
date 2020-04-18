const express = require("express")
const http = require('http')
const socketio = require('socket.io')
const User = require('./models/user')
const Chess = require('./models/chess')
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

    socket.on('play', async (callback) => {
        const { error, user } = getUser(socket.id)

        if (error) {
            return callback(error)
        } else {
            const {error, player2} = findToPlay(user.id)
            
            if (!error){

                try {

                    const f1 = await User.findByName(user.username)
                    const f2 = await User.findByName(player2.username)

                    const chess = new Chess({
                        player1: f1._id,
                        player2: f2._id
                    })

                    await chess.save()

                    const playRoom = chess._id
                    
                    io.to(player2.id).emit('invite', playRoom)

                    return callback(playRoom)
                } catch (e) {
                    console.log(e)
                    return callback(e)
                }
            }
        }
        callback({error: 'No partner was found.'})
    })

    socket.on('disconnect', () => {
        try {
            const user = removeUser(socket.id)
            console.log(`[+] ${user.username} has disconnected!`)
        } catch (e) {
            console.log(e)
        }
    })

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