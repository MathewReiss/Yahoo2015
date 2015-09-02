#include <pebble.h>

#define DATA 9000	
	
#define PRE_DRAFT 300
	
#define APP_NAME "Yahoo! Fantasy Football"

#ifdef PBL_COLOR
  #define APP_COLOR GColorIndigo
#else
  #define APP_COLOR GColorBlack
#endif
	
#define APP_CREDIT "© Yahoo Inc."
#define HEADER GRect(0,0,144,16)
#define BODY GRect(0,16,144,152)
#define TOP_HALF GRect(0,0,144,76)
#define BOTTOM_HALF GRect(0,76,144,76)
	
#ifdef PBL_SDK_2
  #define FONT_KEY_LECO_42_NUMBERS FONT_KEY_BITHAM_42_BOLD
#endif

Window *splash_window, *home_window, *matchup_window, *league_window, *team_window, *loading_window, *credits_window;
MenuLayer *home_menu_layer, *league_menu_layer, *team_menu_layer, *credits_menu_layer;
TextLayer *home_text_layer, *matchup_text_layer, *league_text_layer, *team_text_layer, *loading_text_layer, *credits_text_layer;
Layer *splash_custom_layer, *matchup_custom_layer, *loading_custom_layer;

GBitmap *logo;

int old_matchup_ally_score_int = 0, old_matchup_enemy_score_int = 0;
int matchup_ally_score_int = 0, matchup_enemy_score_int = 0;

char home_matchup_subtitle[32], home_league_subtitle[32], home_team_subtitle[32];
char matchup_ally_name[32], matchup_enemy_name[32], matchup_ally_score_char[8], matchup_enemy_score_char[8];
char league_team_names[20][32];
char team_player_names[30][32];

AppTimer *loading_timer;
GRect loading_rect;
bool loading_timer_active = false;
bool loading_color = true;

bool pre_draft = false;

int num_teams = 20, num_players = 30;

#define INIT -1
#define SPLASH 0
#define HOME 1
#define MATCHUP 2
#define LEAGUE 3
#define TEAM 4
#define CREDITS 5
#define LOADING 9

int current = -1;

void push_appropriate_window(void){
  MenuIndex home_row = menu_layer_get_selected_index(home_menu_layer);
  switch(home_row.row){
	case 0: window_stack_push(matchup_window, true); break;
	case 1: window_stack_push(league_window, true); break;
	case 2: window_stack_push(team_window, true); break;
	case 3: window_stack_push(credits_window, true); break;
  }
  window_stack_remove(loading_window, false);
	
  current = HOME + 1 + home_row.row;
}

void loading_timer_run(){
  if(loading_color){
	loading_rect.size.w++;
	if(loading_rect.size.w == 80) loading_color = false;
  }
  else{
	loading_rect.size.w--;
	loading_rect.origin.x++;
	if(loading_rect.size.w == 0){ loading_color = true; loading_rect.origin.x = 32; }
  }
  layer_mark_dirty(loading_custom_layer);
  loading_timer = app_timer_register(20, loading_timer_run, NULL);
}
void loading_timer_start(){
  loading_timer_active = true;
  loading_rect.size.w = 0;
  loading_rect.origin.x = 32;
  loading_timer = app_timer_register(20, loading_timer_run, NULL);
}
void loading_timer_cancel(){
  if(loading_timer != NULL) app_timer_cancel(loading_timer);
  loading_timer_active = false;
  loading_color = true;
}

void send_request(char *request){
  Tuplet request_tuple = TupletCString(DATA, request);
  DictionaryIterator *iter;
  app_message_outbox_begin(&iter);
  dict_write_tuplet(iter, &request_tuple);
  dict_write_end(iter);
  app_message_outbox_send();
}
void send_initial_request(){
  send_request("HOME");
}

void handle_tick(struct tm *tick_time, TimeUnits units){
	if(current == MATCHUP && tick_time->tm_min%5 == 0) send_request("MATCHUP");
}

