const express = require('express');
const router = express.Router();
const Lobby = require('../models/lobby');
const League = require('../models/league');
const {
	Fixture
} = require('../models/fixture');
const request = require('request');
const mongoose = require('mongoose');
const {API_KEY} = require('../variables.js');




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
//Add user to Lobby

router.put('/:lobbyName/add', async(req,res) => {

const updatedLobby= await Lobby.find({name: req.params.lobbyName});

updatedLobby[0].users.push(req.body.userID);

updatedLobby[0].save()
		.then(data => {
			res.send(data);
		})
		.catch(err => {
			res.send(err);
		})


})



router.post('/:lobbyName/:leagueName/:date', async (req, res) => {

	const league = await League.find({
		name: req.params.leagueName
	});

	let lobby = await Lobby.find({
		name: req.params.lobbyName
	});
	lobby = lobby[0];
	var League_id = league[0].league_id;
	console.log(League_id);
	const date = req.params.date;

	var options = {
		method: 'GET',
		url: `https://api-football-v1.p.rapidapi.com/v2/fixtures/league/${League_id}/${date}`,
		headers: {
			'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
			'x-rapidapi-key': API_KEY
		}
	};

	let fixtureArray = [];
	request(options, function (error, response, body) {
		if (error)
			throw new Error(error);
		let info = JSON.parse(body);
		let count = info.api.results;
		for (let i = 0; i < count; i++) {
			let homeTeamNameVar = info.api.fixtures[i].homeTeam.team_name;
			let awayTeamNameVar = info.api.fixtures[i].awayTeam.team_name;
			let scoreVar = info.api.fixtures[i].score.fulltime;
			let dateVar = info.api.fixtures[i].event_date;
			let statusVar = info.api.fixtures[i].status;
			let fixture = new Fixture({
				homeTeamName: homeTeamNameVar,
				awayTeamName: awayTeamNameVar,
				score: scoreVar,
				date: dateVar,
				status: statusVar
			});
			fixtureArray.push(fixture);
		}
		lobby.fixtures = lobby.fixtures.concat(fixtureArray);
		lobby.save()
			.then(data => {
				res.send(data);
			})
			.catch(err => {
				res.send(err);
			});
	})
});



module.exports = router;