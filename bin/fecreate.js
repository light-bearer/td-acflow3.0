#!/usr/local/bin/node

// js/app.js：指定确切的文件名。
// js/*.js：某个目录所有后缀名为js的文件。
// js/**/*.js：某个目录及其所有子目录中的所有后缀名为js的文件。
// !js/app.js：除了js/app.js以外的所有文件。
// *.+(js|css)：匹配项目根目录下，所有后缀名为js或css的文件。
//流 stream  管道 pipe 管道
//如果想在读取流和写入流的时候做完全的控制，可以使用数据事件。但对于单纯的文件复制来说读取流和写入流可以通过管道来传输数据。
var fs = require('fs');
var path = require('path');
var program = require('commander');
/*
 * 复制目录中的所有文件包括子目录
 * @src param{ String } 需要复制的目录  例 images 或者 ./images/
 * @dst param{ String } 复制到指定的目录  例 images images/
 */
//获取当前目录绝对路径，这里resolve()不传入参数
// var filePath = path.resolve();
program
    .version('0.1.0')
    .option('-t, --template [type]', 'Specify template')
    .option('-n, --name [type]', 'Specify the name of activity')
    .parse(process.argv);

// process.exit(0);
const basePath = 'src/';
const tempBasePath = basePath + 'templates/';
const actBasePath = basePath + 'activities/';
var create = function(src, dst) {
    existDest(dst, function() {
        copy(src, dst);
    });
}

function copy(src, dst) {
    //判断文件需要时间，则必须同步
    if (fs.existsSync(src)) {
        fs.readdir(src, function(err, files) {
            if (err) {
                console.log(err);
                return;
            }
            files.forEach(function(filename) {
                //url+"/"+filename不能用/直接连接，Unix系统是”/“，Windows系统是”\“
                var url = path.join(src, filename),
                    dest = path.join(dst, filename);
                console.log(url);
                console.log(dest);
                fs.stat(path.join(src, filename), function(err, stats) {
                    if (err) throw err;
                    //是文件
                    if (stats.isFile()) {
                        //创建读取流
                        readable = fs.createReadStream(url);
                        //创建写入流
                        writable = fs.createWriteStream(dest, {
                            encoding: 'utf8'
                        });
                        // 通过管道来传输流
                        readable.pipe(writable);
                        //如果是目录
                    } else if (stats.isDirectory()) {
                        exists(url, dest, copy);
                    }
                });
            });
        });
    } else {
        console.log('给定的模板不存在，读取不到文件');
        return;
    }
}

function exists(url, dest, callback) {
    fs.exists(dest, function(exists) {
        if (exists) {
            callback && callback(url, dest);
        } else {
            //第二个参数目录权限 ，默认0777(读写权限)
            fs.mkdir(dest, 0777, function(err) {
                if (err) throw err;
                callback && callback(url, dest);
            });
        }
    });
}

// 判断目标活动是否存在
function existDest(url, cb) {
    fs.stat(actBasePath + program.name, function(err, stat) {
        if (err == null) {
            if (stat.isDirectory()) {
                console.log('该活动名已经存在，请重新命名！');
            } else if (stat.isFile()) {
                console.log('文件存在');
            } else {
                console.log('路径存在，但既不是文件，也不是文件夹');
                //输出路径对象信息
                console.log(stat);
            }
            process.exit(0);
        } else if (err.code == 'ENOENT') {
            // console.log(err.name);
            console.log('该活动名合法，正在生成...');
            createActivity(url, cb);
        } else {
            console.log('错误：' + err);
            process.exit(0);
        }
    });
}
// 创建文件夹
function mkdirSync(url,mode,cb){
    var path = require("path"), arr = url.split("/");
    // console.log(path);
    mode = mode || 0755;
    cb = cb || function(){};
    if(arr[0]==="."){//处理 ./aaa
        arr.shift();
    }
    if(arr[0] == ".."){//处理 ../ddd/d
        arr.splice(0,2,arr[0]+"/"+arr[1])
    }
    function inner(cur){
        if(!fs.existsSync(cur)){//不存在就创建一个
            fs.mkdirSync(cur, mode)
        }
        if(arr.length){
            inner(cur + "/"+arr.shift());
        }else{
            cb();
        }
    }
    arr.length && inner(arr.shift());
}

//生成文件夹
function createActivity(url, cb) {
    mkdirSync(url, 0, function(e) {
        if (e) {
            console.log(url + '创建出错了');
        } else {
            cb && cb();
        }
    });
}
exports.create = create;
//copy("./views/","./www/");

create(tempBasePath + program.template + '/', actBasePath + program.name + '/');
