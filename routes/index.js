var express = require('express');
var router = express.Router();
var passport = require('passport');
//var User = require('../models/User');
var Student = require('../models/Student');
var Professor = require('../models/Professor');
var Question = require('../models/Question');


function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next(); //return next() means continue
  }
  return res.redirect('/');
}

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Just Ask - Login', user:req.user });
});


router.get('/student', function(req, res, next) {
  res.render('studentchat', { title: 'Just Ask', user:req.user });
});

router.get('/professor', function(req, res, next) {
  res.render('profchat', { title: 'Just Ask', user:req.user });
});


router.post('/login', passport.authenticate('local'),function(req, res, next) {
  if(req.user.username == 'admin'){
    res.redirect('/professor');
  } else{
    res.redirect('/student');
  }
});

router.get('/logout', function(req, res, next) {
  req.logout();

  res.redirect('/'); //can redirect to anything
});

router.post('/register', function(req, res, next) {
//console.log(req.body.identifier);
  if(req.body.role === 'student'){
    Student.register(new Student({
      username : req.body.username,
      role : req.body.role,
      identifier: req.body.identifier
    }),

    req.body.password,

    function(err, user){
      if(err){
        return res.render('registerform', {user:user});
      }

      passport.authenticate('local')(req,res,function(){
        res.redirect('/student');
      });
    });
  }else if(req.body.role === 'professor'){
    Professor.register(new Professor({
      username : req.body.email,
      role : req.body.role,
      currentclass: "",
      myclasses:[]
    }),

    req.body.password,

    function(err, user){
      if(err){
        return res.render('registerform', {user:user});
      }

      passport.authenticate('local')(req,res,function(){
        res.redirect('/professor');
      });
    });
  }

});

router.get('/api/questions', function(req, res, next) {
  Question.find().exec(function (err, questions) {
    if (err) return console.error(err);
      res.json(questions);
  });
});





module.exports = router;