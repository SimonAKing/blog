# 漫谈编程语言

Date: 2021-01-30  
Author: SimonAKing  
Categories: 随笔  
Tags: 随笔, 编程语言, 总结  
Source: https://simonaking.com/blog/talking-about-programming-language/

> 漫谈编程语言，从编程语言的三大阵营到编程语言与语义学，编程范式，编程规范，编程语言的执行机制

---
编程语言，一种特殊的语言。
## 前言
本文来自于 我在公司内部的一次分享。

主要简述了编程语言的阵营，语义的表达形式，不同的思维范式，以及常见规范和执行机制。

## 正文

### 编程语言三种阵营

#### 学术派

> You are a poet and a mathematician. Programming is your poetry

语言代表：Haskell Lisp Scala Closure

学术阵营认为编程语言是一种思想的表达。

这些语言往往是从上向下去设计，从一个纯粹的理想角度对语言建模，它们充斥着各种概念: 函数式，类型系统，模式匹配...

它们痛斥操作系统，编译器带来的各种缺陷，所以在设计时 很少去考虑，甚至有的学术派语言 完全找不到相应概念的映射(Lisp)。

虽然它们的结构精妙 概念完美，但从实用角度上 完全不占优势。

主要原因有二：

1. 如果想熟悉学术派编程语言，就必须要先掌握它们背后的设计思想。

   就比如想掌握 Haskell，范畴论那套东西你绕不开，因为 Haskell 的基本组成单位就是 Functor。

2. 大部分学术派语言都认为编程的世界应该是“纯”的，它们反感副作用的出现，它们会为副作用的数据提供各种建模，让它们符合“纯”的定义。

有一个典型的例子，使用 Maybe 处理异常：

```haskell
divBy :: Integral a => a -> [a] -> Maybe [a]
divBy _ [] = Just []
divBy _ (0:_) = Nothing
divBy numerator (denom:xs) =
    case divBy numerator xs of
      Nothing -> Nothing
      Just results -> Just ((numerator `div` denom) : results)
```

但是操作系统就是一个副作用的产物。

