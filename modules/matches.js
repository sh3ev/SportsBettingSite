const express = require('express');
const request = require('request');
const cors = require('cors');
const router = express.Router();
let app = express();
app.use(cors());

// tymczasowe rozwiązanie


// let leagueId = request.query.leagueId;
// let date = request.query.date;
// let url = {
//   method: 'GET',
//   url: `https://api-football-v1.p.rapidapi.com/v2/fixtures/league/${leagueId}/${date}`,
//   headers: {
//     'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
//     'x-rapidapi-key': '0f5b02dfe7msh6c81fec732f7b8ep1803e9jsnd99f16bb485a'
//   }
// };

app.get('/api/matches', cors(), function (req, res) {
  let leagueId = req.query.leagueId;
  let date = req.query.date;
  let url = {
    method: 'GET',
    url: `https://api-football-v1.p.rapidapi.com/v2/fixtures/league/${leagueId}/${date}`,
    qs: {
      timezone: 'Europe%2FLondon'
    },
    headers: {
      'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
      'x-rapidapi-key': '0f5b02dfe7msh6c81fec732f7b8ep1803e9jsnd99f16bb485a'
    }
  };
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      let info = JSON.parse(body)
      console.log(body)
      res.send(info);
    }
  })
});

app.listen(3000);
module.exports = router;