# Go 开发中的十大常见陷阱[译]

Date: 2019-08-17  
Author: SimonAKing  
Categories: 后端  
Tags: 后端, 译文, Go  
Source: https://simonaking.com/blog/the-top-10-most-common-mistakes-ive-seen-in-go-projects/

> Go开发中的十大常见陷阱

---
Golang中要注意的陷阱和常见错误。
## 前言
原文: [The Top 10 Most Common Mistakes I’ve Seen in Go Projects](https://itnext.io/the-top-10-most-common-mistakes-ive-seen-in-go-projects-4b79d4f6cd65#e9ba)

作者: [Teiva Harsanyi](https://itnext.io/@teivah?source=post_page-----4b79d4f6cd65----------------------)

翻译许可:

![image-20210118234116954](./Go开发中的十大常见陷阱-译/permit.png)

![Go开发中的十大常见陷阱[译] · 前言](./Go开发中的十大常见陷阱-译/1.jpeg)

我在Go开发中遇到的十大常见错误。*顺序无关紧要。*

## 正文
### 未知的枚举值

让我们看一个简单的例子:

```go
type Status uint32

const (
  StatusOpen Status = iota
  StatusClosed
  StatusUnknown
)
```

在这里，我们使用iota创建了一个枚举，其结果如下：

```
StatusOpen = 0
StatusClosed = 1
StatusUnknown = 2
```



现在，让我们假设这个`Status`类型是JSON请求的一部分，将被`marshalled/unmarshalled`。

我们设计了以下结构：

```go
type Request struct {
  ID        int    `json:"Id"`
  Timestamp int    `json:"Timestamp"`
  Status    Status `json:"Status"`
}
```

然后，接收这样的请求：

```json
{
  "Id": 1234,
  "Timestamp": 1563362390,
  "Status": 0
}
```

这里没有什么特别的，状态会被`unmarshalled`为`StatusOpen`。

然而，让我们以另一个未设置状态值的请求为例:

```json
{
  "Id": 1235,
  "Timestamp": 1563362390
}
```

在这种情况下，请求结构的`Status`字段将初始化为它的零值(对于`uint32`类型:0)，因此结果将是`StatusOpen`而不是`StatusUnknown`。



那么最好的做法是**将枚举的未知值设置为0**：

```go
type Status uint32

const (
  StatusUnknown Status = iota
  StatusOpen
  StatusClosed
)
```

如果状态不是JSON请求的一部分，它将被初始化为`StatusUnknown`，这才符合我们的期望。



### 自动优化的基准测试

基准测试需要考虑很多因素的,才能得到正确的测试结果。



一个常见的错误是**测试代码无形间被编译器所优化**。

下面是`teivah/bitvector`库中的一个例子:

```go
func clear(n uint64, i, j uint8) uint64 {
  return (math.MaxUint64<<j | ((1 << i) - 1)) & n
}
```

此函数清除给定范围内的位。为了测试它，可能如下这样做:

```go
func BenchmarkWrong(b *testing.B) {
  for i := 0; i < b.N; i++ {
    clear(1221892080809121, 10, 63)
  }
}
```

在这个基准测试中，`clear`不调用任何其他函数，没有**副作用**。所以编译器将会把`clear`优化成内联函数。一旦内联，将会导致不准确的测试结果。



一个解决方案是**将函数结果设置为全局变量**，如下所示：

```go
var result uint64

func BenchmarkCorrect(b *testing.B) {
  var r uint64
  for i := 0; i < b.N; i++ {
    r = clear(1221892080809121, 10, 63)
  }
  result = r
}
```

如此一来，编译器将不知道`clear`是否会产生副作用。

因此，不会将`clear`优化成内联函数。



#### 延伸阅读

[High Performance Go Workshop](https://dave.cheney.net/high-performance-go-workshop/dotgo-paris.html?source=post_page-----4b79d4f6cd65----------------------#watch_out_for_compiler_optimisations)



### 被转移的指针

在函数调用中，按值传递的变量将创建该变量的副本，而通过指针传递只会传递该变量的内存地址。

那么，指针传递会比按值传递更快吗？请看一下[这个例子](https://gist.github.com/teivah/a32a8e9039314a48f03538f3f9535537)。

我在本地环境上模拟了`0.3KB`的数据，然后分别测试了按值传递和指针传递的速度。

结果显示：按值传递比指针传递快4倍以上，这很违背直觉。

测试结果与Go中如何管理内存有关。我虽然不能像[威廉·肯尼迪](https://www.ardanlabs.com/blog/2017/05/language-mechanics-on-stacks-and-pointers.html)那样出色地解释它，但让我试着总结一下。



译者注开始

作者没有说明Go内存的基本存储方式，译者补充一下。

1. 下面是来自Go语言圣经的介绍：

   一个goroutine会以一个很小的栈开始其生命周期，一般只需要2KB。

   一个goroutine的栈，和操作系统线程一样，会保存其活跃或挂起的函数调用的本地变量，但是和OS线程不太一样的是，一个goroutine的栈大小并不是固定的；栈的大小会根据需要动态地伸缩。

   而goroutine的栈的最大值有1GB，比传统的固定大小的线程栈要大得多，尽管一般情况下，大多goroutine都不需要这么大的栈。

2. 译者自己的理解：

   - 栈：每个Goruntine开始的时候都有独立的栈来存储数据。（*Goruntine分为主Goruntine和其他Goruntine，差异就在于起始栈的大小*）

   - 堆: 而需要被多个Goruntine共享的数据，存储在堆上面。

译者注结束



众所周知，可以在**堆**或**栈**上分配变量。

- 栈储存当前`Goroutine`的正在使用的变量（译者注: 可理解为局部变量）。一旦函数返回，变量就会从栈中弹出。
- 堆储存**共享变量**（全局变量等）。



让我们看一个简单的例子，返回单一的值：

```go
func getFooValue() foo {
  var result foo
  // Do something
  return result
}
```

当调用函数时，`result`变量会在当前Goruntine栈创建，当函数返回时，会传递给接收者一份值的拷贝。而`result`变量自身会从当前Goruntine栈出栈。

虽然它仍然存在于内存中，但它不能再被访问。并且还有可能被其他数据变量所擦除。



现在，在看一个返回指针的例子：

```go
func getFooPointer() *foo {
  var result foo
  // Do something
  return &result
}
```

当调用函数时，`result`变量会在当前Goruntine栈创建，当函数返回时，会传递给接收者一个指针（变量地址的副本）。如果`result`变量从当前Goruntine栈出栈，则接收者将无法再访问它。（译者注：此情况称为“内存逃逸”）

在这个场景中，Go编译器将把`result`变量**转义**到一个可以共享变量的地方:**堆**。

不过，传递指针是另一种情况。例如：

```go
func main()  {
  p := &foo{}
  f(p)
}
```

因为我们在同一个Goroutine中调用`f`，所以`p`变量不需要转义。它只是被推送到堆栈，子功能可以访问它。（译者注：不需要其他Goruntine共享的变量就存储在栈上即可）

比如，`io.Reader`中的`Read`方法签名，接收切片参数，将内容读取到切片中，返回读取的字节数。而不是返回读取后的切片。（译者注：如果返回切片，会将切片转义到堆中。）

```go
type Reader interface {
  Read(p []byte) (n int, err error)
}
```

为什么栈如此之快？ 主要有两个原因：

1. **堆栈不需要垃圾收集器。**就像我们说的，变量一旦创建就会被入栈，一旦函数返回就会从出栈。不需要一个复杂的进程来回收未使用的变量。
2. **储存变量不需要考虑同步。**堆属于一个Goroutine，因此与在堆上存储变量相比，存储变量不需要同步。



总之，当创建一个函数时，我们的**默认行为应该是使用值**而不是指针。只有在我们**想要共享变量时才应使用指针。**

如果我们遇到性能问题，可以使用`go build -gcflags "-m -m"`命令，来显示编译器将变量转义到堆的具体操作。

再次重申，对于大多数日常用例来说，值传递是最合适的。



#### 延伸阅读

1. [Language Mechanics On Stacks And Pointers](https://www.ardanlabs.com/blog/2017/05/language-mechanics-on-stacks-and-pointers.html?source=post_page-----4b79d4f6cd65----------------------)

2. [Understanding Allocations: the Stack and the Heap - GopherCon SG 2019](https://www.youtube.com/watch?v=ZMZpH4yT7M0)




### 出乎意料的break

如果`f`返回true，下面的例子中会发生什么？

```go
for {
  switch f() {
  case true:
    break
  case false:
    // Do something
  }
}
```

我们将调用`break`语句。然而，将会`break`出`switch`语句，而不是`for`循环。

同样的问题：

```go
for {
  select {
  case <-ch:
  // Do something
  case <-ctx.Done():
    break
  }
}
```

`break`与`select`语句有关，与`for`循环无关。



`break`出`for/switch或for/select`的一种解决方案是**使用带标签的break**，如下所示：

```go
loop:
  for {
    select {
    case <-ch:
    // Do something
    case <-ctx.Done():
      break loop
    }
  }
```



### 缺失上下文的错误

Go在错误处理方面仍然有待提高，以至于现在错误处理是Go2中最令人期待的需求。

当前的标准库(在Go 1.13之前)只提供`error`的构造函数，自然而然就会缺失其他信息。

让我们看一下[pkg/errors](https://github.com/pkg/errors)库中错误处理的思想：

*An error should be handled only* **once**. Logging an error **is** *handling an error. So an error should* **either** *be logged or propagated.*

（译：错误应该只处理一次。记录*log* 错误就是在处理错误。所以，错误应该记录或者传播）

对于当前的标准库，很难做到这一点，因为我们希望向错误中添加一些上下文信息，使其具有层次结构。



例如: 所期望的`REST`调用导致数据库问题的示例：

```
unable to server HTTP POST request for customer 1234
 |_ unable to insert customer contract abcd
     |_ unable to commit transaction
```

如果我们使用`pkg/errors`，可以这样做：

```go
func postHandler(customer Customer) Status {
  err := insert(customer.Contract)
  if err != nil {
    log.WithError(err).Errorf("unable to server HTTP POST request for customer %s", customer.ID)
    return Status{ok: false}
  }
  return Status{ok: true}
}

func insert(contract Contract) error {
  err := dbQuery(contract)
  if err != nil {
    return errors.Wrapf(err, "unable to insert customer contract %s", contract.ID)
  }
  return nil
}

func dbQuery(contract Contract) error {
  // Do something then fail
  return errors.New("unable to commit transaction")
}
```

如果不是由外部库返回的初始`error`可以使用`error.New`创建。中间层`insert`对此错误添加更多上下文信息。最终通过`log`错误来处理错误。每个级别要么返回错误，要么处理错误。



我们可能还想检查错误原因来判读是否应该重试。假设我们有一个来自外部库的`db`包来处理数据库访问。 该库可能会返回一个名为`db.DBError`的临时错误。要确定是否需要重试，我们必须检查错误原因：

使用`pkg/errors`中提供的`errors.Cause`可以判断错误原因。

```go
func postHandler(customer Customer) Status {
  err := insert(customer.Contract)
  if err != nil {
    switch errors.Cause(err).(type) {
    default:
      log.WithError(err).Errorf("unable to server HTTP POST request for customer %s", customer.ID)
      return Status{ok: false}
    case *db.DBError:
      return retry(customer)
    }
  }
  return Status{ok: true}
}

func insert(contract Contract) error {
  err := db.dbQuery(contract)
  if err != nil {
    return errors.Wrapf(err, "unable to insert customer contract %s", contract.ID)
  }
  return nil
}
```



我见过的一个常见错误是部分使用`pkg/errors`。 例如，通过这种方式检查错误：

```go
switch err.(type) {
default:
  log.WithError(err).Errorf("unable to server HTTP POST request for customer %s", customer.ID)
  return Status{ok: false}
case *db.DBError:
  return retry(customer)
}
```

在此示例中，如果`db.DBError`被`wrapped`，它将永远不会执行`retry`。



#### 延伸阅读

[Don’t just check errors, handle them gracefully](https://dave.cheney.net/2016/04/27/dont-just-check-errors-handle-them-gracefully?source=post_page-----4b79d4f6cd65----------------------)



### 正在扩容的切片

有时，我们知道切片的最终长度。假设我们想把`Foo`切片转换成`Bar`切片，这意味着这两个切片的长度是一样的。

我经常看到切片以下面的方式初始化：

```go
var bars []Bar
bars := make([]Bar, 0)
```

切片不是一个神奇的数据结构，如果没有更多可用空间，它会进行双倍扩容。在这种情况下，会自动创建一个切片(容量更大)，并复制其中的元素。

如果想容纳上千个元素，想象一下，我们需要扩容多少次。虽然插入的时间复杂度是`O(1)`，但它仍会对性能有所影响。



因此，如果我们知道最终长度，我们可以:

- 用预定义的长度初始化它

  ```go
  func convert(foos []Foo) []Bar {
    bars := make([]Bar, len(foos))
    for i, foo := range foos {
      bars[i] = fooToBar(foo)
    }
    return bars
  }
  ```

- 或者使用长度0和预定义容量初始化它：

  ```go
  func convert(foos []Foo) []Bar {
    bars := make([]Bar, 0, len(foos))
    for _, foo := range foos {
      bars = append(bars, fooToBar(foo))
    }
    return bars
  }
  ```



### 无规范的Context

`context.Context` 经常被误用。 根据官方文档:

> *A Context carries a deadline, a cancelation signal, and other values across API boundaries.*

这种描述非常笼统，以至于让一些人对使用它感到困惑。

让我们试着详细描述一下。`Context`可以包含:

- A **deadline**（最后期限）。它意味着到期之后（250ms之后或者一个指定的日期），我们必须停止正在进行的操作（`I/O`请求，等待的`channel`输入，等等）。
- A **cancelation signal**（取消信号）。一旦我们收到信号，我们必须停止正在进行的活动。例如，假设我们收到两个请求：一个用来插入一些数据，另一个用来取消第一个请求。这可以通过在第一个调用中使用`cancelable`上下文来实现，一旦我们获得第二个请求，这个上下文就会被取消。
- A list of key/value （键/值列表）均基于`interface{}`类型。



值得一提的是，**Context是可以组合的**。例如，我们可以继承一个带有截止日期和键/值列表的`Context`。此外，多个`goroutines`可以共享相同的`Context`，取消一个`Context`可能会停止多个活动。



回到我们的主题，举一个我经历的例子。

一个基于[urfave/cli](https://github.com/urfave/cli) （*如果您不知道，这是一个很好的库，可以在Go中创建命令行应用程序*）创建的Go应用。一旦开始，程序就会继承父级的`Context`。这意味着当应用程序停止时，将使用此`Context`发送取消信号。

我经历的是，这个`Context`是在调用`gRPC`时直接传递的，这不是我想做的。相反，我想当应用程序停止时或无操作100毫秒后，发送取消请求。

为此，可以简单地创建一个组合的`Context`。如果`parent`是父级的`Context`的名称（*由urfave/cli创建*），那么组合操作如下：

```go
ctx, cancel := context.WithTimeout(parent, 100 * time.Millisecond)
response, err := grpcClient.Send(ctx, request)
```

`Context`并不复杂，在我看来，可谓是 Go 的最佳特性之一。



#### 延伸阅读

1. [Understanding the context package in golang](http://p.agnihotry.com/post/understanding_the_context_package_in_golang/?source=post_page-----4b79d4f6cd65----------------------)
2. [gRPC and Deadlines](https://grpc.io/blog/deadlines/?source=post_page-----4b79d4f6cd65----------------------)



### 被遗忘的-race参数

我经常看到的一个错误是在没有`-race`参数的情况下测试 Go 应用程序。

正如[本报告](https://blog.acolyer.org/2019/05/17/understanding-real-world-concurrency-bugs-in-go/)所述，虽然Go“旨在使并发编程更容易，更不容易出错”，但我们仍然遇到很多并发问题。

显然，Go 竞争检测器无法解决每一个并发问题。但是，它仍有很大价值，我们应该在测试应用程序时始终启用它。



#### 延伸阅读

[Does the Go race detector catch all data race bugs?](https://medium.com/@val_deleplace/does-the-race-detector-catch-all-data-races-1afed51d57fb)



### 更完美的封装

另一个常见错误是将文件名传递给函数。

假设我们实现一个函数来计算文件中的空行数。最初的实现是这样的：

```go
func count(filename string) (int, error) {
  file, err := os.Open(filename)
  if err != nil {
    return 0, errors.Wrapf(err, "unable to open %s", filename)
  }
  defer file.Close()

  scanner := bufio.NewScanner(file)
  count := 0
  for scanner.Scan() {
    if scanner.Text() == "" {
      count++
    }
  }
  return count, nil
}
```

`filename` 作为给定的参数，然后我们打开该文件，再实现读空白行的逻辑，嗯，没有问题。

假设我们希望在此函数之上实现单元测试，并使用普通文件，空文件，具有不同编码类型的文件等进行测试。代码很容易变得非常难以维护。

此外，如果我们想对于`HTTP Body`实现相同的逻辑，将不得不为此创建另一个函数。



Go 设计了两个很棒的接口：`io.Reader` 和 `io.Writer` (译者注：常见IO 命令行，文件，网络等)

所以可以传递一个抽象数据源的`io.Reader`，而不是传递文件名。

仔细想一想统计的只是文件吗？一个HTTP正文？字节缓冲区？

答案并不重要，重要的是无论`Reader`读取的是什么类型的数据，我们都会使用相同的`Read`方法。

在我们的例子中，甚至可以缓冲输入以逐行读取它（使用`bufio.Reader`及其`ReadLine`方法）：

```go
func count(reader *bufio.Reader) (int, error) {
  count := 0
  for {
    line, _, err := reader.ReadLine()
    if err != nil {
      switch err {
      default:
        return 0, errors.Wrapf(err, "unable to read")
      case io.EOF:
        return count, nil
      }
    }
    if len(line) == 0 {
      count++
    }
  }
}
```

打开文件的逻辑现在交给调用`count`方：

```go
file, err := os.Open(filename)
if err != nil {
  return errors.Wrapf(err, "unable to open %s", filename)
}
defer file.Close()
count, err := count(bufio.NewReader(file))
```

无论数据源如何，都可以调用`count`。并且，还将促进单元测试，因为可以从字符串创建一个`bufio.Reader`，这大大提高了效率。

```go
count, err := count(bufio.NewReader(strings.NewReader("input")))
```



### Goruntines与循环变量

我见过的最后一个常见错误是使用 Goroutines 和循环变量。

以下示例将会输出什么？

```go
ints := []int{1, 2, 3}
for _, i := range ints {
  go func() {
    fmt.Printf("%v\n", i)
  }()
}
```

乱序输出 `1 2 3` ？答错了。

在这个例子中，每个 Goroutine 共享相同的变量实例，因此最有可能输出`3 3 3`。



有两种解决方案可以解决这个问题。

第一种是将`i`变量的值传递给闭包（内部函数）：

```go
ints := []int{1, 2, 3}
for _, i := range ints {
  go func(i int) {
    fmt.Printf("%v\n", i)
  }(i)
}
```

第二种是在`for`循环范围内创建另一个变量：

```go
ints := []int{1, 2, 3}
for _, i := range ints {
  i := i
  go func() {
    fmt.Printf("%v\n", i)
  }()
}
```

`i := i`可能看起来有点奇怪，但它完全有效。

因为处于循环中意味着处于另一个作用域内，所以`i := i`相当于创建了另一个名为`i`的变量实例。

当然，为了便于阅读，最好使用不同的变量名称。



#### 延伸阅读

[Using goroutines on loop iterator variables](https://github.com/golang/go/wiki/CommonMistakes?source=post_page-----4b79d4f6cd65----------------------#using-goroutines-on-loop-iterator-variables)

## 结束语

你还想提到其他常见的错误吗？请随意分享，继续讨论；)

欢迎转载本站文章，请注明作者和出处  [SimonAKing](http://simonaking.com)。
