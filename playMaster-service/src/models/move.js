const mongoose = require('mongoose')


const moveSchema = new mongoose.Schema({
    player: {
        type: String
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'User',
        // required: true
    }, 
    old_position: {
        type: String,
        required: true
    },
    new_position: {
        type: String,
        required: true
    }
},  {
    timestamps: true
},)

const Move = mongoose.model('Move', moveSchema)

module.exports = Move