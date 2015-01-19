/*
* Build mincer
*/
'use strict';
var Mincer = require('mincer');
var rimraf = require('rimraf').sync;
var chalk = require('chalk');
var path = require('path');
module.exports = function (cwd, options) {
  
  options.include = options.include.filter(function(item, pos) {
    return options.include.indexOf(item) === pos;
  });

  var environment = new Mincer.Environment(cwd);
  
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
  
  //console.log(chalk.reset(chalk.cyan("Output assets to " + output + "...")));
  var manifest = new Mincer.Manifest(environment, output);
  manifest.compile(options.files, function (err) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
  
};