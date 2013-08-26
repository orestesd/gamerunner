module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-nodemon');
  
  grunt.initConfig({

    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          require: 'test/coverage/blanket'
        },
        src: ['test/spec/**/*.js']
      },
      coverage: {
        options: {
          reporter: 'html-cov',
          // use the quiet flag to suppress the mocha console output
          quiet: true,
          // specify a destination file to capture the mocha
          // output (the quiet option does not suppress this)
          captureFile: 'test/coverage.html'
        },
        src: ['test/**/*.js']
      }
    },
    
    jshint: {
      src: ['Gruntfile.js', 'src/**/*.js']
    },
    
    nodemon: {
      dev: {
        options: {
          file: 'src/app.js',
          nodeArgs: ['--debug'],
          watchedFolders: ['src'],
          delayTime: 1
        }
      }
    }
    
  });

  grunt.registerTask('default', 'nodemon');
  grunt.registerTask('test', 'mochaTest');
};
