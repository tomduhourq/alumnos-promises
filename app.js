var app = require('express')();
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('lodash');

var id = 0;
var newQuestion = function(parameters) {
	console.log(parameters);
	return {'id': id++, 'question': parameters.question, 
	'answer': null, 'emitter': parameters.emitter};
}

var state = {questions: []};

app.post('/question', function (req, res) {
	var question = newQuestion(req.body);
	state.questions.push(question);
	io.emit('questions', state.questions);
	console.log(state.questions);
	res.jsonp(question);

});

app.post('/answer', function (req, res) {
	console.log(req.body);
	var question = _.find(state.questions, function(q) {
		return q.id == req.body.id;
	});
	if(question.answer != undefined) {
		question.answer = req.body.answer;
		res.jsonp(question);
	} 
	else res.send({error: 'Question with id ' + req.body.id + ' not found. You arrived late.'});
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Server listening at http://%s:%s', host, port);
});
