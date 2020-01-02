const config = require('config');
const MongoClient = require('mongodb');
const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const users = require('./routes/users');
const leauges = require('./routes/leagues');
const lobbies = require('./routes/lobbies');
const fixtures = require('./routes/fixtures');
const authRoute = require('./routes/auth');
const app = express();
var cors = require('cors');
require('./routes/prod')(app);

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined');
  process.exit(1);
} else if (!config.get('ApiKey')) {
  console.error('FATAL ERROR: Api Key is not defined');
  process.exit(1);
}

app.use(cors({ 'Access-Control-Expose-Headers': 'X-Content-Range' }));
app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(express.json());
app.use('/api/user', authRoute);
app.use('/api/users', users);
app.use('/api/lobbies', lobbies);
app.use('/api/leagues', leauges);
app.use('/api/fixtures', fixtures);

// DB CONNECTION
mongoose
  .connect(
    'mongodb+srv://przemek:1234@cluster0-pwyj2.mongodb.net/test?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

// START LISTETING TO THE SERVER
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));
