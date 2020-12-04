
let mergeFiles = require('./grunt-scripts/merge-files');

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

    mergeFiles(grunt);

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

        copy: {
			main: {
				expand:  true,
				flatten: true,
				filter:  'isFile',
				cwd:     'dist/',
				src:     '**',
				dest:    'Update This Path'
			},
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
        },
          
    });
    grunt.registerTask('default',  ['clean', 'mergeFiles', 'screeps']);
    grunt.registerTask('deploy',  ['clean', 'mergeFiles', 'screeps']);
    grunt.registerTask('test',     ['jsbeautifier:verify']);
    grunt.registerTask('pretty',   ['jsbeautifier:modify']);
    grunt.registerTask('merge', 'mergeFiles');
};
