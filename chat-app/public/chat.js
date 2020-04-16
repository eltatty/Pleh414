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

socket.on('invite', (message) => {
    // console.log(message + ' wants to play!')
    console.log(message)
})

document.querySelector('#join').addEventListener('click', () => {
    console.log('Try to join')
    const username = document.getElementById('username').value
    console.log(username)
    socket.emit('join', { username }, (error) => {
        if (error) {
            alert(error)
        }
    })
})

document.querySelector('#play').addEventListener('click', () => {
    console.log('Try to play')
    socket.emit('play', (message) => {
        console.log(message)
    })
})

