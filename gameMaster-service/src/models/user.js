const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true, 
        unique: true
    }, 
    email: {
        type: String,
        unique: true,
        required: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error ('Email is invalid.')
            }
        }
    }, 
    password: {
        type:String, 
        required: true,
        minlength:8,
        trim:true
    }, 
    age: {
        type: Number,
        default: 18,
        validate(value){
            if(value < 18) {
                throw new Error('You must be an adult.')
            }
        }
    },
    role: {
        type: String,
        default: "player",
        validate(value){
            if(value !== "player" && value !== "official" && value !== "admin") { 
                throw new Error('You must have a role.')
            }
        }
    },
    practice_wins: {
        type: Number,
        default: 0
    },
    practice_losses: {
        type: Number,
        default: 0
    },
    practice_ties: {
        type: Number,
        default: 0
    },
    practice_participations: {
        type: Number,
        default: 0
    },
    tournament_wins: {
        type: Number,
        default: 0
    },
    tournament_losses: {
        type: Number,
        default: 0
    },
    tournament_participations: {
        type: Number,
        default: 0
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
},  {
    timestamps: true
},)

userSchema.methods.generateAuthToken = async function() {
    const user = this

    const token = jwt.sign({ _id: user._id.toString() }, 'messithegoat')

    user.tokens = user.tokens.concat({token})
    await user.save()
    
    return token
}

userSchema.statics.findByName = async (name) => {
    const user = await User.findOne ({ name })

    if (!user) {
        throw new Error('Unable to find user')
    }

    return user
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to find email')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    
    if(!isMatch) {
        throw new Error('Unable to find match')
    }
    return user
}

userSchema.pre('save', async function (next) {
    const user = this
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User