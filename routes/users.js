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
router.put('/bets/:id', async (req, res) => {

  const user = await User.findById(req.params.id);
  const FixtureID = req.body.fixtureID;
  const userNewBet = req.body.bet;
  const lobbyID = req.body.lobbyID;


  const newBet = new Bet({
    fixtureID: FixtureID,
    fixtureBet: userNewBet
  })

  const previousBets = user.usersBets.find((elem) => {
    return elem.lobby == lobbyID;
  })
  if (!previousBets) {
    const betsArray = [newBet];
    const newUserBet = new UsersBet({
      lobby: lobbyID,
      bets: betsArray,
    })

    user.usersBets.push(newUserBet);
    await user.save().
    then(data =>
        res.send(data))
      .catch(err =>
        res.send(err));
  } else {
    const prevoiusIndex = user.usersBets.findIndex(elem => {
      return elem.lobby == lobbyID;
    })

    user.usersBets[prevoiusIndex].bets.push(newBet);
    await user.save().
    then(data =>
        res.send(data))
      .catch(err =>
        res.send(err));

  }



})
module.exports = router;