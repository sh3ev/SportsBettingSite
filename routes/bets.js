const express = require('express');
const mongoose = require('mongoose');
const usersBet = require('../models/usersBet');
const router = express.Router();


//Save new user's bet
router.post('/', (req, res) => {
	const bet = new usersBet({
        lobbyID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lobby'
          },
          fixtureID: req.body.fixtureID,
          homeTeamScore: req.body.homeTeamScore,
          awayTeamScore: req.body.awayTeamScore      
	});
	bet.save()
		.then(data => {
			res.send(data);
		})
		.catch(err => {
            res.send(err);
		})
});

module.exports = router;