
var app = angular.module('calc',[]);

app.controller('calc',function($scope,$http){
	
	  var operation;
	  $scope.operation = function(x){
	    operation = x;
	  }

	$scope.calculate= function(){
		
		$http({			
			method: "POST",
			url : '/calc',
			data : {
				
				"num1" : $scope.num1,
				"num2" : $scope.num2,
				"operation" : operation
			}		
		}).success(function(data){
			console.log(data.result);
			if(data.result == null || data.result == undefined){
				$scope.result = "Correct your inputs!";
			}else{
				$scope.result = data.result;
			}
			
			
		}).error(function(error){
			console.log(data.msg);
			$scope.result = data.msg;
			
		});
	}
			
})