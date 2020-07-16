//jshint esversion:6

const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


//Load User model
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(new LocalStrategy({
    usernameField: "username"
  }, function(username, password, done) {
    //match the user from dataBase
    User.findOne({
      username: username
    }).then(function(user){
      if (!user) {
        return done(null, false, {
          message: "You are not yet registered"
        });
      } else {
        bcrypt.compare(password, user.password, function(err, isMatch) {
          if (err) {
            console.log(err);
          } else if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, {
              message: "Password Incorrect."
            });
          }
        });
      }
    });
  }));
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
