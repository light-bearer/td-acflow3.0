'use strict';
// 拷贝逻辑js到dist下
export function copyJs(gulp, plugin, config) {
    return gulp.src(`${config.act}/js/**/*.js`)
        .pipe(gulp.dest(`${config.path}/js`))
}
