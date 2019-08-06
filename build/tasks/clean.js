'use strict';

export function clean(gulp, plugin, config) {
    // let cleanPath = config.path + (config.isDev ? 'css' : '') + '/';
    return plugin.del([`${config.act}/css`,  `${config.act}/dist`], {force: true});
}
