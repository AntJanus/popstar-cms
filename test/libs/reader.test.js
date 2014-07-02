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
      var files = reader.getFeed(parentPath, 0, 0, function(data) {
        data.should.eql([ { title: 'Something',
              content: 'else',
              path: 'test/content/1-posts/1-first-post/post.md',
              slug: [ 'posts', 'first-post' ] } ]);
        done();
      });
    });
  });

  describe('Get a limited item feed', function() {
    it('should return item feed of a specific length', function(done) {
      var files = reader.getFeed('', 1, 0, function(data) {
        data.should.have.length(1);
        data.should.eql([ { title: 'Test',
           content: 'nothing',
           path: "test/content/1-posts/post.md",
           slug: ["posts"]
        }]);
        done();
      });
    });

    it('should return item feed with a limit and offset', function(done) {
      var files = reader.getFeed('', 1, 1, function(data) {
        data.should.have.length(1);
        data.should.eql([ { title: 'Array post',
           content: 'some content',
           array1: [
            "first element",
            "second element",
            "third element"
           ],
           path: "test/content/2-arrays/post.md",
           slug: ["arrays"]
        }]);
        done();
      });
    });
  });

  describe('Find children of a file', function() {
    it('should return path information on children of a file', function(done) {
      var parentFile = 'test/content/1-posts';
      var files = reader.findFeedItems(parentFile);

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

  describe('File sort by id', function() {
    it('should return correctly sorted files', function(done) {
      var files = ['1-something', '2-else', '15-trick-file', '03-trick'];
      files = files.sort(function (a, b) {
        return reader.fileSort(a, b);
      });


      files.should.eql([ '1-something', '2-else', '03-trick', '15-trick-file' ]);
      done();
    });
  });

  describe('options', function() {
    it('should return existing options', function(done) {
      var testReader = new Reader;
      var opts = testReader.options();

      opts.should.eql({
        directory: 'content',
        postsPerPage: 10,
        slugSplit: /^[0-9]*-/,
        extensionSplit: /\.md$/,
        ignoreFiles: /^\./,
        filename: 'post.md',
        parser: {
          split: /-{3,}(\r\n|\r|\n)/g,
          varSplit: /^(\w+)(\[\])?:/,
          arraySplit: /\[\]/
        }
      });

      done();
    });

    it('should extend existing options', function(done) {
      var testReader = new Reader;
      var opts = testReader.options();

      opts.should.eql({
        directory: 'content',
        postsPerPage: 10,
        slugSplit: /^[0-9]*-/,
        extensionSplit: /\.md$/,
        ignoreFiles: /^\./,
        filename: 'post.md',
        parser: {
          split: /-{3,}(\r\n|\r|\n)/g,
          varSplit: /^(\w+)(\[\])?:/,
          arraySplit: /\[\]/
        }
      });

      var newOpts = {
        directory: 'test/content',
        test: 1,
        parser: {
          split: /,/g,
          test: 2
        }
      };

      testReader.options(newOpts);
      opts = testReader.options();

      opts.should.eql({
        directory: 'test/content',
        postsPerPage: 10,
        slugSplit: /^[0-9]*-/,
        extensionSplit: /\.md$/,
        ignoreFiles: /^\./,
        filename: 'post.md',
        test: 1,
        parser: {
          split: /,/g,
          varSplit: /^(\w+)(\[\])?:/,
          arraySplit: /\[\]/,
          test: 2,
        }
      });

      done();
    });
  });
});
