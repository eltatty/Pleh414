const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')
const { getTournaments, getUsers } = require('../utils/room')

// Routes

router.get('/users', auth, async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/liveTournaments', auth, async (req, res) => {
    try {
        if(req.user.role !== "admin"){
            res.status(500).send("You have no power here!")
        } else {
            res.status(200).send(getTournaments())
        }
    } catch (e) {
        res.status(500).send(e)
    }
})


router.get('/liveUsers', auth, async (req, res) => {
    try {
        if(req.user.role !== "admin"){
            res.status(500).send("You have no power here!")
        } else {
            res.status(200).send(getUsers())
        }
    } catch (e) {
        res.status(500).send(e)
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