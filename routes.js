module.exports = function(app, handler) {

    app.get('/', function(req, res) {
      res.redirect('/games');
    });

    app.get('/games', function(req, res) {
        res.send(['dummy']);
    });


    app.get('/game/:engine', function(req, res) {
        // map parameters id/action to action
        res.send('');
    });

    app.all('/game/:engine/create', function(req, res) {
        handler.create(req.params.engine, req, res);
    });

    app.post('/game/:engine/:gameid/addplayer', function(req, res) {
        handler.add_player(req.params.engine, req.params.gameid, req, res);
    });

    app.all('/game/:engine/:gameid/start', function(req, res) {
        handler.start(req.params.engine, req.params.gameid, req, res);
    });

    app.all('/game/:engine/:gameid/end', function(req, res) {
        handler.end(req.params.engine, req.params.gameid, req, res);
    });

    app.get('/game/:engine/:gameid/status', function(req, res) {
        handler.status(req.params.engine, req.params.gameid, req, res);
    });

    app.post('/game/:engine/:gameid/:playerid/command', function(req, res) {
        handler.command(req.params.engine, req.params.gameid, req.params.playerid, req, res);
    });

};