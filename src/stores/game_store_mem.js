var GameRunner = require('../gamerunner').GameRunner;

var GameStore = function() {

    var games = {};

    return {
        read : function(id) {
            var data = games[id];
            if (data) {
                var game = GameRunner.from_json(data);
                process.emit('engine-instance-restored', game);
                return game;
            }
        }, 
        save : function(game) {
            games[game.get_id()] = game.to_json();
        }, 
        clear : function(game) {
            games = {};
        }
    };
};

module.exports = new GameStore();