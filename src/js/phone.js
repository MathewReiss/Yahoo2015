var TESTING = true; //Use mock data
var DEBUG = true; //Log results

/*
var OAUTH_TOKEN			= 'dj0yJmk9UFpEY01kYWhVYUp1JmQ9WVdrOVJrNVlSMEZWTkhFbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD0zNg--';
var OAUTH_TOKEN_SECRET	= 'f2ff4e36bc93845b18e8c6181916c1c290458001';
*/

var ACCESS_TOKEN		= '';
var ACCESS_TOKEN_SECRET	= '';
var SESSION_HANDLE		= '';

var LEAGUE_ID		= '';
var TEAM_ID			= '';

var LEAGUE_NAME		= '';
var USER_NAME		= '';
var OPPONENT_NAME	= ''; 

var USER_SCORE		= '';
var OPPONENT_SCORE	= '';

var REFRESH_URL		= 'https://ineal.me/pebble/fantasy/api/refresh';
var LOGIN_URL		= 'https://ineal.me/pebble/fantasy/api/login';
var BASE_URL		= 'https://ineal.me/pebble/fantasy/api/yql';

var CURRENT_WEEK = 1;
var END_WEEK = 16;

var SETTINGS_VISIBLE = false;

Pebble.addEventListener("ready", function(e){
	if(TESTING){
		LEAGUE_ID = 'X';
	}
	else{
		LEAGUE_ID			= localStorage.getItem("LEAGUE_ID");
		
		ACCESS_TOKEN		= localStorage.getItem("ACCESS_TOKEN");
		
		ACCESS_TOKEN_SECRET	= localStorage.getItem("ACCESS_TOKEN_SECRET");
		
		SESSION_HANDLE		= localStorage.getItem("SESSION_HANDLE");
	}
	
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
	
	if(!TESTING) Pebble.openURL(LOGIN_URL);
});

Pebble.addEventListener("webviewclosed", function(e){
	if(TESTING) return;
	
	var response = e.response;
	
	console.log(response);
	
	if(JSON.stringify(response) === "" || response === undefined || response === null || response.league_id === null || response.league_id === ""){
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
	
	ACCESS_TOKEN = response.keys.access_token;
	localStorage.setItem("ACCESS_TOKEN", ACCESS_TOKEN);
	
	ACCESS_TOKEN_SECRET = response.keys.access_token_secret;
	localStorage.setItem("ACCESS_TOKEN_SECRET", ACCESS_TOKEN_SECRET);
	
	SESSION_HANDLE = response.keys.session_handle;
	localStorage.setItem("SESSION_HANDLE", SESSION_HANDLE);
	
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
	
	var url = BASE_URL, params = '';
	
	if(request === "HOME"){
		params = "q=select * from fantasysports.leagues.scoreboard where league_key='nfl.l."+LEAGUE_ID+"'";
		
		if(TESTING){
			Pebble.sendAppMessage(
				{
					"HOME_OPPONENT" : "vs Optimus Prime", 
					"HOME_LEAGUE" : "Transformers", 
					"HOME_TEAM" : "Megatron", 
					"PRE_DRAFT" : "0"
				}
			);
			
			timelineRequest();
		}
	}
	else if(request === "MATCHUP"){
		params = "q=select * from fantasysports.leagues.scoreboard where league_key='nfl.l."+LEAGUE_ID+"'";
		
		if(TESTING){
			var opp = (Math.random()*15000).toFixed(0);
			var ally= (Math.random()*15000).toFixed(0);
			
			var opp_c = opp/100;
			var ally_c= ally/100;
			
			delay();
			
			Pebble.sendAppMessage(
				{
					"MATCHUP_OPPONENT_NAME" : "Optimus Prime", 
					"MATCHUP_OPPONENT_SCORE_INT" : "10235",//opp+"", 
					"MATCHUP_OPPONENT_SCORE_CHAR": "102.35",//opp_c+"",
					"MATCHUP_USER_NAME":"Megatron", 
					"MATCHUP_USER_SCORE_INT": "11527",//ally+"",
					"MATCHUP_USER_SCORE_CHAR": "115.27"//ally_c+""
				}
			);
		}
	}
	else if(request === "LEAGUE"){
		params = "q=select * from fantasysports.leagues.standings where league_key='nfl.l."+LEAGUE_ID+"'";
		
		if(TESTING){
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
		}
	}
	else if(request === "TEAM"){
		params = "q=select * from fantasysports.teams.roster where team_key='nfl.l."+LEAGUE_ID+".t."+TEAM_ID+"'";
	
		if(TESTING){
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
					"TEAM_12": "BN JJ Watt",
					"TEAM_13": "",
					"TEAM_14": "",
					"TEAM_15": ""
				}
			);
			
			roster = [];
			
			roster.push("QB Tom Brady");
			roster.push("WR Danny Amendola");
			roster.push("WR Jeremy Maclin");
			roster.push("RB Marshawn Lynch");
			roster.push("TE Jimmy Graham");
			roster.push("K Adam Vinatieri");
			roster.push("D Chicago");
			roster.push("BN Jonas Gray");
			roster.push("BN Tim Tebow");
			
			teams = [];
			
			teams.push("NE");
			teams.push("GB");
			teams.push("PHI");
			teams.push("SEA");
			teams.push("NO");
			teams.push("IND");
			teams.push("CHI");
			teams.push("NE");
			teams.push("PHI");
			
			checkInjuries();
		}
	}
	
	params.replace(/ /g, '%20').replace(/\*/g, '%2A').replace(/=/g, '%3D').replace(/'/g, '%27');
	
	if(DEBUG) console.log("Params: " + params);
	
	params += '&format=json&oauth_token='+ACCESS_TOKEN+'&oauth_secret'+ACCESS_TOKEN_SECRET;
	
	if(!TESTING) HTTP_POST(request, url, params);
});


function delay(){
	var tick = 0;
	while(tick < 200000000) tick++;
}


