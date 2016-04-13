var bodyParser = require('body-parser');
var io = require('socket.io-client');
var _ = require('lodash');

var answers = io.connect('http://localhost:3000/answers');
var questions = io.connect('http://localhost:3000/questions');
var id = 'Profesor-' + Math.random();

var state = {questions: []};
var currentQuestion = null;

questions.on('questions', function (questions) {
	if(currentQuestion === null) {
	  state.questions = questions;
    }
});

function tryAnswer() {
	val toAnswer = _.find(state.questions, function(q) {
		return q.answerer == null;
	});
	//Todos respondiendo
	if(!toAnswer) return;
	//Intentar responder
	toAnswer.answerer = id;
	currentQuestion = toAnswer;
	var timer;
	// Scenario where we could abort
	answer.emit('startedWriting', toAnswer, function(callbackQuestion) {
		if(callbackQuestion.answerer !== id) {
			clearTimeout(timer);
			currentQuestion = null;
		} 
	});
	// Try to respond, could be aborted (upwards).
	timer = setTimeout(function() {
		console.log('Answering question ' + toAnswer.id);
		toAnswer.answer = id + ' responded.';
		answer.emit('answer', toAnswer);
		currentQuestion = null;
	}, 500);
}

while(true) {
  if(currentQuestion === null) {
	tryAnswer();
  }
}