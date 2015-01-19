/*
* Parse mincer command-line options
*/
'use strict';
var shellwords = require('shellwords').split;
var chalk = require('chalk');


module.exports = function (string) {
  var 
    args = shellwords(string.replace(/^#.*/gm, '')),
    option, 
    value, 
    i,
    opts = {
      include: [],
      output: null,
      files: []
    };
  
  // Parse command-line options
  for (i = 0; i < args.length; i++) {
    // Detect option
    if (args[i].substring(0, 2) === '--') {
      // Is option
      option = args[i].substring(2);
      // Get value
      if (args[i + 1]) {
        value = args[i + 1];
        // Process option
        switch (option) {
          case 'include':
            opts.include.push(value);
            break;
          case 'output':
            opts.output = value;
            break;
        }
        // Move ahead
        i++;
      } else {
        // Command line option found, but no value
      }
    } else {
      // This should be an input file
      opts.files.push(args[i]);
    }
  }
  return opts;
};