var cricLive = new angular.module('cricLive',[]);

cricLive.controller('MainController',['$scope','$http','$timeout',function($scope,$http,$timeout){

	$scope.getProductData = function(){
		 (function tick() {
	 		$http.get('http://localhost:3001/myendpoint').success(function(response){
			$scope.asd = response.data;
			console.log("response from server");
			console.log(response.data);
			$timeout(tick, 5000);
		});
	 		})();
	};


}]);