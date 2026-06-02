# Webpack 飞行手册

Date: 2017-11-30  
Author: SimonAKing  
Categories: 前端  
Tags: 前端, Webpack  
Source: https://simonaking.com/blog/webpack-flight-manual/

> Webpack学习手册。

---
<!-- head -->
现在是一个 Web 技术蓬发的时代。## 前言
在学习 Webpack 之前，我们需要了解一个概念：**模块**。
### 何为模块？
如果你曾学过 Java , C# 之类的语言，一定会知道 Java 中的 import 或 C# 中的 using 吧？
比如：我想在 C# 中进行数据库操作，我只需要在代码头部加上 下面这两段代码即可。
``` cs
using System.Data;
using System.Data.SqlClient;
```
这两段代码可以看成 两个与数据库操作相关的模块。
当我们需求是数据库，或者是读取 IO 等其他操作，我们便加载其他不同的模块。
很明显，这实现了编程中的一个非常重要的功能 **按需加载**。

在前端中 模块又该如何定义呢？
按照我个人的理解：
- 在 HTML 中 模块 便是一个组件
```html
<div class="layer">
    <div><%= name %></div>
    <% for(var i = 0; i < People.length;++i) { %>
        <%= People[i] %>
    <% } %>
</div>
```
- 在 CSS 中 模块 便是一个局部样式
```css
header{
    display:block;
}
header h1{
    font-size: 60px;
}
```

- 在 Javascript 中 模块 便是一个封装着方法或数据的脚本文件
```js
let People = { name: "Simon" } ;
module.exports = People;

```

而我们又该怎样实现 在前端中加载模块呢？
下面是两个很常见的例子：
> 在 Less 中

```css
@import "header";
@import "layout";
@import "footer";
```


> 在 Javascript


``` jsx
// CommonJS
const $ = require("jQuery");

//es6
let People = { name: "Simon" } ;
module.exports = People;

import "./layer.less";
import tpl from "./layer.ejs";
```
如果你直接运行以上代码，浏览器并不会解析，这个时候，就要依靠 Webpack 了！
### Webpack是什么

Webpack 是一款目前非常流行的前端模块打包工具，可以将项目中所加载的模块进行打包，以及将 一些浏览器不支持的语言进行转换。

Webpack 的打包原理是 先找到入口文件，递归探索出所有依赖的模块，最后 利用 Loader 进行不同文件类型的处理，打包成一个 Javascript 文件。

其中，Webpack 的两个最核心原理分别是：
1.  **一切皆模块**
2.  **按需加载**


当然 Webpack 的作用不止加载模块这么简单，前端的常用需求通常都可以实现：利用 Loader 转换 es6 、 Less 、 Typescript ，还可利用插件 开发多页面应用,等等诸多强大功能。

## 正文
下面，我将讲解 Webpack 的具体使用和配置。
### 安装
我一般在项目中使用 Webpack，都是先执行下面这四条命令进行 Webpack 的安装
1. npm install -g webpack
在全局安装 Webpack，第一次使用时 执行
2. npm install \--save-dev webpack
将 Webpack 安装到你的项目
3. npm init
npm初始化，会询问你的项目信息，可以回车跳过
4. npm install \--save-dev webpack-dev-server
 在当前项目，安装 Webpack 服务器

安装完成后，便是建立配置文件了。

### 基本配置
在项目根目录下新建名为 webpack.config.js 的文件，
基本上 一个配置文件的大体结构就是下面这样：
```js
modules.export={
    entry:{
        /* 入口文件 */
    },
    output:{
        /* 出口文件 */
    },
    module:{
        /* Loader */
        rules:[{},{},{}]
    },
    plugins:[
        /* 插件 */
    ],
    devtool: ...
    devServer: {...}
    resolve:{...}
}
```
我们下面就先分析 modules.export 各个属性

### 入口
**entry**
代表是入口文件，Webpack 工作的开始。
Webpack 会递归的探索出 入口文件中所依赖的模块，并按照顺序 利用 Loader 进行处理。
官网给出了其 3 种数据类型：
1. 字符串
``` js
    entry: "app.js";
```
2. 数组
数组中的每一项都会被打包，形成互不依赖的文件
``` js
    entry: ["app.js","main.js"];
```
3. 对象
对象中的每一个属性都会被打包，形成互不依赖的文件
``` js
    entry:{
        app: "./src/js/app.js",
        main: "./src/js/main.js"
    }
```
一般入口文件中多是 import 或者 require 等模块导入命令。

