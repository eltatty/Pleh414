const mongoose = require('mongoose')

const TournamentSchema = new mongoose.Schema({
    gameType: {
        type: String,
        required: true,
        validate(value){
            if (value !== "chess" && value !== "tic"){
                throw new Error('Invalid game type.')
            }
        }
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    }],
    games: [{
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'onModel'
    }],
    onModel: {
        type: String,
        enum: ['Tic', 'Chess']
    }
},  {
    timestamps: true
},)

const Tournament = mongoose.model('Tournament', TournamentSchema)

module.exports = Tournament