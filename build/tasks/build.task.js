import { clean } from './clean';
import { style } from './style';
import { ejs } from './ejs';
import { useref } from './useref';
import { copyJs } from './copyJs';
import { copyMedia } from './copyMedia';
import { imagemin } from './imagemin';

export function buildTask(gulp, plugin, config) {
    let cleanFile = () => {
        return clean(gulp, plugin, config);
    };
    let styleCompile = () => {
        return style(gulp, plugin, config);
    };
    let ejstask = () => {
        return ejs(gulp, plugin, config);
    };
    let userefTask = () => {
        return useref(gulp, plugin, config);
    };
    let copyJsTask = () => {
        return copyJs(gulp, plugin, config);
    };
    let imageminTask = () => {
        return imagemin(gulp, plugin, config);
    };
    let copyMediaTask = () => {
        return copyMedia(gulp, plugin, config);
    };

    return gulp.series(cleanFile, gulp.parallel(styleCompile, ejstask), gulp.parallel(userefTask, copyJsTask, imageminTask, copyMediaTask));
}
