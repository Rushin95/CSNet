var app = angular.module("myApp", []);

app.controller('accounts', function($scope, $http) {

	$scope.screen = "signup";
	$scope.messages = [];
	$scope.errors = [];
	$scope.showMessages = false;
	$scope.showErrors = false;

	$scope.signin = function() {

		$http({
			method: "POST",
			url: '/signin',
			data: {
				"email": $scope.email,
				"password": $scope.password
			}
		}).then(function(response) {
			if (response.data.statusCode == 401) {
				$scope.errors.push("Login Failed. Please try again!");
				$scope.showErrors = true;
			} else if (response.data.statusCode == 403) {
				$scope.errors.push("Bad Credentials. Please try again!");
				$scope.showErrors = true;
			} else if (response.data.statusCode == 200) {
				window.location.assign("/communities");
			}
		}, function(error) {
			$scope.errors.push("Internal Error. Please try again later!")
			$scope.showErrors = true;
		});
	};

	$scope.signup = function() {
		$http({
			method: "POST",
			url: '/signup',
			data: {
				"firstname": $scope.firstname,
				"lastname": $scope.lastname,
				"email": $scope.email,
				"password": $scope.password,
				"contact": $scope.contact,
				"company": $scope.company
			}

		}).then(function(response) {
			if (response.data.statusCode == 401) {
				$scope.errors.push("Signup Failed. Please try again!");
				$scope.showErrors = true;
			} else if (response.data.statusCode == 401) {
				$scope.errors.push("Signup Failed. Please try again!");
				$scope.showErrors = true;
			} else {
				$scope.screen = "login";
				$scope.messages.push("Account Created! Please login.");
				$scope.showMessages = true;
			}
		}, function(error) {
			$scope.errors.push("Internal Error. Please try again later!");
			$scope.showErrors = true;
		});
	};

});
