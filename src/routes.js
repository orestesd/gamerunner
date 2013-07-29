module.exports = function(app, handler) {

    var util = require('util');

    app.get('/', function(req, res) {
      res.redirect('/games');
    });

    app.get('/games', function(req, res) {
        var result = handler.load_engines();
        res.send(result);
    });

    app.get('/games/:engine', function(req, res) {
        var result = handler.engine_info(req.params.engine);
        res.send(result);
    });


    app.all('/games/:engine/create', function(req, res) {
        var result = handler.create(req.params.engine);
        res.send(result);
    });

    app.all('/games/:gameid/addplayer/:playerid', function(req, res) {
        var result = handler.add_player(req.params.gameid, req.params.playerid);
        res.send(result);
    });

    app.all('/games/:gameid/start', function(req, res) {
        var result = handler.start(req.params.gameid);
        res.send(result);
    });

    app.all('/games/:gameid/end', function(req, res) {
        var result = handler.end(req.params.gameid);
        res.send(result);
    });

    app.get('/games/:gameid/status', function(req, res) {
        var result = handler.status(req.params.gameid);
        res.send(result);
    });

    app.post('/games/:gameid/command', function(req, res) {
        var playerid = req.body.playerid;
        handler.command(req.params.gameid, playerid, req.body);
        res.send(result);
    });


    app.post('/players/:playerid', function(req, res) {
        var result = handler.register_player(req.params.playerid, req.body);
        res.send(result);
    });

};