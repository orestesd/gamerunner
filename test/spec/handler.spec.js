var chai = require('chai'),
    expect = chai.expect;

var basedir = '../../src/';
var config = require('../config_test');
var handler = require(basedir + 'handler')(config);
var engine = 'dummy';

describe("[GameRunner and Players handler]", function() {
    
    beforeEach(function() {
        handler.get_game_store().clear();
        handler.get_player_store().clear();        
    });

    it("create GameRunner with specified engine", function() {
        var result = handler.create(engine);
        expect(result.engine).to.be.equal(engine);
        expect(result.id).to.not.be.undefined;
    });

    it("create GameRunner with unexistent engine", function() {
        var result = handler.create('zzz');
        expect(result).to.be.undefined;
    });

    it("load engines", function() {
        var result = handler.load_engines();
        expect(result).to.deep.equal(['dummy']);
    });

    it("register player", function() {
        var game_id = handler.create(engine).id;
        var player = handler.register_player('a', {platform: 'facebook'});
        
        expect(player).to.not.be.undefined;
        expect(player.id).to.be.equal('a');

        var readed = handler.read_player('a');
        expect(readed.id).to.be.equal('a');
        expect(readed.platform).to.be.equal('facebook');
    });

    it("add registered player", function() {
        var game_id = handler.create(engine).id;
        handler.register_player('a', {platform: 'facebook'});

        var result = handler.add_player(game_id, 'a', {platform: 'facebook'});
        expect(result.id).to.be.equal('a');
    });

    it("add unregistered player", function() {
        var game_id = handler.create(engine).id;
        var result = handler.add_player(game_id, 'a', {platform: 'facebook'});
        expect(result).to.be.undefined;
    });


    describe("[actions with initialized GameRunner]", function() {

        var game_id;

        beforeEach(function() {
            game_id = handler.create(engine).id;
            handler.register_player('a', {platform: 'facebook'});
            handler.register_player('b', {platform: 'facebook'});

            handler.add_player(game_id, 'a');
            handler.add_player(game_id, 'b');
        });

        it("start game", function() {
            var result = handler.start(game_id);
            expect(result).to.be.true;
        });

        it("end game", function() {
            handler.start(game_id);
            var result = handler.end(game_id);
            expect(result).to.be.true;
        });

        it("start unexistent game", function() {
            var result = handler.start('unexistent game id');
            expect(result).to.not.be.true;
        });

        it("end unexistent game", function() {
            var result = handler.end('unexistent game id');
            expect(result).to.not.be.true;
        });

        it("end unstarted game", function() {
            var result = handler.end(game_id);
            expect(result).to.be.true;
        });

        it("command", function() {
            handler.start(game_id);
            
            var result = handler.command(game_id, 'a', {'foo' : 'bar'});
            expect(result.error).to.be.equal(0);
            expect(result.data).to.be.equal('gamestatus');
        });

        it("retrieve game status after a command", function() {
            handler.start(game_id);
            handler.command(game_id, 'a', {'foo' : 'bar'});
            
            var status = handler.status(game_id);
            expect(status.timestamp).to.be.gt(0);
            expect(status.players).to.have.length(2);
            expect(status.running).to.be.true;
        });
    });

});

describe("[Game events]", function() {
    
    var player_a, player_b;

    beforeEach(function() {
        handler.get_player_store().clear();        
    });

    it("player-registered event is raised", function(done) {
        process.once(handler.EVENTS.register_player, function(player) {
            expect(player.get_id()).to.be.equal('a');
            done();
        });

        handler.register_player('a', {platform: 'web'});
    });

    it("game-created event is raised", function(done) {
        process.once(handler.EVENTS.create_game, function(runner) {
            expect(runner.get_id()).to.not.be.undefined;
            done();
        });

        handler.create(engine);
    });

    it("player-added event is raised", function(done) {
        process.once(handler.EVENTS.add_player, function(player) {
            expect(player.get_id()).to.be.equal('a');
            done();
        });

        handler.register_player('a', {platform: 'web'});
        var game = handler.create(engine);
        handler.add_player(game.id, 'a');
    });

    describe("", function() {

        var gameid;

        beforeEach(function() {
            handler.register_player('a', {platform: 'web'});
            handler.register_player('b', {platform: 'web'});

            gameid = handler.create(engine).id;

            handler.add_player(gameid, 'a');
            handler.add_player(gameid, 'b');
        });
    
        it("game-started event is raised", function(done) {
            process.once(handler.EVENTS.start_game, function(runner) {
                expect(runner.get_id()).to.be.equal(gameid);
                done();
            });

            handler.start(gameid);
        });

        it("game-ended event is raised", function(done) {
            process.once(handler.EVENTS.end_game, function(runner) {
                expect(runner.get_id()).to.be.equal(gameid);
                done();
            });

            handler.end(gameid);
        });

        it("command-received event is raised", function(done) {
            process.once(handler.EVENTS.command, function(command_result) {
                expect(command_result.error).to.be.equal(0);
                done();
            });

            handler.start(gameid);
            handler.command(gameid, 'a', {});
        });

    });

});

describe("[Player notifications]", function() {

    var player_a, player_b;

    beforeEach(function() {
        handler.get_player_store().clear();
        handler.register_player('a', {platform: 'web'});
        handler.register_player('b', {platform: 'web'});
    });

    it("sending notifications", function() {
        var result = handler.send_notif('a', {idx: 0});
        expect(result).to.be.true;
    });

    it("send notifications from player to player", function() {
        handler.send_notif('b', {idx: 1}, 'a');
        handler.send_notif('b', {idx: 2}, 'a');
        
        expect(handler.read_notif('b')).to.have.length(2);
    });

    it("reading notifications", function() {
        handler.send_notif('a', {idx: 1});
        handler.send_notif('a', {idx: 2});
        
        var notifs = handler.read_notif('a');
        expect(notifs).to.have.length(2);
        expect(notifs[0].idx).to.be.equal(1);
        expect(notifs[1].idx).to.be.equal(2);
    });

    it("notifications are removed after reading", function() {
        handler.send_notif('a', {idx: 1});
        expect(handler.read_notif('a')).to.have.length(1);
        expect(handler.read_notif('a')).to.have.length(0);
    });

    it("notification-sent event is raised", function(done) {
        process.once(handler.EVENTS.send_notif, function(player, data, from) {
            expect(player.get_id()).to.be.equal('a');
            expect(data).to.be.deep.equal({idx: 1});
            done();
        });

        handler.send_notif('a', {idx: 1});
    });

    it("notification-read event is raised", function(done) {
        process.once(handler.EVENTS.read_notif, function(player, notifications) {
            expect(player.get_id()).to.be.equal('a');
            expect(notifications).to.be.deep.equal([{idx: 1}]);
            done();
        });

        handler.send_notif('a', {idx: 1});
        handler.read_notif('a');
    });

});