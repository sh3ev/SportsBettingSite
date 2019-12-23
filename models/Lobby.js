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
	users: {
		type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
	}
});

module.exports = mongoose.model('Lobby', LobbySchema);
