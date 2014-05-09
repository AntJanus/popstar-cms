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
      var parentPath = '1-posts';
      var files = reader.getChildren(parentPath, 0,function(data) {
        data.should.eql([ { title: 'Something',
              content: 'else',
              path: 'test/content/1-posts/1-first-post/post.md',
              slug: [ 'posts', 'first-post' ] } ]);
        done();
      });
    });
  });
  describe('Find children of a file', function() {
    it('should return path information on children of a file', function(done) {
      var parentFile = 'test/content/1-posts';
      var files = reader.findChildren(parentFile);

      files.should.eql(['1-first-post']);
      done();
    });
  });

  describe('Slugify a file path', function() {
    it('should return slug information based on filepath', function(done) {
      var filePath = 'test/content/1-posts/post.md';
      var slugInfo = reader.slugify(filePath);

      slugInfo.should.eql(['posts']);
      done();
    });
  });

  describe('Parse slug out of file name', function() {
    it('should return data information based on filepath', function(done) {
      var fileName = '1-posts';
      var slugInfo = reader.parseSlug(fileName);

      slugInfo.should.eql({ id: 1, slug: 'posts'});
      done();
    });
  });
});
