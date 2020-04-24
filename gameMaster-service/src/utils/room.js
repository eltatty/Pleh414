const users = []


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

module.exports = {
    addUser,
    removeUser,
    getUser, 
    findToPlay,
    getRoom,
    findParticipants
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

// // addUser({
// //     id: 5,
// //     username: "user5"
// // })

// // console.log(users)

// findParticipants(1,4)