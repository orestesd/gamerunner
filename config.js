var config = {};

config.port = process.env.PORT || 8000;
config.engines_pah = process.env.ENGINES_PATH || './engines';
config.game_store = './stores/game_store_mem.js'
config.player_store = './stores/player_store_mem.js'

module.exports = config;