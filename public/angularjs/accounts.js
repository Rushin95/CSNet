var app = angular.module("myApp", []);

app.controller('accounts', function($scope, $http) {

	$scope.screen = "signup";
	$scope.messages = [];
	$scope.errors = [];

	$scope.signin = function() {

		$http({
			method: "POST",
			url: '/afterSignIn',
			data: {
				"inputUsername": $scope.username,
				"inputPassword": $scope.password
			}

		}).success(function(data) {
			if (data.statusCode == 401) {
				errors.push("Login Failed. Please try again!")
			} else {
				window.location.assign("/communities");
			}
		}).error(function(error) {
			errors.push("Internal Error. Please try again later!")
		});
	};

	$scope.signup = function() {
		$http({
			method: "POST",
			url: '/register',
			data: {
				"firstname": $scope.firstname,
				"lastname": $scope.lastname,
				"email": $scope.username,
				"password": $scope.password,
				"contact": $scope.contact,
				"company": $scope.company
			}

		}).success(function(data) {
			if (data.statusCode == 401) {
				errors.push("Signup Failed. Please try again!")
			} else if (data.statusCode == 401) {
				errors.push("Signup Failed. Please try again!")
			} else {
				$scope.screen = "login"
				messages.push("Account Created! Please login.")
			}
		}).error(function(error) {
			errors.push("Internal Error. Please try again later!")
		});
	};

});
