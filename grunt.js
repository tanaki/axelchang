'use strict';

module.exports = function(grunt) {

  var pkg = grunt.file.readJSON('package.json');

  // Project configuration.
  var configOptions = {

    pkg: pkg,
    
    concat: {
      dist: {
        src: [
          'dev/src/App.js', 
          'dev/src/app/controllers/*.js', 
          'dev/src/app/Router.js', 
          'dev/src/app/models/*.js', 
          'dev/src/app/collections/*.js', 
          'dev/src/app/views/Base.js',
          'dev/src/app/views/**/*.js',
          'dev/src/utils/*.js'
        ],
        dest: 'build/js/<%= pkg.namespace %>.js'
      },
      libs : {
        src : [
          'dev/src/libs/underscore.js',
          'dev/src/libs/backbone.js',
          'dev/src/libs/*.js'
        ],
        dest: 'build/js/libs/libs.js'
      }
    },
    
    uglify: {
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'build/js/<%= pkg.namespace %>.min.js'
      },
      libs: {
        src: '<%= concat.libs.dest %>',
        dest: 'build/js/libs/libs.min.js'
      }
    }
  };

  var 
      filesToWatch = ['dev/src/**/*.js'],
      defaultTasks = ['concat'],
      deployTasks = ['concat', 'uglify'];

  switch ( pkg.css_preprocessor ) {

    case "less" :
      configOptions.less = {
        dev: {
          src: 'dev/less/style.less',
          dest: 'build/css/style.css'
        },
        deploy: {
          src: 'dev/less/style.less',
          dest: 'build/css/style.css',
          options: {
            compress: true
          }
        }
      };

      filesToWatch.push('dev/less/**/*.less');
      defaultTasks.unshift('less:dev');
      deployTasks.unshift('less:deploy');
      break;

    case "sass" : 
      configOptions.sass = {
          dev: {
          src: 'dev/sass/style.scss',
          dest: 'build/css/style.css',
          options: {
            style: 'expand',
            compass : true
          }
        },
        deploy: {
          src: 'dev/scss/style.scss',
          dest: 'build/css/style.css'
        }
      };

      filesToWatch.push('dev/sass/*.scss');
      defaultTasks.unshift('sass:dev');
      deployTasks.unshift('sass:deploy');
      break;
  }

  configOptions.watch = {
    test: {
      files: filesToWatch,
      tasks: 'default'
    }
  };

  grunt.initConfig(configOptions);

  // Default task.
  grunt.registerTask('default', defaultTasks);
  grunt.registerTask('deploy', deployTasks);

};
