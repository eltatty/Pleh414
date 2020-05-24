const Chess = require('../models/chess')
const Tic = require('../models/tic')
const User = require('../models/user')

const trade = async (data, game, tour) => {
    try {
        if(data.winner !== ''){

            const user = await User.findByName(data.winner)

            if (user._id.equals(game.player1)){
                game.winner = game.player1
                game.loser = game.player2

                if(!tour){

                    // Might Change
                    const usID = await User.find({ "_id" : game.player2 })
                    const user2 = await User.findById(usID)
                    user.practice_participations += 1
                    user2.practice_participations += 1
                    user.practice_wins += 1
                    user2.practice_losses += 1
                    await user.save()
                    await user2.save()
                }
                

            } else {
                game.winner = game.player2
                game.loser = game.player1

                if(!tour){

                    // Might change
                    const usID = await User.find({ "_id" : game.player1 })
                    const user2 = await User.findById(usID)
                    user.practice_participations += 1
                    user2.practice_participations +=1 
                    user.practice_wins += 1
                    user2.practice_losses += 1
                    await user.save()
                    await user2.save()
                }
            }
        }

        game.grid = data.move

        await game.save()

    } catch (e) {
        console.log(e)
    }

}


module.exports = trade



