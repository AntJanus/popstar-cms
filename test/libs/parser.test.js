/*jshint multistr: true */
var should = require('should');
var Parser = require('../../routes/lib/parser');
var parser = new Parser;

var fileString = 'title: Something \r\n\
-----\r\n\
content: something else.';

var fileStringArray = 'title: Something \r\n\
-----\r\n\
myarray[]: first element. \r\n\
-----\r\n\
myarray[]: second element.';

var varString = 'title: Something';

//splitting string
describe('Parser', function(){
  describe('parseVariable', function() {
    it('should have name=title and content=Something', function(done) {
      var parsedString = parser.parseVariable(varString);
      parsedString.should.have.property('name', 'title');
      parsedString.should.have.property('content', 'Something');
      done();
    });
  });
  describe('parseFile', function() {
    it('should have title and content keys', function(done) {
      var parsedFile = parser.parseFile(fileString);
      parsedFile.should.have.keys('title', 'content');
      done();
    });
  });
  describe('parseArray', function() {
    it('should pass back an array of values', function(done) {
      var parsedFile = parser.parseFile(fileStringArray);
      parsedFile.should.have.keys('title', 'myarray');
      parsedFile.myarray.should.have.lengthOf(2);
      done();
    });
  });
});
