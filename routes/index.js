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

router.get('/messages', function(req, res, next) {
	res.render('message_box', {});
});

router.post('/logout', function(req, res, next) {
	req.session.user = undefined;
	res.send({
		'statusCode': 200
	});
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
	mysql.executeQuery(function(err, result) {
		req.db.get('photos').insert({
			'_id': result.insertId,
			'photo': {
				filetype: "image/png",
				filename: "1.jpg",
				filesize: 13448,
				base64: "iVBORw0KGgoAAAANSUhEUgAAALcAAAC3CAIAAADfDFjIAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NEZBRjY1ODJFMTgxMTFFMTlCQUE5NTZBQ0EyNjQyQjIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NEZBRjY1ODNFMTgxMTFFMTlCQUE5NTZBQ0EyNjQyQjIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDMjA2NkM2MUUwRUExMUUxOUJBQTk1NkFDQTI2NDJCMiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDMjA2NkM2MkUwRUExMUUxOUJBQTk1NkFDQTI2NDJCMiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvuefA0AABIESURBVHja7J17d9u2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"
			}
		})
		utils.sendEmail(req.body.new_email, "CSNet Role Credentials", "User Name: " + login + "\n" + "Password: " + password, function(email_result) {
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
	req.db.get('photos').findOne({
		'_id': req.body.user ? req.body.user : req.session.user.user_id
	}).then(function(result) {
		mysql.executeQuery(function(err, role_details) {
			role_details[0].photo = result.photo;
			res.send(role_details)
		}, "SELECT * FROM role_details where role_id = ?", [req.body.user ? req.body.user : req.session.user.user_id]);
	}, function(error) {
		res.send({
			'statusCode': 401
		})
	})
});

router.post('/updatePhoto', function(req, res, next) {
	req.db.get('photos').remove({
		'_id': req.session.user.user_id
	}).then(function(result1) {
		req.db.get('photos').insert({
			'photo': req.body.photo,
			'_id': req.session.user.user_id
		}).then(function(result2) {
			res.send({
				'statusCode': 200
			})
		});
	}, function(error) {
		req.db.get('photos').insert({
			'photo': req.body.photo,
			'_id': req.session.user.user_id
		}).then(function(result2) {
			res.send({
				'statusCode': 200
			})
		});
	})
});

router.post('/updateName', function(req, res, next) {
	mysql.executeQuery(function(err, update_result) {
		if (err) {
			throw err;
		}
		res.send({
			'statusCode': 200
		});
	}, 'UPDATE role_details SET name = ? WHERE role_id = ?', [req.body.name, req.session.user.user_id])
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
		mysql.executeQuery(function(err, posts_result) {
			if (err) {
				throw err;
			}
			var ids = []
			var postIds = []
			for (var i = 0; i < posts_result.length; i++) {
				ids.push(posts_result[i].role_id);
				postIds.push(posts_result[i].post_id);
				posts_result[i].comments = [];
			}
			mysql.executeQuery(function(err, comments_result) {
				if (err) {
					throw err;
				}
				var commentIds = [];
				for (var k = 0; k < comments_result.length; k++) {
					commentIds.push(comments_result[k].owner)
				}
				req.db.get('photos').find({
					'_id': {
						$in: commentIds
					}
				}).then(function(comment_photos) {
					for (var k = 0; k < comments_result.length; k++) {
						comments_result[k].photo = comment_photos[k].photo;
						for (var l = 0; l < posts_result.length; l++) {
							if (posts_result[l].post_id === comments_result[k].post) {
								posts_result[l].comments.push(comments_result[k]);
							}
						}
					}
					req.db.get('photos').find({
						'_id': {
							$in: ids
						}
					}).then(function(result) {
						for (var j = 0; j < result.length; j++) {
							posts_result[j].photo = result[j].photo
						}
						res.send(posts_result);
					}, function(error) {
						throw error;
					})
				})
			}, "select * from comment_details, role_details where post in (" + postIds.join(",") + ") and owner = role_id")
		}, 'SELECT * FROM post_details, role_details where owner = role_id and post_details.appid = ? order by timestamp desc', [app_id_result[0].appid]);
	}, 'SELECT appid FROM role_details where role_id = ?', [req.session.user.user_id]);
});

router.post('/getRoles', function(req, res, next) {
	mysql.executeQuery(function(err, app_id_result) {
		if (err) {
			throw err;
		}
		mysql.executeQuery(function(err, roles_result) {
			if (err) {
				throw err;
			}
			var ids = [];
			for (var i = 0; i < roles_result.length; i++) {
				ids.push(roles_result[i].role_id);
			}
			req.db.get('photos').find({
				'_id': {
					$in: ids
				}
			}).then(function(result) {
				for (var j = 0; j < result.length; j++) {
					roles_result[j].photo = result[j].photo
				}
				res.send(roles_result);
			}, function(error) {
				throw error;
			})
		}, 'SELECT * FROM role_details where appid = ? and role_id != ?', [app_id_result[0].appid, req.session.user.user_id]);
	}, 'SELECT appid FROM role_details where role_id = ?', [req.session.user.user_id]);
});

router.post('/getMessages', function(req, res, next) {
	mysql.executeQuery(function(err, message_result) {
		if (err) {
			throw err;
		}
		req.db.get('photos').find({
			'_id': req.body.user
		}).then(function(result) {
			res.send({
				'photo': result,
				'messages': message_result
			});
		}, function(error) {
			throw error;
		})
	}, 'SELECT * FROM msg_details where (sender = ? and receiver = ?) or (sender = ? and receiver = ?)', [req.session.user.user_id, req.body.user, req.body.user, req.session.user.user_id]);
});

router.post('/sendMessage', function(req, res, next) {
	mysql.executeQuery(function(err, message_result) {
		if (err) {
			throw err;
		}
		res.send({
			'statusCode': 200
		});
	}, 'insert into msg_details set ?', {
		'subject': "New Message",
		'message': req.body.message,
		'timestamp': utils.getTimestamp(),
		'sender': req.session.user.user_id,
		'receiver': req.body.friend
	});
});

module.exports = router;
