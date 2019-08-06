'use strict';
// 拷贝媒体文件到dist下
export function copyMedia(gulp, plugin, config) {
    return gulp.src(`${config.act}/media/**/*.{mp3, mp4}`)
        .pipe(gulp.dest(`${config.path}/media`))
}
