var app = angular.module("myApp", []);

app.controller('empLogin', function($scope, $http) {

	$scope.screen = "signup";
	$scope.messages = [];
	$scope.errors = [];
	$scope.showMessages = false;
	$scope.showErrors = false;

	$scope.signin = function() {

		$http({
			method: "POST",
			url: '/empLogin',
			data: {
				"login": $scope.login,
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
				window.location.assign("/dashboard");
			}
		}, function(error) {
			$scope.errors.push("Internal Error. Please try again later!")
			$scope.showErrors = true;
		});
	};

});
