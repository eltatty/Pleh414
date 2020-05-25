const express = require("express")
const http = require('http')
const socketio = require('socket.io')
const Chess = require('./models/chess')
const Tic = require('./models/tic')
const User = require('./models/user')
const trade = require('./utils/game')
const zoo_con = require("./zoo/client")

require("./db/mongoose")

// As server.
const app = express()
const port = process.env.PORT || 3008
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
        socket.broadcast.to(data.room).emit('second_move')
    })
    

    socket.on('move', async (data, callback) => {
        try {
            // Wins/losses
            const tour = 0
            if (data.tournament !== ''){
                const tour = 1
            }

            if (data.gameType === "chess"){
                const game = await Chess.findById(data.room)

                await trade(data, game, tour)

            } else if (data.gameType === "tic"){                
                const game = await Tic.findById(data.room)

                await trade(data, game, tour)

            } else {
                return callback( {error: "No gameType was specified!"})
            }

            if (data.winner !== ''){
                // const user = await User.findByName(data.winner)

                if(data.tournament !== ''){
                    const flowers = {
                        name: data.winner,
                        tournamentID: data.tournament 
                    }
    
                    socket2.emit('nextRound', flowers)
                }
                socket.broadcast.to(data.room).emit('move_back', 'END')
            }else {
                socket.broadcast.to(data.room).emit('move_back', data.move)
            }
            

        } catch (e) {
            return callback(e)
        }
    })
    
})


server.listen(port, () => {
    console.log('Listening on ' + port)
})


zoo_con()