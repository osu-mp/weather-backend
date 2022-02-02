"use strict"

var express = require('express')
//var bodyParser = require("body-parser");

var app = express()

app.listen(3002)
console.log('Node.jf Express server is running on port 3002...')

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

    //res.setHeader('Access-Control-Allow-Origin', '*');


    // Request methods you wish to allow eg: GET, POST, OPTIONS, PUT, PATCH, DELETE
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Pass to next layer of middleware
    next();
});


app.get('/v1/weather/', get_weather)
app.get('/v1/hello/', get_hello)
app.post('/v1/auth/', post_auth)



function get_weather(request, response){
    response.json({"coord":{"lon":-123.262,"lat":44.5646},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"base":"stations","main":{"temp":45.77,"feels_like":43.84,"temp_min":39.9,"temp_max":47.91,"pressure":1026,"humidity":88},"visibility":10000,"wind":{"speed":0,"deg":0},"clouds":{"all":100},"dt":1642217300,"sys":{"type":2,"id":2012991,"country":"US","sunrise":1642175199,"sunset":1642208235},"timezone":-28800,"id":5720727,"name":"Corvallis","cod":200})
}

function get_hello(request, response){
    console.log('Hello world requested');
    response.json({"greeting": "Hello world!"})
}

function post_auth(request, response){
    //const user = request.body.user;
    const user = request.user;
    response.send({"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJyZWZyZXNoLXRva2VuIjoiZHVtbXlfdmFsdWUxIiwiYWNjZXNzLXRva2VuIjoiZHVtbXlfdmFsdWUyIiwiaWF0IjoxNTE2MjM5MDIyfQ.guTzYRwmwEx2WQbhc-4zFV7dLZw1uWNhUvnzL3fEt3o"})
}