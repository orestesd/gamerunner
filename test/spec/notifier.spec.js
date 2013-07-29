var chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon');

var basedir = '../../src/';
var Player = require(basedir + 'gamerunner').Player;
var Notifier = require(basedir + '/notifiers');

var sandbox;

beforeEach(function() {
    sandbox = sinon.sandbox.create();
});

afterEach(function() {
    sandbox = sandbox.restore();
});



describe("[Creating Players]", function() {
    
    var player_a, player_b, player_b, player_d;

    beforeEach(function() {
        player_a = new Player({id:'a', platform : 'web'});
        player_b = new Player({id:'b', platform : 'web'});

        Notifier.clear(player_a);
        Notifier.clear(player_b);
    });

    it("sending notifications", function() {
        var result = Notifier.send_notif(player_a, {idx: 1});
        expect(result).to.be.true;
    });

    it("reading notifications", function() {
        Notifier.send_notif(player_a, {idx: 1});
        Notifier.send_notif(player_a, {idx: 2});
        
        var notifs = Notifier.get_notif(player_a);
        expect(notifs).to.have.length(2);
        expect(notifs[0].idx).to.be.equal(1);
        expect(notifs[1].idx).to.be.equal(2);
    });

    it("notifications are removed after reading", function() {
        Notifier.send_notif(player_a, {idx: 1});
        expect(Notifier.get_notif(player_a)).to.have.length(1);
        expect(Notifier.get_notif(player_a)).to.have.length(0);
    });
});