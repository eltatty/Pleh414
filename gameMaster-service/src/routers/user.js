const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')
const Chess = require('../models/chess')
const Tic = require('../models/tic')
const { getTournaments, getUsers, serverTrack } = require('../utils/room')

// Routes

router.get('/users', auth, async (req, res) => {
    try {
        const users = await User.find({}, {name:1, _id:0})
        res.send(users)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/liveTournaments', auth, (req, res) => {
    try {
        if(req.user.role !== "admin"){
            res.status(500).send("You have no power here!")
        } else {
            res.status(200).send(getTournaments())
        }

        res.status(200).send(getTournaments())
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/chesses', auth, async (req, res) => {
    try {

        const games = await Chess.find({}, {winner:1, loser:1, _id:0}).or([{player1: req.user._id}, {player2: req.user._id}]).lean()


        clean_games = games.filter((game) => typeof game.winner !== "undefined")

        clean_games.forEach((game) => {
            if (req.user.name === game.winner){
                game.outcome = "Win"
            } else {
                game.outcome = "Loss"
            }
        })

        res.status(200).send(clean_games)
    } catch (e) {
        console.log(e)
    }
})

router.get('/tics', auth, async (req, res) => {
    try {

        const games = await Tic.find({}, {winner:1, loser:1, _id:0}).or([{player1: req.user._id}, {player2: req.user._id}]).lean()

        clean_games = games.filter((game) => typeof game.winner !== "undefined")

        clean_games.forEach((game) => {
            if (req.user.name === game.winner){
                game.outcome = "Win"
            } else {
                game.outcome = "Loss"
            }
        })

        res.status(200).send(clean_games)
    } catch (e) {
        console.log(e)
    }
})

router.get('/liveUsers', auth, (req, res) => {
    try {
        // if(req.user.role !== "admin"){
        //     res.status(500).send("You have no power here!")
        // } else {
        //     res.status(200).send(getUsers())
        // }
        const data = []
        package = getUsers()
        package.users.forEach((pair) => {
            data.push(pair.username)
        })
        res.status(200).send(data)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/userInfo/:name', auth, async (req, res) => {
    try {
        const sub = await User.findByName(req.params.name)
        if (!sub) {
            res.status(500).send("User not found.")
        }

        if (req.user.name !== sub.name && req.user.role !== "admin"){
            res.status(500).send("You have no power here!")
        }

        const answer = {
            name: sub.name,
            age: sub.age,
            email: sub.email,
            created: sub.createdAt
        }

        res.status(200).send(answer)

    } catch (e) {
        res.status(500).send()
    }
})

router.get('/userStats/:name', auth, async (req, res) => {
    try {
        const sub = await User.findByName(req.params.name)
        if (!sub) {
            res.status(500).send("User not found.")
        }

        if (req.user.name !== sub.name && req.user.role !== "admin"){
            res.status(500).send("You have no power here!")
        }

        const answer = {
            prct_parts: sub.practice_participations,
            prct_wins: sub.practice_wins,
            prct_losses: sub.practice_losses,
            tour_parts: sub.tournament_participations,
            tour_wins: sub.tournament_wins,
            tour_losses: sub.tournament_losses    
        }

        res.status(200).send(answer)

    } catch (e) {
        res.status(500).send()
    }
})

router.get('/server_games', auth, async (req, res) => {
    if(req.user.role !== "admin"){
        res.status(500).send("You have no power here!")
    } else {
        const answer = serverTrack(null, null, 1)
        res.status(200).send(answer)
    }
})


router.post('/deleteUser', auth, async (req, res) => {
    try {

        if(req.user.role !== "admin"){
            res.status(500).send("You have no power here!")
        }

        const sub = await User.findByName(req.body.name)

        if(!sub){
            res.status(500).send("Can`t find user")
        } else if (sub.name === req.user.name) {
            res.status(500).send("No suicides here.")
        } else if(sub.role === "admin"){
            res.status(500).send("Can`t delete another admin.")
        } else {
            const answer = await User.findByIdAndRemove(sub._id)
            res.status(200).send("User with name " + answer.name + " deleted successfully.")
        }

    } catch (e) {
        res.status(500).send()
    }
})

router.post('/role', auth, async (req, res) => {
    try {
        // console.log(req.body)
        if(req.user.role !== "admin"){
            res.status(500).send("You have no power here!")
        }

        const sub = await User.findByName(req.body.name)

        if (sub.role === "admin" || req.user.name === req.body.name){
            res.status(500).send("Can`t change")
        }

        if (req.body.role !== "admin" && req.body.role !== "official" && req.body.role !== "player"){
            res.status(500).send("Invalid role!")
        }

        const answer = await User.findById(sub._id)
        answer.role = req.body.role
        await answer.save()

        res.status(200).send({name: answer.name, role: answer.role})
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.status(200).send("Logged out successfully!")
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router