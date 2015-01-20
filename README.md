# grunt-mincerrc

> Run Mincer by .mincerrc files

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-mincerrc --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-mincerrc');
```

## The "mincerrc" task

### Overview
In your project's Gruntfile, add a section named `mincerrc` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  mincerrc: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.clean
Type: `Boolean`
Default value: `false`

Specifies whether to clean output before build



#### options.compress
Type: `Boolean`
Default value: `false`

Specifies whether to gzip assets.

#### options.embedMappingComments
Type: `Boolean`
Default value: `false`

Specifies whether to embed source-map comments into the merged assets.

#### options.enable
Type: `Array`
Default value: `[]`

An array containing features to be enabled in the environment

#### options.engines
Type: `Object`
Default value: `{}`

An object containing configuration options for each of mincer's engines.

#### options.files
Type: `Array`
Default value: `[]`

Environment files to be merged with .mincerrc specific files, such as `application.js`.

#### options.helpers
Type: `Object`
Default value: `{}`

An object containing helper methods to be available during build.

#### options.include
Type: `Array`
Default value: `[]`

Environment paths to be merged with .mincerrc specific paths.
#### options.output
Type: `String`
Default value: `''`

Output path to override .mincerrc output path.

#### options.sourceMaps
Type: `Boolean`
Default value: `false`

Specifies whether to compile source-maps. When set, the corresponding environment-feature is auto-enabled.

### Usage Examples

#### Default Options
Provide paths to .mincerrc-files

```js
grunt.initConfig({
  mincerrc: {
    default_options: {
      options: {
        clean: true
      },
      cwd: 'app',
      src: ['**/.mincerrc']
    }
  }
});
```

#### Custom Options
Apply custom options to .mincerrc builds

```js
grunt.initConfig({
  mincerrc: {
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
          embedMappingComments: true,
          compress: true
        },
        cwd: 'tmp/custom_options',
        src: ['**/.mincerrc']
      }
  }
});
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
v0.0.2 - Added custom options 
