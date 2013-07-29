module.exports = function(config) {
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
            var instance = new engine();
            var runner = new GameRunner(instance);

            GameStore.save(runner);
            
            return { engine: engine_name, id: runner.get_id()};
        },

        add_player : function(engine_name, game_id, data) {
            var runner = GameStore.read(game_id);

            var player = new Player(data);
            var success = runner.add_player(player);

            return success;
        },

        start : function(engine_name, game_id) {
            var runner = GameStore.read(game_id);
            var success = runner.start_game();
            return success;
        },

        end : function(engine_name, game_id) {
            var runner = GameStore.read(game_id);
            var success = runner.end_game();
            return success;
        },

        status : function(engine_name, game_id) {
            var runner = GameStore.read(game_id);
            var status = runner.get_game_status();

            return status;
        },

        command : function(engine_name, game_id, player_id, command) {
            var runner = GameStore.read(game_id);

            var result = runner.command(player_id, command);
            return result;
        }
    };
};