'use strict';

var request = require('request');

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  var reloadPort = 35729, files;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    develop: {
      server: {
        file: 'server.js'
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      files: ['<%= watch.server.files %>', '<%= watch.js.files ?>', '<%= watch.test.files %>']
    },
    mochaTest: {
      api: {
        options: {
          clearRequireCache: true,
          require: ['./test/support/bootstrap']
        },
        src: 'test/**/*.test.js'
      }
    },
    less: {
      options: {
        compress: true
      },
      "public/css/style.css": "public/css/style.less"
    },
    watch: {
      options: {
        nospawn: true,
        livereload: reloadPort
      },
      server: {
        files: [
          'app.js',
          'routes/**/*.js'
        ],
        tasks: ['develop', 'delayed-livereload']
      },
      html: {
        files: ['public/**/*.html'],
        options: {
          livereload: reloadPort
        }
      },
      js: {
        files: ['public/js/*.js'],
        options: {
          livereload: reloadPort
        }
      },
      css: {
        files: ['public/css/*.css'],
        options: {
          livereload: reloadPort
        }
      },
      styles: {
        files: ['public/css/style.less'],
        tasks: ['less'],
      },
      ejs: {
        files: ['views/*.ejs'],
        options: {
          livereload: reloadPort
        }
      },
      test: {
        options: {
          spawn: false
        },
        files: ['<%= mochaTest.api.src %>'],
        tasks: ['mochaTest']
      }
    }
  });

  grunt.config.requires('watch.server.files');
  files = grunt.config('watch.server.files');
  files = grunt.file.expand(files);

  grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
    var done = this.async();
    setTimeout(function () {
      request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','),  function (err, res) {
          var reloaded = !err && res.statusCode === 200;
          if (reloaded) {
            grunt.log.ok('Delayed live reload successful.');
          } else {
            grunt.log.error('Unable to make a delayed live reload.');
          }
          done(reloaded);
        });
    }, 500);
  });

  grunt.registerTask('default', ['develop', 'watch']);
  grunt.registerTask('test', ['mochaTest']);
};

