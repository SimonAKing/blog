# 浅谈搭建平台-画布篇

Date: 2022-11-11  
Author: SimonAKing  
Categories: 前端  
Tags: 前端, NCLC  
Source: https://simonaking.com/blog/canvas/

> 关于建站类，相信大家都能说出一些耳熟能详的产品，如早期的 Dreamweaver、获取上亿投资的Webflow 以及 国内的各个大厂的搭建平台等。搭建平台本身也是一款软件，本文将带你了解其中的奥秘。

---
搭建平台本身也是一款软件，它更注重于“复用与组合”，而非实际的业务逻辑。
## 前言

近些年搭建平台变得很是流行，它提供了一种全新的开发方式，同时大幅降低了使用者的门槛，解决了企业的两大痛点：开发效率与人员转型。

搭建平台由编辑器（画布+设置器）和生成器组成，本文将重点介绍画布，分为架构设计与画布设计两个章节来展开。

## 正文

###  什么是搭建平台

在介绍搭建平台之前，有一个无法绕过的主题，那就是 NCLC（No Code & Low Code）。NCLC 作为建站产品背后的核心概念，推动了一波又一波的技术浪潮。

近些年围绕 NCLC 踊跃出了不同形态的产品，如项目管理 Meego、低代码系统 Retool、在线文档 Notion 等，甚至还有人将 NCLC 细分为了 12 个发展赛道。

![什么是搭建平台](./浅谈搭建平台-画布篇/5daef6094f8145f292e4b926749fa7a7~tplv-k3u1fbpfcp-watermark.png)

*图片来源：https://pinver.medium.com/decoding-the-no-code-low-code-startup-universe-and-its-players-4b5e0221d58b*

<br/>
其中业界内发展最为迅猛、最有代表性的产品形态莫过于 建站类。

关于建站类，相信大家都能说出一些耳熟能详的产品，如早期的 Dreamweaver、获取上亿投资的 SaaS Webflow 以及 国内的各个大厂的搭建平台等。

搭建平台之所以如此流行，原因不外乎于解决了企业的两大痛点：开发效率与人员转型。

**开发效率：**

搭建平台本身也是一款软件，与常见的 IDE 相比，都是为提高生产力服务；不同的是，它更注重于“复用与组合”，而非实际的业务逻辑。通俗来说，用组件拖拽与配置 代替了 传统的编程开发。

想象一下，我们需要开发一款海报形态的活动页面，必不可少的需要堆图片、堆动效，如果走传统的编程可能会花费数天。而如果走搭建，只需生成一次物料，拖拽并配置物料 就搞定了。

简而言之，搭建平台提供了一种全新的开发方式。面向特定场景下，开发的复杂度可以很好地被掩盖。如 电商活动、营销宣传、中后台等。

**人员转型：**

在日新月异的市场中，数字化转型获得了很多企业的一致认可，其中 NCLC 作为人员数字化背后的核心概念，允许企业员工在没有编程经验的情况下构建应用。

在搭建平台的用户中，除了研发同学，更常见的用户是没有编程技能的运营同学，ta 们通过搭建的方式生成所需的活动页面，在没有研发参与的情况下，真正按照自己的想法去实现。

搭建平台大幅降低了使用者的门槛，避免浪费过多的开发资源，进一步提升了 企业中的流程效率。

相信大家对搭建平台已经有一定的了解了，那么搭建平台由哪些概念组成呢？

### 衍生概念

在发展的过程中，搭建平台 衍生出了众多的概念，让人望而却步，但核心可以用一句话来概括：

搭建平台 = 编辑器（画布+设置器）+ 生成器，而这些实体的数据源是物料，实体间遵循的通信协议是 UIDL。

编辑器与生成器独立通过 UIDL 解耦，做到 搭建的页面类型 只与使用的物料相关。

- 编辑器 只负责前端技术栈物料的渲染，生产出 UIDL 规范。
- 生成器 消费 UIDL，再根据约定好的模板项目，生产出页面。

该设计属于典型的分层架构，将系统分成若干个水平层，每一层都有清晰的角色和分工，不需要知道其他层的细节，层与层之间通过接口 & 协议通信。

因为篇幅原因，本文的重心是 画布，分为架构设计与画布设计 两个章节来展开，设置器、生成器 可期待后续系列。

![image-20221111122204604](./浅谈搭建平台-画布篇/image-20221111122204604.png)

### 架构设计

该 part 介绍了 搭建平台中 核心的架构设计。

#### IOC 架构

各个功能模块之间会以 IOC 架构进行依赖耦合，具体来说 每个模块都需定义使用规范，统一在入口进行模块之间的注入绑定。

这意味着模块之间的依赖关系由容器在运行期决定。该设计优势在于功能模块之间的依赖以规范为主，不关心具体的实现；并且功能模块之间可以独立迭代，利于后续扩展。

举个例子：

每一种类型的终端会有独立的物料区、生成器的模板，以及相同的画布功能模块，在使用 IOC 架构之后，功能模块会以 底层基座 加扩展模块的方式进行聚合，如 TV 端画布与 移动端画布的明显差别在于画布分辨率、组件的选中态（TV 端存在焦点的概念），而这些差别 与 画布是附加的关系。

