const mongoose = require('mongoose');
const {
  betSchema
} = require('./bet');



const usersBetSchema = new mongoose.Schema({

  lobby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lobby'
  },
  lobbyName: String,
  bets: [betSchema],
  score: {
    type: Number,
    default: 0,
  }

});


const UsersBet = mongoose.model('UsersBet', usersBetSchema);

exports.UsersBet = UsersBet;
exports.usersBetSchema = usersBetSchema;