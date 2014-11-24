/**
 * Module dependencies.
 */

var express = require('express');
var path    = require('path');
var routes  = require('./routes');
var app     = express();

//express packages
var serveStatic = require('serve-static');
var logger = require('morgan');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(serveStatic(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(routes);

if ('development' === app.get('env')) {
  app.use(errorHandler());
}

module.exports = app;
