
var GameRunner = function(eng, opts) {
	var options = opts || {};

	var engine = eng;
	var id = options.id || new Date().getTime();

	var players = options.players || [];
	
	var started = options.started || false;
	var ended = options.ended || false;
	var last_command_timestamp = options.tmstmp || 0;

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
			if (players[i].id === player_id) {
				return players[i];
			}
		}
		return null;
	};

	this.add_player  = function(player) {
		var exists = this.get_player(player.get_id());
		var game_is_full = players.length >= engine.info.allowed_players.max;

		if (! exists && ! game_is_full && ! this.is_game_started()) {
			players.push(player.to_json());
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
		status.players = this.get_players();
		status.timestamp = last_command_timestamp;
		status.running = this.is_game_running();

		return status;
	};

	this.get_timestamp = function() {
		return last_command_timestamp;
	};

};

GameRunner.prototype.to_json = function() {
	return {
        id : this.get_id(),
        engine : this.get_engine(),
        players : this.get_players(),
        started : this.is_game_started(),
        ended : this.is_game_ended(),
        tmstmp : this.get_timestamp()
    }
};

GameRunner.from_json = function(data) {
	var runner = new GameRunner(data.engine, data);
	return runner;
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

	this.to_json = function() {
		return {
			id: id,
			platform : platform
		};
	};
};

// Export our public API.
exports.GameRunner = GameRunner;
exports.Player = Player;
