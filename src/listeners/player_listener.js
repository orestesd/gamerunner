
module.exports = function() {

    var EVENTS = handler.EVENTS;
    
    process.on(EVENTS.register_player, function(player) {
    });

    process.on(EVENTS.send_notif, function(player_to, data, player_from) {
    });

    process.on(EVENTS.read_notif, function(player, notifications) {
    });

}
