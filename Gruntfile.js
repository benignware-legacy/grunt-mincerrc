/*
 * grunt-mincerrc
 * https://github.com/rafaelnowrotek/grunt-mincerrc
 *
 * Copyright (c) 2015 Rafael Nowrotek
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/**/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },
    copy: {
      test: {
        dot: true,
        expand: true,
        cwd: 'test/fixtures',
        src: '**/*',
        dest: 'tmp'
      }
    },
    // Configuration to be run (and then tested).
    mincerrc: {
      default_options: {
        options: {
          clean: true
        },
        cwd: 'tmp/default_options',
        src: ['**/.mincerrc']
      },
      custom_options: {
        options: {
          clean: true,
          enable: [
            'autoprefixer'
          ],
          engines: {
            Coffee: {
              bare: true
            }
          },
          helpers: {
            asset_path: function(logicalPath) {
              var
                base = 'public/_assets/',
                asset = this.findAsset(logicalPath);
              if (asset) {
                return base + asset.digestPath;
              }
              return base + logicalPath;
            }
          },
          jsCompressor: 'uglify',
          cssCompressor: 'csswring',
          sourceMaps: true,
          embedMappingComments: false,
          compress: true
        },
        cwd: 'tmp/custom_options',
        src: ['**/.mincerrc']
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'copy', 'mincerrc', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
