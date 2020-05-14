const User = require("../models/user")

const users = []
const tournaments = []


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
    getID
}


addUser({
    id: 1,
    username: "user1"
})


addUser({
    id: 2,
    username: "user2"
})

// addUser({
//     id: 3,
//     username: "user3"
// })

// addUser({
//     id: 4,
//     username: "user4"
// })

// addUser({
//     id: 5,
//     username: "user5"
// })

// addUser({
//     id: 6,
//     username: "user6"
// })

// addUser({
//     id: 7,
//     username: "user7"
// })

// addUser({
//     id: 8,
//     username: "user8"
// })

createTournament(findParticipants(1,2), "5eaee5ba09cfff36a553630e", "tic")


console.log(nextRound("user1", "5eaee5ba09cfff36a553630e"))
// nextRound("user2", "5eaee5ba09cfff36a553630e")
// nextRound("user3", "5eaee5ba09cfff36a553630e")
// nextRound("user4", "5eaee5ba09cfff36a553630e")
// // ///
// nextRound("user1", "5eaee5ba09cfff36a553630e")
// nextRound("user3", "5eaee5ba09cfff36a553630e")
// // // ///
// nextRound("user1", "5eaee5ba09cfff36a553630e")