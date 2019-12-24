const MongoClient = require("mongodb");
const Joi = require("joi");
const mongoose = require("mongoose");
const express = require("express");
const users = require("./routes/users");
const leauges = require("./routes/leagues");
const lobbies = require("./routes/lobbies");
const fixtures = require("./routes/fixtures");
const authRoute = require("./routes/auth");
const app = express();
var cors = require('cors')

app.use(cors())
app.use(
	express.urlencoded({
		extended: true
	})
);
app.use(express.json());
app.use("/api/user", authRoute);
app.use("/api/users", users);
app.use("/api/lobbies", lobbies);
app.use("/api/leagues", leauges);
app.use("/api/fixtures", fixtures);

// DB CONNECTION
mongoose
	.connect(
		"mongodb+srv://przemek:1234@cluster0-pwyj2.mongodb.net/test?retryWrites=true&w=majority", {
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
	)
	.then(() => console.log("Connected to MongoDB..."))
	.catch(err => console.error("Could not connect to MongoDB..."));

// START LISTETING TO THE SERVER
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));

//Paulina - function getting scores and points when button clicked
// 1. Input values and press 'Submit my bet' button
// 2. Then press 'Check stats' button
// 3. Then press 'Show my points' button

// let result;
// let userBet;
// let userPoints = [];
// let awayTeamScore;
// let homeTeamScore;

// const aTeamScore = document.getElementById('team-a');
// const hTeamScore = document.getElementById('team-b');
// const submit = document.getElementById('submit');
// const info = document.getElementById('info');
// const checkStats = document.getElementById('checkStats');
// const showPoints = document.getElementById('showPoints');

//     submit.addEventListener('click', () => {
//         if(aTeamScore.value === '' || hTeamScore.value === '' || aTeamScore.value < 0 || hTeamScore.value < 0) {
//             info.innerHTML = 'Provide a correct score!';
//         } else if(aTeamScore.value > hTeamScore.value) {
//             userBet = 'away';
//         } else if(aTeamScore.value < hTeamScore.value) {
//             userBet = 'home';
//         } else {
//             userBet = 'draw';
//         }

//         console.log(userBet);

//     });

// checkStats.addEventListener('click', () => {
//     fetch("https://api-football-v1.p.rapidapi.com/v2/fixtures/league/524/2019-12-01", {
//     "method": "GET",
//     "headers": {
//         "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
//         "x-rapidapi-key": "1492d6dabemshc541fec4e9b58b3p187809jsn04a82e8eca2c"
//     }
//     }).then(response => {
//         return response.json();
//     }).then(data => {

//         const awayTeam = data.api.fixtures[1].awayTeam.team_name;
//         const homeTeam = data.api.fixtures[1].homeTeam.team_name;
//         homeTeamScore = data.api.fixtures[1].goalsHomeTeam;
//         awayTeamScore = data.api.fixtures[1].goalsAwayTeam;

//         teams.innerHTML = (`${awayTeam} ${awayTeamScore} : ${homeTeamScore} ${homeTeam}`);

//         function compare() {
//             if(awayTeamScore > homeTeamScore) {
//                 result = 'away';
//             } else if(awayTeamScore < homeTeamScore) {
//                 result = 'home';
//             } else {
//                 result = 'draw';
//             }
//         };

//         compare();
//         console.log(result);

//     }).catch(err => {
//         console.log(err);
//     });

// });

// function getPoints(a, b) {
//     if(a === b) {
//         console.log('You have 3 points!')
//         userPoints.push(3);
//     } else {
//         console.log('Not this time...')
//     }
// };

// function bonusPoints(a, b, c, d) {
//     if(a == b && c == d) {
//         console.log('...Here is some extra 3 points for exact match')
//         userPoints.push(3);
//     } else {
//         console.log('Try next time :)');
//     }

// }

// showPoints.addEventListener('click', () => {
//     getPoints(result, userBet);
//     bonusPoints(aTeamScore.value, awayTeamScore, hTeamScore.value, homeTeamScore);
// });