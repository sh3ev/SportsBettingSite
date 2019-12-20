const mongoose = require('mongoose');

const fixtureSchema = new mongoose.Schema({
    fixture_id: Number,
    homeTeamName: String,
    awayTeamName: String,
    score: String,
    date: String,
    status: String
});

const Fixture=mongoose.model('Fixture', fixtureSchema);
module.exports.Fixture=Fixture;
module.exports.fixtureSchema=fixtureSchema;
