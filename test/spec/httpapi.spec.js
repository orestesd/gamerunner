var chai = require('chai'),
    expect = chai.expect,
    request = require('supertest'),
    util = require('util');

process.env.CONF_FILE = '../test/config_test';
var basedir = '../../src/';
var app = require(basedir + 'app.js');

describe("[HTTP API]", function() {

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
            .get('/games/dummy/create')
            .expect(200)
            .end(function(err, res) {
                expect(res.body.id).to.not.be.undefined;
                done();
            });
    });

    it("GET /games/dummy/addplayer -> add player to game instance", function(done) {
        request(app)
            .get('/games/dummy/create')
            .end(function(err, res) {
                var gameid = res.body.id;

                request(app)
                    .post(util.format('/games/dummy/%s/addplayer', gameid))
                    .end(function(err, res) {
                        expect(res.body).to.be.true;
                        done();
                    })    
            });
            
    });

    it("GET /games/dummy/start -> start game", function(done) {
        request(app)
            .get('/games/dummy/create')
            .end(function(err, res) {
                var gameid = res.body.id;

                // add player_a
                request(app)
                    .post(util.format('/games/dummy/%s/addplayer', gameid))
                    .send( {id:'player_a', platform: 'web'} )
                    .end(function(err, res) {
                        
                        // add player_b
                        request(app)
                            .post(util.format('/games/dummy/%s/addplayer', gameid))
                            .send( {id:'player_b', platform: 'web'} )
                            .end(function(err, res) {
                                
                                // start_game
                                request(app)
                                    .post(util.format('/games/dummy/%s/start', gameid))
                                    .send( {id:'player_b', platform: 'web'} )
                                    .end(function(err, res) {
                                        expect(res.body).to.be.true;
                                        done();
                                    }) 
                            }) 

                    })    
            });
            
    });

    it("GET /games/dummy/start -> start game", function(done) {
        request(app)
            .get('/games/dummy/create')
            .end(function(err, res) {
                var gameid = res.body.id;

                // add player_a
                request(app)
                    .post(util.format('/games/dummy/%s/addplayer', gameid))
                    .send( {id:'player_a', platform: 'web'} )
                    .end(function(err, res) {
                        
                        // add player_b
                        request(app)
                            .post(util.format('/games/dummy/%s/addplayer', gameid))
                            .send( {id:'player_b', platform: 'web'} )
                            .end(function(err, res) {
                                
                                // start_game
                                request(app)
                                    .post(util.format('/games/dummy/%s/start', gameid))
                                    .end(function(err, res) {
                                        request(app)
                                            .post(util.format('/games/dummy/%s/end', gameid))
                                            .end(function(err, res) {
                                                expect(res.body).to.be.true;
                                                done();
                                            })
                                    }) 
                            }) 

                    })    
            });
            
    });

});
