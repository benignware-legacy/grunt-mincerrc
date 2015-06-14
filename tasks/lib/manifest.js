var fs = require('node-fs');
var path = require('path');
var pathCompleteExtname = require('path-complete-extname');
var glob = require('glob');
var SourceMapConsumer = require('source-map').SourceMapConsumer;
var SourceNode = require('source-map').SourceNode;
var pako = require('pako');

function writeFile(file, buffer, mtime) {
  mtime = mtime || new Date().getTime();
  if (!fs.existsSync(path.dirname(file))) {
    fs.mkdirSync(path.dirname(file), '0777', true);
  }
  fs.writeFileSync(file, buffer);
  fs.utimesSync(file, mtime, mtime);
}

// Compress given String or Buffer
function gzip(data) {
  var unit8Array = new Uint8Array(toBuffer(data));
  return new Buffer(pako.gzip(unit8Array));
}

function findAssetPath(asset, options) {
  options = options || {};
  if (asset) {
    var 
      assetRelativePath = asset.relativePath.replace(/^(?:\/|\\)/g, ''),
      assetPath = options.digest === undefined || options.digest ? path.join(path.dirname(assetRelativePath), asset.digestPath) : assetRelativePath,
      assetDir = path.dirname(assetPath),
      assetBase = path.basename(assetPath, pathCompleteExtname(assetPath)),
      assetExt = path.extname(asset.digestPath);
      
    if (options.originalPaths) {
      assetDir = path.join(path.dirname(asset.relativePath));
    }
    assetPath = path.join(assetDir, assetBase) + assetExt;
    
    return assetPath;
  }
  return "";
}

function Manifest(environment, pathname) {
  this.environment = environment;
  this.path = pathname;
};

Manifest.prototype.compile = function (files, options) {
  
  var
    environment = this.environment,
    data = {
      assets: {},
      files: {}
    },
    //pathIsDir = fs.existsSync(this.path) && fs.lstatSync(this.path).isDirectory(),
    pathIsDir = pathCompleteExtname(this.path).length === 0;
    destDir = this.path && !pathIsDir ? path.dirname(this.path) : this.path;
  
  files.forEach(function (file) {
    
    var
      asset = environment.findAsset(file),
      assetPath = findAssetPath(asset, options),
      assetFile = path.join(destDir, assetPath),
      assetBuffer = asset.buffer;
    
    // Setup manifest data for asset
    data.assets[asset.logicalPath] = assetPath;
    data.files[assetPath] = {
      logicalPath: asset.logicalPath, 
      size: fs.statSync(file).size,
      mtime: asset.mtime, 
      digest: asset.digest
    };
    
    // Embed mapping comments
    if (options.embedMappingComments && options.sourceMaps && asset.sourceMap) {
      assetBuffer = new Buffer(asset.source + asset.mappingUrlComment());
    }
    
    // Write asset
    writeFile(assetFile, assetBuffer, asset.mtime);
    
    
    
    // Compress
    if (asset.type === 'bundled' && options.compress) {
      writeFile(assetFile + '.gz', gzip(assetBuffer), asset.mtime);
    }
    
    if (asset.sourceMap) {
      // add XSSI protection header
      writeFile(assetFile + '.map', ')]}\'\n' + asset.sourceMap, asset.mtime);
      if (options.compress) {
        writeFile(assetFile + '.map.gz', gzip(')]}\'\n' + asset.sourceMap), asset.mtime);
      }
    }
    
  });
  
  // Write manifest.json
  if (!pathIsDir) {
    writeFile(this.path, JSON.stringify(data, null, "  "));
  }
};

module.exports = Manifest;