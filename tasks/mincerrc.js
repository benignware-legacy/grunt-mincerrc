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
    
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      include: [],
      output: "",
      files: [],
      engines: {},
      helpers: {},
      enable: [],
      sourceMaps: false,
      embedMappingComments: false,
      compress: false
    });
    
    var data = this.data;

    // Iterate through fileset
    this.filesSrc.forEach(function(filepath) {
      
      // Setup filepaths
      var file = data.cwd ? path.join(data.cwd, filepath) : filepath;
      var dir = path.dirname(file);
      var opts = merge(options, cliopts(grunt.file.read(file)));
      
      // Compile manifest
      console.log(chalk.green("Compiling " + chalk.cyan(file) + "..."));
      build(dir, opts);
      
    });
    
    
    
  });

};

