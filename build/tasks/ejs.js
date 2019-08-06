'use strict';
import fs from 'fs';
// 编译ejs模版
export function ejs(gulp, plugin, config) {
    fs.stat(`${config.act}/templates`, function(err, stat) {
        if(!err){
            plugin.del.sync([`${config.act}/html/**`, `!${config.act}/html`], { force: true });
        }
    });

    return gulp.src([`${config.act}/templates/*.ejs`, `${config.act}/templates/!(common)**/*.ejs`])
        .pipe(plugin.ejs({}, {}, { ext: '.html' }))
        .pipe(gulp.dest(`${config.act}/html`))
}
