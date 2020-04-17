const express = require("express")
const http = require('http')
const socketio = require('socket.io')
const User = require('./models/user')
const Move = require('./models/move')
const Game = require('./models/game')

require("./db/mongoose")

const app = express()

const port = process.env.PORT || 3007

const server = http.createServer(app)
const io = socketio(server)

const room = "playRoom"

io.on('connection', (socket) => {
    console.log('New websocket connection!')


    socket.on('join', (data) => {
        console.log(data)
        socket.join(room)
        socket.broadcast.to(room).emit('message','New user in room')
    })

    // socket.on('create', async () => {
    //     const game = new Game({
    //         player1: 'ED',
    //         player2: 'Fotis'
    //     })
    //     try {
    //         await game.save()
    //     } catch (e) {
    //         console.log(e)
    //     }
    // })

    socket.on('move', async () => {
        const gameId = "5e994966deebd21799e62286"
        try {
            const game = await Game.findById(gameId)
            const move = new Move({
                player: 'ED',
                old_position: 'back',
                new_position: 'front'
            })
            await move.save()
            game.moves = game.moves.concat(move)
            await game.save()

            socket.broadcast.to(room).emit('message', move)
        } catch (e) {
            console.log(e)
        }
        
    })

    

})


server.listen(port, () => {
    console.log('Listening on ' + port)
})