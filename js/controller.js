var cricLive = new angular.module('cricLive',['ngSanitize']);
 
 cricLive.filter('split', function() {
        return function(input, splitChar, splitIndex) {
            // do some bounds checking here to ensure it has that index
            return input.split(splitChar)[splitIndex];
        }
    });

cricLive.controller('MainController',['$scope','$http','$timeout',function($scope,$http,$timeout){


	var audio = new Audio('../sound/click.wav');

	$scope.alertToggle = true;
	$scope.team1scoresep = [0,0];
	$scope.team2scoresep = [0,0];

	$scope.getMatches = function(){
		 
	 		$http.get('http://localhost:3001/getallmatches').success(function(response){
	 			$scope.matches = []; //value,label
	 			var tempmatch = response;
	 			for(i=0;i<tempmatch.length;i++)
	 			{
	 				var match = tempmatch[i];
		            var beg = match.indexOf(".com/");
		            var curryear = new Date().getFullYear()-1;
		            var end = match.indexOf(curryear);
		            var matchname = match.substring(beg+5,end-1);
	 				var temparr = {'id':match,'label':matchname};
	 				$scope.matches.push(temparr);
	 			}
			
		});
	};


	$scope.getMatchData = function(selectedmatchip){
		$scope.selectedMatch = selectedmatchip;
		if($scope.tickstat != "running"){
		(function tick() {
			$scope.tickstat = "running";
			var selectedmatch = {"matchurl":$scope.selectedMatch};
	 		$http.post('http://localhost:3001/getmatchdata',selectedmatch).success(function(response){
 			console.log(response);
 			console.log(response.bowling_table);
 			var inningsInfoObject = document.createElement('div');
 			inningsInfoObject.innerHTML = response.innings_info;
 			inningsInfoObject = $(inningsInfoObject);

 			var scoreTableObject = document.createElement('table');
 			scoreTableObject.innerHTML = response.score_table;
 			scoreTableObject = $(scoreTableObject);

 			var recentOversObject = document.createElement('div');
 			recentOversObject.innerHTML = response.recent_overs;
 			recentOversObject = $(recentOversObject);

 			$scope.recentovers = [];
 			try{
 				var nodes = recentOversObject.children(".recent-over");
 				console.log(nodes);
 				
 				for(i=0;i<nodes.length;i++)
 				{
 					var temp = [];
 					for(j=0;j<nodes[i].childElementCount;j++)
 					{
 						temp.push(nodes[i].children[j].innerHTML.trim());
 					}
 					$scope.recentovers.push(temp);
 					//console.log(temp);
 				}
 				console.log($scope.recentovers);
 			}
 			catch(err)
 			{

 			}

 			try
 			{
 				$scope.team1name = inningsInfoObject.children(".team-1-name").clone().children().remove().end().text().trim();
				$scope.team2name = inningsInfoObject.children(".team-2-name").clone().children().remove().end().text().trim();
				$scope.innings_status = inningsInfoObject.children(".innings-requirement").text().trim();

 			}
 			catch(err)
 			{
 				$scope.team1name = "____";
				$scope.team2name = "____";
				
				$scope.innings_status = "unable to retrieve match info. Contact Raiden!!";
 			}

 			try{
				$scope.team1score = inningsInfoObject.children(".team-1-name").children()[0].innerHTML;
				if($scope.team1score == ""){
					console.log("blank");
					$scope.team1score="--/--";
					$scope.team1scoresep=[0,0];
					}
				else{
					console.log("not blank");
					$scope.team1scoresep = $scope.team1score.split('/');
					$scope.team1scoresep[0] = parseInt($scope.team1scoresep[0]);
					$scope.team1scoresep[1] = parseInt($scope.team1scoresep[1].substr(0,2));
					

				}
				console.log("score divide for team1",$scope.team1scoresep);


 			}
 			catch(err){
 				$scope.team1score = "--/--";
 			}

 			try{
				$scope.team2score = inningsInfoObject.children(".team-2-name").children()[0].innerHTML;

				if($scope.team2score == ""){
					$scope.team2score="--/--";
					$scope.team2scoresep =[0,0];
					}
				else{
					$scope.team2scoresep = $scope.team2score.split('/');
					$scope.team2scoresep[0] = parseInt($scope.team2scoresep[0]);
					$scope.team2scoresep[1] = parseInt($scope.team2scoresep[1].substr(0,2));

				}
				console.log("score divide",$scope.team2scoresep);

 			}
 			catch(err){
				$scope.team2score = "--/--";

 			}
 			
			
			console.log($scope.team1name);
			console.log($scope.team1score);
			console.log($scope.team2name);
			console.log($scope.team2score);
			console.log($scope.innings_status);

			try
			{
				$scope.batsmen1 = []; //runs,balls,4,6,StrikeRate
				$scope.batsmen1.push(scoreTableObject.find(".batsmen").find(".row1").children()[0].children[0].text);
				$scope.batsmen1.push(scoreTableObject.find(".batsmen").find(".row1").children()[1].innerHTML);
				$scope.batsmen1.push(scoreTableObject.find(".batsmen").find(".row1").children()[2].innerHTML);
				$scope.batsmen1.push(scoreTableObject.find(".batsmen").find(".row1").children()[3].innerHTML);
				$scope.batsmen1.push(scoreTableObject.find(".batsmen").find(".row1").children()[4].innerHTML);
				$scope.batsmen1.push(scoreTableObject.find(".batsmen").find(".row1").children()[5].innerHTML);
				console.log($scope.batsmen1);
			}
			catch(err)
			{
				$scope.batsmen1 = ["_","_","_","_","_"]; //runs,balls,4,6,StrikeRate
			}

			try
			{
				$scope.batsmen2 = []; //runs,balls,4,6,StrikeRate
				$scope.batsmen2.push(scoreTableObject.find(".batsmen").find(".row2").children()[0].children[0].text);
				$scope.batsmen2.push(scoreTableObject.find(".batsmen").find(".row2").children()[1].innerHTML);
				$scope.batsmen2.push(scoreTableObject.find(".batsmen").find(".row2").children()[2].innerHTML);
				$scope.batsmen2.push(scoreTableObject.find(".batsmen").find(".row2").children()[3].innerHTML);
				$scope.batsmen2.push(scoreTableObject.find(".batsmen").find(".row2").children()[4].innerHTML);
				$scope.batsmen2.push(scoreTableObject.find(".batsmen").find(".row2").children()[5].innerHTML);
				console.log($scope.batsmen2	);
			}

			catch(err)
			{
				$scope.batsmen2 = ["_","_","_","_","_"]; //runs,balls,4,6,StrikeRate				
			}
			

			try
			{
				$scope.bowlerStats = []; //multiple bowlers can be present
				var bowlerNodes = scoreTableObject.find(".bowlers").children()[1].rows.length;
				for(i=0; i<bowlerNodes; i+=1) {
				    var tempbowler=[]; //name,overs,maiden,runs,wicket,ecnonomy
				 	tempbowler.push(scoreTableObject.find(".bowlers").children()[1].children[i].children[0].children[0].text);
				 	tempbowler.push(scoreTableObject.find(".bowlers").children()[1].children[i].children[1].innerHTML); 
				 	tempbowler.push(scoreTableObject.find(".bowlers").children()[1].children[i].children[2].innerHTML); 
				 	tempbowler.push(scoreTableObject.find(".bowlers").children()[1].children[i].children[3].innerHTML); 
				 	tempbowler.push(scoreTableObject.find(".bowlers").children()[1].children[i].children[4].innerHTML); 
				 	tempbowler.push(scoreTableObject.find(".bowlers").children()[1].children[i].children[5].innerHTML); 
				 	$scope.bowlerStats.push(tempbowler);
				}
				console.log($scope.bowlerStats);
			}
			catch(err)
			{
				$scope.bowlerStats = []; //multiple bowlers can be present				
			}
			 $timeout(tick, 10000);
			
		});
	 		})();
	 		}
	};

	

		$scope.$watch('team1scoresep', function(newValue,oldValue){
			if(!angular.isUndefined(newValue) && !angular.isUndefined(oldValue)){
				console.log("oldValue Team1",oldValue);
				console.log("newValue Team1",newValue);
				if((newValue[0] - oldValue[0] == 6)||(newValue[0] - oldValue[0] == 5)||(newValue[0] - oldValue[0] == 7)||(newValue[0] - oldValue[0] == 6)||(newValue[0] - oldValue[0] == 4)){
					if($scope.alertToggle)audio.play();
				}
				if(newValue[1] - oldValue[1] == 1)
					if($scope.alertToggle)audio.play();
			}
		});
		$scope.$watch('team2scoresep', function(oldValue,newValue){
			if(!angular.isUndefined(newValue) && !angular.isUndefined(oldValue)){
				console.log("oldValue Team2",oldValue);
				console.log("newValue Team2",newValue);
				if((newValue[0] - oldValue[0] == 6)||(newValue[0] - oldValue[0] == 5)||(newValue[0] - oldValue[0] == 7)||(newValue[0] - oldValue[0] == 6)||(newValue[0] - oldValue[0] == 4)){
					if($scope.alertToggle)audio.play();
				}
				if(newValue[1] - oldValue[1] == 1)
					if($scope.alertToggle)audio.play();
			}
		});

		

}]);



