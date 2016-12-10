// Load Grunt
module.exports = (grunt) => {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // Tasks
    sass: {
      dist: {
        files: {
          'client/css/main.css': 'client/sass/main.scss',
        },
      },
    },
    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer')({ browsers: ['last 3 versions'] }),
        ],
      },
      dist: {
        src: 'client/css/main.css',
      },
    },
    cssmin: {
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
    // uglify: {
    //   options: {
    //     sourceMap: true,
    //   },
    //   my_target: {
    //     files: {
    //       'client/index.min.js': ['client/index.js'],
    //     },
    //   },
    // },
    watch: {
      css: {
        files: '**/*.scss',
        tasks: ['sass', 'postcss', 'cssmin'],
      },
      // js: {
      //   files: 'client/index.js',
      //   tasks: ['uglify'],
      // },
    },
  });
  // Load Grunt plugins
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Register Grunt tasks
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('build', ['sass', 'postcss', 'cssmin']);
};
