const Joi = require('joi');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const {
    User
} = require('../models/user');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('config');


router.post('/login', async (req, res) => {
    // pierwsza walidacja
    const {
        error
    } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    //  szukanie usera po emailu
    const user = await User.findOne({
        email: req.body.email
    });
    if (!user) {
        return res.status(400).send('Nieprawidłowy email lub hasło.');
    }

    // walidacja
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).send('Nieprawidłowy email lub hasło.');
    }

    // Create and assign a token
    const token = jwt.sign({
        _id: user._id
    }, config.get('jwtPrivateKey'));
    res.header('x-auth-token', token);

    res.send("Logged in !");
});

function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };

    return Joi.validate(req, schema);
}

module.exports = router;