'use strict';

// import Q from 'q';

let getConfig = ({isDev = false, basePath = ''} = {}) => {
    let config = {
        isDev: isDev,
        act: basePath,
        path: (() => {
            return isDev ? basePath : `${basePath}/dist`;
        })()
        // base: {
        //     scss: `${path}sass/**/*.scss`,
        //     html: `${path}html/**/*.html`,
        //     js: `${path}js/**/*.js`
        // },
        // dev: {
        //     css: `${path}css/`
        // },
        // build: {
        //     css: `${path}dist/css/`,
        //     html: `${path}dist/html/`,
        //     js: `${path}dist/js/`
        // },
        // greatPromise: function(gulpJob, prams = true) {
        //     let deferred = Q.defer();
        //     let promiseArray = [];

        //     this.system_list.forEach((base) => {
        //         let def = Q.defer();

        //         gulpJob(base, def);

        //         promiseArray.push(def.promise);
        //     });

        //     Q.all(promiseArray).then(function () {
        //         deferred.resolve(prams);
        //     });

        //     return deferred.promise;
        // }
    };
    return config;
};

export default getConfig;
