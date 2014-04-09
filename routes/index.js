//modules

var express   = require('express');
var app       = module.exports = express();
var Reader    = require('./lib/reader');
var reader = new Reader;
var _      = require('lodash');

//routes
app.get('/*', function(req,res) {
  var slug = req.params[0].split('/');
  var payload = {};
  payload = reader.getFile(slug);

  if (payload.error) {
    res.render('404', payload);
  } else {
    res.render('index', payload);
  }
});

app.get('/posts', function(req, res) {
  //posts
  var payload = {};

  payload.posts = reader.getPosts(10);
  payload.pages = reader.getPages(10);

  res.render('index', payload);
});

app.get('/posts/:identifier', function(req, res) {
  //post
  var params = req.params;
  var payload = {};
  var type;

  if(_.isNumber(params.slug)) {
    type = 'id';
  } else {
    type = 'slug';
  }

  payload.post = reader.findPost(params.identifier, type);
  payload.pages = reader.getPages(10);

  res.render('index', payload);
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