function HTTP_POST(type, url, params){
	try{
		if(DEBUG) console.log("URL: " + url);
		//console.log("Params: " + params);
		
		var req = new XMLHttpRequest();
		req.onreadystatechange = function(){
			if(req.readyState === 4){
				if(DEBUG) console.log("Response: " + JSON.stringify(req.response));
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
		
		req.open("POST", url, true);
		req.send(params);
	}
	catch(err){
		console.error(err);
	}
}

function parseHome(json){
	var result = JSON.parse(json).results;
	
	if(DEBUG) console.log("JSON Stringify: " + JSON.stringify(result));
	
	LEAGUE_NAME = result.league.name;
	
	CURRENT_WEEK = result.league.current_week;
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

var standings;

function parseLeague(json){
	var result = JSON.parse(json).results;
	
	standings = [];
	
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
		if(player.selected_position.position !== "BN") teams.push(player.editorial_team_abbr.toUpperCase());
		else teams.push("BN");
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
	
	checkInjuries();
}

function checkPlayerForInjury(team, player){
	if(team === null) return;
	
	for(var i = 0; i < team.length; i++){
		if(team[i].position + " " + team[i].playerName === player){
			Pebble.showSimpleNotificationOnPebble("Injury Update: " + team[i].playerName, "Injury: " + team[i].injury + "\nStatus: " + team[i].gameStatus + (team[i].notes !== "" ? "\n\n" + team[i].notes : "") );
		}
	}
}

function checkInjuries(){
	if(DEBUG) console.log("Check Injuries");
	
	var req = new XMLHttpRequest();

	var url = '';
	if(TESTING) url = 'http://www.fantasyfootballnerd.com/service/injuries/json/test/1/';
	else url = 'http://www.fantasyfootballnerd.com/service/injuries/json/mtqc5jxssxgs';
	
	req.onreadystatechange = function(){
		if(req.readyState === 4 && req.status === 200){
			if(DEBUG) console.log("Injury Report received...");
			
			var result = JSON.parse(req.response);
			
			if(result !== null){
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
			
			timelineRequest2();
		}
	};
	
	req.open("GET", url, true);
	req.send();
}

var retry_counter = 0;

function refreshTokens(currentType, currentUrl){
	//Refresh Access Token - Expires after 1 hour
	var refresh = new XMLHttpRequest();
	refresh.onreadystatechange = function(){
		if(refresh.readyState === 4){
			if(refresh.status === 200){
				var response = JSON.parse(refresh.response);
				
				ACCESS_TOKEN = response.keys.access_token;
				localStorage.setItem("ACCESS_TOKEN", ACCESS_TOKEN);
				
				ACCESS_TOKEN_SECRET = response.keys.access_token_secret;
				localStorage.setItem("ACCESS_TOKEN_SECRET", ACCESS_TOKEN_SECRET);
				
				SESSION_HANDLE = response.keys.session_handle;
				localStorage.setItem("SESSION_HANDLE", SESSION_HANDLE);

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
	
	var params = "oauth_token="+ACCESS_TOKEN+"&oauth_secret="+ACCESS_TOKEN_SECRET+"&oauth_session_handle="+SESSION_HANDLE;
	
	refresh.open("POST", REFRESH_URL, true);
	refresh.send(params);
}

var API_URL_ROOT = 'https://timeline-api.getpebble.com/';

function timelineRequest(){
	Pebble.getTimelineToken(function(token){
		var times = [];
		
		times.push({ "time" : "2015-09-10T23:30:00Z", "matchup" : "PIT @ NE" });	// Week 1 
		times.push({ "time" : "2015-09-17T23:25:00Z", "matchup" : "DEN @ KC" });	// Week 2
		times.push({ "time" : "2015-09-24T23:25:00Z", "matchup" : "WAS @ NYG" });	// Week 3
		times.push({ "time" : "2015-10-01T23:25:00Z", "matchup" : "BAL @ PIT" });	// Week 4
		times.push({ "time" : "2015-10-08T23:25:00Z", "matchup" : "IND @ HOU" });	// Week 5
		times.push({ "time" : "2015-10-15T23:25:00Z", "matchup" : "ATL @ NO" });	// Week 6
		times.push({ "time" : "2015-10-22T23:25:00Z", "matchup" : "SEA @ SF" });	// Week 7
		times.push({ "time" : "2015-10-29T23:25:00Z", "matchup" : "MIA @ NE" });	// Week 8
		times.push({ "time" : "2015-11-06T00:25:00Z", "matchup" : "CLE @ CIN" });	// Week 9
		times.push({ "time" : "2015-11-13T00:25:00Z", "matchup" : "BUF @ NYJ" });	// Week 10
		times.push({ "time" : "2015-11-20T00:25:00Z", "matchup" : "TEN @ JAC" });	// Week 11
		times.push({ "time" : "2015-11-26T16:30:00Z", "matchup" : "PHI @ DET" });	// Week 12
		times.push({ "time" : "2015-12-04T00:25:00Z", "matchup" : "GB @ DET" });	// Week 13
		times.push({ "time" : "2015-12-11T00:25:00Z", "matchup" : "MIN @ ARI" });	// Week 14
		times.push({ "time" : "2015-12-18T00:25:00Z", "matchup" : "TB @ STL" });	// Week 15
		times.push({ "time" : "2015-12-25T00:25:00Z", "matchup" : "SD @ OAK" });	// Week 16
		times.push({ "time" : "2016-01-03T17:00:00Z", "matchup" : "All Games"});	// Week 17
		
		var pin, url, xhr;
		
		for(var w = CURRENT_WEEK; w <= END_WEEK/* && w - CURRENT_WEEK < 10*/; w++){
			pin = {
				"id"			: "lineup_alert_"+w,
				"time"			: times[w-1].time,	
				"duration"		: 60,
				"layout"		: {
					"title"				: "Set lineup for Week " + w,
					"subtitle"			: times[w-1].matchup,
					"body"				: "Kickoff in 1 hour!",
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
							"tinyIcon"			: "system://images/NOTIFICATION_YAHOO_MAIL",
							"largeIcon"			: "system://images/NOTIFICATION_YAHOO_MAIL",
							"title"				: "Hey " + USER_NAME + ",\nDon't forget to set your lineup for Week " + w + "!"
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

function timelineRequest2(){
	Pebble.getTimelineToken(function(token){
		var pin, url, xhr;
		
		for(var g = 0; g < schedule.week[CURRENT_WEEK-1].games.length; g++){
			for(var t = 0; t < teams.length; t++){
				if(schedule.week[CURRENT_WEEK-1].games[g].homeTeam === teams[t] || schedule.week[CURRENT_WEEK-1].games[g].awayTeam === teams[t]){
					
					pin = {
						"id"		: "game_alert_"+t+"_"+g,
						"time"		: schedule.week[CURRENT_WEEK-1].games[g].pin_time,
						"duration"	: 210,
						"layout" : {
							"title"		: schedule.week[CURRENT_WEEK-1].games[g].matchup,
							"locationName"	: schedule.week[CURRENT_WEEK-1].games[g].channel,
							"body"			: "Someone on your fantasy team is playing in this game!",
							"tinyIcon"	: "system://images/TV_SHOW",
							"largeIcon"	: "system://images/TV_SHOW",
							"type"		: "calendarPin",
							"primaryColor"		: "#FFFFFF",
							"secondaryColor"	: "#FFFFFF",
							"backgroundColor"	: "#5500AA"
						}
					};
					
					url = API_URL_ROOT + 'v1/user/pins/' + pin.id;
					xhr = new XMLHttpRequest();
					
					xhr.open('PUT', url);
					xhr.setRequestHeader('Content-Type', 'application/json');
					xhr.setRequestHeader('X-User-Token', '' + token);
					xhr.send(JSON.stringify(pin));
					
					break;
				}
			}
		}
	});
}

var schedule = 
	{ "week":
		[
			{"games":
				[
					{"homeTeam":"NE","awayTeam":"PIT","matchup":"PIT @ NE","pin_time":"2015-09-11T00:30:00Z","channel":"NBC"},
					{"homeTeam":"CHI","awayTeam":"GB","matchup":"GB @ CHI","pin_time":"2015-09-13T17:00:00Z","channel":"FOX"},
					{"homeTeam":"HOU","awayTeam":"KC","matchup":"KC @ HOU","pin_time":"2015-09-13T17:00:00Z","channel":"CBS"},
					{"homeTeam":"NYJ","awayTeam":"CLE","matchup":"CLE @ NYJ","pin_time":"2015-09-13T17:00:00Z","channel":"CBS"},
					{"homeTeam":"BUF","awayTeam":"IND","matchup":"IND @ BUF","pin_time":"2015-09-13T17:00:00Z","channel":"CBS"},
					{"homeTeam":"WAS","awayTeam":"MIA","matchup":"MIA @ WAS","pin_time":"2015-09-13T17:00:00Z","channel":"CBS"},
					{"homeTeam":"JAC","awayTeam":"CAR","matchup":"CAR @ JAC","pin_time":"2015-09-13T17:00:00Z","channel":"FOX"},
					{"homeTeam":"STL","awayTeam":"SEA","matchup":"SEA @ STL","pin_time":"2015-09-13T17:00:00Z","channel":"FOX"},
					{"homeTeam":"ARI","awayTeam":"NO","matchup":"NO @ ARI","pin_time":"2015-09-13T20:05:00Z","channel":"FOX"},
					{"homeTeam":"SD","awayTeam":"DET","matchup":"DET @ SD","pin_time":"2015-09-13T20:05:00Z","channel":"FOX"},
					{"homeTeam":"TB","awayTeam":"TEN","matchup":"TEN @ TB","pin_time":"2015-09-13T20:25:00Z","channel":"CBS"},
					{"homeTeam":"OAK","awayTeam":"CIN","matchup":"CIN @ OAK","pin_time":"2015-09-13T20:25:00Z","channel":"CBS"},
					{"homeTeam":"DEN","awayTeam":"BAL","matchup":"BAL @ DEN","pin_time":"2015-09-13T20:25:00Z","channel":"CBS"},
					{"homeTeam":"DAL","awayTeam":"NYG","matchup":"NYG @ DAL","pin_time":"2015-09-14T00:30:00Z","channel":"NBC"},
					{"homeTeam":"ATL","awayTeam":"PHI","matchup":"PHI @ ATL","pin_time":"2015-09-14T23:10:00Z","channel":"ESPN"},
					{"homeTeam":"SF","awayTeam":"MIN","matchup":"MIN @ SF","pin_time":"2015-09-15T02:20:00Z","channel":"ESPN"}
				]
			},
			//Week 1 Adjusted
			{"games":
				[
					{"homeTeam":"KC","awayTeam":"DEN","matchup":"DEN @ KC","pin_time":"2015-09-18T00:25:00Z","channel":"CBS"},
					{"homeTeam":"CAR","awayTeam":"HOU","matchup":"HOU @ CAR","pin_time":"2015-09-20T17:00:00Z","channel":"CBS"},
					{"homeTeam":"PIT","awayTeam":"SF","matchup":"SF @ PIT","pin_time":"2015-09-20T17:00:00Z","channel":"FOX"},
					{"homeTeam":"NO","awayTeam":"TB","matchup":"TB @ NO","pin_time":"2015-09-20T17:00:00Z","channel":"FOX"},
					{"homeTeam":"MIN","awayTeam":"DET","matchup":"DET @ MIN","pin_time":"2015-09-20T17:00:00Z","channel":"FOX"},
					{"homeTeam":"CHI","awayTeam":"ARI","matchup":"ARI @ CHI","pin_time":"2015-09-20T17:00:00Z","channel":"FOX"},
					{"homeTeam":"BUF","awayTeam":"NE","matchup":"NE @ BUF","pin_time":"2015-09-20T17:00:00Z","channel":"CBS"},
					{"homeTeam":"CIN","awayTeam":"SD","matchup":"SD @ CIN","pin_time":"2015-09-20T17:00:00Z","channel":"CBS"},
					{"homeTeam":"CLE","awayTeam":"TEN","matchup":"TEN @ CLE","pin_time":"2015-09-20T17:00:00Z","channel":"CBS"},
					{"homeTeam":"NYG","awayTeam":"ATL","matchup":"ATL @ NYG","pin_time":"2015-09-20T17:00:00Z","channel":"FOX"},
					{"homeTeam":"WAS","awayTeam":"STL","matchup":"STL @ WAS","pin_time":"2015-09-20T17:00:00Z","channel":"FOX"},
					{"homeTeam":"JAC","awayTeam":"MIA","matchup":"MIA @ JAC","pin_time":"2015-09-20T20:05:00Z","channel":"CBS"},
					{"homeTeam":"OAK","awayTeam":"BAL","matchup":"BAL @ OAK","pin_time":"2015-09-20T20:05:00Z","channel":"CBS"},
					{"homeTeam":"PHI","awayTeam":"DAL","matchup":"DAL @ PHI","pin_time":"2015-09-20T20:25:00Z","channel":"FOX"},
					{"homeTeam":"GB","awayTeam":"SEA","matchup":"SEA @ GB","pin_time":"2015-09-21T00:30:00Z","channel":"NBC"},
					{"homeTeam":"IND","awayTeam":"NYJ","matchup":"NYJ @ IND","pin_time":"2015-09-22T00:30:00Z","channel":"ESPN"}
				]
			},
			//Week 2 Adjusted
			{"games":
				[
					{"homeTeam":"NYG","awayTeam":"WAS","matchup":"WAS @ NYG","pin_time":"2015-09-25T00:25:00Z","channel":"CBS"},
					{"homeTeam":"DAL","awayTeam":"ATL","matchup":"ATL @ DAL","pin_time":"2015-09-27T17:00:00Z","channel":"FOX"},
					{"homeTeam":"TEN","awayTeam":"IND","matchup":"IND @ TEN","pin_time":"2015-09-27T17:00:00Z","channel":"CBS"},
					{"homeTeam":"CLE","awayTeam":"OAK","matchup":"OAK @ CLE","pin_time":"2015-09-27T17:00:00Z","channel":"CBS"},
					{"homeTeam":"BAL","awayTeam":"CIN","matchup":"CIN @ BAL","pin_time":"2015-09-27T17:00:00Z","channel":"CBS"},
					{"homeTeam":"NE","awayTeam":"JAC","matchup":"JAC @ NE","pin_time":"2015-09-27T17:00:00Z","channel":"CBS"},
					{"homeTeam":"CAR","awayTeam":"NO","matchup":"NO @ CAR","pin_time":"2015-09-27T17:00:00Z","channel":"FOX"},
					{"homeTeam":"NYJ","awayTeam":"PHI","matchup":"PHI @ NYJ","pin_time":"2015-09-27T17:00:00Z","channel":"FOX"},
					{"homeTeam":"HOU","awayTeam":"TB","matchup":"TB @ HOU","pin_time":"2015-09-27T17:00:00Z","channel":"FOX"},
					{"homeTeam":"MIN","awayTeam":"SD","matchup":"SD @ MIN","pin_time":"2015-09-27T17:00:00Z","channel":"CBS"},
					{"homeTeam":"STL","awayTeam":"PIT","matchup":"PIT @ STL","pin_time":"2015-09-27T17:00:00Z","channel":"CBS"},
					{"homeTeam":"ARI","awayTeam":"SF","matchup":"SF @ ARI","pin_time":"2015-09-27T20:05:00Z","channel":"FOX"},
					{"homeTeam":"MIA","awayTeam":"BUF","matchup":"BUF @ MIA","pin_time":"2015-09-27T20:25:00Z","channel":"CBS"},
					{"homeTeam":"SEA","awayTeam":"CHI","matchup":"CHI @ SEA","pin_time":"2015-09-27T20:25:00Z","channel":"CBS"},
					{"homeTeam":"DET","awayTeam":"DEN","matchup":"DEN @ DET","pin_time":"2015-09-28T00:30:00Z","channel":"NBC"},
					{"homeTeam":"GB","awayTeam":"KC","matchup":"KC @ GB","pin_time":"2015-09-29T00:30:00Z","channel":"ESPN"}
				]
			},
			//Week 3 Adjusted
			{"games":
				[
					{"homeTeam":"PIT","awayTeam":"BAL","matchup":"BAL @ PIT","pin_time":"2015-10-02T00:25:00Z","channel":"CBS"},
					{"homeTeam":"MIA","awayTeam":"NYJ","matchup":"NYJ @ MIA","pin_time":"2015-10-04T13:30:00Z","channel":"CBS"},
					{"homeTeam":"IND","awayTeam":"JAC","matchup":"JAC @ IND","pin_time":"2015-10-04T17:00:00Z","channel":"CBS"},
					{"homeTeam":"BUF","awayTeam":"NYG","matchup":"NYG @ BUF","pin_time":"2015-10-04T17:00:00Z","channel":"FOX"},
					{"homeTeam":"TB","awayTeam":"CAR","matchup":"CAR @ TB","pin_time":"2015-10-04T17:00:00Z","channel":"FOX"},
					{"homeTeam":"WAS","awayTeam":"PHI","matchup":"PHI @ WAS","pin_time":"2015-10-04T17:00:00Z","channel":"FOX"},
					{"homeTeam":"CHI","awayTeam":"OAK","matchup":"OAK @ CHI","pin_time":"2015-10-04T17:00:00Z","channel":"CBS"},
					{"homeTeam":"ATL","awayTeam":"HOU","matchup":"HOU @ ATL","pin_time":"2015-10-04T17:00:00Z","channel":"CBS"},
					{"homeTeam":"CIN","awayTeam":"KC","matchup":"KC @ CIN","pin_time":"2015-10-04T17:00:00Z","channel":"CBS"},
					{"homeTeam":"SD","awayTeam":"CLE","matchup":"CLE @ SD","pin_time":"2015-10-04T20:05:00Z","channel":"CBS"},
					{"homeTeam":"SF","awayTeam":"GB","matchup":"GB @ SF","pin_time":"2015-10-04T20:25:00Z","channel":"FOX"},
					{"homeTeam":"ARI","awayTeam":"STL","matchup":"STL @ ARI","pin_time":"2015-10-04T20:25:00Z","channel":"FOX"},
					{"homeTeam":"DEN","awayTeam":"MIN","matchup":"MIN @ DEN","pin_time":"2015-10-04T20:25:00Z","channel":"FOX"},
					{"homeTeam":"NO","awayTeam":"DAL","matchup":"DAL @ NO","pin_time":"2015-10-05T00:30:00Z","channel":"NBC"},
					{"homeTeam":"SEA","awayTeam":"DET","matchup":"DET @ SEA","pin_time":"2015-10-06T00:30:00Z","channel":"ESPN"}
				]
			},
			//Week 4 Adjusted
			{"games":
				[
					{"homeTeam":"HOU","awayTeam":"IND","matchup":"IND @ HOU","pin_time":"2015-10-09T00:25:00Z","channel":"CBS"},
					{"homeTeam":"KC","awayTeam":"CHI","matchup":"CHI @ KC","pin_time":"2015-10-11T17:00:00Z","channel":"FOX"},
					{"homeTeam":"CIN","awayTeam":"SEA","matchup":"SEA @ CIN","pin_time":"2015-10-11T17:00:00Z","channel":"FOX"},
					{"homeTeam":"ATL","awayTeam":"WAS","matchup":"WAS @ ATL","pin_time":"2015-10-11T17:00:00Z","channel":"FOX"},
					{"homeTeam":"TB","awayTeam":"JAC","matchup":"JAC @ TB","pin_time":"2015-10-11T17:00:00Z","channel":"CBS"},
					{"homeTeam":"PHI","awayTeam":"NO","matchup":"NO @ PHI","pin_time":"2015-10-11T17:00:00Z","channel":"FOX"},
					{"homeTeam":"BAL","awayTeam":"CLE","matchup":"CLE @ BAL","pin_time":"2015-10-11T17:00:00Z","channel":"CBS"},
					{"homeTeam":"GB","awayTeam":"STL","matchup":"STL @ GB","pin_time":"2015-10-11T17:00:00Z","channel":"CBS"},
					{"homeTeam":"TEN","awayTeam":"BUF","matchup":"BUF @ TEN","pin_time":"2015-10-11T17:00:00Z","channel":"CBS"},
					{"homeTeam":"DET","awayTeam":"ARI","matchup":"ARI @ DET","pin_time":"2015-10-11T20:05:00Z","channel":"FOX"},
					{"homeTeam":"DAL","awayTeam":"NE","matchup":"NE @ DAL","pin_time":"2015-10-11T20:25:00Z","channel":"CBS"},
					{"homeTeam":"OAK","awayTeam":"DEN","matchup":"DEN @ OAK","pin_time":"2015-10-11T20:25:00Z","channel":"CBS"},
					{"homeTeam":"NYG","awayTeam":"SF","matchup":"SF @ NYG","pin_time":"2015-10-12T00:30:00Z","channel":"NBC"},
					{"homeTeam":"SD","awayTeam":"PIT","matchup":"PIT @ SD","pin_time":"2015-10-13T00:30:00Z","channel":"ESPN"}
				]
			},
			//Week 5 Adjusted
			{"games":
				[
					{"homeTeam":"NO","awayTeam":"ATL","matchup":"ATL @ NO","pin_time":"2015-10-16T00:25:00Z","channel":"CBS"},
					{"homeTeam":"NYJ","awayTeam":"WAS","matchup":"WAS @ NYJ","pin_time":"2015-10-18T17:00:00Z","channel":"FOX"},
					{"homeTeam":"PIT","awayTeam":"ARI","matchup":"ARI @ PIT","pin_time":"2015-10-18T17:00:00Z","channel":"FOX"},
					{"homeTeam":"MIN","awayTeam":"KC","matchup":"KC @ MIN","pin_time":"2015-10-18T17:00:00Z","channel":"CBS"},
					{"homeTeam":"BUF","awayTeam":"CIN","matchup":"CIN @ BUF","pin_time":"2015-10-18T17:00:00Z","channel":"CBS"},
					{"homeTeam":"DET","awayTeam":"CHI","matchup":"CHI @ DET","pin_time":"2015-10-18T17:00:00Z","channel":"FOX"},
					{"homeTeam":"CLE","awayTeam":"DEN","matchup":"DEN @ CLE","pin_time":"2015-10-18T17:00:00Z","channel":"CBS"},
					{"homeTeam":"JAC","awayTeam":"HOU","matchup":"HOU @ JAC","pin_time":"2015-10-18T17:00:00Z","channel":"CBS"},
					{"homeTeam":"TEN","awayTeam":"MIA","matchup":"MIA @ TEN","pin_time":"2015-10-18T17:00:00Z","channel":"CBS"},
					{"homeTeam":"SEA","awayTeam":"CAR","matchup":"CAR @ SEA","pin_time":"2015-10-18T20:05:00Z","channel":"FOX"},
					{"homeTeam":"GB","awayTeam":"SD","matchup":"SD @ GB","pin_time":"2015-10-18T20:25:00Z","channel":"CBS"},
					{"homeTeam":"SF","awayTeam":"BAL","matchup":"BAL @ SF","pin_time":"2015-10-18T20:25:00Z","channel":"CBS"},
					{"homeTeam":"IND","awayTeam":"NE","matchup":"NE @ IND","pin_time":"2015-10-19T00:30:00Z","channel":"NBC"},
					{"homeTeam":"PHI","awayTeam":"NYG","matchup":"NYG @ PHI","pin_time":"2015-10-20T00:30:00Z","channel":"ESPN"}
				]
			},
			//Week 6 Adjusted
			{"games":
				[
					{"homeTeam":"SF","awayTeam":"SEA","matchup":"SEA @ SF","pin_time":"2015-10-23T00:25:00Z","channel":"CBS"},
					{"homeTeam":"JAC","awayTeam":"BUF","matchup":"BUF @ JAC","pin_time":"2015-10-25T13:30:00Z","channel":"ESPN"},
					{"homeTeam":"WAS","awayTeam":"TB","matchup":"TB @ WAS","pin_time":"2015-10-25T17:00:00Z","channel":"FOX"},
					{"homeTeam":"TEN","awayTeam":"ATL","matchup":"ATL @ TEN","pin_time":"2015-10-25T17:00:00Z","channel":"FOX"},
					{"homeTeam":"IND","awayTeam":"NO","matchup":"NO @ IND","pin_time":"2015-10-25T17:00:00Z","channel":"FOX"},
					{"homeTeam":"DET","awayTeam":"MIN","matchup":"MIN @ DET","pin_time":"2015-10-25T17:00:00Z","channel":"FOX"},
					{"homeTeam":"KC","awayTeam":"PIT","matchup":"PIT @ KC","pin_time":"2015-10-25T17:00:00Z","channel":"CBS"},
					{"homeTeam":"STL","awayTeam":"CLE","matchup":"CLE @ STL","pin_time":"2015-10-25T17:00:00Z","channel":"CBS"},
					{"homeTeam":"MIA","awayTeam":"HOU","matchup":"HOU @ MIA","pin_time":"2015-10-25T17:00:00Z","channel":"CBS"},
					{"homeTeam":"NE","awayTeam":"NYJ","matchup":"NYJ @ NE","pin_time":"2015-10-25T17:00:00Z","channel":"CBS"},
					{"homeTeam":"SD","awayTeam":"OAK","matchup":"OAK @ SD","pin_time":"2015-10-25T20:05:00Z","channel":"CBS"},
					{"homeTeam":"NYG","awayTeam":"DAL","matchup":"DAL @ NYG","pin_time":"2015-10-25T20:25:00Z","channel":"FOX"},
					{"homeTeam":"CAR","awayTeam":"PHI","matchup":"PHI @ CAR","pin_time":"2015-10-26T00:30:00Z","channel":"NBC"},
					{"homeTeam":"ARI","awayTeam":"BAL","matchup":"BAL @ ARI","pin_time":"2015-10-27T00:30:00Z","channel":"ESPN"}
				]
			},
			//Week 7 Adjusted
			{"games":
				[
					{"homeTeam":"NE","awayTeam":"MIA","matchup":"MIA @ NE","pin_time":"2015-10-30T00:25:00Z","channel":"CBS"},
					{"homeTeam":"KC","awayTeam":"DET","matchup":"DET @ KC","pin_time":"2015-11-01T13:30:00Z","channel":"FOX"},
					{"homeTeam":"ATL","awayTeam":"TB","matchup":"TB @ ATL","pin_time":"2015-11-01T17:00:00Z","channel":"FOX"},
					{"homeTeam":"CLE","awayTeam":"ARI","matchup":"ARI @ CLE","pin_time":"2015-11-01T17:00:00Z","channel":"FOX"},
					{"homeTeam":"STL","awayTeam":"SF","matchup":"SF @ STL","pin_time":"2015-11-01T17:00:00Z","channel":"FOX"},
					{"homeTeam":"NO","awayTeam":"NYG","matchup":"NYG @ NO","pin_time":"2015-11-01T17:00:00Z","channel":"FOX"},
					{"homeTeam":"CHI","awayTeam":"MIN","matchup":"MIN @ CHI","pin_time":"2015-11-01T17:00:00Z","channel":"FOX"},
					{"homeTeam":"BAL","awayTeam":"SD","matchup":"SD @ BAL","pin_time":"2015-11-01T17:00:00Z","channel":"CBS"},
					{"homeTeam":"PIT","awayTeam":"CIN","matchup":"CIN @ PIT","pin_time":"2015-11-01T17:00:00Z","channel":"CBS"},
					{"homeTeam":"HOU","awayTeam":"TEN","matchup":"TEN @ HOU","pin_time":"2015-11-01T17:00:00Z","channel":"CBS"},
					{"homeTeam":"OAK","awayTeam":"NYJ","matchup":"NYJ @ OAK","pin_time":"2015-11-01T20:05:00Z","channel":"CBS"},
					{"homeTeam":"DAL","awayTeam":"SEA","matchup":"SEA @ DAL","pin_time":"2015-11-01T20:25:00Z","channel":"FOX"},
					{"homeTeam":"DEN","awayTeam":"GB","matchup":"GB @ DEN","pin_time":"2015-11-02T00:30:00Z","channel":"NBC"},
					{"homeTeam":"CAR","awayTeam":"IND","matchup":"IND @ CAR","pin_time":"2015-11-03T00:30:00Z","channel":"ESPN"}
				]
			},
			//Week 8 Adjusted
			
			//Times should be adjusted +5 hours, since EDT becomes EST
			{"games":
				[
					{"homeTeam":"CIN","awayTeam":"CLE","matchup":"CLE @ CIN","pin_time":"2015-11-06T01:25:00Z","channel":"NF:"},
					{"homeTeam":"CAR","awayTeam":"GB","matchup":"GB @ CAR","pin_time":"2015-11-08T18:00:00Z","channel":"FOX"},
					{"homeTeam":"NE","awayTeam":"WAS","matchup":"WAS @ NE","pin_time":"2015-11-08T18:00:00Z","channel":"FOX"},
					{"homeTeam":"NO","awayTeam":"TEN","matchup":"TEN @ NO","pin_time":"2015-11-08T18:00:00Z","channel":"CBS"},
					{"homeTeam":"BUF","awayTeam":"MIA","matchup":"MIA @ BUF","pin_time":"2015-11-08T18:00:00Z","channel":"CBS"},
					{"homeTeam":"MIN","awayTeam":"STL","matchup":"STL @ MIN","pin_time":"2015-11-08T18:00:00Z","channel":"FOX"},
					{"homeTeam":"NYJ","awayTeam":"JAC","matchup":"JAC @ NYJ","pin_time":"2015-11-08T18:00:00Z","channel":"CBS"},
					{"homeTeam":"PIT","awayTeam":"OAK","matchup":"OAK @ PIT","pin_time":"2015-11-08T18:00:00Z","channel":"CBS"},
					{"homeTeam":"TB","awayTeam":"NYG","matchup":"NYG @ TB","pin_time":"2015-11-08T21:05:00Z","channel":"FOX"},
					{"homeTeam":"SF","awayTeam":"ATL","matchup":"ATL @ SF","pin_time":"2015-11-08T21:05:00Z","channel":"FOX"},
					{"homeTeam":"IND","awayTeam":"DEN","matchup":"DEN @ IND","pin_time":"2015-11-08T21:25:00Z","channel":"CBS"},
					{"homeTeam":"DAL","awayTeam":"PHI","matchup":"PHI @ DAL","pin_time":"2015-11-09T01:30:00Z","channel":"NBC"},
					{"homeTeam":"SD","awayTeam":"CHI","matchup":"CHI @ SD","pin_time":"2015-11-10T01:30:00Z","channel":"ESPN"}
				]
			},
			//Week 9 Adjusted
			{"games":
				[
					{"homeTeam":"NYJ","awayTeam":"BUF","matchup":"BUF @ NYJ","pin_time":"2015-11-13T01:25:00Z","channel":"NFL"},
					{"homeTeam":"GB","awayTeam":"DET","matchup":"DET @ GB","pin_time":"2015-11-15T18:00:00Z","channel":"FOX"},
					{"homeTeam":"TB","awayTeam":"DAL","matchup":"DAL @ TB","pin_time":"2015-11-15T18:00:00Z","channel":"FOX"},
					{"homeTeam":"TEN","awayTeam":"CAR","matchup":"CAR @ TEN","pin_time":"2015-11-15T18:00:00Z","channel":"FOX"},
					{"homeTeam":"STL","awayTeam":"CHI","matchup":"CHI @ STL","pin_time":"2015-11-15T18:00:00Z","channel":"FOX"},
					{"homeTeam":"WAS","awayTeam":"NO","matchup":"NO @ WAS","pin_time":"2015-11-15T18:00:00Z","channel":"FOX"},
					{"homeTeam":"PHI","awayTeam":"MIA","matchup":"MIA @ PHI","pin_time":"2015-11-15T18:00:00Z","channel":"CBS"},
					{"homeTeam":"PIT","awayTeam":"CLE","matchup":"CLE @ PIT","pin_time":"2015-11-15T18:00:00Z","channel":"CBS"},
					{"homeTeam":"BAL","awayTeam":"JAC","matchup":"JAC @ BAL","pin_time":"2015-11-15T18:00:00Z","channel":"CBS"},
					{"homeTeam":"OAK","awayTeam":"MIN","matchup":"MIN @ OAK","pin_time":"2015-11-15T21:05:00Z","channel":"FOX"},
					{"homeTeam":"NYG","awayTeam":"NE","matchup":"NE @ NYG","pin_time":"2015-11-15T21:25:00Z","channel":"CBS"},
					{"homeTeam":"DEN","awayTeam":"KC","matchup":"KC @ DEN","pin_time":"2015-11-15T21:25:00Z","channel":"CBS"},
					{"homeTeam":"SEA","awayTeam":"ARI","matchup":"ARI @ SEA","pin_time":"2015-11-16T01:30:00Z","channel":"NBC"},
					{"homeTeam":"CIN","awayTeam":"HOU","matchup":"HOU @ CIN","pin_time":"2015-11-17T01:30:00Z","channel":"ESPN"}
				]
			},
			//Week 10 Adjusted
			{"games":
				[
					{"homeTeam":"JAC","awayTeam":"TEN","matchup":"TEN @ JAC","pin_time":"2015-11-20T01:25:00Z","channel":"NFL"},
					{"homeTeam":"DET","awayTeam":"OAK","matchup":"OAK @ DET","pin_time":"2015-11-22T18:00:00Z","channel":"CBS"},
					{"homeTeam":"ATL","awayTeam":"IND","matchup":"IND @ ATL","pin_time":"2015-11-22T18:00:00Z","channel":"CBS"},
					{"homeTeam":"HOU","awayTeam":"NYJ","matchup":"NYJ @ HOU","pin_time":"2015-11-22T18:00:00Z","channel":"CBS"},
					{"homeTeam":"PHI","awayTeam":"TB","matchup":"TB @ PHI","pin_time":"2015-11-22T18:00:00Z","channel":"FOX"},
					{"homeTeam":"CHI","awayTeam":"DEN","matchup":"DEN @ CHI","pin_time":"2015-11-22T18:00:00Z","channel":"CBS"},
					{"homeTeam":"MIN","awayTeam":"GB","matchup":"GB @ MIN","pin_time":"2015-11-22T18:00:00Z","channel":"FOX"},
					{"homeTeam":"BAL","awayTeam":"STL","matchup":"STL @ BAL","pin_time":"2015-11-22T18:00:00Z","channel":"FOX"},
					{"homeTeam":"MIA","awayTeam":"DAL","matchup":"DAL @ MIA","pin_time":"2015-11-22T18:00:00Z","channel":"FOX"},
					{"homeTeam":"CAR","awayTeam":"WAS","matchup":"WAS @ CAR","pin_time":"2015-11-22T18:00:00Z","channel":"FOX"},
					{"homeTeam":"ARI","awayTeam":"CIN","matchup":"CIN @ ARI","pin_time":"2015-11-22T21:05:00Z","channel":"CBS"},
					{"homeTeam":"SEA","awayTeam":"SF","matchup":"SF @ SEA","pin_time":"2015-11-22T21:25:00Z","channel":"FOX"},
					{"homeTeam":"SD","awayTeam":"KC","matchup":"KC @ SD","pin_time":"2015-11-23T01:30:00Z","channel":"NBC"},
					{"homeTeam":"NE","awayTeam":"BUF","matchup":"BUF @ NE","pin_time":"2015-11-24T01:30:00Z","channel":"ESPN"}
				]
			},
			//Week 11 Adjusted
			{"games":
				[
					{"homeTeam":"DET","awayTeam":"PHI","matchup":"PHI @ DET","pin_time":"2015-11-26T17:30:00Z","channel":"FOX"},
					{"homeTeam":"DAL","awayTeam":"CAR","matchup":"CAR @ DAL","pin_time":"2015-11-26T21:30:00Z","channel":"CBS"},
					{"homeTeam":"GB","awayTeam":"CHI","matchup":"CHI @ GB","pin_time":"2015-11-27T01:30:00Z","channel":"NBC"},
					{"homeTeam":"TEN","awayTeam":"OAK","matchup":"OAK @ TEN","pin_time":"2015-11-29T16:00:00Z","channel":"CBS"},
					{"homeTeam":"KC","awayTeam":"BUF","matchup":"BUF @ KC","pin_time":"2015-11-29T18:00:00Z","channel":"CBS"},
					{"homeTeam":"IND","awayTeam":"TB","matchup":"TB @ IND","pin_time":"2015-11-29T18:00:00Z","channel":"FOX"},
					{"homeTeam":"WAS","awayTeam":"NYG","matchup":"NYG @ WAS","pin_time":"2015-11-29T18:00:00Z","channel":"FOX"},
					{"homeTeam":"HOU","awayTeam":"NO","matchup":"NO @ HOU","pin_time":"2015-11-29T18:00:00Z","channel":"FOX"},
					{"homeTeam":"ATL","awayTeam":"MIN","matchup":"MIN @ ATL","pin_time":"2015-11-29T18:00:00Z","channel":"FOX"},
					{"homeTeam":"CIN","awayTeam":"STL","matchup":"STL @ CIN","pin_time":"2015-11-29T18:00:00Z","channel":"FOX"},
					{"homeTeam":"JAC","awayTeam":"SD","matchup":"SD @ JAC","pin_time":"2015-11-29T18:00:00Z","channel":"CBS"},
					{"homeTeam":"NYJ","awayTeam":"MIA","matchup":"MIA @ NYJ","pin_time":"2015-11-29T18:00:00Z","channel":"CBS"},
					{"homeTeam":"SF","awayTeam":"ARI","matchup":"ARI @ SF","pin_time":"2015-11-29T21:05:00Z","channel":"FOX"},
					{"homeTeam":"SEA","awayTeam":"PIT","matchup":"PIT @ SEA","pin_time":"2015-11-29T21:25:00Z","channel":"CBS"},
					{"homeTeam":"DEN","awayTeam":"NE","matchup":"NE @ DEN","pin_time":"2015-11-30T01:30:00Z","channel":"NBC"},
					{"homeTeam":"CLE","awayTeam":"BAL","matchup":"BAL @ CLE","pin_time":"2015-12-01T01:30:00Z","channel":"ESPN"}
				]
			},
			//Week 12 Adjusted
			{"games":
				[
					{"homeTeam":"DET","awayTeam":"GB","matchup":"GB @ DET","pin_time":"2015-12-04T01:25:00Z","channel":"CBS"},
					{"homeTeam":"NYG","awayTeam":"NYJ","matchup":"NYJ @ NYG","pin_time":"2015-12-06T18:00:00Z","channel":"CBS"},
					{"homeTeam":"STL","awayTeam":"ARI","matchup":"ARI @ STL","pin_time":"2015-12-06T18:00:00Z","channel":"FOX"},
					{"homeTeam":"TB","awayTeam":"ATL","matchup":"ATL @ TB","pin_time":"2015-12-06T18:00:00Z","channel":"FOX"},
					{"homeTeam":"NO","awayTeam":"CAR","matchup":"CAR @ NO","pin_time":"2015-12-06T18:00:00Z","channel":"FOX"},
					{"homeTeam":"MIN","awayTeam":"SEA","matchup":"SEA @ MIN","pin_time":"2015-12-06T18:00:00Z","channel":"FOX"},
					{"homeTeam":"BUF","awayTeam":"HOU","matchup":"HOU @ BUF","pin_time":"2015-12-06T18:00:00Z","channel":"CBS"},
					{"homeTeam":"MIA","awayTeam":"BAL","matchup":"BAL @ MIA","pin_time":"2015-12-06T18:00:00Z","channel":"CBS"},
					{"homeTeam":"CLE","awayTeam":"CIN","matchup":"CIN @ CLE","pin_time":"2015-12-06T18:00:00Z","channel":"CBS"},
					{"homeTeam":"TEN","awayTeam":"JAC","matchup":"JAC @ TEN","pin_time":"2015-12-06T18:00:00Z","channel":"CBS"},
					{"homeTeam":"CHI","awayTeam":"SF","matchup":"SF @ CHI","pin_time":"2015-12-06T18:00:00Z","channel":"FOX"},
					{"homeTeam":"SD","awayTeam":"DEN","matchup":"DEN @ SD","pin_time":"2015-12-06T21:05:00Z","channel":"CBS"},
					{"homeTeam":"OAK","awayTeam":"KC","matchup":"KC @ OAK","pin_time":"2015-12-06T21:05:00Z","channel":"CBS"},
					{"homeTeam":"NE","awayTeam":"PHI","matchup":"PHI @ NE","pin_time":"2015-12-06T21:25:00Z","channel":"FOX"},
					{"homeTeam":"PIT","awayTeam":"IND","matchup":"IND @ PIT","pin_time":"2015-12-07T01:30:00Z","channel":"NBC"},
					{"homeTeam":"WAS","awayTeam":"DAL","matchup":"DAL @ WAS","pin_time":"2015-12-08T01:30:00Z","channel":"ESPN"}
				]
			},
			//Week 13 Adjusted
			{"games":
				[
					{"homeTeam":"ARI","awayTeam":"MIN","matchup":"MIN @ ARI","pin_time":"2015-12-11T01:25:00Z","channel":"NFL"},
					{"homeTeam":"PHI","awayTeam":"BUF","matchup":"BUF @ PHI","pin_time":"2015-12-13T18:00:00Z","channel":"CBS"},
					{"homeTeam":"CLE","awayTeam":"SF","matchup":"SF @ CLE","pin_time":"2015-12-13T18:00:00Z","channel":"FOX"},
					{"homeTeam":"STL","awayTeam":"DET","matchup":"DET @ STL","pin_time":"2015-12-13T18:00:00Z","channel":"FOX"},
					{"homeTeam":"TB","awayTeam":"NO","matchup":"NO @ TB","pin_time":"2015-12-13T18:00:00Z","channel":"FOX"},
					{"homeTeam":"NYJ","awayTeam":"TEN","matchup":"TEN @ NYJ","pin_time":"2015-12-13T18:00:00Z","channel":"CBS"},
					{"homeTeam":"CIN","awayTeam":"PIT","matchup":"PIT @ CIN","pin_time":"2015-12-13T18:00:00Z","channel":"CBS"},
					{"homeTeam":"HOU","awayTeam":"NE","matchup":"NE @ HOU","pin_time":"2015-12-13T18:00:00Z","channel":"CBS"},
					{"homeTeam":"JAC","awayTeam":"IND","matchup":"IND @ JAC","pin_time":"2015-12-13T18:00:00Z","channel":"CBS"},
					{"homeTeam":"KC","awayTeam":"SD","matchup":"SD @ KC","pin_time":"2015-12-13T18:00:00Z","channel":"CBS"},
					{"homeTeam":"CHI","awayTeam":"WAS","matchup":"WAS @ CHI","pin_time":"2015-12-13T18:00:00Z","channel":"FOX"},
					{"homeTeam":"CAR","awayTeam":"ATL","matchup":"ATL @ CAR","pin_time":"2015-12-13T18:00:00Z","channel":"FOX"},
					{"homeTeam":"DEN","awayTeam":"OAK","matchup":"OAK @ DEN","pin_time":"2015-12-13T21:05:00Z","channel":"CBS"},
					{"homeTeam":"GB","awayTeam":"DAL","matchup":"DAL @ GB","pin_time":"2015-12-13T21:25:00Z","channel":"FOX"},
					{"homeTeam":"BAL","awayTeam":"SEA","matchup":"SEA @ BAL","pin_time":"2015-12-14T01:30:00Z","channel":"NBC"},
					{"homeTeam":"MIA","awayTeam":"NYG","matchup":"NYG @ MIA","pin_time":"2015-12-15T01:30:00Z","channel":"ESPN"}
				]
			},
			//Week 14 Adjusted
			{"games":
				[
					{"homeTeam":"STL","awayTeam":"TB","matchup":"TB @ STL","pin_time":"2015-12-18T01:25:00Z","channel":"NFL"},
					{"homeTeam":"DAL","awayTeam":"NYJ","matchup":"NYJ @ DAL","pin_time":"2015-12-20T01:25:00Z","channel":"NFL"},
					{"homeTeam":"MIN","awayTeam":"CHI","matchup":"CHI @ MIN","pin_time":"2015-12-20T18:00:00Z","channel":"FOX"},
					{"homeTeam":"JAC","awayTeam":"ATL","matchup":"ATL @ JAC","pin_time":"2015-12-20T18:00:00Z","channel":"FOX"},
					{"homeTeam":"IND","awayTeam":"HOU","matchup":"HOU @ IND","pin_time":"2015-12-20T18:00:00Z","channel":"CBS"},
					{"homeTeam":"PHI","awayTeam":"ARI","matchup":"ARI @ PHI","pin_time":"2015-12-20T18:00:00Z","channel":"FOX"},
					{"homeTeam":"NYG","awayTeam":"CAR","matchup":"CAR @ NYG","pin_time":"2015-12-20T18:00:00Z","channel":"FOX"},
					{"homeTeam":"NE","awayTeam":"TEN","matchup":"TEN @ NE","pin_time":"2015-12-20T18:00:00Z","channel":"CBS"},
					{"homeTeam":"WAS","awayTeam":"BUF","matchup":"BUF @ WAS","pin_time":"2015-12-20T18:00:00Z","channel":"CBS"},
					{"homeTeam":"BAL","awayTeam":"KC","matchup":"KC @ BAL","pin_time":"2015-12-20T18:00:00Z","channel":"CBS"},
					{"homeTeam":"SEA","awayTeam":"CLE","matchup":"CLE @ SEA","pin_time":"2015-12-20T21:05:00Z","channel":"FOX"},
					{"homeTeam":"OAK","awayTeam":"GB","matchup":"GB @ OAK","pin_time":"2015-12-20T21:05:00Z","channel":"FOX"},
					{"homeTeam":"PIT","awayTeam":"DEN","matchup":"DEN @ PIT","pin_time":"2015-12-20T21:25:00Z","channel":"CBS"},
					{"homeTeam":"SD","awayTeam":"MIA","matchup":"MIA @ SD","pin_time":"2015-12-20T21:25:00Z","channel":"CBS"},
					{"homeTeam":"SF","awayTeam":"CIN","matchup":"CIN @ SF","pin_time":"2015-12-21T01:30:00Z","channel":"NBC"},
					{"homeTeam":"NO","awayTeam":"DET","matchup":"DET @ NO","pin_time":"2015-12-22T01:30:00Z","channel":"ESPN"}
				]
			},
			//Week 15 Adjusted
			{"games":
				[
					{"homeTeam":"OAK","awayTeam":"SD","matchup":"SD @ OAK","pin_time":"2015-12-25T01:25:00Z","channel":"NFL"},
					{"homeTeam":"PHI","awayTeam":"WAS","matchup":"WAS @ PHI","pin_time":"2015-12-27T01:25:00Z","channel":"NFL"},
					{"homeTeam":"NYJ","awayTeam":"NE","matchup":"NE @ NYJ","pin_time":"2015-12-27T18:00:00Z","channel":"CBS"},
					{"homeTeam":"TEN","awayTeam":"HOU","matchup":"HOU @ TEN","pin_time":"2015-12-27T18:00:00Z","channel":"CBS"},
					{"homeTeam":"KC","awayTeam":"CLE","matchup":"CLE @ KC","pin_time":"2015-12-27T18:00:00Z","channel":"CBS"},
					{"homeTeam":"MIA","awayTeam":"IND","matchup":"IND @ MIA","pin_time":"2015-12-27T18:00:00Z","channel":"CBS"},
					{"homeTeam":"NO","awayTeam":"JAC","matchup":"JAC @ NO","pin_time":"2015-12-27T18:00:00Z","channel":"CBS"},
					{"homeTeam":"DET","awayTeam":"SF","matchup":"SF @ DET","pin_time":"2015-12-27T18:00:00Z","channel":"FOX"},
					{"homeTeam":"BUF","awayTeam":"DAL","matchup":"DAL @ BUF","pin_time":"2015-12-27T18:00:00Z","channel":"FOX"},
					{"homeTeam":"TB","awayTeam":"CHI","matchup":"CHI @ TB","pin_time":"2015-12-27T18:00:00Z","channel":"FOX"},
					{"homeTeam":"ATL","awayTeam":"CAR","matchup":"CAR @ ATL","pin_time":"2015-12-27T18:00:00Z","channel":"FOX"},
					{"homeTeam":"MIN","awayTeam":"NYG","matchup":"NYG @ MIN","pin_time":"2015-12-27T18:00:00Z","channel":"FOX"},
					{"homeTeam":"SEA","awayTeam":"STL","matchup":"STL @ SEA","pin_time":"2015-12-27T21:25:00Z","channel":"FOX"},
					{"homeTeam":"ARI","awayTeam":"GB","matchup":"GB @ ARI","pin_time":"2015-12-27T21:25:00Z","channel":"FOX"},
					{"homeTeam":"BAL","awayTeam":"PIT","matchup":"PIT @ BAL","pin_time":"2015-12-28T01:30:00Z","channel":"NBC"},
					{"homeTeam":"DEN","awayTeam":"CIN","matchup":"CIN @ DEN","pin_time":"2015-12-29T01:30:00Z","channel":"ESPN"}
				]
			},
			//Week 16 Adjusted
			{"games":
				[
					{"homeTeam":"BUF","awayTeam":"NYJ","matchup":"NYJ @ BUF","pin_time":"2016-01-03T18:00:00Z","channel":"CBS"},
					{"homeTeam":"MIA","awayTeam":"NE","matchup":"NE @ MIA","pin_time":"2016-01-03T18:00:00Z","channel":"CBS"},
					{"homeTeam":"CAR","awayTeam":"TB","matchup":"TB @ CAR","pin_time":"2016-01-03T18:00:00Z","channel":"FOX"},
					{"homeTeam":"ATL","awayTeam":"NO","matchup":"NO @ ATL","pin_time":"2016-01-03T18:00:00Z","channel":"FOX"},
					{"homeTeam":"CIN","awayTeam":"BAL","matchup":"BAL @ CIN","pin_time":"2016-01-03T18:00:00Z","channel":"CBS"},
					{"homeTeam":"CLE","awayTeam":"PIT","matchup":"PIT @ CLE","pin_time":"2016-01-03T18:00:00Z","channel":"CBS"},
					{"homeTeam":"HOU","awayTeam":"JAC","matchup":"JAC @ HOU","pin_time":"2016-01-03T18:00:00Z","channel":"CBS"},
					{"homeTeam":"IND","awayTeam":"TEN","matchup":"TEN @ IND","pin_time":"2016-01-03T18:00:00Z","channel":"CBS"},
					{"homeTeam":"KC","awayTeam":"OAK","matchup":"OAK @ KC","pin_time":"2016-01-03T18:00:00Z","channel":"CBS"},
					{"homeTeam":"DAL","awayTeam":"WAS","matchup":"WAS @ DAL","pin_time":"2016-01-03T18:00:00Z","channel":"FOX"},
					{"homeTeam":"NYG","awayTeam":"PHI","matchup":"PHI @ NYG","pin_time":"2016-01-03T18:00:00Z","channel":"FOX"},
					{"homeTeam":"CHI","awayTeam":"DET","matchup":"DET @ CHI","pin_time":"2016-01-03T18:00:00Z","channel":"FOX"},
					{"homeTeam":"GB","awayTeam":"MIN","matchup":"MIN @ GB","pin_time":"2016-01-03T18:00:00Z","channel":"FOX"},
					{"homeTeam":"DEN","awayTeam":"SD","matchup":"SD @ DEN","pin_time":"2016-01-03T21:25:00Z","channel":"CBS"},
					{"homeTeam":"ARI","awayTeam":"SEA","matchup":"SEA @ ARI","pin_time":"2016-01-03T21:25:00Z","channel":"FOX"},
					{"homeTeam":"SF","awayTeam":"STL","matchup":"STL @ SF","pin_time":"2016-01-03T21:25:00Z","channel":"FOX"}
				]
			}
			//Week 17 Adjusted
		]
	};