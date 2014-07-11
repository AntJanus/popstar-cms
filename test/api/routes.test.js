var hippie = require('hippie');
var compareJSON = require('json-structure-validator');

var api = function() {
  return hippie().json().base('http://localhost:3000');
};

var emptyObj = {

};
hippie.assert.showDiff = true;

describe('routes', function() {
  it('should return full site object', function(done) {
    api()
      .get('?format=json')
      .expectStatus(200)
      .expectHeader('Content-type', 'application/json; charset=utf-8')
      .expect(function(res, body, next) {
        var comparison = compareJSON(emptyObj, body);
        if (comparison === true) {
          next();
        } else {
          throw new Error(comparison);
        }
      })
      .end(done)
    ;
  })

});
