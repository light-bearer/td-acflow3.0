'use strict';

export function style(gulp, plugin, config) {

    return gulp.src(`${config.act}/sass/**/*.scss`)
        // .pipe(plugin.changed(config.path + '/css', { extension: '.css'}))
        // .pipe(plugin.cached('style-task'))
        .pipe(plugin.sourcemaps.init())
        .pipe(plugin.sass({outputStyle: 'compressed'}).on('error', plugin.sass.logError))
        .pipe(plugin.autoprefixer({
            browsers: ['last 7 versions'],
            cascade: false
        }))
        .pipe(plugin.sourcemaps.write('./maps'))
        // .pipe(plugin.remember('style-task'))
        .pipe(gulp.dest(`${config.act}/css`));
}