用[垠神的话](http://www.yinwang.org/blog-cn/2015/04/03/paradigms)来说：没有副作用的语言，就像一个没有无线电，没有光的世界，所有的数据都必须通过实在的导线传递，这许多纷繁的电缆，必须被正确的连接和组织，才能达到需要的效果。

不过 它们对现代编程语言的发展做出了很大贡献，现代编程语言中的大多数特性都是来自这个阵营。

就比如 React 提倡的 State 数据不可变模型，reducer 的纯函数特性。

Rust 中的错误处理特性，Kotlin中的高阶类型等等。

#### 低层派

> You are a hacker. You make hardware dance to your tune

语言代表: C C++ Rust Assembly

计算机科学的先驱 Alan Perlis 给低层语言（low-level languages）下的定义是：

> “A programming language is low level when its programs require attention to the irrelevant.”

如果用一门语言编写的程序**需要处理不相关的东西**，那这就是一门低层语言。

低层阵营认为编程语言是运行在冯诺依曼机器上的机器码。

这些语言没有学术派语言"那些华丽的外衣"，它们是命令式语言与一点 操作系统/编译器抽象的结合。

虽然从编程角度来说很原始，但它们有最贴近魔法的能力，它们可直接操控内存，手动回收垃圾，从语法角度去进行编译优化，将操作系统/编译器的概念映射得淋漓尽致。

并且它们也是高级语言以及各种基础设施的缔造者。

不过为了有效地编程，必须时刻记住硬件和软件的概念，在往往会让开发者痛苦不堪。

最典型的 烫烫烫错误：

![低层派](./漫谈编程语言/error.png)

#### 应用派

> You are a maker. You build things for people to use

语言代表: JavaScript Python C# Swift Kotlin PHP

应用阵营认为编程语言是构建应用的一种工具。

这些语言往往是最贴近应用业务的，它们倾向于在特定环境下组合各种功能 模块，而不必太关心底层。

甚至有的应用级开发者，不需要懂操作系统，算法就可以设计出一款精美的应用。

因为在互联网的红利推动下，有很多基础设施已经被实现，所以应用级的开发者 很少在乎底层，这是件可怕的事。

就比如: Java里的Int是4个byte；但是Go里的Int却和机器的32bit还是64bit有关；到了JS里，压根就没有“整数”的概念，都是“number”。

现代的大部分应用都离不开这些语言，有趣的是，有些语言的最初设计很不规范，幸好它们的社区是最开发繁荣的。

### 编程语言与语义学

编程语言与语言密不可分，都是表达思想的一种工具。

谈起语言 就离不开语义，在编程语言中 语义最明显的表现就是 命名 以及 编程范式(下一章节)了。

#### 正反例子

举一些的例子:

JavaScript - 命名错误问题

```javascript
// 返回两数之和
function sub(a，b) { return a + b }
```

Python - API 设计问题

```python
# 返回 列表中 出现次数最多的数字
# 短短两行代码，做的事情全都隐藏起来了 为了简约 反而给开发者增加了心智负担
def most_frequent(lst):
  return max(set(lst)，key = lst.count)

most_frequent([1,2,1,2,3,2,1,4,2]) # 2
```

Kotlin - 正面例子

```kotlin
// 根据条件 划分数组
data class Person(val name: String，val age: Int)

fun main() {
  val members = listOf(
    Person("Ben"，85),
    Person("Mel"，7),
    Person("Lou"，15),
    Person("Sam"，22),
    Person("Ash"，10),
  )

  val (kids，adults) = members.partition { it.age < 18 }
}
```

#### 语义设计

可以看出，一个优秀的名称设计是有多么的重要，这里可以细谈一下，名称设计一般分为：

1. 内部变量命名
   - 表示数据
   - 表示状态

2. 函数命名

3. 特定领域命名(不涉及，因为一般都有规范，就比如 React 组件必须大写-骆驼峰)

命名内部数据变量的时候，用名词堆叠 再符合个命名规范就可以了。

比如:

```js
const page_count = 5
const should_update = true
const firstName = 'Gustavo'
const friends = ['Kate'，'John']
```

命名状态变量的时候，一般都是特定动词(has/should/can/is/...)+名词。

比如:

```js
const hasPagination = postCount > 10
const shouldDisplayPagination = postCount > 10
```

函数命名时，也是有一定规律的。

函数: 动词+名词堆叠+[副词]

而动词 完全可以把它枚举出来，这样大部分场景下，都可以拿来就用。

```js
addBalance getAccount filterActivityList patchEmails deleteUserById
removeItem [generate/gen]TagList fillTableHeader createFolder forEachFileList parseNodeTree updateUserInfo
extractUserInfo showTable hideIframe useDebounce toBase64 isSuccess canWrite requestModule loadScript fetchGalleryData setLanguage sendMessage querySelector findElement combineList importResource searchService renderComponent readFile onChange handleInput verifyFormData changeSettings cloneJSON appendSlice insertColumn saveConfig execCommand unloadPage destoryConnection openProgram
```

单个动词，一般都是 名词.动词，就比如 `AST.parse()`。

#### 中文编程

1. [文言文编程语言](https://github.com/wenyan-lang/wenyan)

   ```
   吾有一數。曰三。名之曰「甲」。
   為是「甲」遍。
     吾有一言。曰「「問天地好在。」」。書之。
   云云。
   ```

2. [东北编程语言](https://github.com/zhanyong-wan/dongbei/blob/master/doc/dongbei-ref.md)

3. [易网页](https://github.com/itorr/e/blob/master/index.html)

### 编程范式

不同的编程范式 代表了coding 时 不同的思考维度，下面将简述目前最流行的三种范式。

#### 结构式

> everything is command.

结构式编程是最符合冯诺依曼体系的范式，它告诉计算机如何去做事情。

它将逻辑划分成一个个语句，使用最淳朴的方式(循环，分支,顺序)排列起来，然后顺序执行。

[FizzBuzz](https://www.hackerrank.com/challenges/fizzbuzz/problem)程序的结构式实现：

> Write a short program that prints each number from 1 to 100 on a new line.
>
> For each multiple of 3，print "Fizz" instead of the number.
>
> For each multiple of 5，print "Buzz" instead of the number.
>
> For numbers which are multiples of both 3 and 5，print "FizzBuzz" instead of the number.

```go
package main

import (
    "fmt"
)

func main() {
    for i := 1; i <= 100; i++ {
        divBy3 := i%3 == 0
        divBy5 := i%5 == 0
        if divBy3 && divBy5 {
            fmt.Println("FizzBuzz")
        } else if divBy3 {
            fmt.Println("Fizz")
        } else if divBy5 {
            fmt.Println("Buzz")
        } else {
            fmt.Println(i)
        }
    }
}
```

很淳朴不是嘛。

#### 面向对象

> everything is object.

相信很多同学都学过有关面向对象的语言，在我们上课的时候，老师就常提起 面向对象的三大概念: 封装 继承 多态。

其实这个概念一直是错误的。

封装是一个很笼统的概念，函数就是一种封装；并且多态可以理解为向上转型，Python TypeScript 中的 ducking typing 就可以多态；目前看来只有继承是 OOP 的特性。

但 OOP 的主要概念真的是如此吗? 显然不是的。

OOP 主要是提供了一种模块化思想，面向对象范式只是语法层面的思想体现。

它在面向结构式上抽象，根据功能业务 对编程世界进行建模，把代码变成一个个以类为主的组成单元。

有趣的是 大行其道微服务，这两年兴起的微前端，以及底层的微内核 都是这种模块化思想。

在语法上 OOP 由于不支持 函数第一成员的特性，所有的逻辑都只能封装到类的方法中，调用逻辑时只能名词.动词()，这也是面向对象语言 给人造成繁琐的原因。

(其实我还想说，这也是为什么设计模式 这种常见概念能大行其道的原因)

```kotlin
class Point{
    var x:Int = 0
    var y:Int = 0
    operator fun plus(p: Point) {
        x += p.x
        y += p.y
    }
}

fun main(args: Array<String>) {
    val p = Point()
    p.x = 8
    p.y = 10
    val p1 = Point()
    p1.x = 2
    p1.y = 3

    val p2 = p + p1
    println("Point(x = ${p.x}，y = ${p.y})")
}
```

#### 函数式

> everything is lambda.

函数式编程是最符合人思维的范式，它告诉计算机 我们想要什么(声明式编程)。

一提到函数式，纯函数，无状态，数据不可变，副作用，惰性执行等等相关概念都不可避免。

我简述下：

1. 无状态: 不管何时运行，运行多少次，只要给定相同的输入，那输出结果一定是一致的，完全不依赖外部数据。
2. 数据不可变: 顾名思义，数据不可变化，如果想修改数据，那就创建一个新的数据。
3. 副作用: 指的是 函数修改了外部的状态，可以看出 如果保存了数据不可变型，那么函数自然而然就没有副作用了。
4. 纯函数: 如果一个函数保障了 无状态 数据不可变特性，那这个函数就是一个纯函数。

不依赖外部数据，不修改内部数据。

举例:

```javascript
const person = { name: 'SimonAKing' }

// 修改了内部数据
const changeName = (person，newName) => person.name = NewName

// 依赖了外部数据
const joinName = (text) => person.name + text
```

可以看出 函数式本身具备了一种防御性编程的规范。

而函数式编程的主要提供了什么？

答: 逻辑的组合映射 以及 行为上的分治思想(MapReduce)。

逻辑的组合映射，函数式编程语言提供了很多有关组合映射的工具函数：map、flatMap、foldl、foldr、reduce、filter、compose、partial、curring ..

当然在熟悉它们之前，你需要了解下 各种 Functor: 基本的Mappable函子、Pointed 函子、Maybe 函子、Monad函子等 以及 一些范畴论的知识。

一个简朴的函子:

```javascript
class Box {
  constructor(value) {
    this.value = value
  }
  map (fn) {
    return new Box(fn(this.value))
  }
}

const value = new Box(1).map(v => v + 1).map(v => v * 2)
```

行为上的分治思想：

给出快排的两种实现，大家可以体会下：

- 结构式:

```java
class QuickSort {
       private static void exch(int pos1,int pos2,List data){
             int tmp=data[pos1];
             data[pos1]=data[pos2];
             data[pos2]=tmp;
       }
       private static void partition (int lo,int hi，List a){
             if (lo<0||hi<0||lo>=hi-1){
                    return;
             }
             int midValue=a[lo];
             int i=lo+1;int j=hi;
             while (true){
                    while(i<hi&&a[i]<midValue){
                           i++;
                    }
                    while(j>lo&&a[j]>midValue){
                           j--;
                    }
                    if (i>=j) break;
                    exch(i,j,a);
             }
             exch(i,lo,a);
             partition(lo,i-1,a);
             partition(i+1,hi,a);

       }
       public static List sort(List a){
             int low=0; int hight=a.size()-1;
             partition(low，hight，a);
             return a;
       }
}
```

- 函数化:

```javascript
const quickSort = a => {
  if (!a.length) { return [] }

  return [
    ...quickSort(a.filter(e => e < a[0])),
    ...a.filter(e => e === a[0]),
    ...quickSort(a.filter(e => e > a[0]))]
}
```

就像章节开始所说的那样：结构式编程是最符合冯诺依曼体系的范式，它告诉计算机如何去做事情；函数式编程是最符合人思维的范式，它告诉计算机 我们想要什么。

具体选哪种范式，还是要根据场景来结合。

如果你的场景适合业务领域建模，很容易找到不同的模型以及模型间关系的话，那么 OOP 显然是最优的。

如果你的场景 主要是对数据的加工，就比如对一数组先排序再筛选 然后映射得到结果的话，FP 就很自然。



### 编程规范

#### SOLID 原则

1. S：单一职责原则

   一个模块只能做一件事。

2. O：开闭原则

   增加新功能时，模块应该是支持扩展的，而不是提倡修改，多态的最佳实践。

3. L：里氏替换原则

   子类必须可以替换它的超类，向下转型的最佳实践。

4. I：接口隔离原则

   接口设计时应该衡量细粒化，而不是设计一个笼统的接口。

5. D：依赖反转原则

   高级模块不应该依赖于低级模块。两者都应该依赖于抽象。

   抽象不应该依赖于细节。细节应该依赖于抽象。

   注入实现了相同接口的逻辑。

#### 防御性编程

防御性编程往往是从编程角度去提升工程质量，减少 Bug。

刚刚提到函数式语言的思想就很实用。

1. 拒绝写副作用代码

   不要与外部状态相互关联，尽量将所需数据全部输入。
   比如典型的副作用JS-API: sort，reverse，splice，最好能不用就不用。

2. 不要共享引用

   如果说 null 的设计是一亿美金的失误，那么 堆上对象共享引用 的设计可以算上得百亿美金的失误。
   如果遇到共享引用的变量情况，请不要碰它。

3. 尽量写纯函数

4. 尽量将数据流统一化

5. 统一语言规范，使用相同的 lint 工具，相同的语法规范

6. 容错处理，正视程序出现的每一个异常

7. API接口设计时 对输入尽可能的保持严谨，对输出保持开发

8. 不要相信网络请求，每一次网络请求都有可能失败

#### 抽象化原则

1. DRY - Don't Repeat Yourself

   尽量在项目中减少重复的代码。

2. KISS - Keep It Simple & Stupid

   代码应该保持简单易懂。

3. YAGNI - You Ain’t Gonna Need It

   不要进行过度化设计，会延缓开发效率。

### 编程语言如何执行

#### 编译型语言

编译型语言是将源代码经过词法分析，语法分析，生成 AST，然后在转成中间代码的形式，经过优化器优化后 再生成目标机器的机器码。

优化涉及到的一些点：

1. 去掉无意义的数据 (无法运行到的代码，没有利用的数据)
2. 内联函数，尾递归优化
3. 解语法糖
4. ...

代表语言: C，C++，Go

#### 解释型语言

解释型语言，不能直接生成机器码，而是先翻译成中间代码，再有解释器对中间代码进行解释运行。

代表语言: Python，Lua

#### 解释编译型语言

由于即时编译技术(JIT)的存在，可以将热点代码直接编译成字节码 来提高程序执行的效率，越来越多的语言开始使用，就比如最近推出的 [Ruby3](https://www.ruby-lang.org/en/news/2020/12/25/ruby-3-0-0-released/)。

JavaScript 也是一个很好的例子。

> V8 运行 JS 的过程

1. 源代码(source code) 通过解析器(parser) 解析后 生成抽象语法树(AST)。
2. 抽象语法树 通过 解释器(interpreter-Ignition) 生成了字节码(bytecode)，此字节码作为基准执行模型，字节码等同于 25%-50% 机器码大小。 并且 此时抽象语法树被彻底清除掉了，释放其内存空间。
3. 生成后的字节码 直接被 解释器执行 (解释执行)。
4. 在代码不断的运行过程中，解释器收集到了很多可以优化代码的信息，比如变量的类型，哪些函数执行的频率较高。
5. V8引擎的编译器(compiler-TruboFan) 会根据这些信息和字节码 来编译出经过优化的机器代码。

一些常见的优化规则：

- 函数只是声明未被调用，那么该函数不会生成到 AST
- 函数如果只被调用一次，字节码则直接被解释执行了
- 如果函数被调用多次，可能会被标记为热点函数，会被编译成机器代码

随着不断执行，会有越来越多的代码被标记为热点代码，然后被编译成机器码。

所以 JS 运行的过程 正是一个从解释执行到编译执行的过程。

注意在某些情况下，优化后的机器代码可能会被逆向还原成字节码。

```javascript
const sum = (a,b) => a + b

sum(1,2)
// 假设调用了多次 sum 函数
// sum 函数在编译器优化后的机器码 将是 int 类型的参数

sum('1'，'2')
// 此时 参数的类型发生变化，V8 将会发生 deoptimization 的过程
// 机器码不知道如何处理 string 类型参数，也就是回退到字节码，由解释器解释执行
// 所以 coding 时，热点函数不要随便改变类型
```

### 未来编程语言设想

1. 完全不涉及编译器的概念
2. 语义设计优秀，写代码就像写诗一样
3. 无 GC
4. 强类型系统，支持强大类型建模
5. 各领域都有对应的丰富生态
6. 优雅错误处理，强行让开发者正视逻辑错误，可是忽视潜在错误
7. 强大的工具链，具有比较统一的编程风格，lint 工具，包管理器
8. 可以完全利用多核的能力
9. 可以面向 GPU 编程
10. 支持多种编程范式
11. 跨平台，无需虚拟机，可编译成机器码
12. 在语法层面提供并发原语

### 推荐阅读

- [3 tribes of programming](https://josephg.com/blog/3-tribes/)
- [编程的宗派](http://www.yinwang.org/blog-cn/2015/04/03/paradigms)
- [思考的价值-PL](https://thinking.simonaking.com/tags/pl/index)
- [思考的价值-Coding](https://thinking.simonaking.com/tags/coding)
- [前端 DSL 实践指南（上）—— 内部 DSL](https://zhuanlan.zhihu.com/p/107947462)
- [Learn Advanced TypeScript Types](https://medium.com/free-code-camp/typescript-curry-ramda-types-f747e99744ab)
- [Java即时编译器原理解析及实践](https://tech.meituan.com/2020/10/22/java-jit-practice-in-meituan.html)
- [函数式编程进阶：杰克船长的黑珍珠号](https://musicfe.dev/javascript-functional-programming-advance/)
- [编程的智慧](http://www.yinwang.org/blog-cn/2015/11/21/programming-philosophy)


***
## 结束语

欢迎转载本站文章，请注明作者和出处  [SimonAKing](http://simonaking.com)。
