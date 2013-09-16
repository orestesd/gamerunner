
var GameHandler = function(config) {
    var engines_path = config.engines_path,
        PlayerStore = require(config.player_store),
        GameStore = require(config.game_store);

    var fs = require('fs'),
        path = require('path');

    var gr = require('./gamerunner'),
        GameRunner = gr.GameRunner,
        Player = gr.Player;

    var engines = {};

    function get_engine(engine_name) {
        return engines[engine_name];
    }

    function load_fs_engines(folder) {
        if (fs.existsSync(folder)){
            fs.readdirSync(folder)
                .forEach( function(filename) {
                    var filepath = path.join(folder, filename);
                    var engine = path.basename(filename, path.extname(filename));

                    engines[engine] = require(folder + path.sep + engine);
                });
        }
    }
    load_fs_engines(config.engines_path);

    return {
        load_engines : function(callback) {
            load_fs_engines(config.engines_path);
            var keys = Object.keys(engines);

            return callback ? callback(null, keys) : keys;
        },

        engine_info : function(engine_name, callback) {
            var engine = get_engine(engine_name);
            var info = new engine().info;

            return callback ? callback(null, info) : info;
        }, 

        create : function(engine_name, callback) {
            var engine = get_engine(engine_name);
            if (engine) {
                var instance = new engine();
                var runner = new GameRunner(instance);

                GameStore.save(runner);
                
                process.emit(EVENTS.create_game, runner);

                var result = { engine: engine_name, id: runner.get_id()};
                return callback ? callback(null, result) : result;
            }
        },

        register_player : function(player_id, data, callback) {
            data.id = player_id;
            var player = new Player(data);
            PlayerStore.save(player);

            process.emit(EVENTS.register_player, player);

            var result = player.to_json();
            return callback ? callback(null, result) : result;
        },

        read_player : function(player_id, callback) {
            var result = PlayerStore.read(player_id).to_json();
            return callback ? callback(null, result) : result;
        },

        add_player : function(game_id, player_id, callback) {
            var runner = GameStore.read(game_id);
            var player = PlayerStore.read(player_id);

            if (runner && player) {
                var success = runner.add_player(player);
                GameStore.save(runner);
                process.emit(EVENTS.add_player, player);

                var result = player.to_json();
                return callback ? callback(null, result) : result;
            }
        },

        read_notif : function(player_id, callback) {
            var player = PlayerStore.read(player_id);
            var notifications = PlayerStore.read_notif(player_id);
            process.emit(EVENTS.read_notif, player, notifications);
            return callback ? callback(null, notifications) : notifications;
        },

        send_notif : function(player_id, data, player_id_from, callback) {
            var player = PlayerStore.read(player_id);
            var from = PlayerStore.read(player_id_from);
            var result = PlayerStore.save_notif(player_id, data, player_id_from);
            process.emit(EVENTS.send_notif, player, data, from);
            return callback ? callback(null, result) : result;
        },

        start : function(game_id, callback) {
            var runner = GameStore.read(game_id);
            if (runner) {
                var success = runner.start_game();
                GameStore.save(runner);
                process.emit(EVENTS.start_game, runner);
                return callback ? callback(null, success) : success;
            }
        },

        end : function(game_id, callback) {
            var runner = GameStore.read(game_id);
            if (runner) {
                var success = runner.end_game();
                GameStore.save(runner);
                process.emit(EVENTS.end_game, runner);
                return callback ? callback(null, success) : success;
            }
        },

        status : function(game_id, callback) {
            var runner = GameStore.read(game_id);
            var status = runner.get_game_status();
            return callback ? callback(null, status) : status;
        },

        timestamp : function(game_id, callback) {
            var runner = GameStore.read(game_id);
            var timestamp = {'timestamp' : runner.get_timestamp()};
            return callback ? callback(null, timestamp) : timestamp;
        },

        command : function(game_id, player_id, command, callback) {
            var runner = GameStore.read(game_id);

            var result = runner.command(player_id, command);
            
            GameStore.save(runner);
            process.emit(EVENTS.command, result);
            return callback ? callback(null, result) : result;
        },

        get_player_store : function() {
            return PlayerStore;
        },

        get_game_store : function() {
            return GameStore;
        }
    };
};

var EVENTS = {
    create_game : 'game-created',
    start_game : 'game-started',
    end_game : 'game-ended',
    add_player : 'player-added',
    command : 'command-received',

    register_player : 'player-registered',
    send_notif : 'notification-sent',
    read_notif : 'notif-read',
    
}

module.exports = function(config) {
    var handler = new GameHandler(config);

    handler.EVENTS = EVENTS;

    return handler;
};