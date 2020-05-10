// const socket = io()

// const io = require('socket.io-client')

const socket = io.connect("http://localhost:3006", {
    reconnection:true
})

socket.on('connect', function () {
    console.log('connected to localhost')
})

socket.on('message', (message) => {
    console.log(message)
})
socket.on('move_back', (message) => {
    console.log(message)
})

socket.on('second_move', (message) => {
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
    // data = {
    //     username: username, 
    //     room: "5e9b384938c2583de5b02ea5",
    //     gameType: "chess"
    // }
    // socket.emit('join', data, (error) => {
    //     if (error) {
    //         alert(error)
    //     }
    // })

    socket.emit('join', {username}, (error) => {
        if (error) {
            alert(error)
        }
    })
})

document.querySelector('#play').addEventListener('click', () => {
    console.log('Try to play')
    const game = document.getElementById('joker').value
    socket.emit('play', game, (message) => {
        console.log(message)
    })
})

document.querySelector('#create').addEventListener('click', () => {
    console.log('Try to create')
    socket.emit('create', (message) => {
        console.log(message)
    })
})


document.querySelector('#move').addEventListener('click', () => {
    console.log('Try to move')
    // const move = document.getElementById('joker').value
    // move = ["BQ", "BK", "WO", "BP", "WT", "WH", "WH", "BO", "BQ", "BK", "WO", "BP", "WT", "WH", "WH", "BO", "BQ", "BK", "WO", "BP", "WT", "WH", "WH", "BO", "BQ", "BK", "WO", "BP", "WT", "WH", "WH", "BO", "BQ", "BK", "WO", "BP", "WT", "WH", "WH", "BO", "BQ", "BK", "WO", "BP", "WT", "WH", "WH", "BO", "BQ", "BK", "WO", "BP", "WT", "WH", "WH", "BO", "BQ", "BK", "WO", "BP", "WT", "WH", "WH", "BO"]
    const move = ["@", "@", "@", "-", "O", "X", "O", "-", "O"]
    data = {
        move: move,
        room: "5e9b384938c2583de5b02ea5", 
        gameType: "tic",
        winner:'lklk'
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

    socket.emit('tour-play', (message) => {
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

    socket.emit('tour-move', data, (message) => {
        console.log(message)
    })
})
