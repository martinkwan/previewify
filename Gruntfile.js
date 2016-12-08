// Load Grunt
module.exports = (grunt) => {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // Tasks
    sass: {
      dist: {
        options: {
          sourceMap: 'none',
        },
        files: {
          'client/css/main.css': 'client/sass/main.scss',
        },
      },
    },
    cssmin: { // Begin CSS Minify Plugin
      options: {
        sourceMap: true,
      },
      target: {
        files: [{
          expand: true,
          cwd: 'client/css',
          src: ['*.css', '!*.min.css'],
          dest: 'client/css',
          ext: '.min.css',
        }],
      },
    },
    uglify: { // Begin JS Uglify Plugin
      build: {
        src: ['client/*.js'],
        dest: 'script.min.js',
      },
    },
    watch: {
      css: {
        files: '**/*.scss',
        tasks: ['sass', 'cssmin'],
      },
      js: {
        files: '**/*.js',
        tasks: ['uglify'],
      },
    },
  });
  // Load Grunt plugins
  grunt.loadNpmTasks('grunt-contrib-sass');
  // grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Register Grunt tasks
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('runSass', ['sass']);
};
