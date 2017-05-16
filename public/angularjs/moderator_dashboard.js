var app = angular.module('myApp', []);

app.controller('moderatorDashboard', function($scope, $http, $location, $window) {

	$scope.community = $location.search().community_id;
	$scope.form = {}
	$scope.form.replace = false;
	$scope.form.levels = [1, 2, 3]

	$scope.fetchCommunityName = function() {
		$http({
			method: 'POST',
			url: '/getCommunityDetails',
			data: {
				'community': $scope.community
			}
		}).then(function(response) {
			$scope.community_details = response.data.details;
		}, function(error) {
			$window.location.href = "/communities";
		});
	};

	$scope.fetchCommunityDetails = function() {
		$http({
			method: 'POST',
			url: '/getCommunityName',
			data: {
				'community': $scope.community
			}
		}).then(function(response) {
			$scope.community_name = response.data.community_name;
		}, function(error) {
			$window.location.href = "/communities";
		});
	};

	// $scope.fetchCommunityName();
	// $scope.fetchCommunityDetails();
	$scope.community_name = "Avalon on the Alameda"

	$scope.updateRole = function() {
		$http({
			method: 'POST',
			url: '/updateRole',
			data: {
				'role': $scope.form.role,
				'level': $scope.form.level,
				'description': $scope.form.desc,
				'current_name': $scope.form.current_name,
				'new_name': $scope.form.new_name,
				'new_email': $scope.form.new_email
			}
		}).then(function(response) {
			$scope.community_details = response.data.details;
		}, function(error) {
			$window.location.href = "/communities";
		});
	};

	$scope.resetRole = function() {
		$scope.form.role = "";
		$scope.form.level = 1;
		$scope.form.desc = "";
		$scope.form.current_name = "";
		$scope.form.new_name = "";
		$scope.form.new_email = ""
		$scope.form.replace = false
	}

	$scope.addRole = function() {
		$http({
			method: 'POST',
			url: '/addRole',
			data: {
				'role': $scope.form.role,
				'level': $scope.form.level,
				'description': $scope.form.desc,
				'new_name': $scope.form.new_name,
				'new_email': $scope.form.new_email
			}
		}).then(function(response) {
			// $scope.community_details = response.data.details;
		}, function(error) {
			$window.location.href = "/communities";
		});
	};

});
