var chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon');

var basedir = '../../src/';
var gr = require(basedir + 'gamerunner.js');
var DummyEngine = require('../engines_test/dummy.js');

var sandbox;
var runner;

var engine = new DummyEngine();

beforeEach(function() {
	sandbox = sinon.sandbox.create();
	runner = new gr.GameRunner(engine);
});

afterEach(function() {
	sandbox = sandbox.restore();
});



describe("[Creating a GameRunner]", function() {
	
	it("a GameRunner is created with a engine", function() {
		expect(runner.get_engine()).exist
	});

});

describe("[Adding players to a GameRunner]", function() {

	var player_a, player_b, player_c, player_d, player_e;

	beforeEach(function() {
		player_a = new gr.Player({id:'a'});
		player_b = new gr.Player({id:'b'});
		player_c = new gr.Player({id:'c'});
		player_d = new gr.Player({id:'d'});
		player_e = new gr.Player({id:'e'});
	});

	it("a player can be added to a not started game", function() {
		runner.add_player(player_a);
		expect(runner.get_players()).to.have.length(1);

		runner.add_player(player_b);
		expect(runner.get_players()).to.have.length(2);
	});

	it("a player can't be added twice", function() {
		runner.add_player(player_a);
		expect(runner.get_players()).to.have.length(1);

		runner.add_player(player_a);
		expect(runner.get_players()).to.have.length(1);
	});

	it("a player can't be added to a running game", function() {
		runner.add_player(player_a);
		runner.add_player(player_b);
		runner.start_game();

		expect(runner.get_players()).to.have.length(2);
		expect(runner.is_game_running()).to.be.true;

		var success = runner.add_player(player_c);
		expect(success).to.be.false;
		expect(runner.get_players()).to.have.length(2);
	});

	it("a player can't be added to a ended game", function() {
		runner.add_player(player_a);
		runner.add_player(player_b);
		runner.end_game();

		expect(runner.get_players()).to.have.length(2);

		var success = runner.add_player(player_b);
		expect(success).to.be.false
		expect(runner.get_players()).to.have.length(2);
	});

	it("a player can't be added to a full game", function() {
		runner.add_player(player_a);
		runner.add_player(player_b);
		runner.add_player(player_c);
		runner.add_player(player_d);
		var success = runner.add_player(player_e);

		expect(success).to.be.false;
		expect(runner.get_players()).to.have.length(4);
	});

	it("a GameRunner without enough players can't be started", function() {
		var success = runner.start_game();
		expect(success).to.be.false;
		expect(runner.is_game_started()).to.be.false;
	});

});

describe("[Starting and ending a GameRunner]", function() {
	
	beforeEach(function() {
		runner.add_player(new gr.Player({id:'a'}));
		runner.add_player(new gr.Player({id:'b'}));
	});

	it("a GameRunner is created as not started", function() {
		expect(runner.is_game_started()).to.be.false;
		expect(runner.is_game_running()).to.be.false;
		expect(runner.is_game_ended()).to.be.false;
	});

	it("a GameRunner with enough players can be started", function() {
		var success = runner.start_game();
		expect(success).to.be.true;
		expect(runner.is_game_started()).to.be.true;
		expect(runner.is_game_running()).to.be.true;
		expect(runner.is_game_ended()).to.be.false;
	});

	it("a GameRunner can't be started twice (is actionless)", function() {
		var success = runner.start_game();
		expect(success).to.be.true;
		expect(runner.start_game()).to.be.false;
		expect(runner.is_game_started()).to.be.true;
		expect(runner.is_game_running()).to.be.true;
		expect(runner.is_game_ended()).to.be.false;
	});

	it("a running GameRunner can be ended", function() {
		runner.start_game();
		runner.end_game();
		expect(runner.is_game_started()).to.be.true;
		expect(runner.is_game_running()).to.be.false;
		expect(runner.is_game_ended()).to.be.true;
	});

	it("a not running GameRunner can be ended", function() {
		runner.end_game();
		expect(runner.is_game_started()).to.be.false;
		expect(runner.is_game_running()).to.be.false;
		expect(runner.is_game_ended()).to.be.true;
	});

});

describe("[Sending commands to GameRunner]", function() {
	
	var player_a, player_b;

	beforeEach(function() {
		player_a = new gr.Player({id:'a'});
		player_b = new gr.Player({id:'b'});
		runner.add_player(player_a);
		runner.add_player(player_b);
	});

	it("an not started GameRunner doesn't accept commands", function() {
		var result = runner.command('a', {});
		expect(result.error).to.be.equal(1);
	});

	it("GameRunner invokes command success callback", function() {
		runner.start_game();
		
		var result = runner.command('a', {});
		expect(result.is_valid).to.be.true;
	});

	it("GameRunner send commands to engine", function() {
		sandbox.spy(engine, 'command');

		runner.start_game();
		
		var result = runner.command('a', 'xxx');
		expect(engine.command.calledOnce).to.be.ok;
		expect(engine.command.getCall(0).args[0].get_id()).to.be.equal('a');
		expect(engine.command.getCall(0).args[1]).to.be.equal('xxx');
	});

	it("a successful command is notified to players", function(done) {
		player_b.notify_update = function(result) {
			expect(result.timestamp).to.be.equal(999);
			expect(result.data).to.be.equal('gamestatus');
			done();
		};

		runner.start_game();
		
		runner.command('a', 'xxx');
	});

});
