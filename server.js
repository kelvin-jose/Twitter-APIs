var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('./controllers/passport');
var users = require('./controllers/users');
var tweets = require('./controllers/tweets');
var p = require('passport')
app.use(bodyParser.urlencoded({ extended: true })) // to take care of from data parsing

//  database connection
//  name of the database is twitter
mongoose.connect('mongodb://localhost:27017/twitter',{ useNewUrlParser: true });

app.use(require('express-session')({
    secret: "Yes I'm coming with a brand name",
    resave: false,
    saveUninitialized: false
  }))

app.use(p.initialize());
app.use(p.session());
app.use(users);
app.use(tweets);
app.use(passport);

//  landing page route
app.get('/',function(req,res){
    res.json({ 'message': 'You\'ve reached the homepage, login first' });
})

//  universal route
app.all('*',function(req,res){
    res.json({ 'error': true, 'message': '404 page not found!' });
})

//  starting server on port 3000
app.listen(3000,function(){
    console.log({ 'success': true, 'message': 'App started on port 3000' });
})