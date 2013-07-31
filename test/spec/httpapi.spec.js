var chai = require('chai'),
    expect = chai.expect,
    request = require('supertest'),
    util = require('util');

process.env.CONF_FILE = '../test/config_test';
var basedir = '../../src/';
var app = require(basedir + 'app.js');

describe("[HTTP API]", function() {

    beforeEach(function(done) {
        request(app)
            .post('/players/a')
            .send({platform : 'web'})
            .expect(200)
            .end(function(err, res) {
                request(app)
                    .post('/players/b')
                    .send({platform : 'web'})
                    .expect(200)
                    .end(function(err, res) {
                        done();
                    })
            });
    });

    it("GET / -> redirect to /games", function(done) {
        request(app)
            .get('/')
            .expect(200)
            .end(function(err, res) {
                expect(res.header['location']).to.include('/games');
                done();
            });
    });

    it("GET /games -> list game engines", function(done) {
        request(app)
            .get('/games')
            .expect(200)
            .end(function(err, res) {
                expect(res.body).to.deep.equal(['dummy']);
                done();
            });
    });

    it("GET /games/dummy -> list game engines", function(done) {
        request(app)
            .get('/games/dummy')
            .expect(200)
            .end(function(err, res) {
                expect(res.body.name).to.be.equal('Dummy Game Engine');
                done();
            });
    });

    it("GET /games/dummy/create -> create game instance", function(done) {
        request(app)
            .post('/games/dummy/create')
            .expect(200)
            .end(function(err, res) {
                expect(res.body.id).to.not.be.undefined;
                done();
            });
    });

    it("GET /games/:gameid/addplayer/a -> add player to game instance", function(done) {
        request(app)
            .post('/games/dummy/create')
            .end(function(err, res) {
                var gameid = res.body.id;
                request(app)
                    .post(util.format('/games/%s/addplayer/a', gameid))
                    .end(function(err, res) {
                        expect(res.body.id).to.be.equal('a');
                        done();
                    });
            });
            
    });

    it("GET /games/:gameid/start -> start game", function(done) {
        request(app)
            .post('/games/dummy/create')
            .end(function(err, res) {
                var gameid = res.body.id;

                // add player a
                request(app)
                    .post(util.format('/games/%s/addplayer/a', gameid))
                    .end(function(err, res) {
                        
                        // add player_b
                        request(app)
                            .post(util.format('/games/%s/addplayer/b', gameid))
                            .end(function(err, res) {
                                
                                // start_game
                                request(app)
                                    .post(util.format('/games/%s/start', gameid))
                                    .send( {id:'player_b', platform: 'web'} )
                                    .end(function(err, res) {
                                        expect(res.body).to.be.true;
                                        done();
                                    });
                            }) 

                    })    
            });
            
    });

    it("GET /games/:gameid/start -> start game", function(done) {
        request(app)
            .post('/games/dummy/create')
            .end(function(err, res) {
                var gameid = res.body.id;

                // add player_a
                request(app)
                    .post(util.format('/games/%s/addplayer/a', gameid))
                    .end(function(err, res) {
                        
                        // add player_b
                        request(app)
                            .post(util.format('/games/%s/addplayer/b', gameid))
                            .send( {id:'player_b', platform: 'web'} )
                            .end(function(err, res) {
                                
                                // start_game
                                request(app)
                                    .post(util.format('/games/%s/start', gameid))
                                    .end(function(err, res) {
                                        request(app)
                                            .post(util.format('/games/%s/end', gameid))
                                            .end(function(err, res) {
                                                expect(res.body).to.be.true;
                                                done();
                                            });
                                    }); 
                            }); 

                    });   
            });
            
    });

});
