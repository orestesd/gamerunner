
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
        load_engines : function() {
            load_fs_engines(config.engines_path);
            return Object.keys(engines);
        },

        engine_info : function(engine_name) {
            var engine = get_engine(engine_name);
            return new engine().info;
        }, 

        create : function(engine_name) {
            var engine = get_engine(engine_name);
            if (engine) {
                var instance = new engine();
                var runner = new GameRunner(instance);

                GameStore.save(runner);
                
                process.emit(EVENTS.create_game, runner);

                return { engine: engine_name, id: runner.get_id()};
            }
        },

        register_player : function(player_id, data) {
            data.id = player_id;
            var player = new Player(data);
            PlayerStore.save(player);

            process.emit(EVENTS.register_player, player);

            return player.to_json();
        },

        read_player : function(player_id) {
            return PlayerStore.read(player_id).to_json();
        },

        add_player : function(game_id, player_id) {
            var runner = GameStore.read(game_id);
            var player = PlayerStore.read(player_id);

            if (runner && player) {
                var success = runner.add_player(player);
                process.emit(EVENTS.add_player, player);
                return player.to_json();
            }
        },

        read_notif : function(player_id) {
            var player = PlayerStore.read(player_id);
            var notifications = PlayerStore.read_notif(player_id);
            process.emit(EVENTS.read_notif, player, notifications);
            return notifications;
        },

        send_notif : function(player_id, data, player_id_from) {
            var player = PlayerStore.read(player_id);
            var from = PlayerStore.read(player_id_from);
            var result = PlayerStore.save_notif(player_id, data, player_id_from);
            process.emit(EVENTS.send_notif, player, data, from);
            return result;
        },

        start : function(game_id) {
            var runner = GameStore.read(game_id);
            if (runner) {
                var success = runner.start_game();
                process.emit(EVENTS.start_game, runner);
                return success;
            }
        },

        end : function(game_id) {
            var runner = GameStore.read(game_id);
            if (runner) {
                var success = runner.end_game();
                process.emit(EVENTS.end_game, runner);
                return success;
            }
        },

        status : function(game_id) {
            var runner = GameStore.read(game_id);
            var status = runner.get_game_status();

            return status;
        },

        command : function(game_id, player_id, command) {
            var runner = GameStore.read(game_id);

            var result = runner.command(player_id, command);
            
            process.emit(EVENTS.command, result);
            return result;
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