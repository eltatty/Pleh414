const users = []
const tournaments = []


const addUser = ({ id, username }) => {
    if (!id || !username ) {
        return {
            error: 'No valid data was provided!'
        }
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
    console.log(tournament)
}

const nextRound = (user, tournamentID) => {
    const index = tournaments.findIndex((tournament) => tournament.tournamentID === tournamentID )
    if (index === -1){
        return {
            error: "Can`t find tournament"
        }
    }

    if(Math.sqrt(tournaments[index].participants.length) === tournaments[index].phase) {
        console.log("Winner")
        return {
            winner: user
        }
    }

    const current = "phase" + tournaments[index].phase

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
        }
    } else {
        const tmp = tournaments[index].phase - 1
        const prevPhase = "phase" + tmp
        if (tournaments[index][prevPhase].length === tournaments[index][current].length / 2){
            tournaments[index].phase += 1
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
    nextRound
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


// createTournament(findParticipants(1,4), "firstTournament")
// createTournament(findParticipants(2,4), "secondTournament")
// nextRound(users[0], "secondTournament")
// nextRound(users[1], "secondTournament")
// console.log(nextRound(users[1], "secondTournament"))
// console.log("\n\n\n")
// console.log(tournaments[1])