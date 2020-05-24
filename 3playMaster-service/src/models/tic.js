const mongoose = require('mongoose')

const ticSchema = new mongoose.Schema({
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    }, 
    loser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    }
},  {
    timestamps: true
},)

const Tic = mongoose.model('Tic', ticSchema)

module.exports = Tic