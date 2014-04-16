//modules

var express   = require('express');
var app       = module.exports = express();
var config    = require('../config');
var Reader    = require('./lib/reader');
var reader    = new Reader(config.reader ? config.reader : {});
var _         = require('lodash');
var async     = require('async');

//routes
app.get('/*', function(req,res) {
  var slug = req.params[0].split('/');
  var payload = {};
  var format = req.query.format ? req.query.format : null;
  payload = reader.getFile(slug);

  if (payload.error) {
    res.render('404', payload);
  } else {
    payload.path.shift();
    var path = payload.path.join('/');
    var meta = {};

    meta.children = function(callback) {
      reader.getChildren(path, 0, function(result) {
        callback(null, result);
      });
    };

    meta.main = function(callback) {
      reader.getChildren('', 0, function(result) {
        callback(null, result);
      });
    };

    async.parallel(meta, function(err, result) {
      payload.children = result.children;
      payload.site = config.site;
      payload.main = result.main;

      if (format === 'json') {
        res.send(payload);
      } else {
        res.render('index', payload);
      }
    });
  }
});


app.get('/posts', function(req, res) {
  //posts
  var payload = {};

  payload.posts = reader.getPosts(10);
  payload.pages = reader.getPages(10);

  res.render('index', payload);
});

