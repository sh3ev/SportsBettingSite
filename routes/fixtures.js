const request = require('request');
const mongoose = require('mongoose');
const config = require("config")
const API_KEY = config.get('ApiKey');
const {
    Fixture
} = require('../models/fixture');
const express = require('express');
const router = express.Router();
const League = require('../models/league');


router.get('/', async (req, res) => {

    const league = await League.find({
        name: req.body.league
    });

    var League_id = league[0].league_id;
    const date = req.body.date;

    let fixture = await Fixture.find({
        league_name: req.body.league,
        date: new RegExp(date)
    });
    if (fixture.length != 0)
        return res.send(fixture);


    var options = {
        method: 'GET',
        url: `https://api-football-v1.p.rapidapi.com/v2/fixtures/league/${League_id}/${date}`,
        headers: {
            'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
            'x-rapidapi-key': API_KEY
        }
    };
    let fixturesArray = [];
    request(options, function (error, response, body) {
        if (error)
            throw new Error(error);
        let info = JSON.parse(body);
        let count = info.api.results;
        if (count == 0)
            return res.status(200).send("There are no matches for entered day!");



        for (let i = 0; i < count; i++) {
            let fixtureApi = info.api.fixtures[i];
            let fixtureNew = new Fixture({
                league_name: req.body.league,
                fixture_id: fixtureApi.fixture_id,
                homeTeamName: fixtureApi.homeTeam.team_name,
                awayTeamName: fixtureApi.awayTeam.team_name,
                score: fixtureApi.score.fulltime,
                date: fixtureApi.event_date,
                status: fixtureApi.status
            });
            fixturesArray.push(fixtureNew)
            fixtureNew.save()
                .catch(err => {
                    res.send(err);
                });
        }
        res.send(fixturesArray);
    })


})

router.put('/:fixtureID', async (req, res) => {

    let fixture = await Fixture.findOne({
        fixture_id: req.params.fixtureID
    }).select({
        homeTeamName: 1,
        awayTeamName: 1,
        score: 1,
        status: 1
    });
    if (fixture.status == "Match Finished") {
        return res.status(200).send("Match finished. No need to update.")
    }

    let dateNow = new Date();
    let dateFixture = new Date(fixture.date)

    if (dateFixture > dateNow)
        return res.status(200).send('Match has not ended!');

    var options = {
        method: 'GET',
        url: `https://api-football-v1.p.rapidapi.com/v2/fixtures/id/${req.params.fixtureID}`,
        headers: {
            'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
            'x-rapidapi-key': API_KEY
        }
    };


    request(options, function (error, response, body) {
        if (error)
            throw new Error(error);
        let info = JSON.parse(body);
        let fixtureAPI = info.api.fixtures[0];

        fixture.set({
            score: fixtureAPI.score.fulltime,
            status: fixtureAPI.status
        });


        fixture.save()
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.send(err);
            });
    })




})

module.exports = router;