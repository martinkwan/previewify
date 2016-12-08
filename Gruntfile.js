// Load Grunt
module.exports = (grunt) => {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // Tasks
    sass: {
      dist: {
        options: {
          sourcemap: 'none',
        },
        files: {
          'client/css/main.css': 'client/sass/main.scss',
        },
      },
    },
    watch: {
      css: {
        files: '**/*.scss',
        tasks: ['sass'],
      },
    },
  });
  // Load Grunt plugins
  grunt.loadNpmTasks('grunt-contrib-sass');
  // grunt.loadNpmTasks('grunt-postcss');
  // grunt.loadNpmTasks('grunt-contrib-cssmin');
  // grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Register Grunt tasks
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('runSass', ['sass']);
};
