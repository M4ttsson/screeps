
module.exports = function (grunt) {
    var config = require('./.screeps.json')

    grunt.loadNpmTasks('grunt-screeps');
    grunt.loadNpmTasks('grunt-contrib-clean')
    grunt.loadNpmTasks('grunt-contrib-copy')

	grunt.initConfig({
		screeps: {
			options: {
                email: config.email,
                password: config.password,
                branch: config.branch,
                ptr: config.ptr
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
          
    });
    grunt.registerTask('default',  ['clean', 'copy:screeps', 'screeps']);
};