### 出口
**output**
顾名思义，Webpack打包后文件的具体配置
常用的属性有 4 个
1. path: `${__dirname }/dist`
打包后文件所在路径
2. filename: "js/[name].js"
打包后文件的名字，这里有 4 种常用的写法
    1. 自定义
    2. [name].js
 代表的便是入口的文件名
    3. [hash].js
 此次打包后的hash值
    4. [chunkhash]
 该块打包后的hash值


3. publicPath: `"http://cdn.com/"`
    上线时的公共路径，主要应用于线上
4. chunkFilename: 'js/[name].js'
    按需加载模块时输出的文件名称

### Loader
Loader 是 Webpack 中最振奋人心的东西了！
将一切浏览器不支持的语言，处理成 浏览器可以支持。
针对各个文件类型，都有各种的 Loader 等你去挖掘。

Loader 的工作方式 是从右向左执行，链式地按照顺序进行编译。
loader 链中的第一个返回值给下一个 loader，在最后一个 loader，返回所预期的结果。

loader 可以是同步或异步函数，也可使用 options 对象去接受配置参数。

基础结构

```jsx
module:{
  rules:[
    {
      test:/\.xxx$/,//以xxx结尾的文件
      loader: "xxx-loader",
      exclude: {排除的路径},
      include: {包含的路径},
      options: {Loader配置}
    }
  ]
}
```
可以很清楚的看到，Loader 利用 test 的正则 找到各个类型文件，然后使用 loader 进行处理，便可转换成浏览器支持的文件。

其中我知道的 loader 的写法有两种:
1. 每一个 loader 都是一个对象
```javascript
loaders:[
  {loader:"style-loader"},
  { loader: "css-loader?modules", options: { importLoaders: 1 } },
  {loader: "less-loader"}
]
```
2. 使用 ! 号拼接的写法
```javascript
loader: "style-loader!css-loader?importLoaders=1!less-loader"
```
下面介绍三个 前端必备的 Loader 方式
#### css
1. style-loader
通过注入`style`标签将 CSS 添加到 DOM
```bash
npm install style-loader --save-dev
```
2. css-loader
css-loader像import / require（）一样解释@import和url（）并解析它们。
```bash
npm install css-loader --save-dev
```
3. postcss-loader
补充 不兼容的css属性 的浏览器前缀
```bash
npm install post-loader --save-dev
```
4. less-loader
将Less 转换成 CSS
```bash
npm install less --save-dev
npm install less-loader --save-dev
```

#### javascript
babel
主要用于将 es6 转换成 es2015
```bash
npm install --save-dev babel-core babel-loader babel-preset-es2015
```
#### 图片 & 字体
1. file-loader
用于压缩文件
```bash
npm install --save-dev file-loader
```
2. url-loader
如果文件下于 规定限制，将会转换成 二进制编码
```bash
npm install --save-dev url-loader
```
#### ejs
另外 我想介绍一下 自己常用的 ejs-loader
1. 配置
```bash
npm install --save-dev ejs-loader
```
 ```javascript
 test:/\.ejs$/ , loader:"ejs-loader",
 ```

2. 使用

```html
<div class="layer">
  <div><%= name %></div>
  <% for(let i = 0; i < Array.length;++i) { %>
      <%= Array[i] %>
  <% } %>
</div>
```

``` javascript
//入口文件
import tpl from "./layer.ejs";

document.body.innerHTML = tpl({
  name:"Simon",
  arr:["Apple","Xiaomi"]
});
```
运行 生成后的页面 ，便会发现 ejs 组件已经被加进去了，
想象一下，我们在平时工作中是否可以把 一个轮播图，或者 排行榜 、评论 当成一个组件呢？


### 插件
**plugins**
在日常工作中，我们使用 Loader 处理不同类型的文件，当有某种其他方面的需求时，比如 抽离 CSS 、生成多页面 HTML ，plugins 便派上了用场。

插件的使用，一般都要先 require 出来，然后在 plugins 属性中 进行初始化
```javascript
const htmlWebpackPlugin = require("html-webpack-plugin");
......
plugins: [ new htmlWebpackPlugin({/* options */}) ]
```

