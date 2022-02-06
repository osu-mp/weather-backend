"use strict"

var express = require('express')
//var bodyParser = require("body-parser");

var app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const url = require('url');             // used to parse query params from url

app.listen(3000)
console.log('Node.jf Express server is running on port 3000...')

const magic_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJyZWZyZXNoLXRva2VuIjoiZHVtbXlfdmFsdWUxIiwiYWNjZXNzLXRva2VuIjoiZHVtbXlfdmFsdWUyIiwiaWF0IjoxNTE2MjM5MDIyfQ.guTzYRwmwEx2WQbhc-4zFV7dLZw1uWNhUvnzL3fEt3o";

/*
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    const allowedOrigins = ['https://editor.swagger.io', 'https://hoppscotch.io'];
    const origin = req.headers.origin;

    console.log('Headers: ', req.headers)
    console.log('In app.use: ', origin);

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        console.log('Allowing origin: ', origin)
    }

    res.setHeader('Access-Control-Allow-Origin', '*');


    // Request methods you wish to allow eg: GET, POST, OPTIONS, PUT, PATCH, DELETE
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Pass to next layer of middleware
    next();
});*/


app.get('/v1/weather/', get_weather)
app.get('/v1/hello/', get_hello)
app.post('/v1/auth/', post_auth)


function check_token(req){
    //console.log("Bypassing token check!! (TODO REMOVE)"); return true;
    var auth_token = extractToken(req)

    if (auth_token == magic_token)    {
        console.log("Token accepted")
        return true;
    }
    console.log("Token rejected")
    return false;
}

function get_weather(req, response){
    console.log("Weather request: " + req)
    if (check_token(req)){
        response.json({"coord":{"lon":-123.262,"lat":44.5646},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"base":"stations","main":{"temp":45.77,"feels_like":43.84,"temp_min":39.9,"temp_max":47.91,"pressure":1026,"humidity":88},"visibility":10000,"wind":{"speed":0,"deg":0},"clouds":{"all":100},"dt":1642217300,"sys":{"type":2,"id":2012991,"country":"US","sunrise":1642175199,"sunset":1642208235},"timezone":-28800,"id":5720727,"name":"Corvallis","cod":200})
    }
    else{
        response.status(401);
        response.json({"Error": "Unauthorized user, no weather for you!"})
    }
}

function get_hello(req, response){
    console.log("Get Hello Requested")
    const queryObject = url.parse(req.url, true).query;
    console.log(queryObject);


    console.log('Hello world requested');

    if (check_token(req)){
        response.json({"main": {"greeting": "Hello world!"}})
    }
    else{
        response.status(401);
        // TODO : should this return a different status code, how?
        response.json({"greeting": "Unauthorized user, no hello for you!"})
    }

}

function extractToken (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        return req.query.token;
    }
    return null;
}

function post_auth(request, response){
    console.log("Auth requested")
    var user = request.body.username;
    var pass = request.body.password;

    // set expires for 2 hours from now
    var exp = new Date();
    exp.setMinutes(exp.getMinutes() + 120);

    if (user == "joe" && pass == "my_password2"){
        console.log("User authenticated");
        response.send({"main": {"token": magic_token, "expires": exp}})
    }
    else{
        console.log("User rejected");

        throw new Error("Unauthorized request")
    }


}