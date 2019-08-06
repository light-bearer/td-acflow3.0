'use strict';

export function spriteTask(gulp, plugin, config) {
    let spriteData = gulp.src(`${config.act}/images/sprites/*.png`)
        .pipe(plugin.spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.scss',
            cssTemplate: '../src/handlebars/sprite.handlebars',
            padding: 10
        }))

    let imgStream = spriteData.img
        .pipe(plugin.vinylBuffer())
        .pipe(gulp.dest(`${config.act}/images`))

    let cssStream = spriteData.css
        .pipe(gulp.dest(`${config.act}/sass`))

    return plugin.mergeStream(imgStream, cssStream)
}
