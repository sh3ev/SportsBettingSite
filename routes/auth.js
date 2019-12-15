const config = require('config'); //import obiektu config do zmiennej config
const jwt = require('jsonwebtoken'); //zaimportowanie jsonwebtoken i zapis w zmiennej jwt

//logowanie rejestracja

const token = jwt.sign({_id:user._id}, config.get('jwtPrivateKey')); //wygenerowanie tokena i zapis do zmiennej token
res.send(token); //zwrócenie zmiennej token dla klienta