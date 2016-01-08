var cricLive = new angular.module('cricLive',[]);

cricLive.controller('MainController',['$scope','$http','$timeout',function($scope,$http,$timeout){


	$scope.getMatches = function(){
		 
	 		$http.get('http://localhost:3001/getallmatches').success(function(response){
	 			$scope.matches = response;
			
		});
	};

	$scope.getMatchData = function(selectedmatchip){
		var selectedmatch = {"matchurl":selectedmatchip};
		(function tick() {
	 		$http.post('http://localhost:3001/getmatchdata',selectedmatch).success(function(response){
 			console.log(response);
 			var inningsInfoObject = document.createElement('div');
 			inningsInfoObject.innerHTML = response.innings_info;
 			inningsInfoObject = $(inningsInfoObject);

 			var scoreTableObject = document.createElement('table');
 			scoreTableObject.innerHTML = response.score_table;
 			scoreTableObject = $(scoreTableObject);

 			var recentOversObject = document.createElement('div');
 			recentOversObject.innerHTML = response.recent_overs;
 			recentOversObject = $(recentOversObject);

 			
 			$scope.team1name = inningsInfoObject.children(".team-1-name").clone().children().remove().end().text().trim();
			$scope.team2name = inningsInfoObject.children(".team-2-name").clone().children().remove().end().text().trim();
			$scope.team1score = inningsInfoObject.children(".team-1-name").children()[0].innerHTML;
			$scope.team2score = inningsInfoObject.children(".team-2-name").children()[0].innerHTML;
			$scope.innings_status = inningsInfoObject.children(".innings-requirement").text().trim();
			
			console.log($scope.team1name);
			console.log($scope.team1score);
			console.log($scope.team2name);
			console.log($scope.team2score);
			console.log($scope.innings_status);

			$scope.batsmen1 = []; //runs,balls,4,6,StrikeRate
			$scope.batsmen1.push(scoreTableObject.find(".batsmen").find(".row1").children()[0].children[0].text);
			$scope.batsmen1.push(scoreTableObject.find(".batsmen").find(".row1").children()[1].innerHTML);
			$scope.batsmen1.push(scoreTableObject.find(".batsmen").find(".row1").children()[2].innerHTML);
			$scope.batsmen1.push(scoreTableObject.find(".batsmen").find(".row1").children()[3].innerHTML);
			$scope.batsmen1.push(scoreTableObject.find(".batsmen").find(".row1").children()[4].innerHTML);
			$scope.batsmen1.push(scoreTableObject.find(".batsmen").find(".row1").children()[5].innerHTML);
			console.log($scope.batsmen1);

			$scope.batsmen2 = []; //runs,balls,4,6,StrikeRate
			$scope.batsmen2.push(scoreTableObject.find(".batsmen").find(".row2").children()[0].children[0].text);
			$scope.batsmen2.push(scoreTableObject.find(".batsmen").find(".row2").children()[2].innerHTML);
			$scope.batsmen2.push(scoreTableObject.find(".batsmen").find(".row2").children()[2].innerHTML);
			$scope.batsmen2.push(scoreTableObject.find(".batsmen").find(".row2").children()[3].innerHTML);
			$scope.batsmen2.push(scoreTableObject.find(".batsmen").find(".row2").children()[4].innerHTML);
			$scope.batsmen2.push(scoreTableObject.find(".batsmen").find(".row2").children()[5].innerHTML);
			console.log($scope.batsmen2	);

			$scope.bowlerStats = []; //multiple bowlers can be present
			var bowlerNodes = scoreTableObject.find(".bowlers").children()[1].rows.length;
			for(i=0; i<bowlerNodes; i+=1) {
			    var tempbowler=[]; //overs,maiden,runs,wicket,ecnonomy
			 	tempbowler.push(scoreTableObject.find(".bowlers").children()[1].children[i].children[0].children[0].text);
			 	tempbowler.push(scoreTableObject.find(".bowlers").children()[1].children[i].children[1].innerHTML); 
			 	tempbowler.push(scoreTableObject.find(".bowlers").children()[1].children[i].children[2].innerHTML); 
			 	tempbowler.push(scoreTableObject.find(".bowlers").children()[1].children[i].children[3].innerHTML); 
			 	tempbowler.push(scoreTableObject.find(".bowlers").children()[1].children[i].children[4].innerHTML); 
			 	tempbowler.push(scoreTableObject.find(".bowlers").children()[1].children[i].children[5].innerHTML); 
			 	$scope.bowlerStats.push(tempbowler);
			}
			console.log($scope.bowlerStats);

			console.log(recentOversObject);

			$scope.recentOvers = [];
			var recentOversCount = recentOversObject[0].childElementCount -2;
			console.log("overs",recentOversCount);
			for(i=1;i<=recentOversCount;i++)
			{
				var tempover = [];
				console.log(recentOversObject[0].children[i]);
				console.log(i);

				balls = recentOversObject[0].children[i].getElementsByTagName("li");
				console.log("baalls",balls.length);
				for(j=0;j<balls.length;j++)
				{
					tempover.push(balls[j].innerHTML.trim());
				}

				$scope.recentOvers.push(tempover);

			}
			console.log($scope.recentOvers);
			 $timeout(tick, 10000);
			
		});
	 		})();
	};

}]);



