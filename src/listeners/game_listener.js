
module.exports = function() {

    var EVENTS = handler.EVENTS;
    
    process.on(EVENTS.create_game, function(gamerunner) {
    });

    process.on(EVENTS.add_player, function(player) {
    });

    process.on(EVENTS.start_game, function(gamerunner) {
    });

    process.on(EVENTS.end_game, function(gamerunner) {
    });

    process.on(EVENTS.command, function(gamerunner) {
    });
}