'use strict';
module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    /*connect: {
      example: {
        port: 1337,
        base: 'src'
      }
    },*/
    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          'src/app/styles/style.css': 'src/app/styles/style.less'
        }
      }
    },
    watch: {
      files: ['src/app/components/**/newNoteArea.less', 'src/app/styles/*.less'],
      tasks: 'less',
      options: {
        nospawn: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-connect');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', []);
};