const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
    player1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    player2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },  
    moves: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Move',
    }]
},  {
    timestamps: true
},)

const Game = mongoose.model('Game', gameSchema)

module.exports = Game