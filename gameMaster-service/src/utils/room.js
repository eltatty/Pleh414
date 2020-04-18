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

module.exports = {
    addUser,
    removeUser,
    getUser, 
    findToPlay
}

// addUser({
    // id: 22,
    // username: 'Fotis'
// })

// addUser({
//     id: 23,
//     username: 'Makis'
// })

// addUser({
//     id: 24,
//     username: 'Ed'
// })

// console.log(findToPlay(22))