如此设计的好处是当出现新的终端时，可以快速适配。

总的来说，IOC 架构是一种可模块和可扩展的设计方案，让整个系统更加可插件化。

延伸阅读：[InversifyJS 的最佳实践](https://github.com/inversify/InversifyJS/blob/master/wiki/good_practices.md)。

#### 编辑渲染分层

用户搭建时需要在组件上渲染出各种交互态，这些状态不能直接与组件本身耦合。搭建平台会把画布进一步分为 渲染层与编辑层，彼此之间通过通信协议进行解耦。

![image.png](./浅谈搭建平台-画布篇/d0b601663dc74908882be828686c02f9~tplv-k3u1fbpfcp-watermark.png)

编辑层本质上是画布中真实渲染的元素；渲染层则是在编辑层之上的一层蒙版，其中蒙版是由 与真实元素 相同大小定位的虚拟元素组成的。

当用户编辑页面时，会直接操作到编辑层的元素，而后续的交互 会在渲染层上进行。

举例：当用户选中组件时，被选中的组件位于编辑层；选中组件后会出现 8 个锚点，这些锚点是在渲染层中挂载的。

这种设计带来的优势非常明显：

- 可提效页面预览

  预览页面时只需移除掉 画布编辑器的蒙版即可，真正的秒级预览。

- 便于画布的交互体验

  组件的提示线、锚点只在渲染层中产出，不会影响编辑层的真实组件；并且当拖拽组件时 只需增删相应的渲染层组件即可。

- 真正的解耦设计

  可枚举出画布编辑的规范与画布渲染的规范，梳理每一个行为与其所需的输入信息，让每一个行为都有足够详细的描述，真正做到分层解耦。

  - 画布编辑规范主要用于梳理 画布上的编辑动作，大概形态如下：

  ```ts
   interface ComponentAddAction {}
   interface ComponentDragAction {}
   ...
  ```

  - 画布渲染规范用于梳理 画布上的渲染动作，大概形态如下：

  ```ts
   interface ComponentFocusRenderer {}
   interface ComponentMirrorRenderer {}
   ...
  ```

业界中更激进的做法是将编辑与渲染通过 iframe 分层，具体来说是 渲染层是一个独立的路由，内嵌到编辑器中，编辑层会在渲染层之上建立一个等大小的蒙版。用户在操作画布时，蒙版会首先捕获用户的操作，再通过 iframe 的同源协议进行交互行为的通信，渲染层接收消息后实时做到响应。

通过 iframe 实现编辑渲染分层的好处有：

- 天然的沙盒化

  因为 iframe 的天然隔离性，画布渲染器中的所有逻辑、样式不会影响编辑器本身。

- 利于多人编辑

  单人编辑时使用 iframe 进行通信，而多人编辑时可将 iframe 通信切换成 WebSocket 通信，设计时有异曲同工之妙。

需要注意的是，如果想保障 编辑层与渲染层 相应组件之间的定位、大小相同，需要在 `resize`、`scroll` 事件中进行渲染层的重新渲染。

*下文以画布代称编辑层与渲染层，不再做区分。*

#### 事件体系

事件体系是进一步解耦的设计方案，编辑器中会建设一套完善的事件体系，对应着每个编辑动作、渲染动作、全局动作的生命周期或者具体的回调动作。

每个功能模块都可消费相应的事件。

![image.png](./浅谈搭建平台-画布篇/ca3fd4b7b7584881bef5a5c8c59db469~tplv-k3u1fbpfcp-watermark.png)

如此设计的好处是利于扩展，当添加新 feature 时，可以很容易地通过挂载事件来做到。

针对事件体系，举两个典型案例：

- 当 页面加载时 会触发 init 事件，平台上的不同功能模块消费该事件：侧边栏加载物料、画布渲染 Schema、物料管理 加载基础依赖等。
- 当 拖拽组件到画布时 会触发 dragEnd 事件，平台上的不同功能模块消费该事件：物料管理加载拖拽的物料，设置器解析渲染拖拽物料的设置规范、画布移除拖拽镜像等。

#### 规范设计

在平台实践时，切记两点：

- 围绕落地场景来设计产品思路，不可盲目堆功能。
- 规范先行，规范是贯穿编辑器的核心概念。

下文介绍两个重点规范：UIDL 规范 与 物料规范。

** UIDL 规范 **

> UIDL：用于描述 搭建页面时的所有与 UI 相关的可结构化信息。

UIDL 最初是由 teleporthq 公司提出：

```
All user interfaces serve the same purpose: allow for an interaction between a human and a machine.
Functionally speaking, the vocabulary of human-machine interaction is well defined. No matter the medium or the technology used behind it, a user interface will likely be built with a dozen atomic visual elements such as: titles, paragraphs, inputs, images, videos, links, buttons, etc., and a couple of meaningful compositions of these elements such as lists, tables, forms and menus.
However, over time the number of channels has increased dramatically (web, mobile, tablets, tv, AR/VR) and the number of technologies used for each of those channels as well. This has resulted in an increased human time cost of building a user interface and distributing it to each channel while providing no extra value for the end user.
This is why we have decided to search for a solution which would allow us to focus more on the what and worry less about the how.
Like others before us, we decided to work on a universal format that could describe all the possible scenarios for a given user interface. This format allows us to:
generate the same user interface with various tools and frameworks
transition from one code output to another without effort
enable efficient and advanced programmatic manipulation
We have named our universal format "User Interface Definition Language" (UIDL). It is represented by a human-readable JSON document, a format supported natively by many programming languages.
```

*摘录自：https://docs.teleporthq.io/guides/what-is-this.html#uidl*

一般而言，UIDL 可由四部分组成：

- UIDL 元信息
- 项目元信息
- 页面 Schema 规范
- 使用的物料以及物料的配置

```ts
interface ComponentProps {
  id: string
  [key: string]: any
}

interface Schema {
  id: string
  type: MaterialId
  name: string
  children: Schema[]
  props: ComponentProp
}

interface UIDL {
  meta: {
    version: string // UIDL 元信息
  }
  project: {
    // 项目元信息
    id: string
    title: string
    version: string
    author: User
    url: string
  }
  schema: Schema // 页面 Schema 规范
  materials: {
    // 使用的物料及其配置
    components: Array<Component>
  }
}
```

** 物料规范 **

> 物料：用于描述 搭建页面时所需的组件等一系列可丰富页面功能、样式的实体。

一个物料有多种属性，每一个属性都可成为分类的条件。

- 终端划分：移动端 Web、小程序、TV 端...
- 形态划分：组件、插件、动作
- 功能划分：基础组件、容器组件、玩法组件...

其中**终端、业务线** 是物料外在的属性，**形态、功能** 是物料内在的属性。

我们在确定一个具体物料时，会首先通过物料的外在属性过滤出当前页面上可用的物料，然后再通过物料的内在属性 明确应该使用的物料，所以在设计物料标识时也应尽可能的体现出关键的属性。

------

### 画布设计

该 part 介绍了画布中的核心难点 以及 对应的实现方案。

为了让大家更好地理解文章脉络，我们举一个页面生产的案例：

有个男人叫小帅（请自行脑补），他接到了某活动的需求，需要产出一个宣传页面，页面的大概样子如下：

![image.png](./浅谈搭建平台-画布篇/ae0e9299ebcb454ebaaca05f5d4cf57c~tplv-k3u1fbpfcp-watermark.png)

于是他开始打开某搭建平台，首先从物料区拖拽了三个组件：图片、文本、按钮，并按照设计格式放置好。

然后他开始进行各个组件的配置，图片组件上传设计图，文本组件配置介绍文案，按钮组件配置跳转链接。

配置完成后，他开始了活动发布，等待发布完成后，得到了一个可投放的页面链接，到此 任务完成。

*来自一个真实的案例：*

![画布设计](./浅谈搭建平台-画布篇/59ede7cb46e24db5a68db2a52c63230a~tplv-k3u1fbpfcp-watermark.png)

根据小帅的操作过程，我们不难得到以下关键流程：

生成页面 = (1)添加组件 - (2)拖拽组件 - (3)选择组件 - (3)配置组件（设置器）- (4)活动发布（生成器）。

*因为文章篇幅，设置器、生成器 本文暂不展开，可期待后续系列。*

其中前三个核心环节均是在画布中完成的，那么这些核心环节的背后发生了什么呢？

#### 添加组件

添加组件的核心 有两点：

1. 组件的产物加载到搭建平台
2. 生成组件的 Schema Node，并在拖拽结束时 插入到 UIDL（下一章节）

** Schema 生成 **

当添加组件时，第一步是生成 组件的 Schema Node，为后续 UIDL 服务，生成时会解析当前组件设置器的规范，伪代码如下：

```ts
genSchema(component: ComponentMaterial): Schema {
    const children: Schema[] = []

    // TODO: 应该由 设置器中的 props 填充
    const props = {}

    // TODO: 应该由 设置器中的默认样式填充
    const styles: React.CSSProperties = SchemaService.defaultStyles

    return {
      id: this.genComponentId(),
      type: component.id,
      name: component.name,

      props,
      children,
      styles
    }
  }
```

** 加载物料 **

用户第一次进入搭建平台时，是不可能直接加载所有物料资源的，物料一般是在使用时加载，这是因为物料是可扩展，加载所有物料 会导致搭建体验下降。

所以编辑器需要一种异步的物料加载方式，有利于渲染单页面资源 最优化。

** 打包规范 **

很明显，物料的加载方式是需要与打包类型 紧密配合的。

在 Web 的模块化发展中，出现了四种使用较广泛的类型：AMD、CJS、UMD、ESM，其中 UMD 是在 AMD、CJS 上层的兼容方案，就不展开了。

下面简单梳理了下各种模块化的优劣势与适用场景。

![image-20221111131525099](./浅谈搭建平台-画布篇/image-20221111131525099.png)

现代前端模块化的发展趋势逐渐以 ESM 为主流，相比 AMD、CJS 有标准化组织支持，所以物料打包规范建议以 ESM 为目标。

** 加载物料 **

随着前端模块化的发展，模块加载方式也出现了一些更加成熟的解决方案，梳理如下：

![image-20221111131550407](./浅谈搭建平台-画布篇/image-20221111131550407.png)

综合来说，使用 systemJS 加载模块是个更好的选择，对现代打包工具有较好的支持，有一套规范可以实现复杂的依赖引用，而且还支持各种模块的规范。

** 依赖分析 **

除了加载物料本身还远远不够，物料在实现时会依赖很多通用的基础库、框架，如 按钮组件在 Web 端会依赖 React，具体依赖大概可分为以下三种类型：

- **基础框架、库**：React、React-DOM 等
- **特定组件下所需的 框架、库**：如 xg-player
- **依赖的其他组件**：如 按钮列表组件 需要 按钮组件

这三种类型的依赖，如果每一个物料都打包的话，无疑会造成很大的物料体积冗余，从而进一步影响拖拽体验，所以需要根据不同类型做不同的打包优化处理。

- **基础框架、库**：会作为公共依赖存在，物料打包时不会打包进该产物，该产物会直接内置在 搭建平台侧。注意 这些公共依赖 需要在物料侧统一版本。
- **特定组件下所需的 框架**：会一起打包进物料，不进行处理。
- **依赖的其他组件**：物料打包时，会检查当前物料依赖的其他物料，并声明在物料信息的某一字段中（如 **dependencies**），物料在加载时 会先加载 依赖所需的物料。注意 物料加载方式是深度优先的，会存在多层依赖的场景。

** 沙箱化 **

每个物料作为单独的可执行单元，运行在同一 runtime 中，为了避免互相相互影响，沙箱化机制是必不可少的，我们可以参考以下微前端的常见沙箱化手段。

根据 Web 的技术特性，沙箱可分为逻辑隔离与样式隔离。

** 逻辑隔离 **

逻辑隔离常见的方案有 Eval、Function 方案，其中 Eval 的安全性、性能与 Function 相比差距较大。

业界中常见的微前端框架 逻辑隔离是 通过代理 全局对象 实现，大概的逻辑如下：

```ts
const varBox = {};
const fakeWindow = new Proxy(window, {
    get(target, key) {
        // 敏感调用检查
        return varBox[key] || window[key]
    },
    set(target, key, value) {
        // 敏感调用检查
        varBox[key] = value;
        return true;
    }
})
const fn = new Function('window', code);
fn(fakeWindow);
```

** 样式隔离 **

样式隔离根据开发的层面也有不同的解决方案。

在开发层，可以尝试使用 style-components 或者 css-module 方案，打包出具有唯一样式的组件。

在构建层可以使用 Shadow Dom 包一层 或者在所有样式外 加一层组件类名。

```
let elementRef = document.querySelect('#sub-app');
let shadow = elementRef.attachShadow({mode: 'open'});
```

** 结束语 **

到此，添加组件已完成，回顾一下：

1. 组件的 UIDL 已经生成完毕
2. 组件的资源已经被加载到了搭建平台。

------

#### 拖拽组件

拖拽组件属于画布中的核心难点，该 part 将尽可能覆盖拖拽背后的技术难点。

** 拖拽库 **

在介绍拖拽之前，必不可少要做的是 拖拽事件的监听与拖拽信息的收集，业界中有很多库都做了或多或少的事情，如 Github 的 [draggable topic](https://github.com/topics/draggable)。那么拖拽库又做了什么呢？

组件在拖拽时，会根据时间周期分为三个阶段，每个阶段都应该提供不同的信息供外部消费：

- 拖拽开始 - 注册事件：MouseDown
  - 是否已拖拽，需提供 拖拽的判定距离，不能太小不然会误判。
  - 触发拖拽开始的回调

- 拖拽中 - 注册事件：MouseMove、Scroll
  - 拖拽的方向
  - 拖拽的距离
  - 拖拽的位置
  - 触发拖拽中的回调
  - 拖拽到边界时容器应随之滚动
    - 应只针对于非固定布局的元素
  - 拖拽时应显示拖拽中的光标

- 拖拽结束 - 注册时间：MouseUp
  - 拖拽的位置
  - 触发拖拽结束的回调

在拖拽组件时 预期可提供不同阶段的回调函数，再结合该引擎使用，做到底层隔离，聚焦业务逻辑。

你可能好奇 为什么要使用 **MouseDown + MouseMove + MouseUp 模拟拖拽事件**，而不使用 [DOM 原生的 Drag 事件](https://developer.mozilla.org/en-US/docs/Web/API/Document/drag_event)？

画布组件拖拽中需要实时拿到当前的位置、拖拽方向，即需要注册 MouseMove 事件，如此一来不如使用以上三个 Mouse 事件模拟更加方便。

** 镜像组件 **

组件从拖拽开始到拖拽结束 会有一个拖拽中的镜像组件，可以从以下两点提升搭建的体验。

这样做的好处是：镜像组件能前置加载组件资源 ，拖拽时也能给用户实时的反馈。

实现伪代码如下：

```ts
let componentMap = {}
let mirror = { move: xxx, destory:xxx }

// 鼠标摁下 加载物料，生成镜像
onMouseDown = (e) => {
    const schema = genSchema(e)
    const schema = loadComponent(schema)
    mirror = renderMirror(schema)
}

// 根据拖拽的位置移动镜像
onMouseMove = (e) => {
    mirror.move(e)
}

// 拖拽结束销毁镜像
onMouseUp = (e) => {
    mirror.destory()
}

// 加载组件资源
loadComponent = (schema) => {
    if(componentMap[schema.type]) return
    componentMap[schema.type] = systemjs.loadModule(schema.url)
}

// 根据已经获取的组件资源 渲染镜像
renderMirror = (schema) => {
    const mirrorEl = document.createElement('div')
    document.body.appendChild(this.mirrorEl)

    const Mirror = componentMap[schema.type]
    ReactDOM.render(<Mirror />, this.mirrorEl)
}
```

- 在鼠标点击时加载物料资源 或者 复用已缓存的物料资源
- 在拖拽开始时渲染相应的组件

- 拖拽中 实时同步位置，拖拽结束卸载组件

** 组件锚点 **

> 组件锚点 属于 拖拽组件中绕不开的一个概念。

用知名绘图工具 [draw.io](https://app.diagrams.net/) 举例，选中组件后，会在组件周围出现 8 个锚点。

![拖拽组件](./浅谈搭建平台-画布篇/8e933995b42a4daa8cc3e7ec96a09999~tplv-k3u1fbpfcp-watermark.png)

组件在拖拽时 可根据其锚点进行 参考线的显示，并且在选中组件时 也可拖拽锚点进行组件的缩放。

组件锚点 一般分为 4 个、6 个、8 个，常见为 8 个，以组件左上角（X*Y）二维坐标举例：

![image.png](./浅谈搭建平台-画布篇/a589d61f848641a8beb2d274d00c2752~tplv-k3u1fbpfcp-watermark.png)

实现逻辑是生成 8 个相应位置的锚点，再贴在原生节点上，具体实现如下：

```ts
const pointList = ['t', 'r', 'b', 'l', 'lt', 'rt', 'lb', 'rb']
const selectedComponent // 选中的组件

const pointStyle = {
    width: 5px;
    height: 5px;
    border-radius: 5px;
    cursor: point.split('').reverse().map(m => this.directionKey[m]).join('') + '-resize',
}

const genPointStyle = point => {
    let { left, top } = selectComponent.style

    if(point === 'lt') {
        return ({...pointStyle,left,top})
    }

    // 其他点的处理逻辑...
}

 {pointList.map(p => ( <div key={p} style={getPointStyle(p)}/> ))}
```

** 锚点拖拽 **

锚点在拖拽时可以随意缩放组件本身的大小，从而 达到快捷设置组件尺寸的目的。

**重点来了，组件本身的位置大小，在 2D 坐标系中由四个属性即可描述完整：Width、Height、Left、Top，简称为 Rect，该概念贯穿全文**。

![image.png](./浅谈搭建平台-画布篇/7a0ec6dbc58244df9c390936a9699711~tplv-k3u1fbpfcp-watermark.png)

并且需要注意的是，组件的 8 个锚点在拖拽时 都是以 **对点（左<->右）** 为固定的，所以拖拽不同的锚点，达到的效果是不相同的。

- 左上锚点：可更改组件的 Width、Height、Left、Top
- 中上锚点：可更改组件的 Height、Top
- 右上锚点：可更改组件的 Width、Height、Top
- 左中锚点：可更改组件的 Width、Left
- 右中锚点：可更改组件的 Width
- 左下锚点：可更改组件的 Width、Height、Left
- 中下锚点：可更改组件的 Height
- 右下锚点：可更改组件的 Width、Height

举例说明：假设鼠标摁下的端点坐标为 (x1,y1)，鼠标移动时取任一时间切片的坐标为(x2,y2)，锚点拖拽具体的实现逻辑如下：：

1. 在鼠标点击时 记录点击的坐标(x1,y1)
2. 在鼠标移动时，拿到鼠标移动时的坐标(x2,y2)
3. 由两个坐标 相减的绝对值 得到拖拽的距离
4. 根据以上的规则 与 拖拽的距离，重新设置 组件的 Width、Height、Left、Top

伪代码如下：

```ts
let component // 当前拖拽的组件
let startPoint // 起点
const onMouseDown = e => { startPoint = new Point(e) }

const onMouseMove = (e,point) => {
    const distanceX = e.x - startPoint.x
    const distanceY = e.y - startPoint.y
    if(point === 'LT') {
        component.height -= distanceY
        component.width -= distanceX
        component.left += distanceX
        component.top += distanceY
    }
    // 其他点处理...

}
```

** 智能吸附 **

智能吸附属于组件拖拽时的辅助功能，提升页面的搭建效率。

智能吸附一般可分为三种：位置吸附、距离吸附与尺寸吸附。

** 位置吸附 **

位置吸附在很多编辑场景中都能见得到，如设计工具、搭建平台、绘图工具等。

主要原理是，用户在拖拽某一组件时，如果**检测到 拖拽中的组件位置 与 画布中其他组件的位置 小于吸附的阈值，则会智能吸附**，从而使得 用户搭建页面更加准确。

吸附的阈值一般为 1~5 px 常见为 3 px，如果阈值太大 则卡顿感会很明显。

智能吸附的原理很简单，当检测到 拖拽中组件与其他组件的 不同锚点 X 坐标或 Y 坐标之间的差绝对值小于阈值时，就会将拖拽中组件的 Rect 中的 Left/Top 直接设置为 被吸附组件的锚点坐标。

并且当吸附后组件之间会显示参考线，参考线一般根据锚点位置分为 2 种类型 6 条参考线，分别是：

- X 轴参考线 - Left、Height 是变量，Width 一般为 较小值，Top 一般等于吸附位置的 Top
- Y 轴参考线：Top、Width 是变量，Height 一般为 较小值，Left 一般等于吸附位置的 Left

![image.png](./浅谈搭建平台-画布篇/42163ac93b39492b81652c66f95c1bf5~tplv-k3u1fbpfcp-watermark.png)

参考线的显示与锚点显示的大概逻辑相同，也是通过已知的定位大小 与 较高的图层 渲染在画布上。

伪代码如下：

```ts
let draggingComponent // 拖拽中的组件
let allComponents // 画布中的所有组件

// 垂直参考线样式 width: 1px;height: 100%; z-index: 9e3; display:none
let verticalLine

const onMouseDown = e => {
    draggingComponent = getComponentByMousePosition(e)
    allComponents = getAllComponents() // 得到画布中的所有组件

    注册鼠标移动、鼠标抬起事件
}

const Diff = 3

const isNearly = (a,b) => Math.abs(a-b) < Diff

const onMouseMove = (e) => {
    allComponent.forEach(c => {
        const {left,top} = c.getBoundingClientRect()
        if(isNearly(e.left,left)){
            draggingComponent.style.left = left

            verticalLine.style.left = left
            verticalLine.style.display = 'block'
        }
        // 同理针对 top、top + top/2 、其他点...

    })
}
```

** 距离吸附 **

很多设计工具除了 位置吸附外，也提供了距离吸附。

用户在拖拽组件时，画布会实时检测 **组件之间是否已存在 一定误差范围内的相同边距，如果存在 则设置组件的位置，已达到 边距与已存在的边距一致**。

该功能在排版 边距相同的组件时会很有效。

功能要点如下：

- 因为搭建页面时，画布的组件只能分为两种：拖拽中的组件 与 静态放置的组件。 静态放置的相邻组件之间是可以计算出边距的，所以编辑器中可存在一个代表 包含了画布上所有相邻组件的边距状态。

- 当拖拽组件时，会拿到拖拽组件与相邻组件之间的边距，如果该边距 命中了 已知的边距大小，则进行组件之间的边距渲染。

- 为了防止 边距吸附引起的噪音过大，组件之间的边距计算，需组件在拖拽组件视图内，如下：

  ![image.png](./浅谈搭建平台-画布篇/8099aca92bf14907ad3f24fc3c6216a6~tplv-k3u1fbpfcp-watermark.png)

  - 垂直视图内判定：以下条件需全部满足
    - 拖拽组件的 Right >= 兄弟组件的 Left
    - 拖拽组件的 Left <= 兄弟组件的 Right
  - 水平视图内判定：
    - 拖拽组件的 Bottom >= 兄弟组件的 Top
    - 拖拽组件的 Top <= 兄弟组件的 Bottom

- 组件在拖拽时，参考边距由：父组件、没有与拖拽组件相交的兄弟组件、参考线组成。

  - 垂直参考距离：下侧组件的 Top - 相邻上侧组件的 Bottom
  - 水平参考距离：右侧组件的 Left - 相邻左侧组件的 Right
  - 拖拽中已知的距离：
    - 上侧距离：拖拽组件的 Top - 相邻上侧组件的 Bottom
    - 下侧距离：相邻下侧组件的 Top - 拖拽组件的 Bottom
    - 左侧距离：拖拽组件的 Left - 相邻左侧组件的 Right
    - 右侧距离：拖拽组件的 Right - 相邻右侧组件的 Left

- 在计算时会将父组件模拟成四个组件，具体逻辑如下：

![image.png](./浅谈搭建平台-画布篇/52eaffa330194093ad6a146759c159be~tplv-k3u1fbpfcp-watermark.png)

基于以上要点，梳理逻辑如下：

![image.png](./浅谈搭建平台-画布篇/55b37e2ebb024c019444f0d6218f8c53~tplv-k3u1fbpfcp-watermark.png)

最后渲染的流程等价于 画布上显示各种 高亮提示，因为已经得到了具体的 rect 信息，实现手段很多样 就不展开了，比如悬浮一个 div。

** 尺寸吸附 **

当锚点拖拽时，也可提供 缩放组件时的尺寸吸附。

**当缩放组件的高宽存在一定误差内相同的组件高宽时，就会自动设置。**

达到智能吸附的效果，便于设置相同大小的组件。

功能要点如下：

1. 画布缩放时存在 8 种类型，需要根据不同类型与变化的值 计算出 当前缩放的边。
   1. 如拖拽 topLeft 锚点时，只有 Height 发生了变化，那么就寻找存在一定误差的 Height。
   2. 并且 Height 的吸附提示 只显示在 Left 侧。
2. 参考的组件为所有兄弟组件，如果存在多个一定误差内的组件，则取最小误差的，并且把所有最小误差的组件都渲染出 吸附提示。
3. 吸附提示较简单，分为高度提示 与 宽度提示。

** 组件插入 **

组件插入时，需要根据对应的布局类型与图层关系，将 组件 对应的 Schema Node 信息插入到 UIDL 中，而画布会根据 UIDL 响应式进行渲染。

通俗理解，画布等价于 UIDL 树结构动态渲染的工程，即 canvas = render(UIDL)，伪代码如下：

```ts
type Props = {
  id: ComponentId
  key?: string
}

const DynamicComponent: React.FC<Props> = ({ id }) => {
  const [schema, version] = useSchema(id)
  const moduleMap = useSelector((state: RootState) => state.material.moduleMap)

  const { children = [], type, props, name } = schema

  const Module = moduleMap[type]
  return (
    <Module key={id} {...props}>
      {children.map(child => (
        <DynamicComponent
          key={child.id}
          id={child.id}
        />
      ))}
    </Module>
  )
}
```

在插入完成后，还可发起 事件通知，进行后置的操作，如：选中组件、销毁镜像、设置器更新等。

** 插入提示 **

组件在拖拽时会实时计算鼠标下的 DOM 节点是否为画布中的组件，如果是画布组件需给出可插入提示，从而提升搭建体验。

实时计算 DOM 节点，可通过 [document.elementsFromPoint](https://developer.mozilla.org/en-US/docs/Web/API/Document/elementsFromPoint) 方法，该方法会返回鼠标下的所有 DOM 节点，后续可深度遍历 查找出具有特征标识的 画布组件。

根据组件插入的方式 可知，插入动作分为 插入目标组件中 与 插入目标组件周围，这两种插入动作的提示重心是完全不同的。

- **插入目标组件中**，提示重心在于目标组件可包含。

- **插入目标组件周围**，提示重心在于插入的位置。

关于提示的实现，可通过增加上层绝对定位的 DOM 节点，这里不具体展开了。

** 结束语 **

至此，组件已经成功被插入到画布中，回顾一下：

- 使用 or 自研 拖拽库，作为底层能力，不同阶段的信息供外部消费。
- 在拖拽时有 镜像组件、多种智能吸附的效果 来保障搭建的效率与体验。
- 组件插入时，利用 UIDL 响应式渲染的特性，在画布中呈现最新的组件。

------

#### 选择组件

该 part 将重点介绍 组件选择后的核心机制，与可交互的快捷功能。

** 事件分发 **

在组件选择后，有一个无法绕过的主题，那就是事件分发。

由于画布中的组件是动态加载来的，如果想为组件绑定事件，需要在组件开发时进行内部的 props 消费，如把 onClick 透传到组件根节点上，但针对组件产物 进行事件绑定，这显然是不合理的。

所以如果想绑定事件，只能从 DOM 层出发，解放方案有二：

- 组件节点声明 组件的关键信息，并且在 Wapper 中为每个组件绑定事件。
  - 优势：
    - 事件触发更准确
  - 劣势：
    - 需要绑定 组件个数 * N 个事件

- 绑定全局的事件，再根据点击的位置找到相应的元素，进行分发。
  - 优势：
    - 节省内存
  - 劣势：
    - 需要一套完善的组件查找机制

为了实现的复杂度，选择方案一即可。

回归到事件分发的本身，事件分发是为了绑定画布组件的事件出现，编辑器可以提供一个 EventProvider ，该功能希望能做到不侵入原有组件、不影响组件功能、样式，并且还可为组件绑定各种事件。

可借助 display:contents 可以实现该功能，如果大家对该属性感兴趣，也可以看下 iCSS 前端趣闻 的一篇文章：[冷知识！使用 display: contents 实现幽灵节点？](https://mp.weixin.qq.com/s/DhkQNO8Hv1zZP9Fu7uSw-g)

具体逻辑如下：

```ts
function withEventProvider<P>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  const Wrapped: React.ComponentType<P> = props => {
    return (
      <div
        style={{ display: 'contents' }}
        onClick={e => {
          console.log(e, props)
        }}>
        <Component {...props} />
      </div>
    )
  }

  const name = Component.displayName ?? Component.name ?? 'Unknown'
  Wrapped.displayName = `withEventProvider(${name})`

  return Wrapped
}
```

** 快捷操作 **

用户在选中组件后可进行以下快捷操作，希望提高搭建效率。

** 删除组件 **

> 用户在选中组件之后，可以使用快捷键或者右键菜单进行删除组件。

具体逻辑为：删除目标组件在 Schema 中的相应节点，删除之后画布重新渲染即可。

** 复制粘贴 **

> 用户在选中组件之后，可以使用快捷键或者右键菜单进行进行复制组件。
>
> 预期操作途径：选中组件 X -> Ctrl C -> 选中画布、组件 Y -> Ctrl V

需要注意的点如下：

- 在画布状态中需维护 已复制的组件 schema，并且复制的组件状态只是单个变量，非数组。
- 当 X、Y 组件是同一组件时，需设置两个组件偏移量，不然很容易出现重叠的情况。
- 插入组件时 应重置 复制组件的 Left、Top ，不然会出现偏移不符合目标容器的情况。

具体逻辑类似于组件插入。

** 剪切组件 **

> 用户在选中组件之后，可以使用快捷键或者右键菜单进行进行剪切组件。

剪切操作本质上是 复制粘贴操作 与 删除操作的组合，在用户复制组件后 需将复制的组件从画布中删除，剪切操作与复制操作中使用的是同一画布状态。

** 文本编辑 **

在很多搭建平台、设计工具中，文本内容可以进行双击编辑，使用起来符合直觉。

组件在开发时可为编辑的文本 wrapper 增加声明属性，如 data-edit="propKey"

```ts
const Text: React.FC<Props> = ({ id, styles = {}, content = '请输入文字' }) => {
  return (
    <div id={id} className={s.text} style={styles} data-edit='content'>
      {content}
    </div>
  )
}
```

组件在挂载到画布之后，会为所有声明了 data-edit 的 DOM 节点设置 contentEditable。

用户在选中某一组件后，会判断当前位置是否存在 可编辑的文本，如存在 会在失去组件焦点后 同步设置组件的文本，已达到更新输入后的内容。

** 组件旋转 **

组件旋转功能常见于设计工具或 自由度较高的建站平台中，活动页搭建平台中使用的场景较少。

旋转功能的具体原理简单来说是，拿到 鼠标点击时坐标与鼠标移动时坐标 针对组件中心点 各自对应的角度，将其相减就是旋转的角度。

** 组件多选 **

用户可通过拖拽鼠标完成多个组件的选择，实现针对多个组件的同时操作，提升效率。

** 选择区域 **

用户在画布上拖拽鼠标时 需实时高亮已选择的区域，该功能属于组件多选的基本能力。

假设鼠标摁下的端点坐标为 (x1,y1)，鼠标移动时取任一时间切片的坐标为(x2,y2)，从视频中可以分析出以下三点：

- 选择区域 是以 (x1,y1) 为不动点
- 区域的宽 是 x2 与 x1 之间的距离，区域的高是 y2 与 y1 之间的距离
- 区域的左上坐标为 (min(x1,x2),min(y1,y2))

具体设计思路如下：

```ts
let startPoint = null

const area = {
    width: 0,
    height: 0,
    x: 0,
    y: 0
}

const onMouseDown = e => {
    // 记录端点
    startPoint = new Point(e)

    注册鼠标移动、鼠标抬起事件
}

const onMouseMove = e => {
    area.width = Math.abs(e.x - startPoint.x)
    area.height = Math.abs(e.y - startPoint.y)
    area.x = Math.min(e.x, startPoint.x)
    area.y = Math.min(e.y, startPoint.y)
}

<Area style={area} />
```

当鼠标抬起后 **选择区域会缩小成 区域中组件组合形成的最小矩形**。

分析要点如下：

- 选择轮廓区域中的组件 需被完全包含
- 选择轮廓区域的宽高 由边界组件的位置限定
- 选择轮廓区域的位置 等于边界组件的位置

具体设计思路如下：

```ts
// 得到画布中的所有组件
const components = getAllComponentInCanvas()

// 得到选择区域中的组件
const componentsInArea = components.filter(c => isInArea(c,area))

// 得到多个组件之间的边界
type Boundary = {left:number,right:number,top:number,bottom:number}
const boundary:Boundary = getComponentsBoundary(componentsInArea)

const  outlineArea = { width: boundary.right - boundary.left , height: ...,x:boundary.left,y: boundary.bottom }

<Area style={outlineArea} />
```

** 同时操作 **

在选择多个组件后，用户可同时对选择的组件进行 移动 & 拉伸操作。

常见的设计工具中为了提升移动性能，减少终端算力，会在拖拽开始前 生成选择轮廓的 DOM 节点，再把选择的多个组件插入其中，这样多个组件拖拽时 实质上是在拖拽最外层的 选择轮廓节点。在拖拽完成后，会隐藏 外层轮廓节点，再为每个组件重新计算最终的移动位置。

不过对于搭建平台来说，因为多选的组件个数不会太多，同时一起移动 也不会太多负向影响。

具体移动的逻辑可参考镜像组件，会为选择的每个组件都生成镜像组件再移动。

需要注意的是 移动时的智能吸附 以及 组件插入 是根据选择轮廓的外层位置来判定的，可理解为 组件多选后 同时移动不再根据单个组件判定 而是根据整体轮廓来判定。

同时拉伸与移动同理，都是根据单个组件拉伸的规则，同时操作在多个组件上。

** 结束语 **

至此，我们可以在选择组件后进行操作了，回顾一下：

- 使用事件分发机制，感知到当前用户操作的组件。
- 通过快捷操作，文本编辑、组件旋转、增删组件的方式 提升搭建的效率。
- 可选择多个组件进行同时的移动编辑。

***
## 结束语

本文根据一个常见的搭建页面案例，梳理了搭建平台的核心实体-画布的技术难点。

当然对于一个成熟的编辑器而言，除了画布外，还有 设置器 与 生成器，不过碍于篇幅，敬请期待后续文章。

欢迎转载本站文章，请注明作者和出处  [SimonAKing](http://simonaking.com)。
