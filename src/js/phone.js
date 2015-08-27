Pebble.addEventListener("ready", function(e){
	Pebble.sendAppMessage({"DATA" : ""});
});

Pebble.addEventListener("appmessage", function(e){
	var request = e.payload.DATA;
	
	if(request === "HOME"){
		Pebble.sendAppMessage({"HOME_OPPONENT" : "vs Optimus Prime", "HOME_LEAGUE" : "Transformers", "HOME_TEAM" : "Megatron"});
	}
	else if(request === "MATCHUP"){
		var opp = (Math.random()*1500).toFixed(0);
		var ally= (Math.random()*1500).toFixed(0);
		
		var opp_c = opp/10;
		var ally_c= ally/10;
		
		delay();
		
		Pebble.sendAppMessage(
			{
				"MATCHUP_OPPONENT_NAME" : "Optimus Prime", 
				"MATCHUP_OPPONENT_SCORE_INT" : opp+"", 
				"MATCHUP_OPPONENT_SCORE_CHAR":opp_c+"",
				"MATCHUP_USER_NAME":"Megatron", 
				"MATCHUP_USER_SCORE_INT":ally+"",
				"MATCHUP_USER_SCORE_CHAR":ally_c+""
			}
		);
	}
	else if(request === "LEAGUE"){
		delay();
		Pebble.sendAppMessage(
			{
				"LEAGUE_1" : "1 Megatron",
				"LEAGUE_2" : "2 Optimus Prime",
				"LEAGUE_3" : "3 Bumblebee",
				"LEAGUE_4" : "4 Starscream",
				"LEAGUE_5" : "5 Cliffjumper",
				"LEAGUE_6" : "6 Bonecrusher",
				"LEAGUE_7" : "7 Galvatron",
				"LEAGUE_8" : "8 Autocon"
			}
		);
	}
	else if(request === "TEAM"){
		delay();
		Pebble.sendAppMessage(
			{
				"TEAM_1" : "QB Tom Brady",
				"TEAM_2" : "WR Reggie Wayne",
				"TEAM_3" : "WR Jordy Nelson",
				"TEAM_4" : "RB Marshawn Lynch",
				"TEAM_5" : "RB LeGarret Blount",
				"TEAM_6" : "TE Jimmy Graham",
				"TEAM_7" : "W/R/T Shonn Green",
				"TEAM_8" : "K Adam Vinatieri",
				"TEAM_9" : "D Chicago",
				"TEAM_10": "BN Jonas Gray",
				"TEAM_11": "BN Tim Tebow",
				"TEAM_12": "BN JJ Watt"
			}
		);
	}
});

function delay(){
	var tick = 0;
	while(tick < 2000000000) tick++;
}

function HTTP_GET(type, url){
	try{
		var req = new XMLHttpRequest();
		req.onreadystatechange = function(){
			if(req.readyState === 4 && req.status === 200){	
				if(type === "HOME") parseHome(req.response);
				else if(type === "MATCHUP") parseMatchup(req.response);
				else if(type === "LEAGUE") parseLeague(req.response);
				else if(type === "TEAM") parseTeam(req.response);
			}
			else if(req.readyState === 4 && req.status === 401){
				refreshTokens();
			}
		};
		
		var params;
		
		req.open("GET", url, true);
		req.send(params);
	}
	catch(err){
		console.error(err);
	}
}

function parseHome(json){
	
}

function parseMatchup(json){
	
}

function parseLeague(json){
	
}

function parseTeam(json){
	
}

function refreshTokens(){
	
}