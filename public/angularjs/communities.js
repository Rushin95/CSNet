var app = angular.module('myApp', []);

app.controller('communities', function($scope, $http) {

	$scope.gotosignup = function() {
		window.location.assign("/signup");
	}

	$scope.load = function() {
		$http({
			method: "POST",
			url: '/getCommunities'
		}).then(function(data) {
			console.log('data', data);
			if (data.community) {
				$scope.records = data.community;
			} else {
				alert("somthing's wrong in callback of cart.js");
			}
		}, function(error) {
			// Do Nothing
		});
	};

	$scope.addCommunity = function() {
		alert($scope.community);
		$http({
			method: "POST",
			url: '/community',
			data: {
				"community": $scope.community
			}

		}).then(function(data) {
			if (data.statusCode == 401) {
				alert("somthing's wrong in callback of community.js");
				window.location.assign("/community");
			} else {

				alert("You are successful.");
				window.location.assign("/community");
			}

		}, function(error) {
			console.log(data.msg);
			$scope.result = data.msg;
		});
	};

});
