var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var Parser = require('./parser');
var parser = new Parser;
var async = require('async');

var reader = function(options) {

  if(options) {
    _.extend(this.globalOptions, options);
  }

  return this;
};

reader.prototype = {

  globalOptions: {
    directory: path.normalize('content'),
    postsPerPage: 10,
    slugSplit: /^[0-9]*-/,
    extensionSplit: /\.md$/,
    ignoreFiles: /^\./,
    filename: 'post.md'
  },

  getFile: function(slugPath) {
    var self = this;
    var foundPath = this.findFile(_.clone(slugPath));
    var data;

    if (foundPath === false) {
      return { error: 'Not found'};
    } else {
      try {
        var filePath = path.normalize(foundPath.join('/') + '/' + self.globalOptions.filename);
        var file = fs.readFileSync(filePath).toString();
        data = parser.parseFile(file);
        data.path = foundPath;
        data.slug = slugPath;

        return data;
      } catch (err) {
        console.log(err);
        return { error: 'Not found'};
      }
    }
  },

  findFile: function(slugPath, existingPath) {
    var self = this;
    var fullPath = [];
    var currentSlug = slugPath.shift();
    var found = false;

    if(!existingPath) {
      var existingPath = [];
    }

    if(_.isEmpty(existingPath)) {
      fullPath.push(this.globalOptions.directory);
      existingPath.push(this.globalOptions.directory);
    } else {
      _.merge(fullPath, existingPath);
    }

    var files = fs.readdirSync(path.normalize(fullPath.join('/')));

    files.forEach(function(file) {
      if(!file.match(self.globalOptions.ignoreFiles) && found === false && currentSlug === self.parseSlug(file).slug) {
        fullPath.push(file);
        found = true;
      } else if (_.isEmpty(currentSlug) && file === self.globalOptions.filename) {
        if (existingPath.join('') === self.globalOptions.directory) {
          found = true;
        }
      }
    });

    if(found === true) {
      if(!_.isEmpty(slugPath)) {
        var nextPath = this.findFile(slugPath, fullPath);

        if(nextPath !== false) {
          return nextPath;
        }
      }

      return fullPath;
    } else {
      return false;
    }
  },

  getChildren: function (parentPath, overrideLimit, callback) {
    var self = this;
    var limit = overrideLimit ? overrideLimit : 0;
    var fullPath = path.normalize(self.globalOptions.directory + '/' + parentPath);

    //get files
    var children = self.findChildren(fullPath, limit);
    var payload = {};
    var parallelExecute = {};
    children.forEach(function(child) {
      parallelExecute[child] = function(callback) {
        var filePath = path.normalize(fullPath + '/' + child + '/' + self.globalOptions.filename);
        fs.readFile(filePath, function (err, data) {
          if (err) {
            callback(null, null);
          } else {
            var d = parser.parseFile(data.toString());
            d.path = filePath;
            d.slug = self.slugify(filePath);
            callback(null, d);
          }
        });
      }
    });

   async.parallel(parallelExecute, function(err, result) {
     var filtered = [];
     _.each(result, function(child) {
      if(!_.isNull(child)) {
        filtered.push(child);
      }
     });

     callback(filtered);
   });
  },

  findChildren: function(parentFile, overrideLimit) {
    var self = this;
    var limit = overrideLimit;

    var files = _.filter(fs.readdirSync(parentFile), function(file) {
      return _.isEmpty(file.split('.')[1]);
    });

    if(limit === 0) {
      limit = files.length;
    }

    files.sort(function(a, b) {
      self.fileSort(a, b);
    });

    files.slice(0, limit);

    return files;
  },

  slugify: function(filePath) {
    var self = this;
    var slug = [];

    var segments = filePath.split('/');
    segments.forEach(function(segment) {
      if (_.contains(self.globalOptions.directory.split('/'), segment) || segment === self.globalOptions.filename || _.isEmpty(segment)) {

      } else {
        var slugged = self.parseSlug(segment);
        slug.push(slugged.slug);
      }
    });

    return slug;
  },

  parseSlug: function(fileName) {
    var file = fileName;
    var data = {};

    var slugInfo = file.split(this.globalOptions.slugSplit);
    if(slugInfo.length == 2) {
      data.id = file.match(this.globalOptions.slugSplit)[0].slice(0,-1);
      data.slug = slugInfo[1].replace(this.globalOptions.extensionSplit,'');
      return data;
    }

    return false;
  },

  fileSort: function(a, b) {
    var a1 = parseInt(a, 10);
    var b1 = parseInt(b, 10);

    return a1 > b1;
  }
};

module.exports = reader;
