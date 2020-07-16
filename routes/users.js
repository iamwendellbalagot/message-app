//jshint esversion:6

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//load user model and auth.js
const User = require('../models/User');
const {forwardAuthenticated} = require('../configs/auth');


//get request
router.get('/login', function(req, res){
  res.render('login');
});

router.get('/register', function(req,res){
  res.render('register');
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

//POST request
router.post('/register', (req, res) => {
  const { name, username, email, password, password2 } = req.body;
  let errors = [];
//checking if all fields are filled
  if (!name || !username || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

//if there is an error this statement will render
  if (errors.length > 0) {
    res.render('signup', {
      errors,
      name,
      email,
      password,
      password2
    });
  }//else if there is no error
   else {
     //We will check if the email already exist in our dataBase
    User.findOne({ email: email }).then(user => {
      if (user) {
        console.log("email already exists");
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      }
      else {
        const newUser = new User({
          name,
          username,
          email,
          password
        });
        //Hashing the password using bcrypt
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save().then(user => {
                console.log('New account added');
                res.redirect('/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});


// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/contacts',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});


module.exports = router;
