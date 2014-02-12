//modules

var express   = require('express');
var app       = module.exports = express();
var fs        = require('fs');
var path      = require('path');
var Reader    = require('./lib/reader');
var Parser    = require('./lib/parser');
var reader = new Reader;
var parser = new Parser;

//routes

app.get('/', function(req, res) {
    //home
});

app.get('/posts', function(req, res) {
    //posts
});

app.get('/posts/:slug', function(req, res) {
    //post
    var params = req.params;
    var type;

    if(_.isNumber(params.slug)) {
      type = 'slug';
    } else {
      type = 'id'
    }

    var post = reader.getPost(params.slug, type);
});

app.get('/:page', function(req, res) {
    //pages
});
