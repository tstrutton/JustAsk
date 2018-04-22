var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var User = new mongoose.Schema({
	username: String,
	password: String,
},{collection:'users'});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', User); //will create collection if it doesn't exist

//not being used