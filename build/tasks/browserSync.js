'use strict';
import { style } from './style';
import { ejs } from './ejs';

export function browser(gulp, plugin, config) {
    return plugin.browserSync({
        open: 'external',
        server: {
            // baseDir: [config.act, '../src/lib']
            baseDir: config.act,
            routes: {
                '/lib': '../src/lib'
            }
        }
    });
}

export function watch(gulp, plugin, config) {
    // gulp.watch(config.path + '/sass/**/*.scss'), style)
    // return gulp.watch([config.path + '*.html', config.path + 'html/**/*.html']).on('change', plugin.browserSync.reload)
    let styleCompile = () => {
        return style(gulp, plugin, config);
    }
    let ejsCompile = () => {
        return ejs(gulp, plugin, config);
    }
    // gulp.watch(`${config.act}/sass/*.scss`, styleCompile);
    gulp.watch('sass/**/*.scss', { cwd: config.act }).on('change', styleCompile)
    gulp.watch(`${config.act}/templates/**/*.ejs`, ejsCompile);
    gulp.watch(['*.html', 'html/**/*.html', 'css/**/*.css', 'js/**/*.js'], { cwd: config.act }).on('change', plugin.browserSync.reload)
}
