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

const createTournament = (participants, tournamentID) => {

    const tournament = {
        participants: participants,
        tournamentID: tournamentID,
        phase: 1
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

const nextRound = (name, tourID) => {
    const ind = users.findIndex((user) => user.username === name)
    const user = users[ind]

    console.log("TourID: " + tourID)
    console.log("Tour[0].tourID: " + tournaments[0].tournamentID)
    console.log(tournaments[0].tournamentID === tourID)

    const index = tournaments.findIndex((tournament) => tournament.tournamentID === tourID )
    if (index === -1){
        return {
            error: "Can`t find tournament"
        }
    }

    if(tournaments[index].participants.length === Math.pow(2, tournaments[index].phase)) {
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
               nextPhase: tournaments[index][current]
            }
        }
    } else {
        const tmp = tournaments[index].phase - 1
        const prevPhase = "phase" + tmp
        if ( tournaments[index][current].length  === tournaments[index][prevPhase].length / 2){
            tournaments[index].phase += 1
            return {
                nextPhase: tournaments[index][current]
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
    getUsers
}


// addUser({
//     id: 1,
//     username: "user1"
// })

// addUser({
//     id: 2,
//     username: "user2"
// })

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

// createTournament(findParticipants(1,8), "5eaee5ba09cfff36a553630e")
// console.log(nextRound("user1", "5eaee5ba09cfff36a553630e"))
// console.log(nextRound("user2", "5eaee5ba09cfff36a553630e"))
// console.log(nextRound("user3", "5eaee5ba09cfff36a553630e"))
// console.log(nextRound("user4", "5eaee5ba09cfff36a553630e"))
// // ///
// console.log(nextRound("user1", "5eaee5ba09cfff36a553630e"))
// console.log(nextRound("user3", "5eaee5ba09cfff36a553630e"))
// // ///
// console.log(nextRound("user1", "5eaee5ba09cfff36a553630e"))
// // console.log(tournaments[0])
// // console.log("\n\n\n")
// // console.log(tournaments[1])