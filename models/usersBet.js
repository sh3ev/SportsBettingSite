const mongoose = require('mongoose');
const {
  betSchema
} = require('./bet');



const usersBetSchema = new mongoose.Schema({

  lobby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lobby'
  },
  bets: [betSchema],
  score: Number

});


const UsersBet = mongoose.model('UsersBet', usersBetSchema);

exports.UsersBet = UsersBet;
exports.usersBetSchema = usersBetSchema;