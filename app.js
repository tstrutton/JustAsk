var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/User');
var socket = require('socket.io');
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

//connect to mongodb
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/justaskdb');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected!');
  });

//connect to socket server
var server = app.listen(4000,function(){
  console.log('listening to requests on port 4000');
});

app.use(express.static('public'));

var io = socket(server);
var usersInfo =[];
var questions = [];
var today = new Date();
var activate = false;
var time = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
io.on('connection',function(socket){
  io.sockets.emit('activate', activate);
  //listening for a chat message from any client
  socket.on('chat',function(data){

    io.sockets.emit('chat',data);
    //console.log(data);
    questions.push({"question" : data.message, "answered": false, "sender": data.handle, "date":time});
    //console.log(questions);
    io.sockets.emit('bin',questions);
  });

  //changing answered boolean
  socket.on('changeanswer', function(data){
    var id = data.id;
    questions[id].answered = data.answered;
    // console.log(questions);
  });

  //clearing the bin

  socket.on('clearthebinreq', function () {
    db.collection('questions').insert(questions);
    // console.log('clear bin activated');
    questions = [];
    io.sockets.emit('clearthebin');
  });

  socket.on('activatereq', function(){
    if (activate != true) {
      activate = true;
      // console.log(activate);
      io.sockets.emit('activate', activate);
    }else{
      activate = false;
      // console.log(activate);
      io.sockets.emit('activate', activate);
    }
  });

  //refill page if refreshed

  socket.on('refreshed', function(){
    socket.emit('refill', questions);
    // console.log(questions);
  });
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('express-session')({
  secret: 'mysuperduperseceretpassword',
  resave: false,
  saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //only do serialize and deserialize when writing to a session, so basically only local auth
passport.deserializeUser(User.deserializeUser());


app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found page');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
