const mongoose = require('mongoose');

const fixtureSchema = new mongoose.Schema({
    homeTeamName: String,
    awayTeamName: String,
    score: String,
    date: Date,
    status: Boolean
});

const Fixture=mongoose.model('Fixture', fixtureSchema);
exports.Fixture;
exports.fixtureSchema;