下面将介绍 一些工作中常用的插件
1. clean-webpack-plugin
主要用于 打包之前 先清空 打包目录下的文件，防止文件混乱。
```bash
npm install --save-dev clean-webpack-plugin
```
2. html-webpack-plugin
主要用于生成HTML，可以规定 模板HTML，也可以为 模板传入参数，压缩文件等
```bash
npm install --save-dev html-webpack-plugin
```
这个插件可谓是 前端必备的，它的配置有很多
```javascript
new htmlWebpackPlugin({
  //打包后的文件名
  filename: "index.html",

  //模板
  template: "index.html",

  //为true自动生成script标签添加到html中
  //或者写 body/head 标签名
  inject: false,//js的注入标签

  //通过<%= htmlWebpackPlugin.options.title  %>引用
  title: "参数title",

  //通过<%= htmlWebpackPlugin.options.date %> 引用
  date: new Date()

  //网站的图标
  favicon: 'path/to/yourfile.ico'

  //生成此次打包的hash
  //如果文件名中有哈希，便代表有 合理的缓冲
  hash: true,

   //排除的块
   excludeChunks: [''],

  //选中的块 与入口文件相关
  chunks: ['app','people'],

  //压缩
  minify:{
   removeComments: true,
   collapseWhitespace: true,
   removeRedundantAttributes: true,
   useShortDoctype: true,
   removeEmptyAttributes: true,
   removeStyleLinkTypeAttributes: true,
   keepClosingSlash: true,
   minifyJS: true,
   minifyCSS: true,
   minifyURLs: true,
  }

}),
```
那么问题来了，我们在模板文件中 又该怎样使用参数呢？
直接按照 ejs 的语法写入 html 文件即可！
```html
<!DOCTYPE html>
<html lang="en">
<%= htmlWebpackPlugin.options.date %>
</html>
```
生成后的模板文件
```html
<!DOCTYPE html>
<html lang="en">
Thu Dec 07 2017 10:01:58 GMT+0800 (中国标准时间)
</html>
```
另外，如果想生成 多页面应用，只需 将上面的配置，多复制几遍即可。
```javascript
new htmlWebpackPlugin({ filename: "index1.html", }
new htmlWebpackPlugin({ filename: "index2.html", }
new htmlWebpackPlugin({ filename: "index3.html", }
```
3. UglifyJsPlugin
主要用于压缩 Javascript 文件
```bash
npm i -D uglifyjs-webpack-plugin
```
4. webpack.ProvidePlugin
自动加载模块，全局使用变量，下面借助 官网的DEMO
```javascript
new webpack.ProvidePlugin({
  $: 'jquery',
  jQuery: 'jquery'
})
// in a module
$('#item'); // <= 起作用
jQuery('#item'); // <= 起作用
// $ 自动被设置为 "jquery" 输出的内容
```
5. open-browser-webpack-plugin
打开服务器后 会自动打开浏览器端口，用起来 很方便
6. HotModuleReplacementPlugin
热更新插件

### 常用命令
- webpack
 最基本的启动webpack命令。找到根目录下的webpack.config.js文件中的 entry属性，递归出所有项目中依赖的模块。

- webpack -w
 监控代码变化，实时进行打包更新
- webpack -p
 对打包后的文件进行压缩，利用线上发布
- webpack -d
 提供SourceMaps，方便调试代码
- webpack --colors
 输出结果带彩色，可以更详细的查看信息
- webpack --profile
 输出性能数据，可以看到每一步的耗时

前两个命令使用频率会较大

### devtool
不知道你现在时候有没有一个想法？ webpack 打包后的文件就一定正确无误吗？ 如果发生错误的话，该怎么办呢？

devtool 属性 便提供了生成 sourcemap 的功能，具体有下面这些选项。

1. source-map
此选项具有最完备的source map，但会减慢打包的速度；
2. cheap-module-source-map
生成一个不带列映射的map
3. eval-source-map
使用eval打包源文件模块，生成一个完整的source map。
4. cheap-module-eval-source-map
这是最快生成source map的方法，生成后的Source Map 会和打包后的 JavaScript 文件同行显示，但没有列映射，所以慎用

