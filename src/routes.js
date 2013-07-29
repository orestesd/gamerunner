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

    app.post('/games/:engine/:gameid/addplayer', function(req, res) {
        var result = handler.add_player(req.params.engine, req.params.gameid, req.body);
        res.send(result);
    });

    app.all('/games/:engine/:gameid/start', function(req, res) {
        var result = handler.start(req.params.engine, req.params.gameid);
        res.send(result);
    });

    app.all('/games/:engine/:gameid/end', function(req, res) {
        var result = handler.end(req.params.engine, req.params.gameid);
        res.send(result);
    });

    app.get('/games/:engine/:gameid/status', function(req, res) {
        var result = handler.status(req.params.engine, req.params.gameid);
        res.send(result);
    });

    app.post('/games/:engine/:gameid/command', function(req, res) {
        var playerid = req.body.playerid;
        handler.command(req.params.engine, req.params.gameid, playerid, req.body);
        res.send(result);
    });

};