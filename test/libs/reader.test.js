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
      var slugPath = ['posts','first-post'];
      var filePath = reader.findFile(slugPath);

      filePath.should.eql(['test/content', '1-posts', '1-first-post']);
      done();
    });
  });

  describe('Get file', function() {
    it('should return a path to a file', function(done) {
      var slugPath = ['posts','first-post'];
      var filePath = reader.getFile(slugPath);

      filePath.should.eql(
        { title: 'Something',
          content: 'else',
          path: [ 'test/content', '1-posts', '1-first-post' ],
          slug: [ 'posts', 'first-post' ] });
      done();
    });
  });

  describe('Get children of a file', function() {
    it('should return information on children of a file', function(done) {
      var slugPath = '/posts/first-post';
      var filePath = reader.getChildren(slugPath);

      filePath.should.eql();
      done();
    });
  });
  describe('Find children of a file', function() {
    it('should return path information on children of a file', function(done) {
      var slugPath = '/posts/first-post';
      var filePath = reader.findChildren(slugPath);

      filePath.should.eql();
      done();
    });
  });
});
