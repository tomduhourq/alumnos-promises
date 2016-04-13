var app = require('express')();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

var io = require('socket.io')(4000);
var _ = require('lodash');

var id = 0;
var newQuestion = function(parameters) {
	return {'id': id++, 'question': parameters.question, 
	'answer': null, 'emitter': parameters.emitter, answerer: null, 
	'answerTimer': null };
}

var state = {questions: []};

var questionsApi = io.of('/questions');

questionsApi.on('connection',function(socket){
	socket.on('question', function (newQuestiondata) {

		var question = newQuestion(newQuestiondata);
		state.questions.push(question);
		questionsApi.emit('questions', state.questions);

	});	
})


io.of('/answers').on('connection', function(socket){
	socket.on('startedWriting', function (questionToAnswer, cbk) {

		var question = _.find(state.questions, function(q) {
			return q.id == questionToAnswer.id;
		});

		if(question.answerer === null) {
			question.answerer = questionToAnswer.answerer;
			questionsApi.emit('questions', state.questions);
			cbk(question);
		} 
		else cbk(questions);
	});

	socket.on('answer', function(questionToAnswer, cbk){
		var question = _.find(state.questions, function(q) {
			return q.id == questionToAnswer.id;
		});

		if(question.answerer === questionToAnswer.answerer) {
			question.answer = questionToAnswer.answer;
			questionsApi.emit('questions', state.questions);
			cbk(question);
		} 
		else cbk(question);

	})

});

setInterval(function(){
	state.questions.forEach(function(question){
		if(question.answerTimer && (question.answerTimer < Date.now() -  3000)){
			question.answerer = null;
			question.answetTimer = null;
		}
	});
	
}, 1000);

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Server listening at http://%s:%s', host, port);
});
