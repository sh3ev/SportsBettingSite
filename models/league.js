const mongoose = require('mongoose');

const leaugeSchema = new mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	league_id: {
		type: Number,
		required: true
    },
    name: {
		type: String,
		required: true
    },
    country: {
		type: String
    }
});

module.exports = mongoose.model('Leauge', leaugeSchema);