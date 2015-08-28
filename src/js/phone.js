var OAUTH_TOKEN		= 'dj0yJmk9UFpEY01kYWhVYUp1JmQ9WVdrOVJrNVlSMEZWTkhFbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD0zNg--';
var OAUTH_SECRET	= 'f2ff4e36bc93845b18e8c6181916c1c290458001';

var LEAGUE_ID		= '';
var TEAM_ID			= '';

var LEAGUE_NAME		= '';
var USER_NAME		= '';
var OPPONENT_NAME	= '';

var USER_SCORE		= '';
var OPPONENT_SCORE	= '';

Pebble.addEventListener("ready", function(e){
	Pebble.sendAppMessage({"DATA" : ""});
});

Pebble.addEventListener("appmessage", function(e){
	var request = e.payload.DATA;
	
	var url = '';
	
	if(request === "HOME"){
		url = 'http://fantasysports.yahooapis.com/fantasy/v2/league/nfl.l.'+LEAGUE_ID+'/scoreboard';
		//Pebble.sendAppMessage({"HOME_OPPONENT" : "vs Optimus Prime", "HOME_LEAGUE" : "Transformers", "HOME_TEAM" : "Megatron"});
	}
	else if(request === "MATCHUP"){
		url = 'http://fantasysports.yahooapis.com/fantasy/v2/league/nfl.l.'+LEAGUE_ID+'/scoreboard';
		
		/*
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
		*/
	}
	else if(request === "LEAGUE"){
		url = 'http://fantasysports.yahooapis.com/fantasy/v2/league/nfl.l.'+LEAGUE_ID+'/standings';
		
		/*
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
		*/
	}
	else if(request === "TEAM"){
		url = 'http://fantasysports.yahooapis.com/fantasy/v2/team/nfl.l.'+LEAGUE_ID+'.t.'+TEAM_ID+'/roster';	
	
		/*
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
		*/
	}
	
	HTTP_GET(request, url);
});

/*
function delay(){
	var tick = 0;
	while(tick < 2000000000) tick++;
}
*/

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
		
		req.open("GET", url, true);
		req.send();
	}
	catch(err){
		console.error(err);
	}
}

function parseHome(json){
	var result = json.results;
	
	LEAGUE_NAME = result.league.name;
	
	for(var m = 0; m < result.league.scoreboard.matchups.count; m++){
		for(var t = 0; t < result.league.scoreboard.matchups.matchup[m].teams.count; t++){
			if(result.league.scoreboard.matchups.matchup[m].teams.team[t].is_owned_by_current_login === 1){
				TEAM_ID			= result.league.scoreboard.matchups.matchup[m].teams.team[t].team_id;
				USER_NAME		= result.league.scoreboard.matchups.matchup[m].teams.team[t].name;
				OPPONENT_NAME	= result.league.scoreboard.matchups.matchup[m].teams.team[(t+1)%2].name;
			}
		}
	}

	Pebble.sendAppMessage(
		{
			"HOME_OPPONENT" : "vs " + OPPONENT_NAME,
			"HOME_LEAGUE"	: LEAGUE_NAME,
			"HOME_TEAM"		: USER_NAME
		}
	);
}

function parseMatchup(json){
	var result = json.results;
	
	for(var m = 0; m < result.league.scoreboard.matchups.count; m++){
		for(var t = 0; t < result.league.scoreboard.matchups.matchup[m].teams.count; t++){
			if(result.league.scoreboard.matchups.matchup[m].teams.team[t].is_owned_by_current_login === 1){
				USER_SCORE		= result.league.scoreboard.matchups.matchup[m].teams.team[t].team_points.total;
				OPPONENT_SCORE	= result.league.scoreboard.matchups.matchup[m].teams.team[(t+1)%2].team_points.total;
			}
		}
	}
	
	Pebble.sendAppMessage(
		{
			"MATCHUP_OPPONENT_SCORE_INT"	: (OPPONENT_SCORE*100).toFixed(0) + "",
			"MATCHUP_OPPONENT_SCORE_CHAR"	: OPPONENT_SCORE + "",
			"MATCHUP_USER_SCORE_INT"		: (USER_SCORE*100).toFixed(0) + "",
			"MATCHUP_USER_SCORE_CHAR"		: USER_SCORE + ""
		}
	);
}

function parseLeague(json){
	var result = json.results;
	
	var standings = [];
	
	for(var t = 0; t < result.league.num_teams; t++){
		standings.push((t+1) + " " + result.league.standings.teams.team[t].name);
	}
	while(standings.length < 20){
		standings.push("");
	}
	
	Pebble.sendAppMessage(
		{
			"LEAGUE_1"	: standings[0],
			"LEAGUE_2"	: standings[1],
			"LEAGUE_3"	: standings[2],
			"LEAGUE_4"	: standings[3],
			"LEAGUE_5"	: standings[4],
			"LEAGUE_6"	: standings[5],
			"LEAGUE_7"	: standings[6],
			"LEAGUE_8"	: standings[7],
			"LEAGUE_9"	: standings[8],
			"LEAGUE_10"	: standings[9],
			"LEAGUE_11"	: standings[10],
			"LEAGUE_12"	: standings[11],
			"LEAGUE_13"	: standings[12],
			"LEAGUE_14"	: standings[13],
			"LEAGUE_15"	: standings[14],
			"LEAGUE_16"	: standings[15],
			"LEAGUE_17"	: standings[16],
			"LEAGUE_18"	: standings[17],
			"LEAGUE_19"	: standings[18],
			"LEAGUE_20"	: standings[19]
		}
	);
}

function parseTeam(json){
	var result = json.results;
	
	var roster = [];
	
	for(var p = 0; p < result.team.roster.players.count; p++){
		var player = result.team.roster.players.player[p];
		roster.push(player.selected_position.position + " " + player.name.full);
	}
	while(roster.length < 30){
		roster.push("");
	}
	
	Pebble.sendAppMessage(
		{
			"TEAM_1"	: roster[0],
			"TEAM_2"	: roster[1],
			"TEAM_3"	: roster[2],
			"TEAM_4"	: roster[3],
			"TEAM_5"	: roster[4],
			"TEAM_6"	: roster[5],
			"TEAM_7"	: roster[6],
			"TEAM_8"	: roster[7],
			"TEAM_9"	: roster[8],
			"TEAM_10"	: roster[9],
			"TEAM_11"	: roster[10],
			"TEAM_12"	: roster[11],
			"TEAM_13"	: roster[12],
			"TEAM_14"	: roster[13],
			"TEAM_15"	: roster[14],
			"TEAM_16"	: roster[15],
			"TEAM_17"	: roster[16],
			"TEAM_18"	: roster[17],
			"TEAM_19"	: roster[18],
			"TEAM_20"	: roster[19],
			"TEAM_21"	: roster[20],
			"TEAM_22"	: roster[21],
			"TEAM_23"	: roster[22],
			"TEAM_24"	: roster[23],
			"TEAM_25"	: roster[24],
			"TEAM_26"	: roster[25],
			"TEAM_27"	: roster[26],
			"TEAM_28"	: roster[27],
			"TEAM_29"	: roster[28],
			"TEAM_30"	: roster[29]
		}
	);
}

function refreshTokens(){
	
}