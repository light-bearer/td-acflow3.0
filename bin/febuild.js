#!/usr/local/bin/node

var path = require('path');
var program = require('commander');
// console.log('fe-build');

// 可能是相对路径，要resolve
var pjPath = process.argv[2];
// 移除参数，以免gulp把它当成任务id
process.argv.splice(2, 1);
// 记录起来，以便在gulpfile.js中使用
process.env.PJ_PATH = pjPath;
// 增加--gulpfile参数
process.argv.push(
    '--gulpfile',
    // __dirname是全局变量，表示当前文件所在目录
    path.resolve(__dirname, '../build/gulpfile.babel.js')
);

require('gulp/bin/gulp');
