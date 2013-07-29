
var GameStore = function() {

    var games = {};

    return {
        read : function(id) {
            return games[id];
        }, 
        save : function(game) {
            games[game.get_id()] = game;
        }
    };
};

module.exports = new GameStore();