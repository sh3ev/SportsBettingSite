// 1. model - users need a model to mapout schema
// A Schema defines the shape of documents within a collection in MongoDB
// model is instance of schema (klasa -> obiekt)

// step 1 create a user model

//deklaracja modules
const Joi = require('joi');
const mongoose = require('mongoose');
 
//user schema model
const User = mongoose.model('User', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    }
}));
 //walidacja
function validateUser(user) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(50).required().email(),
        password: Joi.string().min(5).max(1024).required()
    };
    return Joi.validate(user, schema);
}
 
exports.User = User;
exports.validate = validateUser;