void process_tuple(Tuple *t){
	int key = t->key;
	
	if(key == 9000){
	  app_timer_register(1000, send_initial_request, NULL);
	  tick_timer_service_subscribe(MINUTE_UNIT, handle_tick);
	  return;
	}
	
	if(key < 10){ //HOME
	  switch(key){
		case 0: strncpy(home_matchup_subtitle, t->value->cstring, sizeof(home_matchup_subtitle)); break;
		case 1: strncpy(home_league_subtitle, t->value->cstring, sizeof(home_league_subtitle)); break;
		case 2: strncpy(home_team_subtitle, t->value->cstring, sizeof(home_team_subtitle)); break;
	  }
	}
	else if(key < 100){ //MATCHUP
	  switch(key){
		case 10: strncpy(matchup_ally_name, t->value->cstring, sizeof(matchup_ally_name)); break;
		case 11: matchup_ally_score_int = atoi(t->value->cstring); break;
		case 12: strncpy(matchup_ally_score_char, t->value->cstring, sizeof(matchup_ally_score_char)); break;
			
		case 13: strncpy(matchup_enemy_name, t->value->cstring, sizeof(matchup_enemy_name)); break;
		case 14: matchup_enemy_score_int = atoi(t->value->cstring); break;
		case 15: strncpy(matchup_enemy_score_char, t->value->cstring, sizeof(matchup_enemy_score_char)); break;
	  }
	}
	else if(key < 200){ //LEAGUE
	  strncpy(league_team_names[key-100], t->value->cstring, sizeof(league_team_names[key-100]));
		
	  if(strcmp(league_team_names[key-100], "") == 0 && key-100 < num_teams){
		  num_teams = key-100;
		  menu_layer_reload_data(league_menu_layer);
	  }
	}
	else if(key < 300){ //TEAM
	  strncpy(team_player_names[key-200], t->value->cstring, sizeof(team_player_names[key-200]));
		
	  if(strcmp(team_player_names[key-200], "") == 0 && key-200 < num_players){
		  num_players = key-200;
		  menu_layer_reload_data(team_menu_layer);
	  }
	}
	else if(key == 300){ //DRAFT STATUS
	  if(atoi(t->value->cstring) == 1){
	    #ifdef PBL_COLOR	
  		  menu_layer_set_normal_colors(home_menu_layer, GColorBlack, GColorLightGray);
 		  menu_layer_set_highlight_colors(home_menu_layer, APP_COLOR, GColorLightGray);
		  menu_layer_reload_data(home_menu_layer);
		#endif
		text_layer_set_text(home_text_layer, "Status: Pre-Draft");
		pre_draft = true;
	  }
	}
}
void inbox(DictionaryIterator *iter, void *context){
  Tuple *t = dict_read_first(iter);
  if(t) process_tuple(t);
  while(t != NULL){
	t = dict_read_next(iter);
	if(t) process_tuple(t);
  }
	
  if(current == INIT){
	  current = SPLASH;
  }
  else if(current == SPLASH){
	current = HOME;
	window_stack_push(home_window, true);
	window_stack_remove(splash_window, false);
  }
  else if(current == LOADING){
	push_appropriate_window();
  }
  else if(current == MATCHUP){
	//APP_LOG(APP_LOG_LEVEL_INFO, "Old Ally: %d, Old Enemy: %d. Ally: %d, Enemy: %d.", old_matchup_ally_score_int,old_matchup_enemy_score_int,matchup_ally_score_int,matchup_enemy_score_int);
	if( (old_matchup_ally_score_int > old_matchup_enemy_score_int && matchup_ally_score_int < matchup_enemy_score_int)
	 || (old_matchup_ally_score_int < old_matchup_enemy_score_int && matchup_ally_score_int > matchup_enemy_score_int)
	 || (old_matchup_ally_score_int == 0 && old_matchup_enemy_score_int == 0 && (matchup_ally_score_int != 0 || matchup_enemy_score_int != 0)))
	{
		vibes_short_pulse();
	}
	old_matchup_ally_score_int = matchup_ally_score_int;
	old_matchup_enemy_score_int = matchup_enemy_score_int;
	   	  
	layer_mark_dirty(matchup_custom_layer);
  }
}

