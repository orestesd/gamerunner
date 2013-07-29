
var GameStore = function() {

    var games = {};

    return {
        read : function(id) {
            return games[id];
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