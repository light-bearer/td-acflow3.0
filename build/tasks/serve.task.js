import { clean } from './clean';
import { style } from './style';
import { ejs } from './ejs';
import { browser, watch } from './browserSync';

export function serve(gulp, plugin, config) {
    let cleanFile = () => {
        return clean(gulp, plugin, config);
    };
    let styleCompile = () => {
        return style(gulp, plugin, config)
    };
    let ejstask = () => {
        return ejs(gulp, plugin, config);
    };
    let browserSync = () => {
        return browser(gulp, plugin, config)
    };
    let watchFile = () => {
        watch(gulp, plugin, config)
    }

    return gulp.series(cleanFile, gulp.parallel(styleCompile, ejstask), gulp.parallel(browserSync, watchFile));
}
