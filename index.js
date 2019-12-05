const MongoClient = require('mongodb');
const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const users = require('./routes/users');
const app = express();


mongoose.connect('mongodb+srv://przemek:1234@cluster0-pwyj2.mongodb.net/test?retryWrites=true&w=majority',{ useNewUrlParser: true,  useUnifiedTopology: true} )
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/users', users);
app.get('/', (req, res) => {
    res.send('homepage');
});

app.get('/api/lobbies', (req, res) => {
    res.send('lobbies');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));