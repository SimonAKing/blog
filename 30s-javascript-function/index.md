# 30s 源码刨析系列之函数篇

Date: 2020-03-01  
Author: SimonAKing  
Categories: 源码  
Tags: 源码, JavaScript, 函数式  
Source: https://simonaking.com/blog/30s-javascript-function/

> 30secondsofcode 源码深入解析之 JavaScript 函数篇, 里面覆盖了大量函数式案例,由浅入深逐个击破各个代码片段, 带你领略源码之美

---
由浅入深、逐个击破 [30SecondsOfCode](https://www.30secondsofcode.org/js/t/function/p/1/) 中函数系列所有源码片段，带你领略源码之美。
## 前言

本系列是对名库 [30SecondsOfCode](https://www.30secondsofcode.org/) 的深入刨析。

本篇是其中的函数篇，可以在极短的时间内培养你的函数式思维。

内容根据源码的难易等级进行排版，目录如下：

1. 新手级
2. 普通级
3. 专家级



## 正文

### 新手级

#### checkProp

```js
const checkProp = (predicate, prop) => obj => !!predicate(obj[prop]);

const lengthIs4 = checkProp(l => l === 4, 'length');
lengthIs4([]); // false
lengthIs4([1, 2, 3, 4]); // true
lengthIs4(new Set([1, 2, 3, 4])); // false (Set uses Size, not length)

const session = { user: {} };
const validUserSession = checkProp(u => u.active && !u.disabled, 'user');

validUserSession(session); // false

session.user.active = true;
validUserSession(session); // true

const noLength = checkProp(l => l === undefined, 'length');
noLength([]); // false
noLength({}); // true
noLength(new Set()); // true
```

作用：检查参数是否存在给定的属性。

解析：给定一个检查函数，和所需检查的属性名，返回一个函数。可通过调用 返回的函数，去判定 传入的对象参数是否符合检查函数。

#### functionName

```js
const functionName = fn => (console.debug(fn.name), fn);

functionName(Math.max); // max (logged in debug channel of console)
```

作用：打印函数名。

解析：使用`console.debug`API 和函数的`name`属性，把 函数类型参数的名字 打印到控制台的debug channel中。

#### negate

```js
const negate = func => (...args) => !func(...args);

[1, 2, 3, 4, 5, 6].filter(negate(n => n % 2 === 0)); // [ 1, 3, 5 ]
```

作用：反转 谓词函数（返回类型为布尔的函数）的返回结果。

解析：假设有一谓词函数为`func = args => bool`，我们想要反转其结果，便可对它的调用方式进行进一步的抽象，把反转结果的逻辑放置抽象中。

在本函数中，只需要一个 逻辑非运算符`!func(...args)`。

而扩展运算符`...`是对参数的抽象，代表的是传入的所有参数，我们要将所有参数一个不差地传递，不可破环 谓词函数的“纯洁性”。

#### unary

```js
const unary = fn => val => fn(val);

['6', '8', '10'].map(unary(parseInt)); // [6, 8, 10]
```

作用：参数函数调用时 只接受 参数函数的第一个参数，忽略其他参数。

解析：包装一个函数，并不做任何处理：`wrap = fn => (...args) => fn(...args)`

很显然，如果想对传入的参数进行处理，只需对`args`动刀，而本例直接使用了单独的一个变量，忽略了其他参数。

### 普通级

#### ary

```js
const ary = (fn, n) => (...args) => fn(...args.slice(0, n));

const firstTwoMax = ary(Math.max, 2);
[[2, 6, 'a'], [6, 4, 8], [10]].map(x => firstTwoMax(...x)); // [6, 6, 1
```

作用：参数函数调用时 只接受 参数函数的前 n 个参数，忽略其他参数。

解析：和上列逻辑如出一辙，只不过处理参数的逻辑换成了`...args.slice(0, n)`，只要前n个。

#### attempt

```js
const attempt = (fn, ...args) => {
  try {
    return fn(...args);
  } catch (e) {
    return e instanceof Error ? e : new Error(e);
  }
};

var elements = attempt(function(selector) {
  return document.querySelectorAll(selector);
}, '>_>');
if (elements instanceof Error) elements = []; // elements = []
```

作用：对 参数函数 进行异常捕获，如果有异常则抛出。

解析：对 参数函数 进行进一步封装，本例封装的逻辑是`try catch`，即捕获参数函数的异常。

很久之前，我看到过一个关于`java8`的 attempt 片段，里面还增加了重试逻辑。

js 实现代码如下:

```js
const attempt = (fn, ...args, count, bound) => {
  try {
    return fn(...args);
  } catch (e) {
    if(count == bound){
      return e instanceof Error ? e : new Error(e);
    }
    return attempt(fn, ...args, count + 1, bound)
  }
};
```

#### bind

```js
const bind = (fn, context, ...boundArgs) => (...args) => fn.apply(context, [...boundArgs, ...args]);

function greet(greeting, punctuation) {
  return greeting + ' ' + this.user + punctuation;
}
const freddy = { user: 'fred' };
const freddyBound = bind(greet, freddy);
console.log(freddyBound('hi', '!')); // 'hi fred!'
```

作用：原生API-`bind`的另一种实现。

`fn.bind(context,...args)` => `bind(fn,context,...args)`

[MDN 关于 bind 的解释](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)：

> `bind()` 方法创建一个新的函数，在 `bind()` 被调用时，这个新函数的 `this` 被指定为 `bind()` 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。

解析：首先，使用了`apply`将给定的 上下文参数 应用于 参数函数。

其次，利用 apply 只接受数组作为参数的规定，将最初传入的参数，和后续传入的参数按顺序合并在一个数组中传递进去。

#### bindKey

```js
const bindKey = (context, fn, ...boundArgs) => (...args) =>
  context[fn].apply(context, [...boundArgs, ...args]);

const freddy = {
  user: 'fred',
  greet: function(greeting, punctuation) {
    return greeting + ' ' + this.user + punctuation;
  }
};
const freddyBound = bindKey(freddy, 'greet');
console.log(freddyBound('hi', '!')); // 'hi fred!'
```

作用：把上列中的`fn`换成了`context[fn]`。

解析：我们原来的 参数函数 变成了一个 上下文参数的一个属性，而将这个属性依附于上下文对象就成了一个函数`context[fn]`。

可以说，这个一个调用方式特殊的`bind`。

#### call

```js
const call = (key, ...args) => context => context[key](...args);

Promise.resolve([1, 2, 3])
  .then(call('map', x => 2 * x))
  .then(console.log); // [ 2, 4, 6 ]
const map = call.bind(null, 'map');
Promise.resolve([1, 2, 3])
  .then(map(x => 2 * x))
  .then(console.log); // [ 2, 4, 6 ]
```

作用：动态改变函数执行的上下文。

解析：给定一个属性参数，再给定一组调用参数，返回一个接受上下文对象的函数，并最终组合调用。

其实这里面暗含了一个约束，很显然，`context[key]`必须是一个函数。

这个片段本质是对上下文的抽象。举个例子：

```javascript
const filterMen = call('filter', person => person.sex === 'man')

filterMen([{sex:'woman',...},{sex:'man',...},...])
// 如果有其他 上下文对象，本例中也就是数组 需要相同的 逻辑过滤呢？
```

#### chainAsync

```js
const chainAsync = fns => {
  let curr = 0;
  const last = fns[fns.length - 1];
  const next = () => {
    const fn = fns[curr++];
    fn === last ? fn() : fn(next);
  };
  next();
};

chainAsync([
  next => {
    console.log('0 seconds');
    setTimeout(next, 1000);
  },
  next => {
    console.log('1 second');
    setTimeout(next, 1000);
  },
  () => {
    console.log('2 second');
  }
]);
```

作用：将 函数数组转换为有决策权的链式函数调用。

我为什么称之有决策权的链式函数调用呢？

因为每个函数都会接受一个next方法参数，它代表的就是调用链中的下一个函数，所以什么时候调用下一个函数，要不要调用，决策权在你。

解析：其实这个片段很简单。

首先，`fns` 类型一个函数数组，其中除了最后一个函数都有隐含的约束，可以选择接受 next 参数。

而 next 参数的含义就是调用链中的下一个函数，说白了 就是数组中的下一个成员。

而最后一个函数是无参函数。

片段中复杂点在于：利用闭包存储了两个关键变量。

第一个是 调用链中的函数游标:`curr`；第二个是结束标志，最后一个函数:`last`。

每次链式向下调用前，都会进行一些逻辑处理：

```javascript
const next = () => {
  const fn = fns[curr++];
  fn === last ? fn() : fn(next);
};
```

先取出当前游标所在函数，再把游标指向下一个函数。

然后，判断是否是最后一个函数，是则直接调用，结束；反之，传入 next 调用。

如果，你是一个后端开发者，可以把其理解为中间件的工作模式。

#### collectInto

```js
const collectInto = fn => (...args) => fn(args);

const Pall = collectInto(Promise.all.bind(Promise));
let p1 = Promise.resolve(1);
let p2 = Promise.resolve(2);
let p3 = new Promise(resolve => setTimeout(resolve, 2000, 3));
Pall(p1, p2, p3).then(console.log); // [1, 2, 3] (after about 2 seconds)
```

作用：将接受数组的函数更改为接受可变参数。

分析：利用了扩展运算符的性质，`...args`代表的是所有参数组成的数组，然后将这数组传递进去调用。

可别小看了这一片段，调用方式的改变会决定很多上层逻辑。

平常我们大概率都会，建立一个数组，收集所需的异步函数。

在本例中，很明显的看到 从参数为数组类型的约束 中解放了出来。

#### compose

```js
const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));

const substract3 = x => x - 3;
const add5 = x => x + 5;
const multiply = (x, y) => x * y;
const multiplyAndAdd5AndSubstract3 = compose(
  substract3,
  add5,
  multiply
);
multiplyAndAdd5AndSubstract3(5, 2); // 12
```

作用：将传入的多个[异步]函数以组合的方式 调用。

先将参数传入最后一个[异步]函数，然后将得到的结果，传入倒数第二个[异步]函数，以此类推。

`compose`可以说是函数式编程的经典片段。

它的具体意义可以说是逻辑分层。像洋葱一样，一层一层地处理数据。

解析：fns 代表的是 传入的多个函数 组成的数组。

利用`reduce`方法实现函数的“洋葱”包裹。

因为这种逻辑语义表示效果不好，就直接上上面例子的代码流程了。

```
reduce 第一次循环:
f: substract3;
g: add5;
返回结果：(...args) => substract3(add5(...args));

reduce 第二次循环：
f: (...args) => substract3(add5(...args));
g: multiply;
返回结果：
(...args1) => ((...args2) => substract3(add5(...args2)))(multiply(...args1))
优化后:
(...args) => substract3(add5(multiply(...args)));
循环下去，以此类推...

最后的返回的形式：
(...args) => 第一个函数(第二个函数(第三个函数(...最后一个函数(...args))))
```

PS: 说实话，我并不喜欢 compose，在上例中就可以很明显的看到缺点。

把很多函数组合起来，第一是缺少语义化，与之对应的例子就是 Promise 的 then 调用链，语义鲜明；

第二是无法添加函数与函数之间的抽象逻辑，只能一次写好。

第三是各个函数之间存在隐含的参数约束，很可怕的。

#### composeRight

```js
const composeRight = (...fns) => fns.reduce((f, g) => (...args) => g(f(...args)));

const add = (x, y) => x + y;
const square = x => x * x;
const substract3 = x => x - 3;
const addAndSquare = composeRight(add, square,substract3);
addAndSquareAndSubstract3(1, 2); // 6
```

作用：将传入的多个[异步]函数以组合的方式 调用。

先将参数传入第一个[异步]函数，然后将得到的结果，传入第二个[异步]函数，以此类推。

#### converge

```js
const converge = (converger, fns) => (...args) => converger(...fns.map(fn => fn.apply(null, args)));

const average = converge((a, b) => a / b, [
  arr => arr.reduce((a, v) => a + v, 0),
  arr => arr.length
]);
average([1, 2, 3, 4, 5, 6, 7]); // 4
```

作用：将 函数数组的返回结果 传递到`converger`函数，进一步处理，可用作分析统计。

解析: 使用`map` 和`apply`将参数数据传递给每个处理函数，并将处理后的结果交给`converger`函数。

#### curry

```js
const curry = (fn, arity = fn.length, ...args) =>
  arity <= args.length ? fn(...args) : curry.bind(null, fn, arity, ...args);

curry(Math.pow)(2)(10); // 1024
curry(Math.min, 3)(10)(50)(2); // 2
```

作用：函数柯里化。

柯里化不管在是函数式思维的理解，还是现实面试中，都非常的重要。

[维基百科上 柯里化的解释](https://zh.wikipedia.org/wiki/%E6%9F%AF%E9%87%8C%E5%8C%96)：

> 把接受多个[参数](https://zh.wikipedia.org/wiki/參數_(程式設計))的[函数](https://zh.wikipedia.org/wiki/函数)变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数

解析：这个`bind`用得真是神了，借助它积累每次传进来的参数，等到参数足够时，再调用。

#### debounce

```js
const debounce = (fn, ms = 0) => {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

window.addEventListener(
  'resize',
  debounce(() => {
    console.log(window.innerWidth);
    console.log(window.innerHeight);
  }, 250)
); // Will log the window dimensions at most every 250ms
```

作用：函数防抖。

[什么是防抖和节流？有什么区别？如何实现？](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/5) 一文中关于防抖解释：

> 触发高频事件后n秒内函数只会执行一次，如果n秒内高频事件再次被触发，则重新计算时间。

同样，防抖也是面试必考的点。

解析: 传入需防抖的函数，和防抖的时间间隔，返回一个已防抖化的函数。

主要借助`setTimeout`和`function + apply`保存上下文完成。

每次调用函数前，都执行一遍`clearTimeout`，保证重新计算调用时间。

无论是调用多么频繁的函数都会在指定时间的间隔后只运行一次。

#### defer

```js
const defer = (fn, ...args) => setTimeout(fn, 1, ...args);

// Example A:
defer(console.log, 'a'), console.log('b'); // logs 'b' then 'a'

// Example B:
document.querySelector('#someElement').innerHTML = 'Hello';
longRunningFunction(); // Browser will not update the HTML until this has finished
defer(longRunningFunction); // Browser will update the HTML then run the function
```

作用：推迟调用函数，直到清除当前调用堆栈。

可适用于推迟 cpu 密集型计算，以免阻塞渲染引擎工作。

分析：使用`setTimeout`（超时时间为1ms）将 函数参数 添加到浏览器事件队列末尾。

因为 JavaScript 是单线程执行，先是主线程执行完毕，然后在读取事件队列中的代码执行。

如果主线程有运行时间太长的函数，会阻塞页面渲染，所以将其放置到事件队列。

#### delay

```js
const delay = (fn, wait, ...args) => setTimeout(fn, wait, ...args);

delay(
  function(text) {
    console.log(text);
  },
  1000,
  'later'
); // Logs 'later' after one second.
```

作用：延迟函数执行。

是的，它和`defer`非常像，但使用场景却是不一样。

defer 的目的是将占据主线程时间长的函数推迟到事件队列。

而 delay 只是字面意思，延迟执行。

解析：对 `setTimeout` 进行语义化封装。

#### flip

```js
const flip = fn => (first, ...rest) => fn(...rest, first);

let a = { name: 'John Smith' };
let b = {};
const mergeFrom = flip(Object.assign);
let mergePerson = mergeFrom.bind(null, a);
mergePerson(b); // == b
b = {};
Object.assign(b, a); // == b
```

作用：对 参数函数 的输入数据进行进一步处理，将数据的第一个参数与其余参数位置对调。

解析：主要利用 扩展运算符的性质，对参数的位置进行调整。

如果你不了解这一语言特性，可参考阮一峰老师的[ES6入门](https://es6.ruanyifeng.com/#docs/destructuring)。

#### hz

```js
const hz = (fn, iterations = 100) => {
  const before = performance.now();
  for (let i = 0; i < iterations; i++) fn();
  return (1000 * iterations) / (performance.now() - before);
};

// 10,000 element array
const numbers = Array(10000)
  .fill()
  .map((_, i) => i);

// Test functions with the same goal: sum up the elements in the array
const sumReduce = () => numbers.reduce((acc, n) => acc + n, 0);
const sumForLoop = () => {
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) sum += numbers[i];
  return sum;
};

// `sumForLoop` is nearly 10 times faster
Math.round(hz(sumReduce)); // 572
Math.round(hz(sumForLoop)); // 4784
```

作用：返回函数每秒执行一次的次数。

hz是赫兹的单位（频率的单位）定义为每秒一个周期。

解析：通过两次使用`performance.now`获取`iterations`次迭代前后的毫秒差。

然后将毫秒转换为秒并除以经过的时间，可以得到每秒的函数执行次数。

PS: 此处，并没有太好的个人理解，翻译自[官方](https://www.30secondsofcode.org/js/s/hz/)。

#### once

```js
const once = fn => {
  let called = false;
  return function(...args) {
    if (called) return;
    called = true;
    return fn.apply(this, args);
  };
};

const startApp = function(event) {
  console.log(this, event); // document.body, MouseEvent
};
document.body.addEventListener('click', once(startApp)); // only runs `startApp` once upon click
```

作用：确保一个函数只被调用一次。

分析：因为 JavaScript 是单线程执行环境，不需要考虑并发环境，直接一个内部变量存到闭包中，每次调用前判断，并在第一次调用时，修改其值，让后续调用全部失效。

给你看一下 Go 的 once，官方是通过`atomic`库实现的：

```go
package sync

import (
    "sync/atomic"
)

type Once struct {
    m    Mutex
    done uint32
}

func (o *Once) Do(f func()) {
    if atomic.LoadUint32(&o.done) == 1 {
        return
    }
    o.m.Lock()
    defer o.m.Unlock()
    if o.done == 0 {
        defer atomic.StoreUint32(&o.done, 1)
        f()
    }
}
```

#### over

```js
const over = (...fns) => (...args) => fns.map(fn => fn.apply(null, args));

const minMax = over(Math.min, Math.max);
minMax(1, 2, 3, 4, 5); // [1,5]
```

作用：利用函数数组，对接下来的输入数据进行处理，得到每个函数处理后的结果数组。

解析：使用`map`和`apply`将输入的数据传递到每个函数中进行处理。

#### overArgs

```js
const overArgs = (fn, transforms) => (...args) => fn(...args.map((val, i) => transforms[i](val)));

const square = n => n * n;
const double = n => n * 2;
const fn = overArgs((x, y) => [x, y], [square, double]);
fn(9, 3); // [81, 6]
```

作用：利用 transforms 函数数组，分别处理相应位置的输入数据，并把结果传递进给定函数。

解析：transforms 函数数组 和参数必须位置对应，这个约束有点强啊。

#### partial

```js
const partial = (fn, ...partials) => (...args) => fn(...partials, ...args);

const greet = (greeting, name) => greeting + ' ' + name + '!';
const greetHello = partial(greet, 'Hello');
greetHello('John'); // 'Hello John!'
```

作用：将调用函数的数据分为两次输入，并按正序调用。

解析：两次使用扩展运算符（...），保存不同时期的数据，最后调用。

#### partialRight

```js
const partialRight = (fn, ...partials) => (...args) => fn(...args, ...partials);

const greet = (greeting, name) => greeting + ' ' + name + '!';
const greetJohn = partialRight(greet, 'John');
greetJohn('Hello'); // 'Hello John!'
```

作用：将调用函数的数据分为两次输入，并按反序调用。

解析：两次使用扩展运算符（...），保存不同时期的数据，最后调用。

#### pipeAsyncFunctions

```js
const pipeAsyncFunctions = (...fns) => arg => fns.reduce((p, f) => p.then(f), Promise.resolve(arg));

const sum = pipeAsyncFunctions(
  x => x + 1,
  x => new Promise(resolve => setTimeout(() => resolve(x + 2), 1000)),
  x => x + 3,
  async x => (await x) + 4
);
(async () => {
  console.log(await sum(5)); // 15 (after one second)
})();
```

作用：将传入的多个[异步]函数按照正序 依次调用。

解析：结合`reduce`和`Promise.then`，将数据按照正序传递到每个[异步]函数,进行处理，处理的结果又传给下一个[异步]函数，以此类推。

#### promisify

```js
const promisify = func => (...args) =>
  new Promise((resolve, reject) =>
    func(...args, (err, result) => (err ? reject(err) : resolve(result)))
  );

const delay = promisify((d, cb) => setTimeout(cb, d));
delay(2000).then(() => console.log('Hi!')); // // Promise resolves after 2s
```

作用：将回调函数改为`Promise`方式处理结果。

在 Node8+ ，你可以使用*`util.promisify`*

解析：首先接受给定的回调函数，然后直接在 Promise 中调用该函数。

因为回调函数的结果按照规范永远是最后一个参数，我们只需要在函数调用时，把最后一个参数换成 Promise 的方式，即：如果回调函数出现错误则 reject，反之 resolve。

注意：被 promisify 的函数必须接受回调参数且后续会调用。

#### rearg

```js
const rearg = (fn, indexes) => (...args) => fn(...indexes.map(i => args[i]));

var rearged = rearg(
  function(a, b, c) {
    return [a, b, c];
  },
  [2, 0, 1]
);
rearged('b', 'c', 'a'); // ['a', 'b', 'c']
```

作用：根据指定的索引重新排列传入的参数。

解析：利用`map`结合扩展运算符，重新排列传入的参数，并将转换后的参数传递给fn。

#### runPromisesInSeries

```js
const runPromisesInSeries = ps => ps.reduce((p, next) => p.then(next), Promise.resolve());

const delay = d => new Promise(r => setTimeout(r, d));
runPromisesInSeries([() => delay(1000), () => delay(2000)]);
// Executes each promise sequentially, taking a total of 3 seconds to complete
```

作用：按照正序 运行给定的多个返回类型为 Promise 函数。

解析：使用`reduce`创建一个Promise链，每次运行完一个传入的 Promise，都会返回最外部的`Promise.then`，从而进行下一次调用。

#### sleep

```js
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function sleepyWork() {
  console.log("I'm going to sleep for 1 second.");
  await sleep(1000);
  console.log('I woke up after 1 second.');
}
```

作用: 延迟异步函数的执行。

解析：创建一个接受毫秒数的函数，并结合`setTimeout`，在给定的毫秒数后，返回一个`resolve`状态的Promise。

使用场景：利用异步函数的“同步”机制(await)，使其在异步函数中达到“睡眠”的效果。

#### spreadOver

```js
const spreadOver = fn => argsArr => fn(...argsArr);

const arrayMax = spreadOver(Math.max);
arrayMax([1, 2, 3]); // 3
```

作用：将接受可变参数的函数更改为接受数组。

如果你认真读了文章，就会发现这是`collectInto`函数的反模式。

分析：利用了扩展运算符的性质，将传递进来的数组解构再交给处理函数。

#### times

```js
const times = (n, fn, context = undefined) => {
  let i = 0;
  while (fn.call(context, i) !== false && ++i < n) {}
};

var output = '';
times(5, i => (output += i));
console.log(output); // 01234
```

作用：将给定的函数，迭代执行n次。

分析：使用`Function.call`迭代调用给定的函数，并把迭代的次数传进函数第一个参数。

如果函数返回 false 可提前退出。

#### uncurry

```js
const uncurry = (fn, n = 1) => (...args) => {
  const next = acc => args => args.reduce((x, y) => x(y), acc);
  if (n > args.length) throw new RangeError('Arguments too few!');
  return next(fn)(args.slice(0, n));
};

const add = x => y => z => x + y + z;
const uncurriedAdd = uncurry(add, 3);
uncurriedAdd(1, 2, 3); // 6
```

作用：函数反柯里化。

柯里化是将接受多个[参数](https://zh.wikipedia.org/wiki/參數_(程式設計))的[函数](https://zh.wikipedia.org/wiki/函数)变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数。

而反柯里化就是将多个接受参数的层层函数，铺平。

解析：反柯里化的关键代码在于 `args.reduce((x, y) => x(y), acc)`。

```
在上例中,
args: [1,2,3]
acc: x => y => z => x + y + z

第一次循环：
x：x => y => z => x + y + z
y：1
返回结果：y => z => 1 + y + z

第二次循环:
x: y => z => 1 + y + z
y: 2
返回结果：z => 1 + 2 + z

最后一次循环的结果，即 1 + 2 +3
```

可以看出，每次一循环，都会利用闭包”填充”一个所需变量。

返回的结果分为两种情况：

一是 一个保留了 n 个前置参数的函数。

二是层叠函数中最后一个函数的返回结果。

值得一提的是，在源码中使用了`slice(0，n)`保留适当数量的参数。

如果提供的参数的个数小于给定的解析长度，就会抛出错误。

#### unfold

```js
const unfold = (fn, seed) => {
  let result = [],
    val = [null, seed];
  while ((val = fn(val[1]))) result.push(val[0]);
  return result;
};

var f = n => (n > 50 ? false : [-n, n + 10]);
unfold(f, 10); // [-10, -20, -30, -40, -50]
```

作用：使用种子值以及特殊的数据存储与迭代方式构建一个数组。

解析: 我为什么说数据存储与迭代方式很特殊呢？

迭代的变量与结果值，保存在同一数组里，用01下标区分。

而迭代的函数，也需要满足这一规范，返回同样的数组[value，nextSeed]，保证下一次迭代，或者返回false终止过程。

#### when

```js
const when = (pred, whenTrue) => x => (pred(x) ? whenTrue(x) : x);

const doubleEvenNumbers = when(x => x % 2 === 0, x => x * 2);
doubleEvenNumbers(2); // 4
doubleEvenNumbers(1); // 1
```

作用：根据`pred`函数测试给定数据。如结果为真，则执行`whenTrue`函数；反之，返回数据。

解析: 我喜欢语义化的封装，可大幅提升代码的可读性，减少逻辑负担。

### 专家级

#### memoize

```js
const memoize = fn => {
  const cache = new Map();
  const cached = function(val) {
    return cache.has(val) ? cache.get(val) : cache.set(val, fn.call(this, val)) && cache.get(val);
  };
  cached.cache = cache;
  return cached;
};

// See the `anagrams` snippet.
const anagramsCached = memoize(anagrams);
anagramsCached('javascript'); // takes a long time
anagramsCached('javascript'); // returns virtually instantly since it's now cached
console.log(anagramsCached.cache); // The cached anagrams map
```

作用：为给定的函数添加缓存功能。

解析: 通过实例化一个新的`Map`对象来创建一个空的缓存。

并对函数的调用进一步的封装，如果调用时，传入了一个之前已经传递过的参数，将从缓存中直接返回结果，执行时间为O(1)；如果是首次传递，则需运行函数，将得到结果缓存，并返回。

其实，我们还可以借助这个片段，看到一丝 JavaScript 语法的残缺。

到目前为止，一个社区公认的私有属性语法都没有，TC39 一直提议用`#`号，并阐述了很多原因、声明。

哎，说白了，就是 JavaScript 从一开始设计的失误，到现在已经无法挽回了。

#### throttle

```js
const throttle = (fn, wait) => {
  let inThrottle, lastFn, lastTime;
  return function() {
    const context = this,
      args = arguments;
    if (!inThrottle) {
      fn.apply(context, args);
      lastTime = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFn);
      lastFn = setTimeout(function() {
        if (Date.now() - lastTime >= wait) {
          fn.apply(context, args);
          lastTime = Date.now();
        }
      }, Math.max(wait - (Date.now() - lastTime), 0));
    }
  };
};

window.addEventListener(
  'resize',
  throttle(function(evt) {
    console.log(window.innerWidth);
    console.log(window.innerHeight);
  }, 250)
); // Will log the window dimensions at most every 250ms
```

作用: 函数节流。

[什么是防抖和节流？有什么区别？如何实现？](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/5) 一文中关于防抖解释：

> 高频事件触发，但在 n 秒内只会执行一次，所以节流会稀释函数的执行频率。

同样，节流也是面试必考的点。

解析：第一次执行时，立即执行给定函数，保存当前的时间，并设置标记变量。

标记变量主要用于判断是否第一次调用，如果是第一次则立刻运行。

反之不是第一次运行，过了等待的毫秒后才可继续运行。

主要逻辑是每次运行前先清除上一个的定时器，然后计算出上一次运行的时间与给定的运行间隔所差的毫秒数，并利用其数据新建一个定时器运行。

定时器里的函数除了调用给定函数，还会更新上一次运行的时间变量。

节流的实现，网上的文章有很多版本，但多少都有点瑕疵。



***
## 结束语

呼，花了很长的时间，终于搞定了这篇文章。

以后的 30s 源码刨析系列会挑选一些源码片段去解析，而不是针对某一分类了。

本篇文章涉及了我的一些思考，希望能对你有帮助。

欢迎转载本站文章，请注明作者和出处  [SimonAKing](http://simonaking.com)。
