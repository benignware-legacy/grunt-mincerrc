'use strict';

var grunt = require('grunt');
var path = require('path');
/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

function testManifest(test, actualFile, expectedFile) {
  
  var actualPath = path.dirname(actualFile);
  var expectedPath = path.dirname(expectedFile);
  
  var actualManifest = grunt.file.readJSON(actualFile);
  var expectedManifest = grunt.file.readJSON(expectedFile);
  
  test.deepEqual(Object.keys(actualManifest.assets), Object.keys(expectedManifest.assets), 'should match expected asset files.');
  
  var actualAssetMerge = "";
  for (var logicalPath in actualManifest.assets) {
    actualAssetMerge+= grunt.file.read(path.join(actualPath, actualManifest.assets[logicalPath]));
  }
  
  var expectedAssetMerge = "";
  for (var logicalPath in expectedManifest.assets) {
    expectedAssetMerge+= grunt.file.read(path.join(expectedPath, expectedManifest.assets[logicalPath]));
  }
  
  test.equal(actualAssetMerge, expectedAssetMerge, 'should match expected content.');
  
}

exports.mincerrc = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  default_options: function(test) {
    test.expect(2);
    testManifest(test, 'tmp/default_options/app/public/_assets/manifest.json', 'test/expected/default_options/app/public/_assets/manifest.json');
    test.done();
  },
  custom_options: function(test) {
    test.expect(2);
    testManifest(test, 'tmp/custom_options/app/public/_assets/manifest.json', 'test/expected/custom_options/app/public/_assets/manifest.json');
    test.done();
  }
};
