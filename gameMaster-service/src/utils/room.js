// const User = require("../models/user")
// require("../db/mongoose")

const users = []
const tournaments = []
let server_games = []


const addUser = ({ id, username }) => {
    if (!id || !username ) {
        return {
            error: 'No valid data was provided!'
        }
    }

    const index = users.findIndex((element) => element.username === username)
    if (index !== -1){
        users[index].id = id
        console.log("Refreshed")
        const user = users[index]
        return  { user }
    }

    const user = {id, username}
    users.push(user)
    return { user }
}


const removeUser = (id) => {
    if (!id) {
        return {
            error: 'No valid data was provided!'
        }
    }
    const index = users.findIndex((user) => user.id === id)
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    if (!id) {
        return {
            error: 'No valid data was provided!'
        }
    }
    const index = users.findIndex((user) => user.id === id)
    if (index !== -1) {
        return {user: users[index]}
    } else {
        return {
            error: 'User not found!'
        }
    }
}

const getID = (name) => {
    if (!name){
        return {
            error: 'No valid data was provided!'
        }
    }
    const index = users.findIndex((user) => user.username === name)
    if (index !== -1) {
        return users[index].id
    } else {
        return {
            error: 'User not found!'
        }
    }
}

const findToPlay = (id) => {
    if (!id) {
        return {
            error: 'No valid data was provided!'
        }
    }
    if (users.length == 1) {
        return {
            error: 'Can`t play with yourself at this site!'
        }
    }
    const copy = users.filter((user) => user.id !== id)
    player2 = copy[Math.floor(Math.random() * copy.length)]
    return { player2 }
}

const getRoom = () => {
    return users.length
}

const findParticipants = (id, num) => {
    if (users.length === num) {
        return users
    }

    const participants = []

    participants[0] = users.find(user => {
        return user.id === id
    })

    const copy = users.filter((user) => user.id !== id)

    newLen = 1

    while (newLen < num) {
        tmp = copy[Math.floor(Math.random() * copy.length)]
        if (!participants.includes(tmp)) {
            participants.push(tmp)
            const index = copy.findIndex((user) => user.id === tmp.id)
            copy.splice(index, 1)
            newLen ++
        }
    }

    return participants
}

const createTournament = (participants, tournamentID, gameType) => {
    // Need to change because of refreshed
    const names = []
    participants.forEach(participant => names.push(participant.username))

    const tournament = {
        participants: names,
        tournamentID: JSON.stringify(tournamentID).replace(/['"]+/g, ''),
        phase: 1,
        gameType: gameType
    }
    tournaments.push(tournament)
    // console.log(tournament)
}

const getTournaments = () => {
    return { tournaments }
}

const getUsers = () => {
    return { users }
}

const nextRound = async (name, tourID) => {
    
    const ind = users.findIndex((user) => user.username === name)

    if(ind === -1) {
        return {
            error: "Can`t find user"
        }
    }

    const user = users[ind].username

    const index = tournaments.findIndex((tournament) => tournament.tournamentID === tourID )
    if (index === -1){
        return {
            error: "Can`t find tournament"
        }
    }

    if(tournaments[index].participants.length === Math.pow(2, tournaments[index].phase)) {

        // Participations wins losses
        try {

            for (i=0;i<tournaments[index].participants.length;i++){
                const joker = await User.findByName(tournaments[index].participants[i])

                if (user === tournaments[index].participants[i]){
                    joker.tournament_participations += 1
                    joker.tournament_wins += 1
                    await joker.save()
                }


                joker.tournament_participations += 1
                joker.tournament_losses += 1
                await joker.save()
            }
             

        } catch (error) {
            return {error}
        }

        return {
            winner: user
        }
    }

    const current = "phase" + tournaments[index].phase

    // Create phase array or push user into existing
    if (typeof tournaments[index][current] === "undefined"){
        const qualified = []
        qualified.push(user)
        tournaments[index][current] = qualified
    } else {
        tournaments[index][current].push(user)
    }

    if (tournaments[index].phase === 1){
        if(tournaments[index][current].length === tournaments[index].participants.length / 2){
            tournaments[index].phase += 1
            return {
               nextPhase: tournaments[index][current],
               gameType: tournaments[index].gameType,
               tourID: tournaments[index].tournamentID
            }
        }
    } else {
        const tmp = tournaments[index].phase - 1
        const prevPhase = "phase" + tmp
        if ( tournaments[index][current].length  === tournaments[index][prevPhase].length / 2){
            tournaments[index].phase += 1
            return {
                nextPhase: tournaments[index][current],
                gameType: tournaments[index].gameType,
                tourID: tournaments[index].tournamentID
            }
        }
    }
}


const serverTrack = (gameID, server, type, opt) => {

    if(opt === 1){
        return server_games
    } else if(opt === 2){
        server_games = server_games.filter((element) => element.server !== server)
    } else {
        const pair = {gameID, type, server}
        server_games.push(pair)
    }
}

module.exports = {
    addUser,
    removeUser,
    getUser, 
    findToPlay,
    getRoom,
    findParticipants,
    createTournament,
    nextRound,
    getTournaments,
    getUsers,
    getID, 
    serverTrack
}

// serverTrack("3r13f", 3007, null)
// serverTrack("3213f", 3008, null)
// serverTrack("3d13f", 3007, null)
// serverTrack("3f13f", 3008, null)
// serverTrack("3g13f", 3007, null)
// serverTrack("3113f", 3007, null)

// console.log(serverTrack(null, null, 1))

// console.log("========================")


// serverTrack(null, 3007, 2)
// console.log(serverTrack(null, null, 1))