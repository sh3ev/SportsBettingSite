const mongoose = require('mongoose');

const LobbySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	createdDate: {
		type: Date,
		default: Date.now
	},

	users: [{
		userID: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}, userName: String
	}]

});

module.exports = mongoose.model('Lobby', LobbySchema);
