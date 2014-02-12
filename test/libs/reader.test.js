/*jshint multistr: true */
var should = require('should');
var path = require('path');
var Reader = require('../../routes/lib/reader');
var reader = new Reader({
  directory: path.normalize('test/testContent'),
  postsDir: path.normalize('test/testContent/posts'),
  pagesDir: path.normalize('test/testContent/pages')
});

describe('Reader', function() {
  describe('Post Title', function() {
    it('should return a list of title', function(done) {
      var titleList = reader.getPostTitles();

      titleList[0].should.eql('Testing title');
      done();
    });
  });
});