### devServer
1. contentBase: "./dist",
本地服务器所加载的页面所在的目录
2. historyApiFallback: true,
再找不到文件的时候默认指向index.html
3. inline: true,
当源文件改变时会自动刷新页面
4. hot: true,
热加载开启
5. port:8080
设置默认监听端口

### resolve
1. extensions: [".js", ".html", ".css", ".txt","less","ejs","json"],
自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名

2. alias: { Temp: path.resolve(__dirname, "src/templates/") }
模块别名定义，直接 require('AppStore') 即可,方便后续直接引用别名

### 其他功能

#### path
常用于字符串拼接路径。
```javascript
const path = require("path");
```
有两个 API

1. path.resolve()
将相对路径转换成绝对路径
```javascript
const aPath = path.resolve("__dirname","js","main.js");
// aPath = 当前目录下的 js 文件夹的 main.js 文件的路径
```
2. path.join()
对路径进行拼接
```javascript
const rPath = path.join("source","js","main.js");
// aPath = //source/js/main.js
```
3. __dirname
Node.js 中的全局变量，代表的是 项目的当前路径。常与 path 结合使用。

#### 热更新
上面我们已经提过了 `webpack -w` 命令，它可以实时的监控 代码的改变，从而自动进行打包，但是 有个缺点 在于它不能及时的刷新界面。
在我们 开启服务器后，是无法使用 此命令的，这个时候，如果你还想进行 自动打包，又想自动刷新界面，热更新 便是不二之选，另外 Webpack 只会热更新 发生改变的模块，不会重新加载整个页面，便可加快开发速度。

开启步骤：
1. 修改 devServer属性
```javascript
devServer: {
  hot: true,//热加载开启
  inline: true,//文件改变时会自动刷新页面
}
```
2. 增加热更新插件
```javascript
const webpack = require("webpack");
//Other property
plugins: [
  new webpack.HotModuleReplacementPlugin()
]

```
另外，只有修改 依赖的项目，才会进行实时更新。

### 源文件
个人总结了很长时间的 Webpack 配置，希望能对你有帮助。

