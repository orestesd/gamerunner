
/**
 * Module dependencies.
 */

var express = require('express')
  , app = express.createServer();

var conf = {
    port : process.env.PORT || 8000,
    engines_pah : process.env.ENGINES_PATH || './engines'
}

app.configure(function(){
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var handler = require('./handler.js')(conf.engines_pah)
  , routes = require('./routes.js')(app, handler);

  
app.listen(conf.port);

console.log("Express server listening on port " + conf.port);

module.exports = app;