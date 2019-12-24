# SportsBettingSite

# Installation

```
npm install
```
# Firstly
Create in root folder a file: variables.js and write:
```
exports.API_KEY="YOUR_KEY_TO_FOOTBALL_API"
```
# Start Project
```
npm start
```

# Available Routes

## 1. Add new lobby
```
POST /api/lobbies
``` 
Body Schema:
```
{"name": "name_of_lobby"}
```
## 2. List all lobbies
```
GET /api/lobbies
```
Expected response:
```
[
    {
        "users": [...],
        "_id" : ...,
        "name": ...,
        "createdDate": ...
    },
    ...
]
```
## 3. Delete Lobby
```
DELETE /api/lobbies/:lobbyID
```
## 4. Add user to lobby
```
PUT /api/lobbies/:lobbyID/add
```
Body Schema:
```
{"userID": "id_of_user"}
```
## 5. List users who belongs to lobby
```
GET api/lobbies/:lobbyID/users
```
Expected response:
```
[
    {
        "_id" : ...,
        "name": ...,
        "email": ...
    },
    ...
]
```
## 6. Check users bets for specific fixture (for every user who belongs to lobby)
```
GET api/lobbies/:lobbyID/:fixtureID/check
```
Expected response:
```
"Match has not started yet!"

or

[
    {
        "name": ...,
        "message": "Correct! You got 3 points!" || "Not this time" || "User didn't bet for this fixture",
        "score": ...
    },
    ...
]
```
## 7. Registering Users
```
POST api/users
```
Body Schema:
```
{
    "name": "name_of_user", // Minimum 2 characters
    "email" : "email",   // Minimum 5 characters
    "password" : " " // Minimum 5 characters
}
```
## 8. Login User
```
POST api/users/login
```
Body Schema:
```
{
    "email" : "email",
    "password" : " "
}
```

## 9. Add bet to user in specific lobby

```
PUT api/users/bets/:userID
```
Body Schema:
```
{
    "fixtureID": "...",
    "bet" : "String", // for example "2-1"
    "lobbyID" : "..."
}
```
**It will either add or update bet for indicated lobby.**

## 10. List all fixtures for entered league and date.
```
GET api/fixtures/
```
Body Schema:
```
{
    "league": "string", // for example : "Premier League"
    "date" : "YYYY-MM-DD"
}
```
Expected response:
```
"There are no matches for entered day!|

or
[
    { 
        "_id": "5e0169919e980c21e09566c7",
        "league_name": "Premier League",
        "fixture_id": 157203,
        "homeTeamName": "Tottenham",
        "awayTeamName": "Brighton",
        "score": null,
        "date": "2019-12-26T12:30:00+00:00",
        "status": "Not Started",
    },
    ...
]
```



## 11. Update specific fixture for results
```
PUT api/fixtures/:fixtureID
```
Expected response:
```
"Match finished. No need to update."

or

"Match has not started!"

or

    {
       "homeTeamName": "...",
        "awayTeamName": "...",
        "score": "..."
    }
    
```