<sourceFile>
```js
const
  path = require("path"),

  webpack = require("webpack"),

  htmlWebpackPlugin = require ("html-webpack-plugin"),

  ExtractTextPlugin = require ("extract-text-webpack-plugin"),

  marked = require("marked"),
  renderer = new marked.Renderer(),

  CleanWebpackPlugin = require ("clean-webpack-plugin"),

  OpenBrowserPlugin = require ("open-browser-webpack-plugin");

 const MyConfig = {

  entry: {
   app:"./src/js/app.js"
  },

  output: {
   path: `${__dirname }/dist`,
   filename: "js/[name].js"

   // 上线时的公共路径
   // publicPath: "http://cdn.com/",

   // 按需加载模块时输出的文件名称
   // chunkFilename: 'js/[name].js'
  },

  /* 生成调试用的 source-map */
  devtool: "eval-source-map",

  devServer: {
   contentBase: "./dist", //本地服务器所加载 的页面所在的目录
   historyApiFallback: true, //再找不到文件 的时候默认指向index.html,
   inline: true,//当源文件改变时会自动刷新页面
   hot: true,//热加载开启
   port:8080// 设置默认监听端口
  },
  resolve:{
   //自动扩展文件后缀名，意味着我们require模块可 以省略不写后缀名
   extensions: [".js", ".html", ".css",  ".txt","less","ejs","json"],

   //模块别名定义，直接 require('AppStore')  即可,方便后续直接引用别名
   alias: { Temp: path.resolve(__dirname,  "src/templates/") }
  },
  module:{
   rules:[
    {
     test: /\.(less|css)?$/ ,
     use:ExtractTextPlugin.extract({
      fallback: "style-loader",
      use:[
       { loader: "css-loader? modules", options: {  importLoaders: 1 } },
       {
        loader:"postcss-loa der",
        options:{plugins:  (loader) =>  [require ("autoprefixer")()]  }
       },
       {loader: "less-loader"}
      ]
     }),
     exclude: path.resolve (__dirname,"./node_modules")
    },
    {
     test: /\.js$/ ,  loader:"babel-loader",
     exclude: path.resolve (__dirname,"./node_modules"),
     include: path.resolve (__dirname, "./src"),
     options: {"presets": ["latest"]  }
    },
    {
     test:/\.html$/ ,  loader:"html-loader",
     include:path.resolve(__dirname, "./src/layer"),
     exclude: path.resolve (__dirname,"./node_modules")
    },
    {
     test:/\.ejs$/ ,  loader:"ejs-loader",
     include:path.resolve(__dirname, "./src/layer"),
     exclude: path.resolve (__dirname,"./node_modules")
    },
    {
     test: /\.(png|jpg|jpeg|gif|svg| woff|woff2|ttf|eot|otf)$/i,
     loaders: [
      "file-loader",
      "url-loader?limit=8192",{
       loader:  "image-webpack-loader",
       options: {
        gifsicle: {  interlaced: false } ,
        optipng: {  optimizationLevel:  7 },
        pngquant: {  quality: "65-90",  speed: 4 },
        mozjpeg: {  progressive: true,  quality: 65 },
        webp: { quality:  75 } }
       }
     ],
     exclude: path.resolve (__dirname,"./node_modules")

    }
   ]
  },
  plugins: [

   //打包前 先删除dist目录下的文件
   new CleanWebpackPlugin(
    ["dist"],
    {
     root: __dirname,//指定插件根目录 位置
     verbose: true, //开启在控制台输出 信息
     dry: false //启用删除文件
    }
   ),

   //生成html
   new htmlWebpackPlugin({
    filename: "index.html",//文件名
    template: "index.html",//模板
    inject: false,//js的注入标签
    //这个配置项为true表示自动把打包出来的文 件通过自动生成script标签添加到html中

    title: "参数title",//通过<%=  htmlWebpackPlugin.options.title %> 引用
    date: new Date()//通过<%=  htmlWebpackPlugin.options.date %>引 用

    //favicon: 'path/to/yourfile.ico'

    // excludeChunks: [''],//排除的块
    // chunks: ['app','people']//选中的 块

    /*minify:{ //压缩
     removeComments: true,
     collapseWhitespace: true,
     removeRedundantAttributes:  true,
     useShortDoctype: true,
     removeEmptyAttributes: true,
     removeStyleLinkTypeAttributes:  true,
     keepClosingSlash: true,
     minifyJS: true,
     minifyCSS: true,
     minifyURLs: true,
    }*/

   }),
   //防止CSS文件混乱，单独生成一个css文件
   new ExtractTextPlugin("./css/[name] .min.css"),

   //在每个生成的 chunk 顶部添加 banner
   new webpack.BannerPlugin ("Anthor:Simon"),//添加一个显示版权声明的插 件

   new webpack.optimize.UglifyJsPlugin({
    compress:{//额外的压缩选项
     warnings:false
    }
    // mangle: {  排除不想要压缩的对象名称
             //      except: ['$super', '$',  'exports', 'require', 'module',  '_']
             // },
   }),//压缩js

   //定义全局变量
   new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse (process.env.DEBUG || "false"))
   }),

   //使用ProvidePlugin加载的模块在使用时将不再 需要import和require进行引入
   //全局自动加载模块
   new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery"
   }),

   //打开服务器后 会自动打开浏览器
   new OpenBrowserPlugin({url:  "http://localhost:8080"}),

   //排序输出,为组件分配ID
   new  webpack.optimize.OccurrenceOrderPlugin (),

   // 启用 HMR 热加载插件
   new webpack.HotModuleReplacementPlugin (),

   // 打印日志信息时 webpack 默认使用模块的数 字 ID 指代模块，不便于 debug，
   // 这个插件可以将其替换为模块的真实路径
   new webpack.NamedModulesPlugin()

   /*提取 Chunks中的公共内容
   new webpack.optimize.CommonsChunkPlugin ({
    name: ["vendor", "manifest"], //  vendor libs + extracted manifest
    minChunks: Infinity,
   }),*/

   /*拷贝资源插件 适用于线上场景
   new CopyWebpackPlugin([{
       from: __dirname + '/src/public'
   }]),*/
  ]
 };

 module.exports = MyConfig;
 ```
 </sourceFile>

***
## 结束语

欢迎转载本站文章，请注明作者和出处 [simonaking.com](http://simonaking.com)。
<style>.post-toc-level-4{ display:none }.post-content ol li:first-line { color: #999; font-weight: bold; }</style>
