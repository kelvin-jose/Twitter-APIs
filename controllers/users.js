var express = require('express');
var app = express();
var userModel = require('../models/user');
var passport = require('passport');
var router = express.Router()
var passportController = require('./passport')

//  apt for user registration, it takes two parameters
// - called username and password from form data

router.post('/users/register', function (req, res, next) {

	//  checks whether the username and password are not empty
	if (req.body.username.trim() != "" && req.body.password.trim() != "") {

		//  checks whether an username is taken or not
		userModel.findOne({
			username: req.body.username
		}, function (err, user) {
			if (user)
				return res.json({
					'error': 'true',
					'message': 'username already taken!'
				});
			else {
				//  creating new user
				var newUser = new userModel({
					username: req.body.username,
					password: req.body.password
				})
				newUser.save(function (err, user) {
					if (user)
						return res.json({
							'success': 'true',
							'message': 'user created successfully!'
						});
					else
						return res.json({
							'error': 'true',
							'message': 'username or password cannot be empty!'
						});
				});
			}
		});
	} else
		return res.json({
			'error': 'true',
			'message': 'username or password can\'t be empty'
		})
});

//  api to login
//  on failure redirection to '/' will be done 
router.post('/users/login',
	passport.authenticate('local', {
		failureRedirect: '/'
	}),
	function (req, res) {
		res.json({
			'success': "true",
			'message': 'successfully authenticated!'
		});
	});

//  logs out an user
router.get('/users/logout', function (req, res) {
	req.logout();
	res.json({
		'success': 'true',
		'message': 'user successfully logged out!'
	});
});


//  api to follow an user, it takes one parameter called id
//  which is expected to be the id of the user to be followed
router.post('/users/:id/follow', isLoggedIn, function (req, res) {
	var user = req.user;
	var id = req.params.id;
	const currentId = user._id;

	//  one can't follow himself :-P
	if (id != currentId) {
		//  checks whether such an  user account exists or not
		userModel.findOne({
			_id: id
		}, function (err, user) {
			if (err)
				return res.json({
					'error': 'true',
					'message': 'no such user account'
				})
			else {
				if (user.followers.indexOf(currentId) === -1) {
					user.followers.push(currentId);
					user.save(err => {
						if (err) {
							return res.json({
								'error': 'true',
								'message': 'some error occured'
							});
						} else
							return res.json({
								'success': 'true',
								'message': 'you followed ' + id
							});
					});
				}
			}
		});
	} else
		return res.json({
			'error': 'true',
			'message': 'you can\'t follow yourself'
		})
});

//  api to unfollow an user
router.post('/users/:id/unfollow', isLoggedIn, function (req, res) {
	var user = req.user;
	var id = req.params.id;
	const currentId = user._id;
	//  one can't unfollow himself
	if (id != currentId) {
		userModel.findOne({
			_id: id
		}, function (err, user) {
			if (err)
				return res.json({
					'error': 'true',
					'message': 'no such user account'
				})
			else {
				var index = user.followers.indexOf(currentId);
				if (index != -1) {
					// deleting entry from the followers list
					user.followers.splice(index, 1);
					user.save(err => {
						if (err) {
							return res.json({
								'error': 'true',
								'message': 'some error occured'
							});
						} else {
							userModel.findOne({
								_id: currentId
							}, function (err, user) {
								index = user.following.indexOf(id);
								if (index != -1) {
									// deleting entry from the following list 
									user.following.splice(index, 1);
								}
								user.save();
							});
							return res.json({
								'success': 'true',
								'message': 'you unfollowed ' + id
							});
						}
					});
				} else
					return res.json({
						'error': 'true',
						'message': 'you are not following ' + id
					});
			}
		});
	} else
		return res.json({
			'error': 'true',
			'message': 'why should you unfollow yourself ?'
		})
});


function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();
	// if they aren't redirect them to the home page
	res.redirect('/');
}

module.exports = router;

