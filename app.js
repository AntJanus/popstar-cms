/**
 * Module dependencies.
 */

var express = require('express');
var path    = require('path');
var routes  = require('./routes');
var app     = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.urlencoded());
app.use(express.json());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);
app.use(app.router);

if ('development' === app.get('env')) {
  app.use(express.logger('dev'));
  app.use(express.errorHandler());
}

module.exports = app;
