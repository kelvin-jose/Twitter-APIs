var express = require('express');
var app = express();
var userModel = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var router = express.Router();

// definition for local authentication procedure
passport.use(new LocalStrategy(
    function(username, password, done) {
      userModel.findOne({ username: username,password: password }, function(err, user) {
        if (err) 
            return done(err); 
        return done(null, user);
      });
    }
  ));
  
passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    done(null, user);
  });
  
module.exports = router;