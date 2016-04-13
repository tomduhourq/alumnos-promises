var app = require('express')();
var http = require('http');
var io = require('socket.io-client');;
var bodyParser = require('body-parser')


app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


var options = {
	host: 'http://localhost/questions',
    port: 3000,
    path: '/question',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
}


var availableQuestions = [ { question:'que hora es?', emitter:'kova'}, { question: 'que dia es hoy?', emitter:'tomi'}, {question:'Quien soy?', emmiter:'Alan'}];

//SyncedQuestionsOfList
var questionsList = {};

var socket = io('http://localhost:4000/questions');

socket.on('questions', function (data) {
 	questionsList = data;
 	console.log(data);
});


setInterval(function(){
	console.log("hola");
socket.emit('question', availableQuestions[Math.floor(Math.random() * 3 )]);

}, 8000); 

