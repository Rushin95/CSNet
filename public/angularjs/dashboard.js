var app = angular.module("myApp", ['naif.base64']);

app.controller('dashboard', function($scope, $http) {

	$scope.messages = [];
	$scope.errors = [];
	$scope.showMessages = false;
	$scope.showErrors = false;
	$scope.editName = false;
	$scope.searchResults = [];
	$scope.visibility = "public";

	$scope.getUserDetails = function() {
		$http({
			method: "POST",
			url: '/getUser'
		}).then(function(response) {
			$scope.name = response.data[0].name;
			$scope.role = response.data[0].role;
			$scope.newPhoto = response.data[0].photo;
			$scope.user = response.data[0];
		}, function(error) {
			window.location.assign("/empLogin");
		});
	};

	$scope.logout = function() {
		$http({
			method: "POST",
			url: '/logout'
		}).then(function(response) {
			window.location.assign("/empLogin");
		}, function(error) {
			window.location.assign("/empLogin");
		});
	}

	$scope.updateName = function() {
		$http({
			method: "POST",
			url: '/updateName',
			data: {
				"name": $scope.name
			}
		}).then(function(response) {
			if (response.data.statusCode === 401) {
				$scope.errors.push("Internal Error. Please try again later!")
				$scope.showErrors = true;
			} else {
				$scope.messages.push("Name Updated Successfully");
				$scope.showMessages = true;
				$scope.editName = false;
			}
		}, function(error) {
			$scope.errors.push("Internal Error. Please try again later!")
			$scope.showErrors = true;
		});
	};

	$scope.$watch('search', function() {
		if ($scope.search === undefined || $scope.search === null || $scope.search === "") {
			$scope.searchResults = [];
		} else {
			$http({
				method: "POST",
				url: '/search',
				data: {
					"search": $scope.search
				}
			}).then(function(response) {
				if (response.data.statusCode === 401) {
					$scope.searchResults = [];
				} else {
					$scope.searchResults = response.data;
				}
			}, function(error) {
				$scope.searchResults = [];
			});
		}
	});

	$scope.message = function(role_id) {
		window.location.assign("/message?role=" + role_id);
	}

	$scope.addPost = function() {
		$http({
			method: "POST",
			url: '/post',
			data: {
				"post": $scope.post,
				"visibility": $scope.visibility
			}
		}).then(function(response) {
			if (response.data.statusCode === 401) {
				$scope.errors.push("Internal Error. Please try again later!")
				$scope.showErrors = true;
			} else {
				$scope.messages.push("Post added successfully!");
				$scope.getPosts();
				$scope.post = "";
				$scope.showMessages = true;
			}
		}, function(error) {
			$scope.errors.push("Internal Error. Please try again later!")
			$scope.showErrors = true;
		});
	}

	$scope.getPosts = function() {
		$http({
			method: "POST",
			url: '/getPosts'
		}).then(function(response) {
			if (response.data.statusCode === 401) {
				$scope.posts = [];
			} else {
				$scope.posts = response.data;
				$scope.posts.forEach(function(element, idx, array) {
					array[idx].like = false;
				})
			}
		}, function(error) {
			$scope.posts = [];
		});
	}

	$scope.comment = function(idx) {
		$scope.posts[idx].comments.push({
			'comment': $scope.posts[idx].newcomment,
			'timestamp': 'Now',
			'photo': $scope.user.photo,
			'name': $scope.user.name
		});
		$scope.posts[idx].newcomment = '';
	}

	$scope.changePhoto = function() {
		$http({
			method: "POST",
			url: '/updatePhoto',
			data: {
				"photo": $scope.newPhoto
			}
		}).then(function(response) {
			if (response.data.statusCode === 401) {
				$scope.errors.push("Internal Error. Please try again later!")
				$scope.showErrors = true;
			} else {
				$scope.messages.push("Photo updated successfully!");
				$scope.showMessages = true;
				$scope.getPosts();
				$scope.getUserDetails();
			}
		}, function(error) {
			$scope.errors.push("Internal Error. Please try again later!")
			$scope.showErrors = true;
		});
	}

	$scope.getPosts();
	$scope.getUserDetails();



});

app.directive('ngEnter', function() {
	return function(scope, element, attrs) {
		element.bind("keydown keypress", function(event) {
			if (event.which === 13) {
				scope.$apply(function() {
					scope.$eval(attrs.ngEnter);
				});
				event.preventDefault();
			}
		});
	};
});

app.directive('ngEscape', function() {
	return function(scope, element, attrs) {
		element.bind("keydown keypress", function(event) {
			if (event.which === 27) {
				scope.$apply(function() {
					scope.$eval(attrs.ngEscape);
				});
				event.preventDefault();
			}
		});
	};
});
