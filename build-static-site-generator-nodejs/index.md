# 手撸一个静态文档生成器[译]

Date: 2020-02-29  
Author: SimonAKing  
Categories: 后端  
Tags: 后端, Nodejs, 译文  
Source: https://simonaking.com/blog/build-static-site-generator-nodejs/

> 40行代码手撸一个简易的静态文档生成器，让你了解到hexo，hugo等项目的具体工作流程。

---
目前有很多优秀的静态文档生成器，它们的工作原理比你想象的要简单得多。
## 前言

原文: [Build a static site generator in 40 lines with Node.js](https://www.webdevdrops.com/en/build-static-site-generator-nodejs-8969ebe34b22/)

作者: [Douglas Matoso](https://www.webdevdrops.com/en/author/dmatoso/)

翻译许可:

![手撸一个静态文档生成器[译] · 前言](./40行代码手撸一个静态文档生成器-译/permit.png)

![手撸一个静态文档生成器[译] · 前言](./40行代码手撸一个静态文档生成器-译/1.jpg)



### 为什么要造这个轮子

当我计划建立个人网站时，我的需求很简单，做一个只有几个页面的网站，放置一些关于自己的信息，我的技能和项目就够了。

毫无疑问，它应该是纯静态的(不需要后端服务，可托管在任何地方)。

我曾经使用过`Jekyll`, `Hugo`和`Hexo`这些知名的静态文档生成器，但我认为它们有太多的功能，我不想为我的网站增加这么多的复杂性。

所以我觉得，针对我的需求，一个简单的静态文档生成器就可以满足。

嗯，手动构建一个简单的生成器，应该不会那么难。



## 正文

### 需求分析

这个生成器必须满足以下条件：

- 从`EJS`模板生成`HTML`文件。

- 具有布局文件，所有页面都应该具有相同的页眉，页脚，导航等。

- 允许可重用布局组件。

- 站点的大致信息封装到一个配置文件中。

- 从JSON文件中读取数据。

  例如：项目列表，这样我可以轻松地迭代和构建项目页面。



> 为什么使用 EJS 模板?
>
> 因为 EJS 很简单，它只是嵌入在 HTML 中的 JavaScript 而已。



### 项目结构

```
public/
 src/
   assets/
   data/
   pages/
   partials/
   layout.ejs
 site.config.js
```

- **public:** 生成站点的位置。
- **src:** 源文件。
- **src/assets:** 包含 CSS, JS, 图片 等
- **src/data:** 包含 JSON 数据。
- **src/pages:** 根据其中的 EJS 生成 HTML 页面的模板文件夹。
- **src/layout.ejs:** 主要的原页面模板，包含特殊`<%-body%>`占位符，将插入具体的页面内容。
- **site.config.js**: 模板中全局配置文件。



### 生成器

生成器代码位于`scripts/build.js`文件中，每次想重建站点时，执行`npm run build`命令即可。

实现方法是将以下脚本添加到`package.json`的`scripts`块中：

```json
"build": "node ./scripts/build"
```



下面是完整的生成器代码：

```javascript
const fse = require('fs-extra')
const path = require('path')
const { promisify } = require('util')
const ejsRenderFile = promisify(require('ejs').renderFile)
const globP = promisify(require('glob'))
const config = require('../site.config')

const srcPath = './src'
const distPath = './public'

// clear destination folder
fse.emptyDirSync(distPath)

// copy assets folder
fse.copy(`${srcPath}/assets`, `${distPath}/assets`)

// read page templates
globP('**/*.ejs', { cwd: `${srcPath}/pages` })
  .then((files) => {
    files.forEach((file) => {
      const fileData = path.parse(file)
      const destPath = path.join(distPath, fileData.dir)

      // create destination directory
      fse.mkdirs(destPath)
        .then(() => {
          // render page
          return ejsRenderFile(`${srcPath}/pages/${file}`, Object.assign({}, config))
        })
        .then((pageContents) => {
          // render layout with page contents
          return ejsRenderFile(`${srcPath}/layout.ejs`, Object.assign({}, config, { body: pageContents }))
        })
        .then((layoutContent) => {
          // save the html file
          fse.writeFile(`${destPath}/${fileData.name}.html`, layoutContent)
        })
        .catch((err) => { console.error(err) })
    })
  })
  .catch((err) => { console.error(err) })
```

接下来，我将解释代码中的具体组成部分。



#### 依赖

我们只需要三个依赖项：

- [**ejs**](http://ejs.co/)

  把我们的模板编译成`HTML`。

- [**fs-extra**](https://www.npmjs.com/package/fs-extra)

  Node 文件模块的衍生版，具有更多的功能，并增加了`Promise`的支持。

- [**glob**](https://www.npmjs.com/package/glob)

  递归读取目录，返回包含与指定模式匹配的所有文件，类型是数组。



#### Promisify

我们使用`Node`提供的`util.promisify`将所有回调函数转换为基于`Promise`的函数。

它使我们的代码更短，更清晰，更易于阅读。

```javascript
const { promisify } = require('util')
const ejsRenderFile = promisify(require('ejs').renderFile)
const globP = promisify(require('glob'))
```



#### 加载配置

在顶部，我们加载站点配置文件，以稍后将其注入模板渲染中。

```javascript
const config = require('../site.config')
```

站点配置文件本身会加载其他`JSON`数据，例如：

```javascript
const projects = require('./src/data/projects')

module.exports = {
  site: {
    title: 'NanoGen',
    description: 'Micro Static Site Generator in Node.js',
    projects
  }
}
```



#### 清空站点文件夹

我们使用`fs-extra`提供的`emptyDirSync`函数清空 生成后的站点文件夹。

```javascript
fse.emptyDirSync(distPath)
```



#### 拷贝静态资源

我们使用`fs-extra`提供的`copy`函数，该函数以递归方式复制静态资源 到站点文件夹。

```javascript
fse.copy(`${srcPath}/assets`, `${distPath}/assets`)
```



#### 编译页面模板

首先我们使用`glob`（已被 promisify）递归读取`src/pages`文件夹以查找`.ejs`文件。

它将返回一个匹配给定模式的所有文件数组。

```javascript
globP('**/*.ejs', { cwd: `${srcPath}/pages` })
  .then((files) => {
```



对于找到的每个模板文件，我们使用`Node`的`path.parse`函数来分隔文件路径的各个组成部分（例如目录，名称和扩展名）。

然后，我们在站点目录中使用`fs-extra`提供的`mkdirs`函数创建与之对应的文件夹。

```javascript
files.forEach((file) => {
  const fileData = path.parse(file)
  const destPath = path.join(distPath, fileData.dir)

 // create destination directory
  fse.mkdirs(destPath)
```



然后，我们使用`EJS`编译文件，并将配置数据作为数据参数。

由于我们使用的是已 promisify 的`ejs.renderFile`函数，因此我们可以返回调用结果，并在下一个`promise`链中处理结果。

```javascript
.then(() => {
  // render page
  return ejsRenderFile(`${srcPath}/pages/${file}`, Object.assign({}, config))
})
```



在下一个`then`块中，我们得到了已编译好的页面内容。

现在，我们编译布局文件，将页面内容作为`body`属性传递进去。

```javascript
.then((pageContents) => {
  // render layout with page contents
  return ejsRenderFile(`${srcPath}/layout.ejs`, Object.assign({}, config, { body: pageContents }))
})
```



最后，我们得到了生成好的编译结果（布局+页面内容的 HTML），然后将其保存到对应的`HTML`文件中。

```javascript
.then((layoutContent) => {
  // save the html file
  fse.writeFile(`${destPath}/${fileData.name}.html`, layoutContent)
})
```



### 调试服务器

为了使查看结果更容易，我们在`package.json`的`scripts`中添加一个简单的静态服务器。

```
"serve": "serve ./public"
```

运行 `npm run serve` 命令，打开[http://localhost:5000](http://localhost:5000/)就看到结果了。



### 进一步探索

#### Markdown

大多数静态文档生成器都支持以`Markdown`格式编写内容。

并且，它们还支持以`YAML`格式在顶部添加一些元数据，如下所示：

```yaml
---
title: Hello World
date: 2013/7/13 20:46:25
---
```

只需要一些修改，我们就可以支持相同的功能了。



首先，我们必须增加两个依赖:

- [**marked**](https://www.npmjs.com/package/marked)

  将`markdown`编译为`HTML`

- [**front-matter**](https://www.npmjs.com/package/front-matter)

  从`markdown`中提取元数据(front matter)。



然后，我们将`glob`的匹配模式更新为包括`.md`文件，并保留`.ejs`，以支持渲染复杂页面。

如果想要部署一些纯 HTML 页面，还需包含`.html`。

```javascript
globP('**/*.@(md|ejs|html)', { cwd: `${srcPath}/pages` })
```



对于每个文件，我们都必须加载文件内容，以便可以在顶部提取到元数据。

```javascript
.then(() => {
  // read page file
  return fse.readFile(`${srcPath}/pages/${file}`, 'utf-8')
})
```

我们将加载后的内容传递给`front-matter`。

它将返回一个对象，其中`attribute`属性便是提取后的元数据。

然后，我们使用此数据扩充站点配置。

```javascript
.then((data) => {
  // extract front matter
  const pageData = frontMatter(data)
  const templateConfig = Object.assign({}, config, { page: pageData.attributes })
```



现在，我们根据文件扩展名将页面内容编译为 HTML。

如果是`.md`，则利用`marked`函数编译;

如果是`.ejs`，我们继续使用`EJS`编译;

如果是`.html`，便无需编译。

```javascript
let pageContent

switch (fileData.ext) {
  case '.md':
    pageContent = marked(pageData.body)
    break
  case '.ejs':
    pageContent = ejs.render(pageData.body, templateConfig)
    break
  default:
    pageContent = pageData.body
}
```

最后，我们像以前一样渲染布局。



增加元数据，最明显的一个意义是，我们可以为每个页面设置单独的标题，如下所示：

```yaml
---
title: Another Page
---
```

并让布局动态地渲染这些数据：

```html
<title><%= page.title ? `${page.title} | ` : '' %><%= site.title %></title>
```

如此一来，每个页面将具有唯一的`<title>`标签。



#### 多种布局的支持

另一个有趣的探索是，在特定的页面中使用不同的布局。

比如专门为站点首页设置一个独一无二的布局：

```yaml
---
layout: minimal
---
```



我们需要有单独的布局文件，我将它们放在`src/layouts`文件夹中：

```
src/layouts/
   default.ejs
   mininal.ejs
```



如果`front matter`出现了布局属性，我们将利用`layouts`文件夹中同名模板文件进行渲染; 如果未设置，则利用默认模板渲染。

```javascript
const layout = pageData.attributes.layout || 'default'

return ejsRenderFile(`${srcPath}/layouts/${layout}.ejs`,
  Object.assign({}, templateConfig, { body: pageContent })
)
```



即使添加了这些新特性，构建脚本也才只有`60`行。



### 下一步

如果你想更进一步，可以添加一些不难的附加功能：

- 可热重载的调试服务器

  你可以使用像[**live-server**](https://www.npmjs.com/package/live-server) (内置自动重新加载) 或 [**chokidar**](https://www.npmjs.com/package/chokidar) (观察文件修改以自动触发构建脚本）这样的模块去完成。

- 自动部署

  添加脚本以将站点部署到`GitHub Pages`等常见的托管服务，或仅通过`SSH`（使用`scp`或`rsync`等命令）将文件上传到你自己的服务器上。

- 支持 CSS/JS 预处理器

  在静态文件被复制到站点文件前，增加一些预处理器(SASS 编译为 CSS,ES6 编译为 ES5 等)。

- 更好的日志打印

  添加一些 `console.log` 日志输出 来更好地分析发生了什么。

  你可以使用`chalk`包来完善这件事。



反馈？ 有什么建议吗？ 请随时发表评论或与我联系！



***
## 结束语

这个文章的完整示例可以在这里找到：https://github.com/doug2k1/nanogen/tree/legacy。

一段时间后，我决定将项目转换为`CLI`模块，以使其更易于使用，它位于上面链接的`master`分支中。



译者：

今日本想写一篇[ants](https://github.com/panjf2000/ants/)(一个高性能的`goroutine`池)源码解析，奈何环境太吵，静不下心，遂罢。

这是一篇我前些日子无意间看到的文章，虽然是`17`年的文章，在读完之后仍对我产生了一些思考。

希望这篇文章对你有所帮助。

欢迎转载本站文章，请注明作者和出处  [SimonAKing](http://simonaking.com)。
