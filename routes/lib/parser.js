var _ = require('lodash');

var parser = function(options) {

  if(options) {
    _.extend(this.globalOptions, options);
    return this;
  }
};

parser.prototype = {

  globalOptions: {
    split: /-{3,}(\r\n|\r|\n)/g,
    varSplit: /^(\w+)(\[\])?:/,
    arraySplit: /\[\]/
  },

  parseFile: function(fileString) {
    var parts = fileString.split(this.globalOptions.split);
    var data = {};
    var self = this;
    _.each(parts, function(part) {
      var parsed = self.parseVariable(part);
      if(parsed !== false) {
        if(parsed.array == true) {
          if(!_.isArray(data[parsed.name])) {
            data[parsed.name] = [];
          }
          data[parsed.name].push(parsed.content);
        } else {
          data[parsed.name] = parsed.content;
        }
      }
    });

    return data;
  },

  parseVariable: function(varString) {
    var parsedString = {};
    var name = varString.match(this.globalOptions.varSplit);
    if(_.isEmpty(name)) {
      return false;
    } else {
      parsedString.array = this.arrayCheck(name[0]);
      parsedString.name = name[0].slice(0, parsedString.array ? -3 : -1).trim();
      parsedString.content = varString.replace(this.globalOptions.varSplit, '').trim();

      return parsedString;
    }
  },

  arrayCheck: function(varString) {
    if(!_.isEmpty(varString.match(this.globalOptions.arraySplit))) {
      return true;
    }

    return false;
  }
};

module.exports = parser;
