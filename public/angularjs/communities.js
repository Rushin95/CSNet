var app = angular.module('myApp', []);

app.controller('communities', function($scope, $http) {

	$scope.messages = [];
	$scope.errors = [];
	$scope.showMessages = false;
	$scope.showErrors = false;
	$scope.screen = 'communities';

	$scope.gotosignup = function() {
		window.location.assign("/signup");
	}

	$scope.load = function() {
		$http({
			method: "POST",
			url: '/getCommunities'
		}).then(function(response) {
			if (response.data) {
				$scope.records = response.data;
			} else {
				$scope.errors.push("Internal Error. Please try again later!")
				$scope.showErrors = true;
			}
		}, function(error) {
			$scope.errors.push("Internal Error. Please try again later!")
			$scope.showErrors = true;
		});
	};

	$scope.addCommunity = function() {
		$http({
			method: "POST",
			url: '/addCommunity',
			data: {
				"community": $scope.community
			}
		}).then(function(response) {
			if (response.data.statusCode == 401) {
				$scope.errors.push("Internal Error. Please try again later!")
				$scope.showErrors = true;
			} else {
				$scope.messages.push("New Community Added");
				$scope.load();
				$scope.screen = 'communities';
				$scope.community = '';
			}
		}, function(error) {
			$scope.errors.push("Internal Error. Please try again later!")
			$scope.showErrors = true;
		});
	};

});
