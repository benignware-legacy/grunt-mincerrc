/*
 * grunt-mincerrc
 * https://github.com/rafaelnowrotek/grunt-mincerrc
 *
 * Copyright (c) 2015 Rafael Nowrotek
 * Licensed under the MIT license.
 */

'use strict';

var merge = require("deepmerge");
var path = require('path');
var fs = require('fs');
var Mincer = require('mincer');
var shellwords = require('shellwords').split;
var rimraf = require('rimraf').sync;
var chalk = require('chalk');
var cliopts = require('./lib/cliopts');
var build = require('./lib/build');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('mincerrc', 'Run Mincer by .mincerrc files', function() {
    
    var root = process.cwd();
    
    var defaults = {
      manifest: 'manifest.json',
      digest: true,
      include: [],
      output: ".",
      files: [],
      engines: {},
      helpers: {},
      enable: [],
      sourceMaps: false,
      embedMappingComments: false,
      compress: false
    };
    
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options(defaults);
    
    var data = this.data;
    
    if (data.dest) {
      options.output = path.resolve( data.dest ) == path.normalize( data.dest ) ? data.dest : path.join(root, data.dest, options.output);
    }
    
    if (options.include) {
      options.include = options.include.map(function(file) {
        return path.resolve( file ) === path.normalize( file ).replace(/\/*$/g, "") ? file : path.join(root, file);
      });
    }
    
    // Iterate through fileset
    
    var files = [];
    var opts = {};
    var dir;
    var file;
    
    this.filesSrc.forEach(function(filepath) {
      
      // Setup filepaths
      file = data.cwd ? path.join(data.cwd, filepath) : filepath;
      dir = path.dirname(file);
      if (path.basename(filepath) === '.mincerrc') {
        var cli = cliopts(grunt.file.read(file));
        opts = merge(options, cli);
        // Compile manifest
        build(dir, opts);
      } else {
        files.push(path.resolve(file));
      }
      
    });
    
    if (files.length > 0) {
      opts = merge(options, {
        files: files
      });
      dir = data.cwd ? data.cwd : '.';
      // Compile manifest
      build(dir, opts);
    }
    
  });

};