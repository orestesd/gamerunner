module.exports = function(app, handler) {

    var util = require('util');

    app.get('/', function(req, res) {
      res.redirect('/games');
    });

    app.get('/games', function(req, res) {
        handler.load_engines(req, res);
    });

    app.post('/games', function(req, res) {
        var engine = req.body.engine;
        res.redirect(util.format('/games/%s', engine));
    });


    app.get('/games/:engine', function(req, res) {
        res.send(req.params.engine);
    });

    app.post('/games/:engine', function(req, res) {
        var gameid = req.body.gameid;
        res.redirect(util.format('/games/%s/%s', req.params.engine, gameid));
    });


    app.all('/games/:engine/create', function(req, res) {
        handler.create(req.params.engine, req, res);
    });

    app.post('/games/:engine/:gameid/addplayer', function(req, res) {
        handler.add_player(req.params.engine, req.params.gameid, req, res);
    });

    app.all('/games/:engine/:gameid/start', function(req, res) {
        handler.start(req.params.engine, req.params.gameid, req, res);
    });

    app.all('/games/:engine/:gameid/end', function(req, res) {
        handler.end(req.params.engine, req.params.gameid, req, res);
    });

    app.get('/games/:engine/:gameid/status', function(req, res) {
        handler.status(req.params.engine, req.params.gameid, req, res);
    });

    app.post('/games/:engine/:gameid/command', function(req, res) {
        var playerid = req.body.playerid;
        handler.command(req.params.engine, req.params.gameid, playerid, req, res);
    });

};