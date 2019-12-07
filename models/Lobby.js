const mongoose = require('mongoose');

const LobbySchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	createdDate: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Lobby', LobbySchema);