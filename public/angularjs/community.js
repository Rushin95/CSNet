
var app = angular.module('myApp',[]);

app.controller('signinCtrl',function($scope,$http){
	console.log("posted data to server");	
	
	$scope.gotosignup = function(){
		window.location.assign("/signup");
	}
	
	
	$scope.signin = function(){
		
		$http({			
			method: "POST",
			url : '/community',
			data : {
				"community" : $scope.community				
			}
					
		}).success(function(data){
			if (data.statusCode == 401) {
				alert("somthing's wrong in callback of signin.js");
				window.location.assign("/community");
			}
			else{
				
				alert("You are successfully Looged in! Welcome..");
				window.location.assign("/community");
			}
			
		}).error(function(error){
			console.log(data.msg);
			$scope.result = data.msg;			
		});
	};
	
});