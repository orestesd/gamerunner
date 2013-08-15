
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
        read : function(id) {
            return players[id];
        },

        save : function(player) {
            players[player.get_id()] = player;
        },

        clear : function() {
            players = {};
            notifications = {};
        }, 

        search : function(data) {
            // TODO implement player search
        }, 


        save_notif : function(player_id, data, player_id_from) {
            var notif = new Notification(player_id, data, player_id_from);
            var buffer = get_or_create_buffer(player_id);
            buffer.push(notif.data);

            return true;
        },

        read_notif : function(player_id) {
            var buffer = get_or_create_buffer(player_id);
            clear_buffer(player_id);
            return buffer;
        }
    };
};

module.exports = new PlayerStore();