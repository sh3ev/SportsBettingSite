const mongoose = require('mongoose');



const usersBetSchema = new mongoose.Schema({
    lobbyID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lobby'
    },
    fixtureID:String,
    score: String
    
    })


const UsersBet = mongoose.model('UsersBet', usersBetSchema);

exports.UsersBet=UsersBet;
exports.usersBetSchema=usersBetSchema;
