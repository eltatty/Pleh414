const express = require("express")
const http = require('http')
const socketio = require('socket.io')
const User = require('./models/user')
const Chess = require('./models/chess')
const Tic = require('./models/tic')
const Tournament = require('./models/tournament')
const {zoo_children, zoo_con} = require("./zoo/client")
require("./db/mongoose")

const { addUser, removeUser, getUser, getID, findToPlay, getRoom, findParticipants, createTournament, nextRound } = require('./utils/room')

const app = express()
const sockPort = process.env.PORT || 3006
const userRouter = require("./routers/user")
const sockServer = http.createServer(app)
const io = socketio(sockServer)
const room = "live"
const shape = ["X", "O"]

let playmasters = [3007, 3008, 3009]
let chosenOne = 0

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
                const participants = findParticipants(socket.id, options.participants)
                const tournament = new Tournament({
                    gameType: options.gameType,
                })

                for(i=0;i<participants.length;i+=2){

                    const f1 = await User.findByName(participants[i].username)
                    const f2 = await User.findByName(participants[i+1].username)

                    const playServer = findServer()

                    tournament.participants.push(f1)
                    tournament.participants.push(f2)

                    if (options.gameType === "chess"){
                        const chess = new Chess({
                            player1: f1._id,
                            player2: f2._id
                        })
    
                        await chess.save()
                        tournament.games.push(chess)

                        const flowers = {
                            playRoom: tic._id,
                            tournament: tournament._id,
                            gameType: options.gameType,
                            playServer: playServer
                        }


                        io.to(participants[i].id).emit('tour-inv', flowers, shape[0])
                        io.to(participants[i+1].id).emit('tour-inv', flowers, shape[1])

                    } else {
                        const tic = new Tic({
                            player1: f1._id,
                            player2: f2._id
                        })
    
                        await tic.save()
                        tournament.games.push(tic)
    
                        const flowers = {
                            playRoom: tic._id,
                            tournament: tournament._id,
                            gameType: options.gameType,
                            playServer: playServer
                        }

                        io.to(participants[i].id).emit('tour-inv', flowers, shape[0])
                        io.to(participants[i+1].id).emit('tour-inv', flowers, shape[1])
                    }
                }
                await tournament.save()
                createTournament(participants, tournament._id, options.gameType)
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

                    const playServer = findServer()
                    
                    if (data === "chess"){
                        const chess = new Chess({
                            player1: f1._id,
                            player2: f2._id
                        })
    
                        await chess.save()

                        const flowers = {
                            playRoom: chess._id,
                            gameType: data,
                            shape: shape[0],
                            playServer: playServer
                        }

                        const buquets = {
                            playRoom: chess._id,
                            gameType: data,
                            shape: shape[1],
                            playServer: playServer
                        }

                        io.to(player2.id).emit('invite', flowers)
                        return callback(buquets)
                    } else {
                        const tic = new Tic({
                            player1: f1._id,
                            player2: f2._id
                        })
    
                        await tic.save()

                        const flowers = {
                            playRoom: tic._id,
                            gameType: data,
                            shape: shape[0],
                            playServer: playServer
                        }
                        
                        // Add gameType

                        const buquets = {
                            playRoom: tic._id,
                            gameType: data,
                            shape: shape[1],
                            playServer: playServer
                        }


                        io.to(player2.id).emit('invite', flowers)
                        return callback(buquets)
                    }
                } catch (e) {
                    console.log(e)
                    return callback(e)
                }
            } else {
                callback({error: "No partner was found."})
            }
        }
        callback({error: 'No partner was found.'})
    })

    socket.on('nextRound', async (data) => {
        try {
            console.log(data)
            const {winner, error, nextPhase, gameType, tourID} =  await nextRound(data.name, data.tournamentID)
            if (error) {
                console.log(error)
            } else if (winner) {
                console.log("Winner: " + winner)
                io.to(getID(winner)).emit('winner', "Well done!")
            } else if (nextPhase) {
                // Distribution of rooms for next phase
                console.log("NextPhase: " + nextPhase)
                
                const tournament = await Tournament.findById(tourID)

                for(i=0;i<nextPhase.length;i+=2){
                    const f1 = await User.findByName(nextPhase[i])
                    const f2 = await User.findByName(nextPhase[i+1])

                    const playServer = findServer()

                    if (gameType === "chess"){
                        const chess = new Chess({
                            player1: f1._id,
                            player2: f2._id
                        })

                        await chess.save()
                        tournament.games.push(chess)
                        await tournament.save()

                        const flowers = {
                            playRoom: chess._id,
                            tournament: tournament._id,
                            gameType: gameType,
                            playServer: playServer
                        }

                        io.to(getID(nextPhase[i])).emit('tour-inv', flowers, shape[0])
                        io.to(getID(nextPhase[i+1])).emit('tour-inv', flowers, shape[1])


                    } else {
                        const tic = new Tic({
                            player1: f1._id,
                            player2: f2._id
                        })
    
                        await tic.save()
                        tournament.games.push(tic)
                        await tournament.save()

                        const flowers = {
                            playRoom: tic._id,
                            tournament: tournament._id,
                            gameType: gameType,
                            playServer: playServer
                        }

                        io.to(getID(nextPhase[i])).emit('tour-inv', flowers, shape[0])
                        io.to(getID(nextPhase[i+1])).emit('tour-inv', flowers, shape[1])
                    }

                }
    
    
            } else {
                console.log("Just an addition!")
            }
        } catch (e) {
            console.log(e)
        }
    })

    socket.on('disconnect', () => {
        try {
            const user = removeUser(socket.id)
            console.log(`[+] ${user.username} has disconnected!`)
        } catch (e) {
            // console.log(e)
        }
    })

    socket.on('test', () => {
        console.log("PlayMaster says hi in gameMaster!")
    })

})

app.get('/', (req, res) => {
    res.send('Game Master Service')
})

sockServer.listen(sockPort, () => {
    console.log(`Socket is up on port ${sockPort}!`)
})


zoo_con()

zoo_children((children, error)=> {

    if(error){
        console.log(error)
        return
    }

    if(typeof children === "undefined"){
        return
    }

    if(!children.includes("Playm1")) {
        playmasters = playmasters.filter((node) => node !== 3007)
    } else if(!playmasters.includes(3007)){
        playmasters.push(3007)
    }

    if(!children.includes("Playm2")) {
        playmasters = playmasters.filter((node) => node !== 3008)
    } else if(!playmasters.includes(3008)){
        playmasters.push(3008)
    }

    if(!children.includes("Playm3")) {
        playmasters = playmasters.filter((node) => node !== 3009)
    } else if(!playmasters.includes(3009)){
        playmasters.push(3009)
    }

    console.log(playmasters)
})

const findServer = () => {
    if (playmasters.length !== 0) {

        prep = playmasters[chosenOne]

        if (typeof prep === "undefined"){
            chosenOne = 0 
            prep = playmasters[chosenOne]
        }

        if(chosenOne === playmasters.length -1 || chosenOne >= playmasters.length){
            chosenOne = 0
        } else {
            chosenOne += 1
        }
        return prep
    }
}

app.use(express.json())
app.use(userRouter)


module.exports = app