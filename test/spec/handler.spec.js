var chai = require('chai'),
    expect = chai.expect;

var basedir = '../../src/';
var config = require('../config_test');
var handler = require(basedir + 'handler')(config);


describe("[Invoking handlers]", function() {
    var engine = 'dummy';

    it("create", function() {
        var result = handler.create(engine);
        expect(result.engine).to.be.equal(engine);
        expect(result.id).to.not.be.undefined;
    });

    it("load engines", function() {
        var result = handler.load_engines();
        expect(result).to.deep.equal(['dummy']);
    });

    it("add_player", function() {
        var game_id = handler.create(engine).id;
        var result = handler.add_player(engine, game_id, {id : 'a', platform: 'facebook'});
        expect(result).to.be.true;

        var status = handler.status(engine, game_id);
        expect(status.players).to.have.length(1);
    });

    it("start", function() {
        var game_id = handler.create(engine).id;
        handler.add_player(engine, game_id, {id : 'a', platform: 'facebook'});
        handler.add_player(engine, game_id, {id : 'b', platform: 'facebook'});
        var result = handler.start(engine, game_id);
        expect(result).to.be.true;
    });

    it("end", function() {
        var game_id = handler.create(engine).id;
        handler.add_player(engine, game_id, {id : 'a', platform: 'facebook'});
        handler.add_player(engine, game_id, {id : 'b', platform: 'facebook'});
        handler.start(engine, game_id);
        var result = handler.end(engine, game_id);
        expect(result).to.be.true;
    });

    it("command", function() {
        var game_id = handler.create(engine).id;
        handler.add_player(engine, game_id, {id : 'a', platform: 'facebook'});
        handler.add_player(engine, game_id, {id : 'b', platform: 'facebook'});
        handler.start(engine, game_id);
        
        var result = handler.command(engine, game_id, 'a', {'foo' : 'bar'});
        expect(result.error).to.be.equal(0);
        expect(result.timestamp).to.be.equal(999);
    });

});
