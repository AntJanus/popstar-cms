/*jshint multistr: true */
var should = require('should');
var path = require('path');
var Reader = require('../../routes/lib/reader');
var reader = new Reader({
  directory: path.normalize('test/content')
});

describe('Reader', function() {
  describe('Find file', function() {
    it('should return a path to a file', function(done) {
      var slugPath = '/posts/first-post';
      var filePath = reader.findFile(slugPath);

      filePath.should.eql(['content', '1-posts', '1-first-post']);
      done();
    });
  });

  describe('Get file', function() {
    it('should return a path to a file', function(done) {
      var slugPath = '/posts/first-post';
      var filePath = reader.getFile(slugPath);

      filePath.should.eql();
      done();
    });
  });

  describe('Post Title', function() {
    it('should return a list of title', function(done) {
      var titleList = reader.getPostTitles();

      titleList[0].should.eql('Testing title');
      done();
    });
  });
});
