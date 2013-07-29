
var PlayerStore = function() {

    var players = {};

    return {
        read : function(id) {
            return players[id];
        }, 
        save : function(game) {
            players[players.get_id()] = game;
        }
    };
};

module.exports = new PlayerStore();