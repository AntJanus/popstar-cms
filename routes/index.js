//modules

var express   = require('express');
var app       = module.exports = express();
var fs        = require('fs');
var path      = require('path');
var Reader    = require('./lib/reader');
var Parser    = require('./lib/parser');
var reader = new Reader;
var parser = new Parser;
var _      = require('lodash');

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
      type = 'id';
    } else {
      type = 'slug';
    }

    var post = reader.findPost(params.slug, type);
    res.send(post);
});

app.get('/:page', function(req, res) {
    //pages
});
