const express = require('express');
const router = express.Router();
const Lobby = require('../models/lobby');
const League = require('../models/league');
const Fixture = require('../models/fixture');
const request = require('request');
const mongoose = require('mongoose');

//LIST ALL LOBBIES
router.get('/', async (req, res) => {
	const lobbies = await Lobby.find();
	res.send(lobbies);
});

//SUBMITS LOBBY
router.post('/', (req, res) => {
	const lobby = new Lobby({
		name: req.body.name,

	});
	lobby.save()
		.then(data => {
			res.send(data);
		})
		.catch(err => {
			res.send(err);
		})
});

//LIST SPECIFIC LOBBY
router.get('/:lobbyId', async (req, res) => {
	const lobby = await Lobby.findById(req.params.lobbyId);
	res.send(lobby)
		.then()
		.catch(err => {
			res.send(err);
		})
});

//DELETE LOBBY
router.delete('/:lobbyId', async (req, res) => {
	const removedLobby = await Lobby.remove({
		_id: req.params.lobbyId
	});
	res.send(removedLobby)
		.then()
		.catch(err => {
			res.send(err);
		})
});

//UPDATE LOBBY
router.patch('/:lobbyId', async (req, res) => {
	const updatedLobby = await Lobby.updateOne({
		_id: req.params.lobbyId
	}, {
		$set: {
			name: req.body.name
		}
	});
	res.send(updatedLobby)
		.then()
		.catch(err => {
			res.send(err);
		})
});


//ADD MATCH TO LOBBY In progress
// nie działa nie widzi "Fixture" jako konstruktora

router.post('/:lobbyName/:leagueName/:date', async (req, res) => {
	const leagues = await League.find({
		name: req.params.leagueName
	}, {
		league_id: 1,
		_id: 0
	});
	var League_id = leagues.map(function (leagues) {
		return leagues.league_id
	});
	const date = req.params.date;

	let url = {
		method: 'GET',
		url: `https://api-football-v1.p.rapidapi.com/v2/fixtures/league/${League_id}/${date}`,
		headers: {
			'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
			'x-rapidapi-key': '0f5b02dfe7msh6c81fec732f7b8ep1803e9jsnd99f16bb485a'
		}
	};
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			let info = JSON.parse(body);
			let count = info.api.results;
			let fixtureArray = [];

			for (let i = 0; i = count - 1; i++) {
				let homeTeamNameVar = info.api.fixtures[i].homeTeam.teamName;
				let awayTeamNameVar = info.api.fixtures[i].awayTeam.teamName;
				let scoreVar = info.api.fixtures[i].score;
				let dateVar = info.api.fixtures[i].event_date;
				let statusVar = info.api.fixtures[i].status;

				let fixture = new Fixture ({ // <-- nie widzi tego jako konstruktora
					homeTeamName: homeTeamNameVar,
					awayTeamName: awayTeamNameVar,
					score: scoreVar,
					date: dateVar,
					status: statusVar
				});

				fixtureArray.push(fixture)
			}
			res.send(fixtureArray);
		}
	})

	// const lobby = new Lobby({
	// 	name: req.params.lobbyName,
	//  fixtures: fixtureArray
	// });
	// lobby.save()
	// 	.then(data => {
	// 		res.send(data);
	// 	})
	// 	.catch(err => {
	// 		res.send(err);
	// 	})
});



module.exports = router;