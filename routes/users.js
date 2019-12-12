const {
  User,
  validate
} = require('../models/user');
const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
  const users = await User.find().sort('name');
  res.send(users);
});




router.post('/', (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  })

  user.save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.send(err);
    })
});
module.exports = router;