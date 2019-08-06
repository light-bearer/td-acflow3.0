### 任何开发人员不得把bin以及build下的东西提交！！！！

# Getting Started

$ npm install 

# 环境配置
1）macOS下：命令行输入 which node， 查看node所在位置，例如：作者本机node位置为：/usr/local/bin/node   
那么找到 根目录下bin/febuild.js 以及 bin/fecreate.js，把第一行修改为 “ #!/usr/local/bin/node ”    
再执行以下命令（设置文件权限）  
$ chmod 755 bin/fecreate.js   
$ chmod 755 bin/febuild.js  
$ sudo npm link     
2）windows下： 找到 根目录下bin/febuild.js 以及 bin/fecreate.js，把第一行修改为 “#! /usr/bin/env node”
再执行以下命令   
npm link   

注意：若 npm link 报错，请查看是否翻墙，没翻墙的童鞋，请自行用镜像；     
     
       环境配置过一次，那么直接运行 npm link就可以了。

# 生成新的活动

fecreate -t template -n actname

-t：模版名，模版以一个文件夹包起来
-n： 活动名称

# 启动服务

febuild actname dev

其中：actname 代表 活动名称

# 发布 (不压缩逻辑js)

febuild actname build

其中：actname 代表 活动名称

# 发布 (全部压缩混淆)

febuild actname prod

其中：actname 代表 活动名称

# 问题说明

1、此脚手架使用于活动组，也适用于类似活动这种小项目使用；

2、高清屏幕适配问题  
   1）其中使用rem做高清屏幕适配方案（默认不采用根据dpr缩放viewport，若有此需求，请自行把在header中引入的adapt.js改成adaptScale.js，scss文件中引入的_func.scss改为_funcAdapt.scss）  
   2）若设计稿提供的是普通的宽度为750px的，那么可以直接使用pxToRem，例如：在写scss的时候，量取的高度为90px，写成pxToRem(90px)即可；字体大小看设计师的要求，一般字体要随着屏幕尺寸的变化而变化，那么font-size也可以用pxToRem；若设计师要求不管在什么尺寸的屏幕下，字体保留不变，那么请直接使用px；  
   3）若提供的设计稿提供的不是标准的750px：那么需要去修改src/sass/_func.scss，$base-font-size = 设计稿宽度 ／ 32计算出 基本字体大小；然后按照第2部使用pxToRem即可  

3、关于scss实时编译，刷新浏览器的问题。  
   为了提高效率，特别是在windows下的scss编译问题，此版本采取增量编译，只编译修改过的scss文件。
   此脚手架用的是gulp-cached插件，gulp-cached 可以将第一次传递给它的文件内容保留在内存中，如果之后再次执行 task，它会将传递给它的文件和内存中的文件进行比对，如果内容相同，就不再将该文件继续向后传递，从而做到了只对修改过的文件进行增量编译。
   所以，其他引用此scss文件而本身并未修改过的scss文件，并不会重新进行编译刷新。
   如果要看到对应的效果，建议在对应的scss文件作出修改再保存。如果是全局变量的修改，想要看效果，建议重启一下服务器。

   另外，如果mac上，编译速度比较快，不需要进行增量编译，可以停掉这个插件，找到根目录下的build/tasks/style.js文件，把 .pipe(plugin.cached('style-task')) 注释掉即可。

4、关于合成雪碧图以及使用雪碧图的问题  
   1）在images/sprites放入需要合并成雪碧图的小图标；  
   2）febuild actname sprite  
      其中：actname 代表 活动名称  
      task执行后，会在images下生成雪碧图(sprite.png), 并在sass下生成对应的scss文件(sprite.scss)  
   3）使用的时候只需要加上类似class="sprite sprite-qq"，就可以了。  

5、useref配置说明

      页面css依赖配置
   ![页面css依赖配置](https://github.com/simona1989/readme-images/blob/master/pic0.png)
   
   所有的css都需要进行配置，都需要经过压缩和md5命名
   
      页面js依赖配置
   ![页面js依赖配置](https://github.com/simona1989/readme-images/blob/master/pic1.png)

   1）需要压缩混淆的js模块：fastclick-jquery
      业务js模块，index.js

      建议在活动项目里，js下的关于业务逻辑的js不要压缩混淆，否则整合的后台会看不懂

6、如何使用给定的ejs模版   
   1）直接在ejs里进行开发   
   2）配置header和footer 参数    

   ![ejs模板header和footer参数配置](https://github.com/simona1989/readme-images/blob/master/pic2.png)  

   include的第一个参数是 模板所在的相对路径；    
   第二个参数是 传递给模板的参数，其中，relative： 是相对于js的的相对路径； styles是css的链接， scripts是js的链接。    
   styles和scripts都是一个数组

     styles的详细参数说明   

   ![styles的详细参数说明](https://github.com/simona1989/readme-images/blob/master/pic3.png)  

     scripts的详细参数说明   

   ![scripts的详细参数说明](https://github.com/simona1989/readme-images/blob/master/pic4.png)    

7、关于压缩图片问题
   由于插件的压缩率太低，所以作者把压缩图片的代码注释掉了，只做拷贝用。     
   建议开发人员手动在线压缩后放到images再使用图片。    

