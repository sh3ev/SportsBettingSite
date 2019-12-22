const _ = require('lodash');
const bcrypt = require('bcryptjs');
const { User, validate } = require('../models/user');
const express = require('express');
const router = express.Router();
 
router.post('/', async (req, res) => {
    // pierwsza walidacja
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
 
    // czy istnieje
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send('Użytkownik istnieje!');
    } else {
        // wstaw nowego
        /*user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });*/
        user = new User(_.pick(req.body, ['name', 'email', 'password'])); // lodash
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        // res.send(user); 
        res.send(_.pick(user, ['_id', 'name', 'email']));
    }
});
 
module.exports = router;
