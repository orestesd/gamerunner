var chai = require('chai'),
    expect = chai.expect;

var basedir = '../../';
var handler = require(basedir + 'handler')('./test/engines');


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

});
