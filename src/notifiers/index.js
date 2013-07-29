
var EventEmitter = require('events').EventEmitter;

var AsyncNotifSender = (function() {
    var event_send = 'send-notification';
    var emitter = new EventEmitter();

    var notifiers = {};

    function get_notifier(platform) {
        if (! notifiers[platform]) {
            notifiers[platform] = require('./' + platform);
        }
        return notifiers[platform];
    };

    emitter.on(event_send, function(notif) {
        var platform = notif.to.get_platform();
        var notifier_impl = get_notifier(platform);
        notifier_impl.send(this);
    });

    return {
        send : function(notif) {
            emitter.emit(event_send, notif);
        }
    };

})();

var Notification = function(player_to, payload) {
    var to = player_to;
    var data = payload;

    return {
        to : to,
        data : data
    };
};

var Notifier = function() {

    var notifs = {};

    function get_or_create_buffer(player_id) {
        if (! notifs[player_id]) {
            notifs[player_id] = [];
        }
        return notifs[player_id];
    }

    function clear_buffer(player_id) {
        notifs[player_id] = [];
    }

    return {
        send_notif : function(player, data) {
            var notif = new Notification(player, data);
            
            var buffer = get_or_create_buffer(player.get_id());
            buffer.push(notif.data);

            // async notify
            AsyncNotifSender.send(notif);

            return true;
        },

        get_notif : function(player) {
            var buffer = get_or_create_buffer(player.get_id());
            clear_buffer(player.get_id());
            return buffer;
        },

        clear : function(player) {
            if (player) {
                clear_buffer(player.get_id());
            }
        }
    };

};

module.exports = new Notifier();