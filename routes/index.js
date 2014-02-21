//modules

var express   = require('express');
var app       = module.exports = express();
var fs        = require('fs');
var path      = require('path');
var Reader    = require('./lib/reader');
var reader = new Reader;
var _      = require('lodash');

//routes

app.get('/', function(req, res) {
    //home

});

app.get('/posts', function(req, res) {
    //posts
    res.send(reader.getPosts(10));
});

app.get('/posts/:identifier', function(req, res) {
  //post
  var params = req.params;
  var type;

  if(_.isNumber(params.slug)) {
    type = 'id';
  } else {
    type = 'slug';
  }

  var post = reader.findPost(params.identifier, type);

  res.render('index', post);
});

app.get('/pages', function(req, res) {
    res.send(reader.getPages(0));
});

app.get('/:page', function(req, res) {
  //post
  var params = req.params;
  var type;

  if(_.isNumber(params.slug)) {
    type = 'id';
  } else {
    type = 'slug';
  }

  var page = reader.findPage(params.page, type);
  res.send(page);
});