static void draw_splash_custom_layer(Layer *layer, GContext *ctx){
  graphics_draw_bitmap_in_rect(ctx, logo, GRect(0,12,144,144));
}

static uint16_t home_num_rows(MenuLayer *menu_layer, uint16_t section_index, void *data){
	return 4;
}
void home_draw_row(GContext *ctx, const Layer *cell_layer, MenuIndex *index, void *data){
	if(index->row == 0) menu_cell_basic_draw(ctx, cell_layer, "Current Matchup", home_matchup_subtitle, NULL);
	else if(index->row == 1) menu_cell_basic_draw(ctx, cell_layer, "League Standings", home_league_subtitle, NULL);
	else if(index->row == 2) menu_cell_basic_draw(ctx, cell_layer, "My Team", home_team_subtitle, NULL);
	else{
	  #ifdef PBL_COLOR
		graphics_context_set_text_color(ctx, GColorWhite);
	  #endif
	  menu_cell_basic_draw(ctx, cell_layer, "Credits", "", NULL);
	  #ifdef PBL_COLOR
		if(pre_draft)
		  graphics_context_set_text_color(ctx, GColorLightGray);
	  #endif
	}
}
void home_select(MenuLayer *menu_layer, MenuIndex *index, void *data){
  MenuIndex home_row = menu_layer_get_selected_index(home_menu_layer);
  if(home_row.row == 3){
	push_appropriate_window();  
	return;
  }
  
  if(pre_draft) return;	
	
  if(home_row.row == 0){
	if(matchup_ally_score_int != 0 || matchup_enemy_score_int != 0){
	  window_stack_push(matchup_window, true);
	  current = MATCHUP;
	  send_request("MATCHUP");
	  return;
	}
	send_request("MATCHUP");  
  } 
  else if(home_row.row == 1) send_request("LEAGUE");
  else if(home_row.row == 2) send_request("TEAM");
  //push_appropriate_window();
	
  window_stack_push(loading_window, true);
  loading_timer_cancel();
  loading_timer_start();
  current = LOADING;
}

static void draw_matchup_custom_layer(Layer *layer, GContext *ctx){
  graphics_context_set_fill_color(ctx, GColorBlack);
  graphics_fill_rect(ctx, GRect(0,0,144,152), 0, GCornerNone);
	
  graphics_context_set_fill_color(ctx, APP_COLOR);
  if(matchup_ally_score_int > matchup_enemy_score_int) graphics_fill_rect(ctx, TOP_HALF, 0, GCornerNone);
  else if(matchup_enemy_score_int > matchup_ally_score_int) graphics_fill_rect(ctx, BOTTOM_HALF, 0, GCornerNone);
	
  graphics_context_set_text_color(ctx, GColorWhite);
	
  graphics_draw_text(ctx, matchup_ally_name, fonts_get_system_font(FONT_KEY_ROBOTO_CONDENSED_21), GRect(4,0,136,22), GTextOverflowModeTrailingEllipsis, GTextAlignmentLeft, NULL);
  graphics_draw_text(ctx, matchup_ally_score_char, fonts_get_system_font(FONT_KEY_LECO_42_NUMBERS), GRect(0, 22, 144, 42), GTextOverflowModeTrailingEllipsis, GTextAlignmentCenter, NULL);
  
  graphics_draw_text(ctx, matchup_enemy_name, fonts_get_system_font(FONT_KEY_ROBOTO_CONDENSED_21), GRect(4,76,136,22), GTextOverflowModeTrailingEllipsis, GTextAlignmentLeft, NULL);
  graphics_draw_text(ctx, matchup_enemy_score_char, fonts_get_system_font(FONT_KEY_LECO_42_NUMBERS), GRect(0, 98, 144, 42), GTextOverflowModeTrailingEllipsis, GTextAlignmentCenter, NULL);
}

static uint16_t league_num_rows(MenuLayer *menu_layer, uint16_t section_index, void *data){
  return num_teams;
}
void league_draw_row(GContext *ctx, const Layer *cell_layer, MenuIndex *index, void *data){
  menu_cell_basic_draw(ctx, cell_layer, league_team_names[index->row], NULL, NULL);
}

