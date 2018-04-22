var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var Professor = new mongoose.Schema({
	username: String,
	password: String,
	test: String,
	currentclass: String,
	myclasses: [
		{
			code: String,
			active: Boolean,
			questions:[
				{
					question: String,
					answered: Boolean
				}
			]
		}
	]

},{collection:'users'});

Professor.plugin(passportLocalMongoose);

module.exports = mongoose.model('professors', Professor); //will create collection if it doesn't exist