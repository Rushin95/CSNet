var express = require('express');
var router = express.Router();
var mysql = require('./mysql');
var logger = require('../logger/logger');
var nodemailer = require('nodemailer');

var sendmail = require('sendmail')();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('accounts', {});
});


router.get('/communities', function(req, res, next) {
	// logger.log('info','inside /signup get');
	res.render('communities', {});
});

router.get('/signup', function(req, res, next) {
	// logger.log('info','inside /signup get');
	res.render('signup', {
		title: 'Signup'
	});

router.get('/moderator_dashboard', function(req, res, next) {
	res.render('moderator_dashboard', {});

});

router.post('/signup', function(req, res, next) {
	var first_name = req.body.firstname;
	var last_name = req.body.lastname;
	var email = req.body.email;
	var secret = req.body.password;
	var company = req.body.company;
	var contact = req.body.contact;

	mysql.executeQuery(function(err, results) {
		if (err) {
			res.send({
				"statusCode": 401
			});
		} else {
			if (results.affectedRows === 1) {
				res.send({
					"statusCode": 200
				});
			} else {
				res.send({
					"statusCode": 401
				});
			}
		}
	}, "INSERT INTO user_details SET ?", {
		"f_name": first_name,
		"l_name": last_name,
		"email": email,
		"password": secret,
		"contact": contact,
		"company": company
	});
});

router.post('/signin', function(req, res, next) {
	var email = req.body.email;
	var password = req.body.password;

	if (email === null || password === null) {
		console.log(req.body);
		res.send({
			'statusCode': 401
		});
	}

	mysql.executeQuery(function(err, results) {
		if (err) {
			throw err;
		} else {
			if (results.length > 0) {
				var get_password = results[0].password;
				if (password === get_password) {
					// res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
					req.session.user = {
						"user_id": results[0].user_id,
						"email": email
					};
					res.send({
						"statusCode": 200
					});
				} else {
					res.send({
						"statusCode": 403
					});
				}
			} else {
				res.send({
					"statusCode": 401
				});
			}
		}
	}, getUser, [username]);

});



router.post('/getCommunity', function(req, res, next) {


	var query_string = "select * from app_details where owner=?";
	var owner = 1;

	var JSON_query = {
		"owner": owner	
	};

	mysql.executeQuery(function(err, results) {
		if (err) {
			statusCode = 401;
			throw err;
		} else {
			if (results) {
				logger.log('info', 'fetching of community successful');
				console.log(results);
				JSON_obj = {
						"community" : results
				}
				res.send(JSON_obj);
			} else {
				logger.log('info', 'fetching of community failed');
				// statusCode = 401;
				// res.send({"statusCode" : statusCode});
			}
		}
		// console.log("statusCode", statusCode);
	}, query_string, JSON_query);

});

router.post('/community', function(req, res, next) {

	var name = req.body.community;
	// console.log("community", community);
	var owner = req.session.username;
	// var owner = 1;
	var query_string = "INSERT INTO app_details SET ?";

	var JSON_query = {

		"name": name,
		"owner" : owner		
	};

	mysql.executeQuery(function(err, results) {
		if (err) {
			statusCode = 401;
			throw err;
		} else {
			if (results.affectedRows === 1) {
				logger.log('info', 'insertion of community successful');
				statusCode = 200;
				// res.send({"statusCode" : statusCode});
			} else {
				logger.log('info', 'insertion of community failed');
				statusCode = 401;
				// res.send({"statusCode" : statusCode});
			}
		}
		console.log("statusCode", statusCode);
	}, query_string, JSON_query);

});



module.exports = router;
