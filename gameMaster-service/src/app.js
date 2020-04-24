const express = require("express")
const http = require('http')
const socketio = require('socket.io')
const User = require('./models/user')
const Chess = require('./models/chess')
const Tic = require('./models/tic')
require("./db/mongoose")

const { addUser, removeUser, getUser, findToPlay, getRoom, findParticipants } = require('./utils/room')

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

    socket.on('tournament', async (options, callback) => {

        try {
            const creator = await User.findByName(options.username)

            if(creator.role !== "admin" && creator.role !== "official"){
                return callback({error: "You don`t have privilege!"})
            }else if(getRoom() < options.participants){
                return callback({error: "Not enough people online!"})
            }else if(Math.log2(options.participants) % 1 !== 0){
                return callback({error: "Participants not pairing!"})
            } else {
                // return callback({message: "All good"})
                const participants = findParticipants(socket.id, options.participants)

                for(i=0;i<participants.length;i+=2){

                    const f1 = await User.findByName(participants[i].username)
                    const f2 = await User.findByName(participants[i+1].username)

                    if (options.gameType === "chess"){
                        const chess = new Chess({
                            player1: f1._id,
                            player2: f2._id
                        })
    
                        await chess.save()
    
                        const playRoom = chess._id

                        io.to(participants[i].id).emit('tour-inv', playRoom)
                        io.to(participants[i+1].id).emit('tour-inv', playRoom)

                    } else {
                        const tic = new Tic({
                            player1: f1._id,
                            player2: f2._id
                        })
    
                        await tic.save()
    
                        const playRoom = tic._id

                        io.to(participants[i].id).emit('tour-inv', playRoom)
                        io.to(participants[i+1].id).emit('tour-inv', playRoom)
                    }
                }
            }
        } catch (e) {
            console.log(e)
        }
    })

    socket.on('play', async (data, callback) => {
        const { error, user } = getUser(socket.id)

        if (error) {
            return callback(error)
        } else if( data !== "chess" && data !== "tic"){
            return callback({error: "Tic or Chess!"})
        }
        else {
            const {error, player2} = findToPlay(user.id)
            
            if (!error){

                try {

                    const f1 = await User.findByName(user.username)
                    const f2 = await User.findByName(player2.username)
                    
                    if (data === "chess"){
                        const chess = new Chess({
                            player1: f1._id,
                            player2: f2._id
                        })
    
                        await chess.save()
    
                        const playRoom = chess._id

                        io.to(player2.id).emit('invite', playRoom)
                        return callback(playRoom)
                    } else {
                        const tic = new Tic({
                            player1: f1._id,
                            player2: f2._id
                        })
    
                        await tic.save()
    
                        const playRoom = tic._id

                        io.to(player2.id).emit('invite', playRoom)
                        return callback(playRoom)
                    }
                } catch (e) {
                    console.log(e)
                    return callback(e)
                }
            }
        }
        callback({error: 'No partner was found.'})
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