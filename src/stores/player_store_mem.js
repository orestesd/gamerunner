
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
        }, 
        search : function(data) {
            // TODO implement player search
        }
    };
};

module.exports = new PlayerStore();