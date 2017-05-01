var app = angular.module("myApp", []);
app.controller('signupCtrl',function($scope,$http){
	console.log("in signup angular");	
	
	$scope.gotosignin = function(){
		window.location.assign("/signin");
	}
	
	
	$scope.signup = function(){
			$http({			
			method: "POST",
			url : '/register',
			data : {
				"firstname" : $scope.firstname,
				"lastname" : $scope.lastname,
				"email" : $scope.username,
				"password" : $scope.password,
				"contact" : $scope.contact,
				"company" : $scope.company
			}
					
		}).success(function(data){
			if (data.statusCode == 401) {
				alert("Something's wrong in signup!");
				window.location.assign("/signup");
			}else if(data.statusCode == 10){
				console.log("invalid");
//				alert("username is already in records! please use different userid");
			}
			else{
				
				alert("You are successfully signed up! Please sign-in now!...");
				window.location.assign("/signin");
			}
			
		}).error(function(error){
			// console.log("data.statusCode", data.statusCode);
			console.log("invalid");
			alert("username is already in records! please use different userid");		
			window.location.assign("/signin");
		});
	};
	
});