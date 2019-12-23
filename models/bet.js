const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
    fixtureID: String,
    fixtureBet: String
})


const Bet = mongoose.model('Bet', betSchema);

exports.Bet = Bet;
exports.betSchema = betSchema;