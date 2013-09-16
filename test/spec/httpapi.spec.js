var chai = require('chai'),
    expect = chai.expect,
    request = require('supertest'),
    util = require('util');

process.env.CONF_FILE = '../test/config_test';
var basedir = '../../src/';
var app = require(basedir + 'app.js');

var config = require('../config_test');
var handler = require(basedir + 'handler')(config);

var engine = 'dummy';

describe("[HTTP API]", function() {

    describe("engines", function() {
        
        it("GET / -> redirect to /engines", function(done) {
            request(app)
                .get('/')
                .expect(200)
                .end(function(err, res) {
                    expect(res.header['location']).to.include('/engines');
                    done();
                });
        });

        it("GET /engines -> list engines", function(done) {
            request(app)
                .get('/engines')
                .expect(200)
                .end(function(err, res) {
                    expect(res.body).to.deep.equal(['dummy']);
                    done();
                });
        });

        it("GET /engines/:engine -> engine info", function(done) {
            request(app)
                .get(util.format('/engines/%s', engine))
                .expect(200)
                .end(function(err, res) {
                    expect(res.body.name).to.be.equal('Dummy Game Engine');
                    done();
                });
        });

        it("POST /engines/:engine/create -> create engines instance (game)", function(done) {
            handler.register_player('a', {platform: 'facebook'});

            request(app)
                .post(util.format('/engines/%s/create', engine))
                .set('authorization', auth_header('a'))
                .expect(200)
                .end(function(err, res) {
                    expect(res.body.id).to.not.be.undefined;
                    done();
                });
        });
    });
    

    describe("players", function() {

        it("POST /players/register -> register player", function(done) {
            request(app)
                .post('/players/register')
                .send({id: 'a', platform : 'web'})
                .expect(200)
                .end(function(err, res) {
                    expect(res.body.id).to.be.equal('a');
                    expect(res.body.platform).to.be.equal('web');
                    done();
                });
        });

        it("GET /players/a -> get player info", function(done) {
            request(app)
                .get('/players/a')
                .expect(200)
                .end(function(err, res) {
                    expect(res.body.id).to.be.equal('a');
                    expect(res.body.platform).to.be.equal('web');
                    done();
                });
        });

    });

    describe("games", function() {
        
        var game_id;

        beforeEach(function() {
            handler.get_game_store().clear();
            handler.get_player_store().clear();

            handler.register_player('a', {platform: 'facebook'});
            handler.register_player('b', {platform: 'facebook'});
            handler.register_player('c', {platform: 'facebook'});

            game_id = handler.create(engine).id;
            handler.add_player(game_id, 'a');
            handler.add_player(game_id, 'b');
        });
    
        it("POST /games/:game_id/addplayer/c -> add player to game instance", function(done) {
            request(app)
                .post(util.format('/games/%s/addplayer/c', game_id))
                .set('authorization', auth_header('a'))
                .end(function(err, res) {
                    expect(res.body.id).to.be.equal('c');
                    done();
                });
                
        });

        it("POST /games/:game_id/start -> start game", function(done) {
            
            request(app)
                .post(util.format('/games/%s/start', game_id))
                .set('authorization', auth_header('a'))
                .end(function(err, res) {
                    expect(res.body).to.be.true;
                    done();
                });
                
        });

        it("POST /games/:game_id/end -> end game", function(done) {
            request(app)
                .post(util.format('/games/%s/end', game_id))
                .set('authorization', auth_header('a'))
                .end(function(err, res) {
                    expect(res.body).to.be.true;
                    done();
                });
                
        });

        it("POST /games/:game_id/command -> send command to game", function(done) {
            handler.start(game_id);

            request(app)
                .post(util.format('/games/%s/command', game_id))
                .send({playerid:'a', foo:'bar'})
                .set('authorization', auth_header('a'))
                .end(function(err, res) {
                    expect(res.body.is_valid).to.be.true;
                    expect(res.body.error).to.be.equal(0);
                    done();
                });
                
        });

        it("GET /games/:game_id/status -> get game status", function(done) {
            request(app)
                .get(util.format('/games/%s/status', game_id))
                .set('authorization', auth_header('a'))
                .end(function(err, res) {
                    expect(res.body.players).to.have.length(2);
                    expect(res.body.running).to.be.false;
                    expect(res.body.timestamp).to.be.equal(0);
                    done();
                });
                
        });

        it("GET /games/:game_id/timestamp -> get game timestamp", function(done) {
            request(app)
                .get(util.format('/games/%s/timestamp', game_id))
                .set('authorization', auth_header('a'))
                .end(function(err, res) {
                    expect(res.body.timestamp).to.be.equal(0);
                    done();
                });
                
        });
    });

});

function auth_header(username, password) {
    var encoded = new Buffer(username + ':' + (password || '')).toString('base64');
    return 'Basic ' + encoded;
    
}