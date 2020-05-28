// const socket = io()

// const io = require('socket.io-client')

const socket = io.connect("http://localhost:3007", {
    reconnection:true
})

socket.on('connect', function () {
    console.log('connected to localhost')
})

socket.on('message', (message) => {
    console.log('3006 ==> ')
    console.log(message)
})

socket.on('new_server', (message) => {
    console.log("Got you fam!")
    console.log(message)
})

socket.on('move_back', (message) => {
    console.log(message)
})

socket.on('first_move', (message) => {
    console.log(message)
})

socket.on('invite', (message) => {
    // console.log(message + ' wants to play!')
    console.log(message)
})

socket.on('tour-inv', (flowers, shape) => {
    console.log("Tournament invitation: ")
    console.log(flowers.playRoom)
    console.log(flowers.tournament)
    console.log(shape)
})

document.querySelector('#join').addEventListener('click', () => {
    console.log('Try to join')
    const username = document.getElementById('joker').value
    console.log(username)
    data = {
        username: username, 
        room: "5ece5c8fdeeee2192738acb9",
        gameType: "chess",
        play: 0
    }
    socket.emit('join', data, (error) => {
        if (error) {
            alert(error)
        }
    })

    // socket.emit('join', {username}, (error) => {
    //     if (error) {
    //         alert(error)
    //     }
    // })
})

document.querySelector('#play').addEventListener('click', () => {
    console.log('Try to play')
    const game = document.getElementById('joker').value
    socket.emit('play', game, (message) => {
        console.log(message)
    })
})

document.querySelector('#create').addEventListener('click', () => {
    console.log('Try to join')
    const username = document.getElementById('joker').value
    console.log(username)
    data = {
        username: username, 
        room: "5ece5c8fdeeee2192738acb9",
        gameType: "chess",
        play: 1
    }
    socket.emit('join', data, (error) => {
        if (error) {
            alert(error)
        }
    })
})


document.querySelector('#move').addEventListener('click', () => {
    console.log('Try to move')
    // const move = document.getElementById('joker').value
    // move = ["BQ", "BK", "WO", "BP", "WT", "WH", "WH", "BO", "BQ", "BK", "WO", "BP", "WT", "WH", "WH", "BO", "BQ", "BK", "WO", "BP", "WT", "WH", "WH", "BO", "BQ", "BK", "WO", "BP", "WT", "WH", "WH", "BO", "BQ", "BK", "WO", "BP", "WT", "WH", "WH", "BO", "BQ", "BK", "WO", "BP", "WT", "WH", "WH", "BO", "BQ", "BK", "WO", "BP", "WT", "WH", "WH", "BO", "BQ", "BK", "WO", "BP", "WT", "WH", "WH", "BO"]
    const move = ["@", "@", "@", "-", "O", "X", "O", "-", "O"]
    data = {
        move: move,
        room: "5ece5c8fdeeee2192738acb9", 
        gameType: "chess",
        winner: "user1"
    }
    socket.emit('move', data, (message) => {
        console.log(message)
    })
})

document.querySelector('#tour').addEventListener('click', () => {
    console.log('Try to tournament')

    const data = {
        username: "user1",
        participants: 2,
        gameType: "tic"
    }

    socket.emit('tournament', data, (message) => {
        console.log(message)
    })
})

document.querySelector('#test').addEventListener('click', () => {
    console.log('Try to test')

    socket.emit('playTest', (message) => {
        console.log(message)
    })
})

document.querySelector('#tour-move').addEventListener('click', () => {
    console.log('Tour-Move')
    const move = ["@", "@", "@", "-", "O", "X", "O", "-", "O"]
    data = {
        move: move,
        room: "5eb829ceaa43e1779f143e6c", 
        tournament: '5eb829ceaa43e1779f143e67',
        gameType: "tic",
        winner: "user1"
    }

    socket.emit('move', data, (message) => {
        console.log(message)
    })
})
