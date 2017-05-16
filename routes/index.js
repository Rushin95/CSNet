var express = require('express');
var router = express.Router();
var mysql = require('./mysql');
var utils = require('./utils');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('accounts', {});
});

router.get('/empLogin', function(req, res, next) {
	res.render('empLogin', {});
});

router.get('/communities', function(req, res, next) {
	res.render('communities', {});
});

router.get('/dashboard', function(req, res, next) {
	res.render('dashboard', {});
});

router.get('/moderator_dashboard', function(req, res, next) {
	res.render('moderator_dashboard', {});
});

router.post('/signup', function(req, res, next) {
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
		"f_name": req.body.firstname,
		"l_name": req.body.lastname,
		"email": req.body.email,
		"password": req.body.password,
		"contact": req.body.company,
		"company": req.body.contact
	});
});

router.post('/signin', function(req, res, next) {
	var email = req.body.email;
	var password = req.body.password;

	if (email === null || password === null) {
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
	}, "select * from user_details where email = ?", [email]);

});

router.post('/empLogin', function(req, res, next) {
	var login = req.body.login;
	var password = req.body.password;

	if (login === null || password === null) {
		res.send({
			'statusCode': 401
		});
	}

	mysql.executeQuery(function(err, results) {
		if (err) {
			throw err;
		} else {
			if (results.length > 0) {
				if (password === results[0].password) {
					// res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
					req.session.user = {
						"user_id": results[0].role_id
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
	}, "select * from role_details where login = ?", [login]);

});

router.post('/getCommunities', function(req, res, next) {
	mysql.executeQuery(function(err, results) {
		if (err) {
			res.send({
				'statusCode': 401
			})
		} else {
			console.log('results', results);
			res.send(results);
		}
	}, "select * from app_details where owner = ?", [req.session.user.user_id]);
});

router.post('/addCommunity', function(req, res, next) {
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
	}, "INSERT INTO app_details SET ?", {
		"name": req.body.community,
		"owner": req.session.user.user_id
	});
});

router.post('/addRole', function(req, res, next) {
	var login = utils.generateLogin();
	var password = utils.generatePassword();
	mysql.executeQuery(function() {
		utils.sendEmail(req.body.new_email, "CSNet Role Credentials", "User Name: " + login + "\n" + "Password" + password, function(email_result) {
			res.send({
				'statusCode': 200
			})
		})
	}, "INSERT INTO role_details SET ?", {
		'role': req.body.role,
		'level': req.body.level,
		'description': req.body.description,
		'name': req.body.new_name,
		'email': req.body.new_email,
		'login': login,
		'password': password
	});
});

router.post('/getUser', function(req, res, next) {
	mysql.executeQuery(function(err, role_details) {
		res.send(role_details)
	}, "SELECT * FROM role_details where role_id = ?", [req.session.user.user_id])
});

router.post('/updateName', function(req, res, next) {
	mysql.executeQuery(function(err, update_result) {
		if (err) {
			throw err;
		}
		res.send({
			'statusCode': 200
		});
	}, 'UPDATE role_details SET name = ? WHERE role_id = ?;', [req.body.name, req.session.user.user_id])
});

router.post('/search', function(req, res, next) {
	mysql.executeQuery(function(err, app_id_result) {
		if (err) {
			throw err;
		}
		mysql.executeQuery(function(err, search_result) {
			if (err) {
				throw err;
			}
			res.send(search_result);
		}, 'SELECT * FROM role_details where (name like ? or role like ?) and appid = ?', [req.body.search + '%', req.body.search + '%', app_id_result[0].appid])
	}, 'SELECT appid FROM role_details where role_id = ?', [req.session.user.user_id])
});

router.post('/post', function(req, res, next) {
	mysql.executeQuery(function(err, app_id_result) {
		if (err) {
			throw err;
		}
		mysql.executeQuery(function(err, post_result) {
			if (err) {
				throw err;
			}
			res.send({
				'statusCode': 200
			})
		}, 'insert into post_details set ?', {
			'post': req.body.post,
			'timestamp': utils.getTimestamp(),
			'owner': req.session.user.user_id,
			'is_public': req.body.visibility === 'public',
			'appid': app_id_result[0].appid
		});
	}, 'SELECT appid FROM role_details where role_id = ?', [req.session.user.user_id]);
});

router.post('/getPosts', function(req, res, next) {
	mysql.executeQuery(function(err, app_id_result) {
		if (err) {
			throw err;
		}
		mysql.executeQuery(function(err, search_result) {
			if (err) {
				throw err;
			}
			res.send(search_result);
		}, 'SELECT * FROM post_details, role_details where owner = role_id and post_details.appid = ? order by timestamp desc', [app_id_result[0].appid]);
	}, 'SELECT appid FROM role_details where role_id = ?', [req.session.user.user_id]);
});

module.exports = router;
