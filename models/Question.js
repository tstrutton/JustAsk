var mongoose = require('mongoose');

var questionSchema = new mongoose.Schema({
	question: String,
	answered: Boolean,
	sender: String,
	date: String
},
{ collection : 'questions'}
);

module.exports = mongoose.model('Question', questionSchema);