/*
* Build mincer
*/
'use strict';
var Mincer = require('mincer');
var rimraf = require('rimraf').sync;
var chalk = require('chalk');
var path = require('path');
module.exports = function (cwd, options, callback) {
  
  // Remove duplicate paths
  options.include = options.include.filter(function(item, pos) {
    return options.include.indexOf(item) === pos;
  });

  // Setup environment
  var
    self = this,
    environment = new Mincer.Environment(cwd);
  
  // Configure engines
  
  Object.keys(options.engines).forEach(function (name) {
    var engine = Mincer[name + 'Engine'] || Mincer[name];
    if (!engine || typeof engine.configure !== 'function') {
      throw 'Invalid mincer engine ' + name;
    }
    engine.configure(options.engines[name]);
  });
  
  // Enable environment features
  var features = options.enable || [];
  features.forEach(function (feature) {
    environment.enable(feature);
  });
  
  // Auto enable source_maps-feature
  if (options.sourceMaps) {
    environment.enable('source_maps');
  }

  // Setup environment compressors
  if (options.jsCompressor) {
    environment.jsCompressor = options.jsCompressor;
  }
  if (options.cssCompressor) {
    environment.cssCompressor = options.cssCompressor;
  }
  
  // Register environment helpers
  Object.keys(options.helpers).forEach(function (name) {
    var helper = options.helpers[name].bind(environment);
    environment.registerHelper(name, helper);
  });
  
  options.include.forEach(function (path) {
    environment.appendPath(path);
  });
  
  var files = options.files.map(function(file) {
    return path.join(cwd, file);
  });
  
  var output = path.join(cwd, options.output);
  
  if (options.clean) {
    //console.log(chalk.reset(chalk.cyan("Cleaning " + output + "...")));
    rimraf(output);
  }
  
  var manifest = new Mincer.Manifest(environment, output);
  //console.log(chalk.reset(chalk.cyan("Output assets to " + output + "...")));
  try {
    manifest.compile(options.files, options);
  } catch (e) {
    console.log(chalk.reset(chalk.red(e)));
    process.exit();
  }
  
  
};