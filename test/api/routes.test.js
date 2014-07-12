var hippie      = require('hippie');
var compareJSON = require('json-structure-validator');
var _           = require('lodash');

var api = function() {
  return hippie().json().base('http://localhost:3000');
};


hippie.assert.showDiff = true;

describe('routes', function() {
  it('should return full site object', function(done) {
    api()
      .get('?format=json')
      .expectStatus(200)
      .expectHeader('Content-type', 'application/json; charset=utf-8')
      .expect(function(res, body, next) {
        var composite = buildEmpty();
        var comparison = compareJSON(composite, body);
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

//build functions
function buildEmpty() {
  var emptyPage = {
    title: '',
    content: '',
    path: '',
    slug: ''
  };

  var emptySite = {
    title: ''
  };

  var composite = _.clone(emptyPage);

  composite.children = [];
  composite.children.push(_.clone(emptyPage));
  composite.main = [];
  composite.main.push(_.clone(emptyPage));

  return composite;
};
