module.exports.sendEmail = function(recepiant, subject, content, htmlContent, processResult) {
	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'cloud9.hps@gmail.com',
			pass: 'cloud123#'
		}
	});

	if (isFunc(htmlContent)) {
		processResult = htmlContent;
	}

	if (!exists(htmlContent) || isFunc(htmlContent)) {
		// TODO: Add more sophisticated template
		htmlContent = "<p>" + content + "</p>";
	}

	var mailOptions = {
		from: '"ConnActivity - No Reply" <no-reply@connactivity.com>',
		to: recepiant, // list of receivers
		subject: subject,
		text: content,
		html: htmlContent
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, result) {
		if (error) {
			throw error;
		}
		processResult(result);
	});
};

module.exports.generateLogin = function() {
	var generatedString = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < length; i++) {
		generatedString += possible.charAt(Math.floor(Math.random() * 6));
	}
	return generatedString;
};

module.exports.generatePassword = function() {
	var generatedString = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < length; i++) {
		generatedString += possible.charAt(Math.floor(Math.random() * 10));
	}
	return generatedString;
};
