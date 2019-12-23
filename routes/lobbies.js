const express = require("express");
const router = express.Router();
const Lobby = require("../models/Lobby");
const League = require("../models/league");
const {
	Fixture
} = require("../models/fixture");
const request = require("request");
const mongoose = require("mongoose");
const {
	API_KEY
} = require("../variables.js");

const {
	User
} = require("../models/user");

//LIST ALL LOBBIES
router.get("/", async (req, res) => {
	const lobbies = await Lobby.find();
	res.send(lobbies);
});

//SUBMITS LOBBY
router.post("/", (req, res) => {
	const lobby = new Lobby({
		name: req.body.name
	});
	lobby
		.save()
		.then(data => {
			res.send(data);
		})
		.catch(err => {
			res.send(err);
		});
});

//LIST SPECIFIC LOBBY
router.get("/:lobbyId", async (req, res) => {
	const lobby = await Lobby.findById(req.params.lobbyId);
	if (!lobby) return res.status(404).send('Lobby does not exist!');

	res.status(200).send(lobby)
});

//DELETE LOBBY
router.delete("/:lobbyId", async (req, res) => {
	const removedLobby = await Lobby.remove({
		_id: req.params.lobbyId
	});
	res
		.send(removedLobby)
		.then()
		.catch(err => {
			res.send(err);
		});
});


//Add user to Lobby

router.put("/:lobbyName/add", async (req, res) => {
	const updatedLobby = await Lobby.find({
		name: req.params.lobbyName
	});

	updatedLobby[0].users.push(req.body.userID);

	updatedLobby[0]
		.save()
		.then(data => {
			res.send(data);
		})
		.catch(err => {
			res.send(err);
		});
});

//List users who belongs to lobby
router.get("/:lobbyID/users", async (req, res) => {
	const lobby = await Lobby.findById(req.params.lobbyID);
	if (!lobby) return res.status(404).send('Lobby does not exist!');


	const usersArray = [];
	const count = lobby.users.length;

	if (count == 0) {
		res.status(200).send("This lobby does not have users.")
	}
	for (i = 0; i < count; i++) {
		const oneUser = await User
			.findById(lobby.users[i])
			.select({
				name: 1,
				email: 1
			});

		usersArray.push(oneUser);
	}

	res.status(200).send(usersArray);
});

// Checking users bets
router.get("/:lobbyID/:fixtureID/check", async (req, res) => {

	const lobby = await Lobby.findById(req.params.lobbyID);
	const usersCount = lobby.users.length;
	const fixtureData = await Fixture.findOne({
		fixture_id: req.params.fixtureID
	});

	if (fixtureData.status == "Not Started") {
		return res.status(200).send("Match have not started yet!")
	}

	const returnArray = [];
	const fixtScore = fixtureData.score;

	for (i = 0; i < usersCount; i++) {
		let user = await User.findById(lobby.users[i]);

		const userLobbyBets = user.usersBets.find((elem) => {
			return elem.lobby == req.params.lobbyID;
		})
		const fixtureBet = userLobbyBets.bets.find(elem => {
			return elem.fixtureID == req.params.fixtureID
		}).fixtureBet;

		if (!fixtureBet) {
			const elem = new returnUser(user.name, "User didn't bet for this fixture", userLobbyBets.score);
			returnArray.push(elem);
		} else {
			const result = compareScore(fixtScore, fixtureBet, userLobbyBets);
			const elem = new returnUser(user.name, result, userLobbyBets.score);
			returnArray.push(elem);

		}
		await user.save().catch(err => {
			console.log(err);
		});
	}
	res.status(200).send(returnArray);
});

function returnUser(name, message, score) {
	this.name = name;
	this.message = message;
	this.score = score;
};
const compareScore = function (fixScore, userScore, user) {
	if (fixScore == userScore) {
		user.score += 3;
		return "Correct! You got 3 points!";
	} else
		return "Not this time";
}



module.exports = router;