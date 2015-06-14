/*
* Build mincer
*/
'use strict';
var Mincer = require('mincer');
var rimraf = require('rimraf').sync;
var chalk = require('chalk');
var path = require('path');
var Manifest = require('./manifest');


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
  
  var output = path.resolve( options.output ) === path.normalize( options.output ).replace(/\/*$/g, "") ? options.output : path.join(cwd, options.output);
  
  if (options.clean && cwd !== options.output) {
    console.log(chalk.reset(chalk.cyan("Clean " + output + "...")));
    rimraf(output);
  }
  
  if (options.manifest) {
    options.manifest = typeof options.manifest === 'boolean' ? 'manifest.json' : options.manifest;
    output = options.manifest && path.resolve( options.manifest ) === path.normalize( options.manifest ).replace(/\/*$/g, "") ? options.manifest : path.join(output, options.manifest);
  }

  var ManifestImpl = !options.manifest || !options.digest ? Manifest : Mincer.Manifest;
  
  var manifest = new ManifestImpl(environment, output);
  
  try {
    console.log(chalk.cyan("Build assets to output " + chalk.cyan(output) + "..."));
    manifest.compile(options.files, options);
  } catch (e) {
    console.log(chalk.reset(chalk.red(e)));
    process.exit();
  }
  
  
};