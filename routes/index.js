var express = require('express');
var router = express.Router();
var mysql = require('./mysql');
var logger = require('../logger/logger');
const nodemailer = require('nodemailer');

var sendmail = require('sendmail')();
// var passport      = require("passport");
// var LocalStrategy = require("passport-local").Strategy;
// var bcrypt        = require('bcrypt');

/* GET home page. */
router.get('/', function(req, res, next) {
	  res.render('index', { title: 'Calculator' });
	});

router.get('/signup', function(req, res, next) {
	// logger.log('info','inside /signup get');
	res.render('signup', {title : 'Signup'});
});


router.get('/signin', function(req, res, next) {
	logger.log('info','inside /signin get');

	//for emailing

		// let transporter = nodemailer.createTransport({
		//     service: 'gmail',
		//     auth: {
		//         user: 'cloud9.hps@gmail.com',
		//         pass: 'cloud123#'
		//     }
		// });

		// // setup email data with unicode symbols
		// let mailOptions = {
		//     from: '"GeekHardik 👻" <cloud9.hps@gmail.com>', // sender address
		//     to: 'keyur.golani@sjsu.edu, kalgi.bhatt@sjsu.edu, rushin.naik@sjsu.edu', // list of receivers
		//     subject: 'Emailing from node.js is done!! ✔', // Subject line
		//     text: 'What is next now ?', // plain text body
		//     html: '<b>What is next now ?</b>' // html body
		// };

		// // send mail with defined transport object
		// transporter.sendMail(mailOptions, (error, info) => {
		//     if (error) {
		//         return console.log(error);
		//     }
		//     console.log('Message %s sent: %s', info.messageId, info.response);
		// });

	if(req.session.user){
		res.render('home',{"username" : req.session.user.username});
	}
	else{	
		console.log("redirecting to signin..");
		res.render('signin');
		
	}
});

router.post('/afterSignIn', function(req, res, next) {
	logger.log('info','inside /afterSignIn post');
	var username = req.body.inputUsername;
	console.log("username", username);
	var password = req.body.inputPassword;
	console.log("password", password);

	if (username != null && password != null) {
		res.send({
			'statusCode' : 400
		});
	}

	var getUser = "select * from users where username=?";

	mysql.fetchData(function(err, results) {
		if (err) {
			throw err;
		} else {
			if (results.length > 0) {
												
				// get salt and hash it with password and check if two passwords
				// are same or not!
				
		
				var get_password = results[0].password;
				
					
				if(password === get_password){
					console.log("user is valid");
					// since user is valid. let's make his session!
					res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
					req.session.user = {
							"user_id" : results[0].user_id,
							"username" : username
					};
					logger.log('info','signin was successful');	
					res.send({"statusCode" : 200});	
				
				}else{
					logger.log('info','signin was failed');
				res.send({"statusCode" : 401});
				}
			} else {
				logger.log('info','signin was failed');
				res.send({"statusCode" : 401});	
			}
		}
	}, getUser, [username]);

});

router.post('/register', function(req, res, next) {
	var first_name = req.body.firstname;
	
	var last_name  = req.body.lastname;

	var email      = req.body.email;
	
	var secret     = req.body.password;
	
	var company      = req.body.company;
	
	var contact = req.body.contact;
	
	// if (req.body.password === null || req.body.password === undefined) {
	// 	res.send({
	// 		'statusCode' : 400
	// 	});
	// }


	var query_string = "INSERT INTO user_details SET ?";

	var JSON_query = {

		"f_name" : first_name,
		"l_name" : last_name,
		"email" : email,
		"password" : secret,
		"contact" : contact,
		"company" : company		
	};

	mysql.executeQuery(function(err, results) {
		if (err) {
			statusCode = 401;
			throw err;			
		} else {
			if (results.affectedRows === 1) {
				logger.log('info','signup was successful');
				statusCode = 200;
				// res.send({"statusCode" : statusCode});
			} else {
				logger.log('info','signup failed');
				statusCode = 401;
				// res.send({"statusCode" : statusCode});
			}
		}
		console.log("statusCode", statusCode);
	}, query_string, JSON_query);
		

		

		res.send({"statusCode" : statusCode});

});

module.exports = router;




