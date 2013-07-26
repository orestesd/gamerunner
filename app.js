
/**
 * Module dependencies.
 */

var express = require('express')
  , app = express.createServer();


app.configure(function(){
  app.port = process.env.PORT || 8000;
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var handler = require('./handler.js')
  , routes = require('./routes.js')(app, handler);

  
app.listen(app.port);

console.log("Express server listening on port " + app.port);
