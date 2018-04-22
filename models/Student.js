var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var Student = new mongoose.Schema({
	username: String,
	password: String,
	role: String,
	identifier: String
},{collection:'users'});

Student.plugin(passportLocalMongoose);

module.exports = mongoose.model('student', Student); //will create collection if it doesn't exist