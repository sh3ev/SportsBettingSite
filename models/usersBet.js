const mongoose = require('mongoose');



const usersBetSchema = new mongoose.Schema({
    lobbyID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lobby'
    },
    fixtureID:String,
    homeTeamScore: Number,
    awayTeamScore: Number
    
    });


const UsersBet = mongoose.model('UsersBet', usersBetSchema);

exports.UsersBet=UsersBet;
exports.usersBetSchema=usersBetSchema;
