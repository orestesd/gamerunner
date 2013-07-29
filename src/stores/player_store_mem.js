
var PlayerStore = function() {

    var players = {};

    return {
        read : function(id) {
            return players[id];
        }, 
        save : function(player) {
            players[player.get_id()] = player;
        }, 
        clear : function(game) {
            players = {};
        }
    };
};

module.exports = new PlayerStore();