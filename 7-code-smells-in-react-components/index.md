# React 的 7 种代码异味[译]

Date: 2020-11-15  
Author: SimonAKing  
Categories: 前端  
Tags: 译文, 前端, React  
Source: https://simonaking.com/blog/7-code-smells-in-react-components/

> React的7种代码异味, 教你如何更好地写React

---
教你如何更好地写React。

## 前言

原文链接：[7 code smells in your React components](https://dev.to/awnton/7-code-smells-in-react-components-5f66)

作者信息：[Anton Gunnarsson](https://twitter.com/Awnton)

翻译许可：

![Agree](./React的7种代码异味-译/Agree.png)



## 正文

自从使用 `React` 后，我见过越来越多可值得优化的点，比如：

- 大量的 `props`
- `props` 的不兼容性
- `props` 复制为 `state`
- 返回 `JSX` 的函数
-  `state` 的多个状态
- `useState` 过多
- 复杂的 `useEffect`

在本文中，我想分享几个技巧，这些技巧将改善你的React代码。



### 大量的 props

如果需要把大量的 `props` 传递到一个组件中，那么很有可能 该组件可再进一步拆分。

问题来了，“大量” 具体是多少呢？答案是 看情况。

假设你正在开发 一个包含 20 个或更多 `props` 的组件时，你想再添加一些 `props` 完善其他功能，这时有两点可以参考 是否应拆分组件：



**该组件是否做了多件事？**

像函数一样，一个组件应该只做好一件事，所以考虑下 将组件拆分成多个小组件是否会更好。

例如，该组件存在 [`props` 的不兼容性]() 或 [返回 `JSX` 的函数]()。



**该组件是否可被合成**？

开发中，组合是一种很好的模式但经常被忽视。

如果你的组件中存在将不相干逻辑塞到一起的情况，是时候考虑使用组合了。

假设我们有一个表单组件来处理某组织的用户信息:

```jsx
<ApplicationForm
  user={userData}
  organization={organizationData}
  categories={categoriesData}
  locations={locationsData}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  ...
/>
```

通过该组件的 `props` ，我们可看到它们都与组件提供的功能密切相关。

该组件看起来并无大碍，但如果将其中的一些 `props` 分担到子组件，那么数据流就会更清晰。

```jsx
<ApplicationForm onSubmit={handleSubmit} onCancel={handleCancel}>
  <ApplicationUserForm user={userData} />
  <ApplicationOrganizationForm organization={organizationData} />
  <ApplicationCategoryForm categories={categoriesData} />
  <ApplicationLocationsForm locations={locationsData} />
</ApplicationForm>
```

现在，我们已经看到该表单组件只处理提交和取消动作，其他范围内的事情，都交给了对应的子组件。



**是否传递了很多有关配置的 `props`**

在某些情况下，将多个有关配置的 `props` 组合成一个 `options` 是个不错的实践。

假设我们有一个可显示某种表格的组件：

```jsx
<Grid
  data={gridData}
  pagination={false}
  autoSize={true}
  enableSort={true}
  sortOrder="desc"
  disableSelection={true}
  infiniteScroll={true}
  ...
/>
```

我们可以很清楚地看出，该组件除了 `data` 外其余的 `props` 都是与配置有关的。

如果将多个配置 `props` 合成为一个 `options` ，就可更好地控制组件的选项，规范性也得到提升。

```jsx
const options = {
  pagination: false,
  autoSize: true,
  enableSort: true,
  sortOrder: 'desc',
  disableSelection: true,
  infiniteScroll: true,
  ...
}

<Grid
  data={gridData}
  options={options}
/>
```



### props 的不兼容性

避免组件之间传递不兼容的 `props`。

假设你的组件库中有一个 `<Input />` 组件，而该组件开始时仅用于处理文本，但过了一段时间后，你将它用于电话号码处理。

你的实现可能如下：

```jsx
function Input({ value, isPhoneNumberInput, autoCapitalize }) {
  if (autoCapitalize) capitalize(value)

  return <input value={value} type={isPhoneNumberInput ? 'tel' : 'text'} />
}
```

问题在于，`isPhoneNumberInput` 与 `autoCapitalize` 之间并不存在关联，将一个手机号首字母大写是没有任何意义的。

在这种情况下，我们可以将其分割成多个小组件，来明确具体的职责，如果有共享逻辑，可以将其放到 `hooks` 中。

```jsx
function TextInput({ value, autoCapitalize }) {
  if (autoCapitalize) capitalize(value)
  useSharedInputLogic()

  return <input value={value} type="text" />
}

function PhoneNumberInput({ value }) {
  useSharedInputLogic()

  return <input value={value} type="tel" />
}
```

虽然上面例子有点勉强，可当发现组件的`props`存在不兼容性时，是时候考虑拆分组件了。



### props 复制为 state

如何更好地将 `props` 作为 `state` 的初始值。

有如下组件：

```jsx
function Button({ text }) {
  const [buttonText] = useState(text)

  return <button>{buttonText}</button>
}
```

该组件将 `text` 作为 `useState` 的初始值，可能会导致意想不到的行为。

实际上该组件已经关掉了 `props` 的更新通知，如果 `text` 在上层被更新，它将仍呈现 接受到 `text` 的第一次值，这更容易使组件出错。



一个更实际场景是，我们想基于 `props` 通过大量计算来得到新的 `state`。

在下面的例子中，`slowlyFormatText` 函数用于格式化 `text`，注意 需要很长时间才能完成。

```jsx
function Button({ text }) {
  const [formattedText] = useState(() => slowlyFormatText(text))

  return <button>{formattedText}</button>
}
```

解决此问题 最好的方案是 使用 `useMemo` 代替 `useState`。

```jsx
function Button({ text }) {
  const formattedText = useMemo(() => slowlyFormatText(text), [text])

  return <button>{formattedText}</button>
}
```

现在 `slowFormatFormat` 仅在 `text` 更改时运行，并且没有阻断 上层组件更新。

进一步阅读：[Writing resilient components by Dan Abramov](https://overreacted.io/writing-resilient-components/)。



### 返回 JSX 的函数

不要从组件内部的函数中返回 `JSX`。

这种模式虽然很少出现，但我还是时不时碰到。

仅举一个例子来说明:

```jsx
function Component() {
  const topSection = () => {
    return (
      <header>
        <h1>Component header</h1>
      </header>
    )
  }

  const middleSection = () => {
    return (
      <main>
        <p>Some text</p>
      </main>
    )
  }

  const bottomSection = () => {
    return (
      <footer>
        <p>Some footer text</p>
      </footer>
    )
  }

  return (
    <div>
      {topSection()}
      {middleSection()}
      {bottomSection()}
    </div>
  )
}
```

该例子虽然看起来没什么问题，但其实这会破坏代码的整体性，使维护变得困难。

要么把函数返回的 `JSX` 直接内联到组件内，要么将其拆分成一个组件。

有一点需要注意，如果你创建了一个新组件，不必将其移动到新文件中的。

如果多个组件紧密耦合，将它们保存在同一个文件中是有意义的。



### state 的多个状态

避免使用多个布尔值来表示组件状态。

当编写一个组件并多次迭代后，很容易出现这样一种情况，即内部有多个布尔值来表示 该组件处于哪种状态。

比如下面的例子：

```jsx
function Component() {
  const [isLoading, setIsLoading] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [hasError, setHasError] = useState(false)

  const fetchSomething = () => {
    setIsLoading(true)

    fetch(url)
      .then(() => {
        setIsLoading(false)
        setIsFinished(true)
      })
      .catch(() => {
        setHasError(true)
      })
  }

  if (isLoading) return <Loader />
  if (hasError) return <Error />
  if (isFinished) return <Success />

  return <button onClick={fetchSomething} />
}
```

当按钮被点击时，我们将 `isLoading` 设置为 `true`，并通过 `fetch` 执行网络请求。

如果请求成功，我们将 `isLoading` 设置为 `false`，`isFinished` 设置为 `true`，如果有错误，将 `hasError` 设置为 `true`。

虽然这在技术上是可行的，但很难推断出组件处于什么状态，而且不容易维护。

并且有可能最终处于“不可能的状态”，比如我们不小心同时将 `isLoading` 和 `isFinished` 设置为 `true`。

解决此问题一劳永逸的方案是 使用枚举来管理状态。

在其他语言中，枚举是一种定义变量的方式，该变量只允许设置为预定义的常量值集合，虽然在`JavaScript` 中不存在枚举，但我们可以使用字符串作为枚举：

```jsx
function Component() {
  const [state, setState] = useState('idle')

  const fetchSomething = () => {
    setState('loading')

    fetch(url)
      .then(() => {
        setState('finished')
      })
      .catch(() => {
        setState('error')
      })
  }

  if (state === 'loading') return <Loader />
  if (state === 'error') return <Error />
  if (state === 'finished') return <Success />

  return <button onClick={fetchSomething} />
}
```

通过这种方式，完全杜绝了出现 不可能状态的情况，并更利用扩展。

如果你使用 `TypeScript` 开发的话，则可以从定义时就实现枚举：

```jsx
const [state, setState] = useState<'idle' | 'loading' | 'error' | 'finished'>('idle')
```



### useState 过多

避免在同一个组件中使用太多的 `useState`。



一个包含许多 `useState` 的组件可能会做多件事情，可以考虑是否要拆分它。

当然也存在一些复杂的场景，我们需要在组件中管理一些复杂的状态。

下面是自动输入组件的例子：

```jsx
function AutocompleteInput() {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [items, setItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [activeIndex, setActiveIndex] = useState(-1)

  const reset = () => {
    setIsOpen(false)
    setInputValue('')
    setItems([])
    setSelectedItem(null)
    setActiveIndex(-1)
  }

  const selectItem = (item) => {
    setIsOpen(false)
    setInputValue(item.name)
    setSelectedItem(item)
  }

  ...
}
```

我们有一个 `reset` 函数，可以重置所有状态，还有一个 `selectItem` 函数，可更新一些状态。

这些函数都离不开 `useState` 定义的状态。如果功能继续迭代，那么函数就会越来越多，状态也会随之增加，数据流就会变得模糊不清。

在这种情况下，使用 `useReducer` 来代替 过多的 `useState` 是一个不错的选择。

```jsx
const initialState = {
  isOpen: false,
  inputValue: "",
  items: [],
  selectedItem: null,
  activeIndex: -1
}
function reducer(state, action) {
  switch (action.type) {
    case "reset":
      return {
        ...initialState
      }
    case "selectItem":
      return {
        ...state,
        isOpen: false,
        inputValue: action.payload.name,
        selectedItem: action.payload
      }
    default:
      throw Error()
  }
}

function AutocompleteInput() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const reset = () => {
    dispatch({ type: 'reset' })
  }

  const selectItem = (item) => {
    dispatch({ type: 'selectItem', payload: item })
  }

  ...
}
```

通过使用 `reducer`，我们封装了管理状态的逻辑，并将复杂的逻辑移出了组件，这使得组件更容易维护。

进一步阅读：[state reducer pattern by Kent C. Dodds](https://kentcdodds.com/blog/the-state-reducer-pattern-with-react-hooks)。



### 复杂的 useEffect

避免在 `useEffect` 中做太多事情，它们使代码易于出错，并且难以推理。

下面的例子中 犯了一个很大的错误：

```jsx
function Post({ id, unlisted }) {
  ...

  useEffect(() => {
    fetch(`/posts/${id}`).then(/* do something */)

    setVisibility(unlisted)
  }, [id, unlisted])

  ...
}
```

当 `unlisted` 改变时，即使 `id` 没有变，也会调用 `fetch`。

正确的写法应该是 将多个依赖分离：

```jsx
function Post({ id, unlisted }) {
  ...

  useEffect(() => { // when id changes fetch the post
    fetch(`/posts/${id}`).then(/* ... */)
  }, [id])

  useEffect(() => { // when unlisted changes update visibility
    setVisibility(unlisted)
  }, [unlisted])

  ...
}
```


***
## 结束语

以上就是我分享的全部。请记住，这些绝不是规则，而是表明某些东西可能是“错误的”。

如果你也发现了其他的问题模式，欢迎发表评论，或者在 [Twitter](https://twitter.com/awnton) 上联系我。

欢迎转载本站文章，请注明作者和出处  [SimonAKing](http://simonaking.com)。
