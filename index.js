const MongoClient = require('mongodb');
const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const users = require('./routes/users');
const matches = require('./modules/matches');
const leauges = require('./routes/leagues');
const lobbies = require('./routes/lobbies');
const app = express();


app.use(express.urlencoded({
	extended: true
}));
app.use(express.json());
// ROUTES
app.use('/api/users', users);
app.use('/api/lobbies', lobbies);
app.get('/', (req, res) => {
	res.send('homepage');
});
app.use('/api/leagues', leauges);



// DB CONNECTION
mongoose.connect('mongodb+srv://jedrzej:1234@cluster0-pwyj2.mongodb.net/test?retryWrites=true&w=majority', {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => console.log('Connected to MongoDB...'))
	.catch(err => console.error('Could not connect to MongoDB...'));

// START LISTETING TO THE SERVER
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));