//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');


//initialize express
const app = express();
const server = app.listen(process.env.PORT || 3000);
const io = require('socket.io')(server);
// next line is the money
app.set('socketio', io);
//initialize layout and views folder
app.use(expressLayouts);
app.set('view engine', 'ejs');
//initialize body-bodyParser
app.use(bodyParser.urlencoded({extended:true}));
//initialize public folder
app.use(express.static('public'));
//require passport middleware
require('./configs/passport')(passport);
//use express-session
app.use(session({
  secret:"secret",
  resave:true,
  saveUninitialized:true
}));
//use passport middleware
app.use(passport.initialize());
app.use(passport.session());


//connect to the database
mongoose.connect('mongodb://localhost:27017/messenger',{useNewUrlParser:true});


//import routes
app.use('/', require('./routes/index.js'));
app.use('/', require('./routes/users.js'));
