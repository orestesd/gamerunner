var chai = require('chai'),
    expect = chai.expect;

var basedir = '../../';
var handler = require(basedir + 'handler')('./test/engines');


describe("[Invoking handlers]", function() {
    var engine = 'dummy';
    var req, res;

    beforeEach(function() {
        req = { body: {} };
        res = { send: function() {}};
    });

    function get_game_status(id, cb) {
        handler.status(engine, id, {}, { send: function(status) {
            cb(status);
        }});
    };

    it("create", function(done) {
        res.send = function(result) {
            expect(result.engine).to.be.equal(engine);
            expect(result.id).to.not.be.undefined;
            done();
        };

        handler.create(engine, req, res);
    });

    it("load engines", function(done) {
        res.send = function(result) {
            expect(result).to.deep.equal(['dummy']);
            done();
        };

        handler.load_engines(req, res);
    });

    it("add_player", function(done) {

        handler.create(engine, {}, { send: function(result) {
            var game_id = result.id;

            req.body = {
                id : 'a',
                platform: 'facebook'
            }

            res.send = function(success) {
                expect(success).to.be.true;

                get_game_status(game_id, function(status) {
                    expect(status.players).to.have.length(1);
                    done();    
                })
                
            };

            handler.add_player(engine, game_id, req, res);
        }});
        
    });

});
