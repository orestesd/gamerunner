var config = {};

config.port = 8000;
config.engines_path = __dirname + '/engines_test';
config.game_store = __dirname + '/../src/stores/game_store_mem.js'
config.player_store = __dirname +  '/../src/stores/player_store_mem.js'

config.event_listeners = [
    __dirname + '/../src/listeners/game_listener.js'
]

module.exports = config;