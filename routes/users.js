const {User, validate} = require('../models/user');
const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    const users = await User.find().sort('name');
    res.send(users);
  });


module.exports = router;