static uint16_t team_num_rows(MenuLayer *menu_layer, uint16_t section_index, void *data){
	return num_players;
}
void team_draw_row(GContext *ctx, const Layer *cell_layer, MenuIndex *index, void *data){
  menu_cell_basic_draw(ctx, cell_layer, team_player_names[index->row], NULL, NULL);
}

static uint16_t credits_num_rows(MenuLayer *menu_layer, uint16_t section_index, void *data){
	return 4;
}
void credits_draw_row(GContext *ctx, const Layer *cell_layer, MenuIndex *index, void *data){
  switch(index->row){
	case 0: menu_cell_basic_draw(ctx, cell_layer, "Front-End Dev", "Mathew Reiss", NULL); break;
	case 1: menu_cell_basic_draw(ctx, cell_layer, "Back-End Dev", "Neal Patel", NULL); break;
	case 2: menu_cell_basic_draw(ctx, cell_layer, "Logo, Name, etc.", APP_CREDIT, NULL); break;
	case 3: menu_cell_basic_draw(ctx, cell_layer, "Injury Report", "Fantasy Football Nerd", NULL); break;
  }
}

static void draw_loading_custom_layer(Layer *layer, GContext *ctx){
  graphics_context_set_fill_color(ctx, GColorBlack);
  graphics_fill_rect(ctx, GRect(0,0,144,152), 0, GCornerNone);
	
#ifdef PBL_COLOR
  graphics_context_set_fill_color(ctx, GColorWhite);
#else
  graphics_context_set_fill_color(ctx, GColorBlack);
#endif
	
  graphics_fill_rect(ctx, GRect(32, 72, 80, 6), 2, GCornersAll);
	
#ifdef PBL_COLOR
  graphics_context_set_fill_color(ctx, APP_COLOR);
#else
  graphics_context_set_fill_color(ctx, GColorWhite);
#endif
	
  graphics_fill_rect(ctx, loading_rect, 2, GCornersAll);	
}

void init_text_layer(TextLayer *text_layer){
  text_layer_set_background_color(text_layer, GColorBlack);
  text_layer_set_text_color(text_layer, GColorWhite);
  text_layer_set_font(text_layer, fonts_get_system_font(FONT_KEY_GOTHIC_14));
  text_layer_set_text_alignment(text_layer, GTextAlignmentCenter);
}

void init_with_dummy_data(void){
  strncpy(home_matchup_subtitle, "vs Opponent", sizeof(home_matchup_subtitle));
  strncpy(home_league_subtitle, "League Name", sizeof(home_league_subtitle));
  strncpy(home_team_subtitle, "User", sizeof(home_team_subtitle));
	
  matchup_ally_score_int = 1275;
  matchup_enemy_score_int = 1245;
	
  strncpy(matchup_ally_name, "User", sizeof(matchup_ally_name));
  strncpy(matchup_enemy_name, "Opponent", sizeof(matchup_enemy_name));
  strncpy(matchup_ally_score_char, "127.5", sizeof(matchup_ally_score_char));
  strncpy(matchup_enemy_score_char, "124.5", sizeof(matchup_enemy_score_char));

  for(int t = 0; t < 20; t++){
	snprintf(league_team_names[t], sizeof(league_team_names[t]), "%d Team Name", t+1);
  }
	
  for(int p = 0; p < 30; p++){
	strncpy(team_player_names[p], "Tom Brady", sizeof(team_player_names[p]));
  }
}

