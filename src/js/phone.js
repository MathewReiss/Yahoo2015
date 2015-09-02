var OAUTH_TOKEN		= 'dj0yJmk9UFpEY01kYWhVYUp1JmQ9WVdrOVJrNVlSMEZWTkhFbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD0zNg--';
var OAUTH_SECRET	= 'f2ff4e36bc93845b18e8c6181916c1c290458001';
var OAUTH_SESSION	= '';

var LEAGUE_ID		= '';
var TEAM_ID			= '';

var LEAGUE_NAME		= '';
var USER_NAME		= '';
var OPPONENT_NAME	= '';

var USER_SCORE		= '';
var OPPONENT_SCORE	= '';

var REFRESH_URL		= 'https://ineal.me/pebble/fantasy/api/refresh_token';
var LOGIN_URL		= 'https://ineal.me/pebble/fantasy/api/login';

var END_WEEK = 16;

var SHOW_INJURIES = true;

var SETTINGS_VISIBLE = false;

//PINS

Pebble.addEventListener("ready", function(e){
	SHOW_INJURIES	= localStorage.getItem("SHOW_INJURIES") ? localStorage.getItem("SHOW_INJURIES") : true;
	
	LEAGUE_ID		= localStorage.getItem("LEAGUE_ID");
	
	OAUTH_TOKEN		= localStorage.getItem("OAUTH_TOKEN");
	
	OAUTH_SECRET	= localStorage.getItem("OAUTH_SECRET");
	
	OAUTH_SESSION	= localStorage.getItem("OAUTH_SESSION");
	
	if(!SETTINGS_VISIBLE){
		if(LEAGUE_ID !== null && LEAGUE_ID !== '' && LEAGUE_ID !== undefined){
			Pebble.sendAppMessage({"DATA" : ""});		
		}
		else{
			Pebble.showSimpleNotificationOnPebble("Please Sign In", "Please sign in to your Yahoo! Fantasy Football account through this app's Configuration Page.");
		}
	}
});

Pebble.addEventListener("showConfiguration", function(e){
	SETTINGS_VISIBLE = true;
	
	Pebble.openURL(LOGIN_URL);
});

Pebble.addEventListener("webviewclosed", function(e){
	var response = e.response;
	
	if(JSON.stringify(response) === "" || response.league_id === null || response.league_id === ""){
		if(LEAGUE_ID !== null && LEAGUE_ID !== ''){
			Pebble.sendAppMessage({"DATA" : ""});	
		}
		else{
			Pebble.showSimpleNotificationOnPebble("Please Try Again", "Something went wrong with the sign in process. Please try again.");
		}	
		SETTINGS_VISIBLE = false;
		return;
	}
	
	LEAGUE_ID = response.leauge_id;
	localStorage.setItem("LEAGUE_ID", LEAGUE_ID);
	
	SHOW_INJURIES = response.show_injuries;
	localStorage.setItem("SHOW_INJURIES", SHOW_INJURIES);
	
	OAUTH_TOKEN = response.keys.oauth_token;
	localStorage.setItem("OAUTH_TOKEN", OAUTH_TOKEN);
	
	OAUTH_SECRET = response.keys.oauth_secret;
	localStorage.setItem("OAUTH_SECRET", OAUTH_SECRET);
	
	OAUTH_SESSION = response.keys.oauth_session;
	localStorage.setItem("OAUTH_SESSION", OAUTH_SESSION);
	
	if(LEAGUE_ID !== null && LEAGUE_ID !== ''){
		Pebble.sendAppMessage({"DATA" : ""});	
	}
	else{
		Pebble.showSimpleNotificationOnPebble("Please Try Again", "Something went wrong with the sign in process. Please try again.");
	}
	
	SETTINGS_VISIBLE = false;
});

