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
	User
} = require("../models/user");
const verify = require("../middleware/verifyToken");
const config = require("config")
const API_KEY = config.get('ApiKey');
//LIST ALL LOBBIES
router.get("/", verify, async (req, res) => {
	const lobbies = await Lobby.find();
	res.send(lobbies);
});

//SUBMITS LOBBY
router.post("/", verify, (req, res) => {
	const lobby = new Lobby({
		name: req.body.name,
		users: [req.user._id]
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


//DELETE LOBBY
router.delete("/:lobbyId", verify, async (req, res) => {
	const removedLobby = await Lobby.remove({
		_id: req.params.lobbyId
	});
	res.send(removedLobby);
});


//Add user to Lobby

router.put("/:lobbyID/add", verify, async (req, res) => {
	const updatedLobby = await Lobby.findById(req.params.lobbyID);
	const user = await User.findOne({ email: req.body.email });

	updatedLobby.users.push(user._id);

	updatedLobby
		.save()
		.then(data => {
			res.send(data);
		})
		.catch(err => {
			res.send(err);
		});
});

//List users who belongs to lobby
router.get("/:lobbyID/users", verify, async (req, res) => {
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
				_id: 1,
				name: 1,
				email: 1
			});

		usersArray.push(oneUser);
	}

	res.status(200).send(usersArray);
});

// Checking users bets
router.get("/:lobbyID/:fixtureID/check", verify, async (req, res) => {

	const lobby = await Lobby.findById(req.params.lobbyID); // Znalezienie lobby
	const usersCount = lobby.users.length; // liczba użytkowników lobby
	const fixtureData = await Fixture.findOne({
		fixture_id: req.params.fixtureID
	}); // znalezienie meczu w bazie

	if (fixtureData.status == "Not Started") {
		return res.status(200).send("Match has not started yet!") // jezeli mecz sie jeszcze nie odbył, zwroc info
	}

	const returnArray = []; // tablica, ktora bedzie wysylana na koncu	
	const fixtScore = fixtureData.score; // przypisanie wyniku spotkania

	for (i = 0; i < usersCount; i++) { // dla każdego użytkownika.. 
		let user = await User.findById(lobby.users[i]); // znajdz uzytkownika w bazie

		const userLobbyBets = user.usersBets.find((elem) => {
			return elem.lobby == req.params.lobbyID; // znajdz bety tego uzytkownika dla tego lobby
		})
		if (!userLobbyBets) {
			const elem = new returnUser(user.name, "User didn't bet for this fixture", 0); // jezeli uzytkownik nie u siebie takiego lobby
			returnArray.push(elem);
			continue;
		}

		let fixtureBet = userLobbyBets.bets.find(elem => { // znajdz bet uzytkownika dla tego meczu
			return elem.fixtureID == req.params.fixtureID
		});
		if (!fixtureBet) { // jezeli nie ma betu dla tego meczu, zwroc info
			const elem = new returnUser(user.name, "User didn't bet for this fixture", userLobbyBets.score);
			returnArray.push(elem);
			continue;
		} else { // jezeli ma bet, porównać z realnym i dodaj do tablicy info z punktacja
			fixtureBet = fixtureBet.fixtureBet;
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

function returnUser(name, message, score) { // konstruktor do tablicy zwracanych uzytkownikow
	this.name = name;
	this.message = message;
	this.score = score;
};
const compareScore = function (fixScore, userScore, user) { // funkcja porownujaca bet uzytkownika z realnym
	if (fixScore == userScore) {
		user.score += 3;
		return "Correct! You got 3 points!";
	} else
		return "Not this time";
}



module.exports = router;