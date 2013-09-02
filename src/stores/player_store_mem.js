var Player = require('../gamerunner').Player;

var Notification = function(player_id_to, payload, player_id_from) {
    var to = player_id_to;
    var data = payload;

    return {
        to : to,
        data : data
    };
};

var PlayerStore = function() {

    var players = {};
    var notifications = {};

    function get_or_create_buffer(player_id) {
        if (! notifications[player_id]) {
            notifications[player_id] = [];
        }
        return notifications[player_id];
    }

    function clear_buffer(player_id) {
        notifications[player_id] = [];
    }


    return {
        read : function(id, callback) {
            var data = players[id];
            if (data) {
                var json = Player.from_json(data);
                return callback ? callback(null, json) : json;
            }
        },

        save : function(player, callback) {
            players[player.get_id()] = player.to_json();
            return callback ? callback(null, player) : player;
        },

        clear : function(callback) {
            players = {};
            notifications = {};
            return callback ? callback(null, null) : null;
        }, 

        search : function(data, callback) {
            // TODO implement player search
            var result = {};
            return callback ? callback(null, result) : result;
        }, 


        save_notif : function(player_id, data, player_id_from, callback) {
            var notif = new Notification(player_id, data, player_id_from);
            var buffer = get_or_create_buffer(player_id);
            buffer.push(notif.data);

            return callback ? callback(null, true) : true;
        },

        read_notif : function(player_id, callback) {
            var buffer = get_or_create_buffer(player_id);
            clear_buffer(player_id);

            return callback ? callback(null, buffer) : buffer;
        }
    };
};

module.exports = new PlayerStore();