Pebble.addEventListener("appmessage", function(e){
	var request = e.payload.DATA;
	
	var url = '';
	
	if(request === "HOME"){
		url = 'http://fantasysports.yahooapis.com/fantasy/v2/league/nfl.l.'+LEAGUE_ID+'/scoreboard';
		//Pebble.sendAppMessage({"HOME_OPPONENT" : "vs Optimus Prime", "HOME_LEAGUE" : "Transformers", "HOME_TEAM" : "Megatron", "PRE_DRAFT" : "1"});
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
				"LEAGUE_8" : "8 Autocon",
				"LEAGUE_9" : "",
				"LEAGUE_10": "",
				"LEAGUE_11": "",
				"LEAGUE_12": "",
				"LEAGUE_13": "",
				"LEAGUE_14": "",
				"LEAGUE_15": "",
				"LEAGUE_16": "",
				"LEAGUE_17": "",
				"LEAGUE_18": "",
				"LEAGUE_19": "",
				"LEAGUE_20": ""
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
				"TEAM_2" : "WR Danny Amendola",
				"TEAM_3" : "WR Jeremy Maclin",
				"TEAM_4" : "RB Marshawn Lynch",
				"TEAM_5" : "RB LeGarret Blount",
				"TEAM_6" : "TE Jimmy Graham",
				"TEAM_7" : "RB Shonn Green",
				"TEAM_8" : "K Adam Vinatieri",
				"TEAM_9" : "D Chicago",
				"TEAM_10": "BN Jonas Gray",
				"TEAM_11": "BN Tim Tebow",
				"TEAM_12": "BN JJ Watt"
			}
		);
		
		roster = [];
		
		roster.push("QB Tom Brady");
		roster.push("WR Jeremy Maclin");
		roster.push("WR Danny Amendola");
		
		teams = [];
		
		teams.push("NE");
		teams.push("PHI");
		teams.push("NE");
		
		checkInjuries();
		*/
	}
	
	HTTP_POST(request, url);
});

/*
function delay(){
	var tick = 0;
	while(tick < 2000000000) tick++;
}
*/

function HTTP_POST(type, url){
	try{
		var req = new XMLHttpRequest();
		req.onreadystatechange = function(){
			if(req.readyState === 4){
				if(req.status === 200){	
					if(type === "HOME") parseHome(req.response);
					else if(type === "MATCHUP") parseMatchup(req.response);
					else if(type === "LEAGUE") parseLeague(req.response);
					else if(type === "TEAM") parseTeam(req.response);
				}
				else{//} if(req.status === 401){
					refreshTokens(type, url);
				}
			}
		};
		
		var params = "&format=json&oauth_token=" + OAUTH_TOKEN + "&oauth_secret=" + OAUTH_SECRET;
		
		req.open("POST", url, true);
		req.send(params);
	}
	catch(err){
		console.error(err);
	}
}

function parseHome(json){
	var result = JSON.parse(json).results;
	
	LEAGUE_NAME = result.league.name;
	
	END_WEEK = result.league.end_week;
	
	for(var m = 0; m < result.league.scoreboard.matchups.count; m++){
		for(var t = 0; t < result.league.scoreboard.matchups.matchup[m].teams.count; t++){
			if(result.league.scoreboard.matchups.matchup[m].teams.team[t].is_owned_by_current_login === 1){
				TEAM_ID			= result.league.scoreboard.matchups.matchup[m].teams.team[t].team_id;
				USER_NAME		= result.league.scoreboard.matchups.matchup[m].teams.team[t].name;
				OPPONENT_NAME	= result.league.scoreboard.matchups.matchup[m].teams.team[(t+1)%2].name;
			}
		}
	}
	
	var pre_draft = result.draft_status === "predraft" ? "1" : "0";

	Pebble.sendAppMessage(
		{
			"HOME_OPPONENT" : "vs " + OPPONENT_NAME,
			"HOME_LEAGUE"	: LEAGUE_NAME,
			"HOME_TEAM"		: USER_NAME,
			"PRE_DRAFT"		: pre_draft
		}
	);
	
	timelineRequest();
}

