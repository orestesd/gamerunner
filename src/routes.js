module.exports = function(app, handler) {

    var util = require('util');

    // allow CORS cross-domain querys
    // http://enable-cors.org/server_expressjs.html
    app.all('/**', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    });

    app.get('/', function(req, res) {
        res.redirect('/games');
    });

    app.get('/games', function(req, res) {
        var result = handler.load_engines();
        res.json(result);
    });

    app.get('/games/:engine', function(req, res) {
        var result = handler.engine_info(req.params.engine);
        res.json(result);
    });


    app.post('/games/:engine/create', function(req, res) {
        var result = handler.create(req.params.engine);
        res.json(result);
    });

    app.post('/games/:gameid/addplayer/:playerid', function(req, res) {
        var result = handler.add_player(req.params.gameid, req.params.playerid);
        res.json(result);
    });

    app.post('/games/:gameid/start', function(req, res) {
        var result = handler.start(req.params.gameid);
        res.json(result);
    });

    app.post('/games/:gameid/end', function(req, res) {
        var result = handler.end(req.params.gameid);
        res.json(result);
    });

    app.get('/games/:gameid/status', function(req, res) {
        var result = handler.status(req.params.gameid);
        res.json(result);
    });

    app.post('/games/:gameid/command', function(req, res) {
        var playerid = req.body.playerid;
        handler.command(req.params.gameid, playerid, req.body);
        res.json(result);
    });


    app.post('/players/register', function(req, res) {
        var result = handler.register_player(req.body.id, req.body);
        res.json(result);
    });

    app.get('/players/:playerid', function(req, res) {
        var result = handler.read_player(req.params.playerid, req.body);
        res.json(result);
    });

};