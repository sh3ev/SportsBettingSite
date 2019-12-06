const MongoClient = require('mongodb');
const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const app = express();


app.use(express.urlencoded({
	extended: true
}));
app.use(express.json());


// IMPORT ROUTES
const users = require('./routes/users');
app.use('/api/users', users);

const lobbies = require('./routes/lobbies');
app.use('/api/lobbies', lobbies);


// ROUTES
app.get('/', (req, res) => {
	res.send('homepage');
});


// DB CONNECTION
mongoose.connect('mongodb+srv://jedrzej:1234@cluster0-pwyj2.mongodb.net/test?retryWrites=true&w=majority', {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => console.log('Connected to MongoDB...'))
	.catch(err => console.error('Could not connect to MongoDB...'));

// START LISTETING TO THE SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));