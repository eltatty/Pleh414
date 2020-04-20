const Chess = require('../models/chess')
const Tic = require('../models/tic')
const User = require('../models/user')

const trade = async (data, game) => {

    try {
        if(data.winner){

            const user = await User.findByName(data.winner) 

            if (user._id.equals(game.player1)){
                game.winner = game.player1
                game.loser = game.player2
                game.grid = data.move

                await game.save()

            } else {
                game.winner = game.player2
                game.loser = game.player1
                game.grid = data.move

                await game.save()
            }
        }

    } catch (e) {
        console.log(e)
    }

}


module.exports = trade



