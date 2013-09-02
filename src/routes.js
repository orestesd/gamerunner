module.exports = function(app, handler) {

    var util = require('util'),
        express = require('express');

    function render_json_response(req, res) {
        return function(err, result) {
            res.json(result);
        }
    }

    function extract_auth_header_data(req) {
        var header = (req.headers['authorization'] || ' : ').split(' ');
        var decoded = new Buffer(header[1], 'base64').toString();
        var auth = decoded ? decoded.split(':') : [null,null];
        req.username = auth[0];
        req.password = auth[1];
    }

    var auth_user = function(req, res, next) {
        extract_auth_header_data(req);
        // check the user&pass
        handler.get_player_store().search({username:req.username, password:req.password});
        var user = handler.get_player_store().read(req.username);

        return user ? next() : next(new Error(401));
    };

    var auth_game = function(req, res, next) {
        var game_id = req.params.gameid;
        var game = handler.get_game_store().read(game_id);

        var found = false
        if (game) {
            game.get_players().forEach(function(player) {
                if (player.id === req.username) {
                    found = true;
                }
            });    
        }

        return found ? next() : next(new Error(401));
    };

    // allow CORS cross-domain querys
    // http://enable-cors.org/server_expressjs.html
    app.all('/**', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
		res.header("Access-Control-Allow-Credentials", true);
        res.header("Access-Control-Allow-Headers", "X-Requested-With, Authorization");
        next();
    });

    app.get('/', function(req, res) {
        res.redirect('/engines');
    });


    app.get('/engines', function(req, res) {
        handler.load_engines(render_json_response(req, res))
    });

    app.get('/engines/:engine', function(req, res) {
        handler.engine_info(req.params.engine, render_json_response(req, res))
    });


    app.post('/engines/:engine/create', auth_user, function(req, res) {
        handler.create(req.params.engine, render_json_response(req, res));
    });


    app.post('/games/:gameid/addplayer/:playerid', auth_user, function(req, res) {
        handler.add_player(req.params.gameid, req.params.playerid, render_json_response(req, res));
    });

    app.post('/games/:gameid/start', auth_user, auth_game, function(req, res) {
        handler.start(req.params.gameid, render_json_response(req, res));
    });

    app.post('/games/:gameid/end', auth_user, auth_game, function(req, res) {
        handler.end(req.params.gameid, render_json_response(req, res));
    });

    // FIXME with get don't manage auth properly cause cors preflight headers
    app.all('/games/:gameid/status', auth_user, auth_game, function(req, res) {
        handler.status(req.params.gameid, render_json_response(req, res));
    });

    app.post('/games/:gameid/command', auth_user, auth_game, function(req, res) {
        var playerid = req.username;
        handler.command(req.params.gameid, playerid, req.body, render_json_response(req, res));
    });


    app.post('/players/register', function(req, res) {
        handler.register_player(req.body.id, req.body, render_json_response(req, res));
    });

    app.get('/players/:playerid', function(req, res) {
        handler.read_player(req.params.playerid, render_json_response(req, res));
    });

};
