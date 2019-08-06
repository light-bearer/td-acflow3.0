'use strict';

export function useref(gulp, plugin, config) {

    return gulp.src(`${config.act}/html/**/*.html`)
        .pipe(plugin.useref())
        .pipe(plugin.if('*.js', plugin.uglify()))
        .pipe(plugin.if('*.js', plugin.rev()))
        .pipe(plugin.if('*.css', plugin.cleanCss()))
        .pipe(plugin.if('*.css', plugin.rev()))
        .pipe(plugin.revReplace())

        .pipe(gulp.dest(function(file) {
            file.base = file.base.split('html')[0]+'html';
            return config.path + '/html';
        }))
}
