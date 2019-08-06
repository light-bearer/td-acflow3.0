'use strict';
// 压缩图片
export function imagemin(gulp, plugin, config) {
    return gulp.src(`${config.act}/images/**/*.{png,jpg,gif,ico}`)
        // .pipe(plugin.cache(plugin.imagemin({
        //     progressive: true,
        //     svgoPlugins: [{removeViewBox: false}],
        //     use: [plugin.imageminPngquant()]
        // })))
        .pipe(gulp.dest(`${config.path}/images`));
}
