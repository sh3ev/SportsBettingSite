const mongoose = require('mongoose');
const {fixtureSchema} = require('./fixture');


const LobbySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	createdDate: {
		type: Date,
		default: Date.now
	},
	users: {
		type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
	},
	fixtures: [fixtureSchema]
	
});

module.exports = mongoose.model('Lobby', LobbySchema);
