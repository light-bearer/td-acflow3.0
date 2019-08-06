'use strict';
//js生成文件hash编码并生成 rev-manifest.json文件名对照映射
export function revJs(gulp, plugin, config) {
    return gulp.src(`${config.act}/js/**/*.js`)
        .pipe(plugin.rev())
        //压缩
        .pipe(plugin.uglify())
        .pipe(gulp.dest(`${config.path}/js`))
        //生成rev-manifest.json
        .pipe(plugin.rev.manifest())
        .pipe(gulp.dest(`${config.path}/js`))
}
