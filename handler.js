
    var DummyEngine = require('./engines/dummy')
      , gr = require('./gamerunner')
      , GameRunner = gr.GameRunner
      , Player = gr.Player;

    var games = { 
        'dummy' : {}
    };
    var engines = {
        'dummy' : DummyEngine
    }

    function get_engine(engine_name) {
        return engines[engine_name];
    }

    var handler = {
        create : function(engine_name, req, res) {
            var engine = get_engine(engine_name);
            var instance = new engine();
            var runner = new GameRunner(instance);
            games[engine_name][runner.get_id()] = runner;
            
            res.send({ engine: engine_name, id: runner.get_id()});
        },

        add_player : function(engine_name, game_id, req, res) {
            var runner = games[engine_name][game_id];
            var data = req.body;

            var player = new Player(data.id, data.platform);
            var success = runner.add_player(player);

            res.send(success);
        },

        start : function(engine_name, game_id, req, res) {
            var runner = games[engine_name][game_id];
            var success = runner.start_game();
            res.send(success);
        },

        end : function(engine_name, game_id, req, res) {
            var runner = games[engine_name][game_id];
            var success = runner.end_game();
            res.send(success);
        },

        status : function(engine_name, game_id, req, res) {
            var runner = games[engine_name][game_id];
            var status = runner.get_game_status();

            res.send(status);
        },

        command : function(engine_name, game_id, player_id, req, res) {
            var runner = games[engine_name][game_id];
            var data = req.body;

            var result = runner.command(player_id, data);
            res.send(result);
        }
    }

module.exports = handler;