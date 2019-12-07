// Tworzyć crud dla lig?

const express = require('express');
const router = express.Router();
const League = require('../models/leagues');
const mongoose = require('mongoose');

router.get('/', async(req, res) => {
	const leagues = await League.find();
	res.send(leagues);
});

router.post('/', (req, res) => {
	const league = new League({
        _id: new mongoose.Types.ObjectId(),
        league_id: req.body.league_id,
		name: req.body.name,
	});
	league.save()
		.then(data => {
			res.send(data);
		})
		.catch(err => {
			res.send(err);
		})
});

module.exports = router;