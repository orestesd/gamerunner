 
var GameRunner = function(eng, opts) {
	var engine = eng;
	var options = opts;
	var id = new Date().getTime();

	var players = [];
	var status = {};
	
	var started = false;
	var ended = false;
	var last_command_timestamp = 0;

	function notify_update(data, triggered_by) {
		for (var i = 0; i < players.length; i++) {
			if (players[i].id !== triggered_by) {
				players[i].notify_update(data);
			}
		}
	}

	function players_json() {
		var players_array = [];
		for (var i = 0; i < players.length; i++) {
			players_array[i] = {id: players[i].get_id(), platform : players[i].get_platform()};
		}
		return players_array;
	}


	this.get_id = function() {
		return id;
	};

	this.get_engine = function() {
		return engine;
	};

	this.get_players = function() {
		return players;
	};

	this.get_player  = function(player_id) {
		for (var i = 0; i < players.length; i++) {
			if (players[i].get_id() === player_id) {
				return players[i];
			}
		}
		return null;
	};

	this.add_player  = function(player) {
		var exists = this.get_player(player.get_id());
		var game_is_full = players.length >= engine.info.allowed_players.max;

		if (! exists && ! game_is_full && ! this.is_game_started()) {
			players.push(player);
			return true;
		}

		return false;
	};

	this.is_game_started = function() {
		return started;
	};

	this.is_game_running = function() {
		return started && !ended;
	};

	this.is_game_ended = function() {
		return ended;
	};

	this.start_game = function() {
		var enough_players = players.length >= engine.info.allowed_players.min;

		if (! this.is_game_started() &&  enough_players) {
			started = true;
			
			engine.init({
				players : players
			});
			
			return true;
		}
		return false;
	};

	this.end_game  = function() {
		ended = true;
		return true;
	};

	this.command  = function(player_id, data) {
		if (this.is_game_running()) {
			var player = this.get_player(player_id);
			var result = engine.command(player, data);

			last_command_timestamp = new Date().getTime();
			notify_update(result, player);

			// decorate result
			result.error = 0;

			return result;
		} else {
			return {error : 1, is_valid : false, message: 'game is not running'};
		}
	};

	this.get_game_status = function() {
		var status = engine.get_status();

		// decorate status
		status.players = players_json();
		status.timestamp = last_command_timestamp;
		status.running = this.is_game_running();

		return status;
	};

};

var Player = function(pdata) {
	var id = pdata.id;
	var platform = pdata.platform;

	this.get_id = function() {
		return id;
	};

	this.get_platform = function() {
		return platform;
	};

	this.notify_update = function(data) {

	};
};

// Export our public API.
exports.GameRunner = GameRunner;
exports.Player = Player;