void handle_init(void) {
  //init_with_dummy_data();

  app_message_register_inbox_received(inbox);
  app_message_open(app_message_inbox_size_maximum(), app_message_outbox_size_maximum());
	
  logo = gbitmap_create_with_resource(RESOURCE_ID_LOGO);	
	
//==========
	
  splash_window = window_create();
	
#ifdef PBL_SDK_2
  window_set_fullscreen(splash_window, true);
#endif
	
  window_set_background_color(splash_window, APP_COLOR);
	
  splash_custom_layer = layer_create(GRect(0,0,144,168));
  layer_set_update_proc(splash_custom_layer, draw_splash_custom_layer);
	
  layer_add_child(window_get_root_layer(splash_window), splash_custom_layer);	
	
  window_stack_push(splash_window, true);

//==========	
	
  home_window = window_create();

#ifdef PBL_SDK_2
  window_set_fullscreen(home_window, true);
#else
  window_set_background_color(home_window, GColorBlack);	
#endif
	
  home_text_layer = text_layer_create(HEADER);
  init_text_layer(home_text_layer);
  text_layer_set_text(home_text_layer, APP_NAME);
	
  home_menu_layer = menu_layer_create(BODY);
  menu_layer_set_callbacks(home_menu_layer, NULL, (MenuLayerCallbacks){
	 .get_num_rows = home_num_rows,
	 .draw_row = home_draw_row,
	 .select_click = home_select
  });

#ifdef PBL_SDK_3
  menu_layer_pad_bottom_enable(home_menu_layer, false);
#endif
	
#ifdef PBL_COLOR	
  menu_layer_set_normal_colors(home_menu_layer, GColorBlack, GColorWhite);
  menu_layer_set_highlight_colors(home_menu_layer, APP_COLOR, GColorWhite);
#endif  
	
  menu_layer_set_click_config_onto_window(home_menu_layer, home_window);	
	
  layer_add_child(window_get_root_layer(home_window), text_layer_get_layer(home_text_layer));
  layer_add_child(window_get_root_layer(home_window), menu_layer_get_layer(home_menu_layer));
	
  //window_stack_push(home_window, false);
	
//==========
	
  loading_window = window_create();

#ifdef PBL_SDK_2
  window_set_fullscreen(loading_window, true);
#else
  window_set_background_color(loading_window, GColorBlack);
#endif
	
  loading_text_layer = text_layer_create(HEADER);
  init_text_layer(loading_text_layer);
  text_layer_set_text(loading_text_layer, "Loading...");
	
  loading_custom_layer = layer_create(BODY);
  layer_set_update_proc(loading_custom_layer, draw_loading_custom_layer);

  loading_rect = GRect(32,88-16,0,6);	
	
  layer_add_child(window_get_root_layer(loading_window), text_layer_get_layer(loading_text_layer));
  layer_add_child(window_get_root_layer(loading_window), loading_custom_layer);
	
//==========	
	
  matchup_window = window_create();

#ifdef PBL_SDK_2
  window_set_fullscreen(matchup_window, true);
#else	
  window_set_background_color(matchup_window, GColorBlack);
#endif
	
  matchup_text_layer = text_layer_create(HEADER);
  init_text_layer(matchup_text_layer);
  text_layer_set_text(matchup_text_layer, "Current Matchup");
	
  matchup_custom_layer = layer_create(BODY);
  layer_set_update_proc(matchup_custom_layer, draw_matchup_custom_layer);
	
  layer_add_child(window_get_root_layer(matchup_window), text_layer_get_layer(matchup_text_layer));
  layer_add_child(window_get_root_layer(matchup_window), matchup_custom_layer);	
	
//==========
	
  league_window = window_create();

#ifdef PBL_SDK_2
  window_set_fullscreen(league_window, true);
#else	
  window_set_background_color(league_window, GColorBlack);
#endif  
	
  league_text_layer = text_layer_create(HEADER);
  init_text_layer(league_text_layer);
  text_layer_set_text(league_text_layer, "League Standings");
	
  league_menu_layer = menu_layer_create(BODY);
  menu_layer_set_callbacks(league_menu_layer, NULL, (MenuLayerCallbacks){
	 .get_num_rows = league_num_rows,
	 .draw_row = league_draw_row
  });
	
#ifdef PBL_SDK_3
	menu_layer_pad_bottom_enable(league_menu_layer, false);
#endif
	
#ifdef PBL_COLOR
  menu_layer_set_normal_colors(league_menu_layer, GColorBlack, GColorWhite);
  menu_layer_set_highlight_colors(league_menu_layer, APP_COLOR, GColorWhite);
#endif

  menu_layer_set_click_config_onto_window(league_menu_layer, league_window);
	
  layer_add_child(window_get_root_layer(league_window), text_layer_get_layer(league_text_layer));
  layer_add_child(window_get_root_layer(league_window), menu_layer_get_layer(league_menu_layer));
	
//==========
	
  team_window = window_create();

#ifdef PBL_SDK_2
  window_set_fullscreen(team_window, true);
#else	
  window_set_background_color(team_window, GColorBlack);
#endif	
	
  team_text_layer = text_layer_create(HEADER);
  init_text_layer(team_text_layer);
  text_layer_set_text(team_text_layer, "My Team");
	
  team_menu_layer = menu_layer_create(BODY);
  menu_layer_set_callbacks(team_menu_layer, NULL, (MenuLayerCallbacks){
	 .draw_row = team_draw_row,
	 .get_num_rows = team_num_rows
  });
	
#ifdef PBL_SDK_3
  menu_layer_pad_bottom_enable(team_menu_layer, false);
#endif
	
#ifdef PBL_COLOR
  menu_layer_set_normal_colors(team_menu_layer, GColorBlack, GColorWhite);
  menu_layer_set_highlight_colors(team_menu_layer, APP_COLOR, GColorWhite);
#endif  
	
  menu_layer_set_click_config_onto_window(team_menu_layer, team_window);	
	
  layer_add_child(window_get_root_layer(team_window), text_layer_get_layer(team_text_layer));
  layer_add_child(window_get_root_layer(team_window), menu_layer_get_layer(team_menu_layer));
	
//==========
	
  credits_window = window_create();

#ifdef PBL_SDK_2
  window_set_fullscreen(credits_window, true);
#else
  window_set_background_color(credits_window, GColorBlack);
#endif
	
  credits_text_layer = text_layer_create(HEADER);
  init_text_layer(credits_text_layer);
  text_layer_set_text(credits_text_layer, "Credits");
	
  credits_menu_layer = menu_layer_create(BODY);
  menu_layer_set_callbacks(credits_menu_layer, NULL, (MenuLayerCallbacks){
	 .draw_row = credits_draw_row,
	 .get_num_rows = credits_num_rows
  });
  
#ifdef PBL_SDK_3
  menu_layer_pad_bottom_enable(credits_menu_layer, false);
#endif
	
#ifdef PBL_COLOR
  menu_layer_set_normal_colors(credits_menu_layer, GColorBlack, GColorWhite);
  menu_layer_set_highlight_colors(credits_menu_layer, APP_COLOR, GColorWhite);
#endif
	
  menu_layer_set_click_config_onto_window(credits_menu_layer, credits_window);
  
  layer_add_child(window_get_root_layer(credits_window), text_layer_get_layer(credits_text_layer));
  layer_add_child(window_get_root_layer(credits_window), menu_layer_get_layer(credits_menu_layer));
}

void handle_deinit(void) {
  tick_timer_service_unsubscribe();
	
  gbitmap_destroy(logo);	
	
  text_layer_destroy(credits_text_layer);
  menu_layer_destroy(credits_menu_layer);
  window_destroy(credits_window);
	
  text_layer_destroy(team_text_layer);
  menu_layer_destroy(team_menu_layer);
  window_destroy(team_window);	
	
  text_layer_destroy(league_text_layer);
  menu_layer_destroy(league_menu_layer);
  window_destroy(league_window);	
	
  text_layer_destroy(matchup_text_layer);
  layer_destroy(matchup_custom_layer);
  window_destroy(matchup_window);

  text_layer_destroy(loading_text_layer);	
  layer_destroy(loading_custom_layer);
  window_destroy(loading_window);
	
  text_layer_destroy(home_text_layer);
  menu_layer_destroy(home_menu_layer);
  window_destroy(home_window);
	
  layer_destroy(splash_custom_layer);
  window_destroy(splash_window);
}

int main(void) {
  handle_init();
  app_event_loop();
  handle_deinit();
}