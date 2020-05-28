const Chess = require('../models/chess')
const Tic = require('../models/tic')
const User = require('../models/user')

const repairs = []

const repair = (data, sockID) => {
    const index = repairs.findIndex((element) => element.data.room === data.room)
    if(index == -1){
        const values = {data, sockID}
        repairs.push(values)
        return 1
    } else {
        if(data.play === 0 && repairs[index].data.play === 0){
            repairs.splice(index, 1)[0]
            return 1
        } else if(data.play !== 0){
            repairs.splice(index, 1)[0]
            return sockID
        } else {
            const ask = repairs[index].sockID 
            repairs.splice(index, 1)[0]
            return ask
        }
    }
}

const trade = async (data, game, tour) => {
    try {
        if(data.winner !== ''){

            const user = await User.findByName(data.winner)

            if (user._id.equals(game.player1)){
                game.winner = user.name
                const us2 = await User.find({ "_id" : game.player2 })
                // console.log(us2.name)
                game.loser = us2[0].name

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
                game.winner = user.name
                const us2 = await User.find({ "_id" : game.player1 })
                // console.log(us2[0].name)
                game.loser = us2[0].name

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


module.exports = {
    trade,
    repair
}
