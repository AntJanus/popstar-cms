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
    varSplit: /^(\w+:)/
  },

  parseFile: function(fileString) {
    var parts = fileString.split(this.globalOptions.split);
    var data = {};
    var self = this;
    console.log(parts);
    _.each(parts, function(part) {
      var parsed = self.parseVariable(part);
      if(parsed !== false) {
        data[parsed.name] = parsed.content;
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
      parsedString.name = name[0].slice(0, -1).trim();
      parsedString.content = varString.replace(this.globalOptions.varSplit, '').trim();

      return parsedString;
    }
  }
};

module.exports = parser;
