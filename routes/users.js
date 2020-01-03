const _ = require('lodash');
const bcrypt = require('bcryptjs');
const {
  User,
  validate
} = require('../models/user');
const express = require('express');
const router = express.Router();
const {
  Bet
} = require('../models/bet');
const {
  UsersBet
} = require('../models/usersBet');
const verify = require("../middleware/verifyToken");
const Lobby = require("../models/Lobby");


router.get('/me', verify, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);

})
router.post('/', async (req, res) => {
  // pierwsza walidacja
  const {
    error
  } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // czy istnieje
  let user = await User.findOne({
    email: req.body.email
  });
  if (user) {
    return res.status(400).send('Użytkownik istnieje!');
  } else {

    user = new User(_.pick(req.body, ['name', 'email', 'password'])); // lodash
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    res.send(_.pick(user, ['_id', 'name', 'email']));
  }
});
//Add bets to user
router.put('/bets/', verify, async (req, res) => {

  const user = await User.findById(req.user._id); //znajdz uzytkownika w bazie
  const FixtureID = req.body.fixtureID; // przypisanie wartosci z body
  const userNewBet = req.body.bet;
  const lobbyID = req.body.lobbyID;
  let lobbyName = await Lobby.findById(lobbyID);
  lobbyName = lobbyName.name;
  const newBet = new Bet({ // utworzenie nowego modelu Bet
    fixtureID: FixtureID,
    fixtureBet: userNewBet
  })

  const previousBets = user.usersBets.find((elem) => { // sprawdza, czy uzytkownik ma juz bety dla tego lobby
    return elem.lobby == lobbyID;
  })
  if (!previousBets) { // jezeli nie, tworzy nowa tablice z betami, oraz model dla betow dla danego lobby
    const betsArray = [newBet];
    const newUserBet = new UsersBet({
      lobby: lobbyID,
      lobbyName: lobbyName,
      bets: betsArray,
    })

    user.usersBets.push(newUserBet); //dodaje model dla betow do tablicy
    await user.save(). // save i koniec
      then(data =>
        res.send(data))
      .catch(err =>
        res.send(err));
  } else { // jezeli ma bety dla tego lobby,
    const lobbyIndex = user.usersBets.findIndex(elem => {
      return elem.lobby == lobbyID;
    }) //wyszukuje indeks danego lobby w tablicy


    const fixtureIndex = user.usersBets[lobbyIndex].bets.findIndex(elem => { // sprawdz, czy jest juz bet dla tego meczu
      return elem.fixtureID == FixtureID;
    })
    if (fixtureIndex != -1) // jesli jest, update
      user.usersBets[lobbyIndex].bets[fixtureIndex] = newBet;
    else //jesli nie, dodaj nowy bet
      user.usersBets[lobbyIndex].bets.push(newBet); // dodaje nowy bet i save



    await user.save().
      then(data =>
        res.send(data))
      .catch(err =>
        res.send(err));

  }



})
module.exports = router;