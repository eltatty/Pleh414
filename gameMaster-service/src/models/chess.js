const mongoose = require('mongoose')

const chessSchema = new mongoose.Schema({
    player1: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' 
    }, 
    player2: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' 
    }, 
    grid: [{
        type: String
    }],
    moves: {
        type: Number
    }, 
    winner: {
        type: mongoose.Schema.Types.String,
        ref: 'User',
        field: 'name' 
    }, 
    loser: {
        type: mongoose.Schema.Types.String,
        ref: 'User',
        field: 'name'
    }
},  {
    timestamps: true
},)

const Chess = mongoose.model('Chess', chessSchema)

module.exports = Chess