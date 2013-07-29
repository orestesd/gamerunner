var config = {};

config.port = process.env.PORT || 8000;
config.engines_path = process.env.ENGINES_PATH || __dirname + '/engines';
config.game_store = __dirname + '/stores/game_store_mem.js';
config.player_store = __dirname + '/stores/player_store_mem.js';

module.exports = config;