
var app = angular.module('myApp',[]);

app.controller('communityCtrl',function($scope,$http){
	console.log("posted data to server");	
	
	$scope.gotosignup = function(){
		window.location.assign("/signup");
	}

	$scope.load = function(){	
	$http({			
		method: "POST",
		url : '/getCommunity',						
	}).success(function(data){
		console.log(data);
		if(data.community){
			$scope.records = data.community;	
		}else{
			alert("somthing's wrong in callback of cart.js");
		}
	});	
};

	// $scope.records = [
 //    "Alfreds Futterkiste",
 //    "Berglunds snabbköp",
 //    "Centro comercial Moctezuma",
 //    "Ernst Handel",
 //  ]
	
	
	$scope.addCommunity = function(){
		alert($scope.community);
		$http({			
			method: "POST",
			url : '/community',
			data : {
				"community" : $scope.community				
			}
					
		}).success(function(data){
			if (data.statusCode == 401) {
				alert("somthing's wrong in callback of community.js");
				window.location.assign("/community");
			}
			else{
				
				alert("You are successful.");
				window.location.assign("/community");
			}
			
		}).error(function(error){
			console.log(data.msg);
			$scope.result = data.msg;			
		});
	};
	
});