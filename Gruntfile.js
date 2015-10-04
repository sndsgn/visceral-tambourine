module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['public/client/**/*.js'],
        dest: 'public/dist/<%= pkg.name %>.js'
      }
          },

      mochaTest: {
        test: {
          options: {
            reporter: 'spec'
          },
          src: ['test/**/*.js']
        }
      },

      nodemon: {
        dev: {
          script: 'server.js'
        }
      },

      uglify: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        },
      dist: {
        files: {
          'public/dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
            },
      jshint: {
        files: [
          'Gruntfile.js',
          'app.js',
          'server.js',
          'public/js/*.js',
          'tests/**/*.js'
               ],
        options: {
          force: 'true',
          jshintrc: '.jshintrc',
          ignores: [
            'node_modules/**/*.js',
            'public/bower_components/**/*.js',
            'public/dist/**/*.js'
                   ]
                 }
               },
   
         cssmin: {
           options: {
             keepspecialComments: 0
           },
           dist: {
             files: {
               'public/dist/tachyons.min.css': 'public/tachyons.css' 
             }
           }
                },
           
         watch: {
           scripts: {
             files: [
               'public/js/*.js'
             ],
             tasks: [
               'concat',
               'uglify',
             ]
           },
           css: {
             files: 'public/*.css',
             tasks: ['cssmin']
           }
        },

        shell: {
          prodServer: {
            command: [
            'git add -f public/bower_components',
            'git commit -m "force add bower libs"',
            'git push heroku master',
            'heroku open'
            ].join('&&'),
            options: {
              stdout: true,
              stderr: true,
              failOnError: true
            }
          }
        }

      });
        
      grunt.loadNpmTasks('grunt-contrib-uglify');
      grunt.loadNpmTasks('grunt-contrib-jshint');
      grunt.loadNpmTasks('grunt-contrib-watch');
      grunt.loadNpmTasks('grunt-contrib-concat');
      grunt.loadNpmTasks('grunt-contrib-cssmin');
      grunt.loadNpmTasks('grunt-mocha-test');
      grunt.loadNpmTasks('grunt-shell');
      grunt.loadNpmTasks('grunt-nodemon');   

      grunt.registerTask('server-dev', function () {
       
       var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
       });
       nodemon.stdout.pipe(process.stdout);
       nodemon.stdout.pipe(process.stderr);

       grunt.task.run(['watch']);
     });

     grunt.registerTask('test', [
       'jshint',
       'mochaTest'
     ]);

     grunt.registerTask('build', [
       'concat',
       'uglify',
       'cssmin'
     ]);

    grunt.registerTask('upload', function(n) {
      grunt.task.run(['shell:prodServer']);
   });

   grunt.registerTask('deploy', [
     'test',
     'build',
     'upload'
   ]);

};

