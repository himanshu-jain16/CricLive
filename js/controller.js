var cricLive = new angular.module('cricLive',[]);

cricLive.controller('MainController',['$scope','$http','$timeout',function($scope,$http,$timeout){

	$scope.getMatches = function(){
		 (function tick() {
	 		$http.get('http://localhost:3001/getallmatches').success(function(response){
	 			//console.log(response);
	 		if(true)
	 		{
	 			$scope.matches = response;
				// score_row = response;
				// var htmlObject = document.createElement('div');
				// htmlObject.setAttribute("id", "scorerow");
				// htmlObject.innerHTML = score_row;
				// var scoreDiv = document.getElementById("scorerow");
				// scoreDiv.removeChild(scoreDiv.firstChild);
				// scoreDiv.appendChild(htmlObject);
				 $timeout(tick, 1000);
			}
		});
	 		})();
	};

	$scope.getMatchData = function(selectedmatchip){
		var selectedmatch = {"matchurl":selectedmatchip};
		(function tick() {
	 		$http.post('http://localhost:3001/getmatchdata',selectedmatch).success(function(response){
			console.log(response);
	 		if(true)
	 		{	
	 			console.log("SERVER NE KYA BHEJA");
	 			console.log(response);
				 $timeout(tick, 10000);
			}
		});
	 		})();
	};

}]);



