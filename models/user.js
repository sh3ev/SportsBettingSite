const Joi = require('joi');
const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 70,
        unique:true
      },
      password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 250,
        unique:true
      },
      lobbies: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Lobby'
      }
  }));
  function validateUser(user) {
    const schema = {
      name: Joi.string().min(2).max(50).required(),
      email: Joi.string().min(5).max(70).required().email(),
      password: Joi.string().min(5).max(255).required()
    };
  
    return Joi.validate(user, schema);
  }

  exports.User=User;
  exports.validate=validateUser;