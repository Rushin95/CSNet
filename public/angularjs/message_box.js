var app = angular.module("myApp", []);

app.controller('messages', function($scope, $http) {
	$scope.messages = [];
	$scope.errors = [];
	$scope.showMessages = false;
	$scope.showErrors = false;

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

	$scope.getRoles = function() {
		$http({
			method: "POST",
			url: '/getRoles'
		}).then(function(response) {
			$scope.roles = response.data;
			$scope.getMessages($scope.roles[0].role_id);
		}, function(error) {
			window.location.assign("/empLogin");
		});
	}

	$scope.getMessages = function(user_id) {
		$scope.selectedChat = user_id;
		$http({
			method: "POST",
			url: '/getMessages',
			data: {
				'user': user_id
			}
		}).then(function(response) {
			$scope.messages = response.data.messages;
			$scope.friendPhoto = response.data.photo[0].photo
		}, function(error) {
			window.location.assign("/empLogin");
		});
	}

	$scope.sendMessage = function(user_id) {
		$http({
			method: "POST",
			url: '/sendMessage',
			data: {
				'message': $scope.newMessage,
				'friend': user_id
			}
		}).then(function(response) {
			$scope.getMessages(user_id);
			$scope.newMessage = '';
		}, function(error) {
			window.location.assign("/empLogin");
		});
	}

	$scope.getRoles();
	$scope.getMessages();
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
