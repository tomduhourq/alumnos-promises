var app = require('express')();
var http = require('http');
var io = require('socket.io-client');;
var bodyParser = require('body-parser')


app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


var options = {
	host: 'http://localhost',
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

var socket = io(options.host);

socket.on('questions', function (data) {
 	questionsList = data;
 	console.log(data);
});


setInterval(function(){

socket.emit('question', availableQuestions[Math.floor(Math.rand() * 3 )]);

}, 1000); 








var server = app.listen(3001, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Server listening at http://%s:%s', host, port);
});
