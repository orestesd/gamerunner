
var EVENTS = require('./gamerunner').EVENTS;

var GameRunnerListener = function(runner) {

    runner.on(EVENTS.add_player, function(player) {
    });

    runner.on(EVENTS.start_game, function() {
    });

    runner.on(EVENTS.end_game, function() {
    });

    runner.on(EVENTS.command, function() {
    });

}

module.exports = GameRunnerListener;
