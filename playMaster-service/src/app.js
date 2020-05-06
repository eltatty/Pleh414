const express = require("express")
const http = require('http')
const socketio = require('socket.io')
const Chess = require('./models/chess')
const Tic = require('./models/tic')
const User = require('./models/user')
const trade = require('./utils/game')

require("./db/mongoose")

// As server.
const app = express()
const port = process.env.PORT || 3007
const server = http.createServer(app)
const io = socketio(server)


// As client.
const io2 = require('socket.io-client')
const socket2 = io2.connect("http://localhost:3006", {
    reconnection:true
})

io.on('connection', (socket) => {
    console.log('New websocket connection!')


    socket.on('join', (data) => {
        console.log(data)
        
        socket.join(data.room)
        socket.broadcast.to(data.room).emit('message','New user in room ' + data.username)
    })
    

    socket.on('move', async (data, callback) => {
        try {
            if (data.gameType === "chess"){
                const game = await Chess.findById(data.room)

                await trade(data, game)

            } else if (data.gameType === "tic"){
                const game = await Tic.findById(data.room)

                await trade(data, game)

            } else {
                return callback( {error: "No gameType was specified!"})
            }

            socket.broadcast.to(data.room).emit('message', data.move)

        } catch (e) {
            return callback(e)
        }
    })

    socket.on('tour-move', async (data, callback) => {

        console.log(data)

        try {
            if (data.gameType === "chess"){
                const game = await Chess.findById(data.room)

                await trade(data, game)

            } else if (data.gameType === "tic"){
                const game = await Tic.findById(data.room)

                await trade(data, game)

            } else {
                return callback( {error: "No gameType was specified!"})
            }

            if( typeof data.winner !== "undefined"){
                const user = await User.findByName(data.winner)

                const flowers = {
                    user: user.name,
                    tournament: data.tournament 
                }

                socket2.emit('nextRound', flowers)
            }
            socket.broadcast.to(data.room).emit('message', data.move)

        } catch (e) {
            return callback(e)
        }


    })
})


server.listen(port, () => {
    console.log('Listening on ' + port)
})