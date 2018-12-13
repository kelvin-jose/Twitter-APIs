var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var tweetModel = require('../models/tweet');
var userController = require('./users')
var passport = require('passport');
var passportController = require('./passport')
var router = express.Router()
var mongo = require('mongodb')

// api to create a new tweet
// it takes a paramter called body which is expected 
// - to be receied from form data

router.post('/tweets/new', isLoggedIn, function (req, res) {
	var tweetBody = req.body.body.trim();

	//checks whether the tweet body is empty or not
	if (tweetBody == "")
		return res.json({
			'error': 'true',
			'message': 'tweet body can\'t be empty'
		});
	else {
		var newTweet = new tweetModel({
			body: tweetBody,
			user: req.user._id
		})
		newTweet.save(function (err, tweet) {
			if (err)
				return res.json({
					'error': 'true',
					'message': 'some internal error occured,try again later!'
				})
			else
				// response on successful tweet
				return res.json({
					'success': 'true',
					'message': 'your tweet created successfully!',
					'new tweet': {
						'user': tweet.user,
						'body': tweet.body,
						'date': tweet.createdAt
					}
				})
		});
	}

});

// api to read tweets made by the authenticated user
router.get('/tweets/read', isLoggedIn, function (req, res) {
	tweetModel.find({
		'user': mongo.ObjectID(req.user._id)
	}, function (err, tweets) {
		if (err)
			return res.json({
				'error': 'true',
				'message': 'some internal error is occured, please try again later!'
			})
		else
			return res.json({
				'success': 'true',
				'tweets': tweets
			})
	});
});

//  api to delete a tweet, it takes a paramter called id
//  id is expected to be the id of tweet
router.post('/tweets/:id/delete', isLoggedIn, function (req, res) {
	var tweetId = req.params.id;

	//  checks whether whether such a tweet exists or not
	tweetModel.findOne({
		'_id': mongo.ObjectId(tweetId)
	}, function (err, tweet) {
		if (tweet == null)
			return res.json({
				'error': 'true',
				'message': 'no such tweet found'
			})
		else {
			//  checks the ownership of the tweet
			if (tweet.user == req.user._id) {
				tweetModel.deleteOne({
					'_id': mongo.ObjectId(tweetId)
				}, function (err, tweet) {
					if (tweet)
						return res.json({
							'success': 'true',
							'message': 'tweet deleted successfully!'
						})
					else
						return res.json({
							'error': 'true',
							'message': 'some internal error occured!'
						})
				})

			}

		}
	})
});

// function to check whether an user is authenticated 
// or not
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();
	// if they aren't redirect them to the home page
	res.redirect('/');
}
module.exports = router;

