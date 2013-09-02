var GameRunner = require('../gamerunner').GameRunner;

var GameStore = function() {

    var games = {};

    return {
        read : function(id, callback) {
            var data = games[id];
            if (data) {
                var game = GameRunner.from_json(data);
                process.emit('engine-instance-restored', game);

                return callback ? callback(null, game) : game;
            }
        }, 
        save : function(game, callback) {
            games[game.get_id()] = game.to_json();
            return callback ? callback(null, game) : game;
        }, 
        clear : function(game, callback) {
            games = {};
            return callback ? callback(null, game) : game;
        }
    };
};

module.exports = new GameStore();