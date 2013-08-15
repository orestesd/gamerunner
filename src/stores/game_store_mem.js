
var GameStore = function() {

    var games = {};

    return {
        read : function(id) {
            var game = games[id];
            process.emit('engine-instance-restored', game);
            return game;
        }, 
        save : function(game) {
            games[game.get_id()] = game;
        }, 
        clear : function(game) {
            games = {};
        }
    };
};

module.exports = new GameStore();