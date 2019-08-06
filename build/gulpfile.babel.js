import gulp from 'gulp';
// import minimist from 'minimist';
import path from 'path';

import getConfig from './config';

import gulpLoadPlugins from 'gulp-load-plugins';

import { serve } from './tasks/serve.task';
import { buildTask } from './tasks/build.task';
import { prodTask } from './tasks/prod.task';
import { spriteTask } from './tasks/sprite';

const actPath = `../src/activities/${ process.env.PJ_PATH }/`;

let gulpPlugin = gulpLoadPlugins({
        pattern: ['gulp-*', 'gulp.*', 'del', 'browser-sync', 'merge-stream', 'vinyl-buffer', 'imagemin-pngquant'],
        lazy: true
    });

const sprite = () => {
        return spriteTask(gulp, gulpPlugin, getConfig({isDev: false, basePath: actPath }));
    }

const dev = serve(gulp, gulpPlugin, getConfig({isDev: true, basePath: actPath }));

const build = buildTask(gulp, gulpPlugin, getConfig({isDev: false, basePath: actPath }));

const prod = prodTask(gulp, gulpPlugin, getConfig({isDev: false, basePath: actPath }));

export { dev, build, prod, sprite }
