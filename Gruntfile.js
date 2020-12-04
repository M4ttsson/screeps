
module.exports = function (grunt) {
    require('time-grunt')(grunt);


    var config = require('./.screeps.json')

      // Allow grunt options to override default configuration
    var branch = grunt.option('branch') || config.branch;
    var email = grunt.option('email') || config.email;
    var password = grunt.option('password') || config.password;
    var ptr = grunt.option('ptr') ? true : config.ptr

    grunt.loadNpmTasks('grunt-screeps');
    grunt.loadNpmTasks('grunt-contrib-clean')
    grunt.loadNpmTasks('grunt-contrib-copy')
    grunt.loadNpmTasks("grunt-jsbeautifier")

	grunt.initConfig({
		screeps: {
			options: {
                email: email,
                password: password,
                branch: branch,
                ptr: ptr
            },
			dist: {
				src: ['dist/*.js']
			}
        },
        // Remove all files from the dist folder.
        clean: {
            'dist': ['dist']
        },

        // Copy all source files into the dist folder, flattening the folder structure by converting path delimiters to underscores
        copy: {
            // Pushes the game code to the dist folder so it can be modified before being send to the screeps server.
            screeps: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: '**',
                    dest: 'dist/',
                    filter: 'isFile',
                    rename: function (dest, src) {
                        // Change the path name utilize underscores for folders
                        return dest + src.replace(/\//g,'_');
                    }
                }],
            }
        },

        // Apply code styling
        jsbeautifier: {
            modify: {
                src: ["src/**/*.js"],
                options: {
         //           config: '.jsbeautifyrc'
                }
            },
            verify: {
                src: ["src/**/*.js"],
                options: {
                    mode: 'VERIFY_ONLY',
       //             config: '.jsbeautifyrc'
                }
            }
        }
          
    });
    grunt.registerTask('default',  ['clean', 'copy:screeps', 'screeps']);
    grunt.registerTask('test',     ['jsbeautifier:verify']);
    grunt.registerTask('pretty',   ['jsbeautifier:modify']);
};
