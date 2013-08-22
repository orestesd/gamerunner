
var express = require('express'),
    app = express.createServer();

var config = require(process.env.CONF_FILE || './config');

app.configure(function () {
  app.enable("jsonp callback");
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function () {
  app.use(express.errorHandler());
});

// need define routes after bodyParser to allow req.body
var handler = require('./handler.js')(config),
    routes = require('./routes.js')(app, handler),
    gameListener = require('./listeners/game_listener.js');

app.listen(config.port);

console.log("Express server listening on port " + config.port);

// apply configured game listeners
var game_listeners = [];
config.event_listeners.forEach(function(listener_path) {
    var game_listener = require(listener_path);
    game_listeners.push(game_listener);
});


module.exports = app;