function parseMatchup(json){
	var result = JSON.parse(json).results;
	
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
	var result = JSON.parse(json).results;
	
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

var roster;
var teams;

function parseTeam(json){
	var result = JSON.parse(json).results;
	
	roster = [];
	teams = [];
	
	for(var p = 0; p < result.team.roster.players.count; p++){
		var player = result.team.roster.players.player[p];
		roster.push(player.selected_position.position + " " + player.name.full);
		teams.push(player.editorial_team_abbr.toUpperCase());
	}
	while(roster.length < 30){
		roster.push("");
		teams.push("");
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
	
	if(SHOW_INJURIES) checkInjuries();
}

function checkPlayerForInjury(team, player){
	if(team === null || team === undefined) return;
	for(var i = 0; i < team.length; i++){
		if(team[i].position + " " + team[i].playerName === player){
			Pebble.showSimpleNotificationOnPebble("Injury Update: " + team[i].playerName, "Injury: " + team[i].injury + "\nStatus: " + team[i].gameStatus + (team[i].notes !== "" ? "\n\n" + team[i].notes : "") );
		}
	}
}

function checkInjuries(){
	console.log("Check Injuries");
	
	var req = new XMLHttpRequest();
	var url = 'http://www.fantasyfootballnerd.com/service/injuries/json/mtqc5jxssxgs';
	
	//var url = 'http://www.fantasyfootballnerd.com/service/injuries/json/test/1/';
	
	req.onreadystatechange = function(){
		if(req.readyState === 4 && req.status === 200){
			console.log("Injury Report received...");
			
			var result = JSON.parse(req.response);
			
			for(var p = 0; p < roster.length; p++){
				var team_obj;
				switch(teams[p]){
					case "ARI" : team_obj = result.Injuries.ARI; break;
					case "ATL" : team_obj = result.Injuries.ATL; break;
					case "BAL" : team_obj = result.Injuries.BAL; break;
					case "BUF" : team_obj = result.Injuries.BUF; break;
					case "CAR" : team_obj = result.Injuries.CAR; break;
					case "CHI" : team_obj = result.Injuries.CHI; break;
					case "CIN" : team_obj = result.Injuries.CIN; break;
					case "CLE" : team_obj = result.Injuries.CLE; break;
					case "DAL" : team_obj = result.Injuries.DAL; break;
					case "DEN" : team_obj = result.Injuries.DEN; break;
					case "DET" : team_obj = result.Injuries.DET; break;
					case "GB"  : team_obj = result.Injuries.GB;  break;
					case "HOU" : team_obj = result.Injuries.HOU; break;
					case "IND" : team_obj = result.Injuries.IND; break;
					case "JAC" : team_obj = result.Injuries.JAC; break;
					case "KC"  : team_obj = result.Injuries.KC;  break;
					case "MIA" : team_obj = result.Injuries.MIA; break;
					case "MIN" : team_obj = result.Injuries.MIN; break;
					case "NE"  : team_obj = result.Injuries.NE;  break;
					case "NO"  : team_obj = result.Injuries.NO;  break;
					case "NYG" : team_obj = result.Injuries.NYG; break;
					case "NYJ" : team_obj = result.Injuries.NYJ; break;
					case "OAK" : team_obj = result.Injuries.OAK; break;
					case "PHI" : team_obj = result.Injuries.PHI; break;
					case "PIT" : team_obj = result.Injuries.PIT; break;
					case "SD"  : team_obj = result.Injuries.SD;  break;
					case "SEA" : team_obj = result.Injuries.SEA; break;
					case "SF"  : team_obj = result.Injuries.SF;  break;
					case "STL" : team_obj = result.Injuries.STL; break;
					case "TB"  : team_obj = result.Injuries.TB;  break;
					case "TEN" : team_obj = result.Injuries.TEN; break;
					case "WAS" : team_obj = result.Injuries.WAS; break;
				}
				
				checkPlayerForInjury(team_obj, roster[p]);
			}
		}
	};
	
	req.open("GET", url, true);
	req.send();
}

var retry_counter = 0;

function refreshTokens(currentType, currentUrl){
	//Refresh Token - Expires after 1 hour
	var refresh = new XMLHttpRequest();
	refresh.onreadystatechange = function(){
		if(refresh.readyState === 4){
			if(refresh.status === 200){
				OAUTH_SESSION = JSON.parse(refresh.response).keys.oauth_session;
				localStorage.setItem("OAUTH_SESSION", OAUTH_SESSION);

				//Reset retry attempts
				retry_counter = 0;
				
				//Retry original request
				HTTP_POST(currentType, currentUrl);
			}
			else{
				//If at first you don't succeed...
				if(retry_counter < 3){ retry_counter++; refreshTokens(currentType, currentUrl); }
				else{ retry_counter = 0; Pebble.showSimpleNotificationOnPebble("Error", "Sorry, but an error has occurred. Please sign in again."); }
			}
		}
	};
	
	var params = "";
	
	refresh.open("POST", REFRESH_URL, true);
	refresh.send(params);
}

var API_URL_ROOT = 'https://timeline-api.getpebble.com/';

function timelineRequest(){
	Pebble.getTimelineToken(function(token){
		var times = [];
		times.push({ "time" : "2015-09-10T23:30:00Z", "matchup" : "PIT @ NE" }); //Week 1 - Pitt @ NE
		times.push({ "time" : "2015-09-17T23:25:00Z", "matchup" : "DEN @ KC" });
		times.push({ "time" : "2015-09-24T23:25:00Z", "matchup" : "WAS @ NYG" });
		times.push({ "time" : "2015-10-01T23:25:00Z", "matchup" : "BAL @ PIT" });
		times.push({ "time" : "2015-10-08T23:25:00Z", "matchup" : "IND @ HOU" });
		times.push({ "time" : "2015-10-15T23:25:00Z", "matchup" : "ATL @ NO" });
		times.push({ "time" : "2015-10-22T23:25:00Z", "matchup" : "SEA @ SF" });
		times.push({ "time" : "2015-10-29T23:25:00Z", "matchup" : "MIA @ NE" });
		times.push({ "time" : "2015-11-06T00:25:00Z", "matchup" : "CLE @ CIN" });
		times.push({ "time" : "2015-11-13T00:25:00Z", "matchup" : "BUF @ NYJ" });
		times.push({ "time" : "2015-11-20T00:25:00Z", "matchup" : "TEN @ JAC" });
		times.push({ "time" : "2015-11-26T16:30:00Z", "matchup" : "PHI @ DET" });
		times.push({ "time" : "2015-12-04T00:25:00Z", "matchup" : "GB @ DET" });
		times.push({ "time" : "2015-12-11T00:25:00Z", "matchup" : "MIN @ ARI" });
		times.push({ "time" : "2015-12-18T00:25:00Z", "matchup" : "TB @ STL" });
		times.push({ "time" : "2015-12-25T00:25:00Z", "matchup" : "SD @ OAK" });
		times.push({ "time" : "2016-01-03T18:00:00Z", "matchup" : "All games"});
		
		var pin, url, xhr;
		
		for(var w = 1; w <= END_WEEK; w++){
			pin = {
				"id"			: "lineup_alert_"+w,
				"time"			: times[w-1].time,	
				"duration"		: 60,
				"layout"		: {
					"title"				: "Set lineup for Week " + w,
					"subtitle"			: times[w-1].matchup,
					"body"				: "Game starts in one hour!",
					"type"				: "genericPin",
					"tinyIcon"			: "system://images/NOTIFICATION_YAHOO_MAIL",
					"largeIcon"			: "system://images/NOTIFICATION_YAHOO_MAIL",
					"backgroundColor"	: "#5500AA",
					"secondaryColor"	: "#FFFFFF",
					"primaryColor"		: "#FFFFFF"
				},
				"reminders"		: [
					{
						"time"			: times[w-1].time,
						"layout"		: {
							"type"				: "genericReminder",
							"tinyIcon"			: "system://images/NOTIFICATION_REMINDER",
							"largeIcon"			: "system://images/NOTIFICATION_REMINDER",
							"title"				: "Hey " + USER_NAME + "\nDon't forget to set your lineup for Week " + w + "!"
						}
					}
				],
				"actions"		: [
					{
						"title"			: "Check Lineup",
						"type"			: "openWatchApp",
						"launchCode"	: w
					}
				]
			};
			url = API_URL_ROOT + 'v1/user/pins/' + pin.id;
			xhr = new XMLHttpRequest();
			
			xhr.open('PUT', url);
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.setRequestHeader('X-User-Token', '' + token);
			xhr.send(JSON.stringify(pin));
		}
	});
}