const mongoose = require('mongoose');

const leaugeSchema = mongoose.Schema({
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