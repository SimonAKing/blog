# VSCode 之高效快捷键

Date: 2017-12-05  
Author: SimonAKing  
Categories: 工具  
Tags: 工具, VSCode, 快捷键  
Source: https://simonaking.com/blog/vscode-efficient-shortcuts/

> VSCode,快捷键,效率,工具

---
绝对福利,不容错过！
## 前言
常言道：“工欲善其事必先利其器”，而我的器便是 [VSCode](https://code.visualstudio.com/) ，这是一款高颜值的编辑器。
不过在经过长时间的使用后，发现总有些一些快捷键令我难以接受。
遂花了一天的时间，将快捷键全部调整了一遍，总结如下：
>:no_mouth: 底部有源文件,可供你替换

## 正文
### 编辑
1. Alt + Enter
    <span class="Key">跳转到下一个编辑点</span>
2. Ctrl + A
    <span class="Key">全选</span>
3. Ctrl + Shift + A
    <span class="Key">Autoprefixer/Eslint</span>
5. Ctrl + Shift + Z
    <span class="Key">重做</span>
8. Ctrl + R
    <span class="Key">注释当前行</span>
9. Ctrl + T
   <span class="Key">格式化</span>
10. Ctrl + Y
    <span class="Key">选择下一个匹配</span>
11. Ctrl + Shift + Y
    <span class="Key">选择所有匹配项</span>
12. Ctrl + /
    <span class="Key">增加注释</span>
13. Ctrl + J
    <span class="Key">连接下一行</span>
14. Ctrl + Shift + J
    <span class="Key">将标签内的内容全部缩成一行</span>
15. Ctrl + P
    <span class="Key">交换字符位置</span>
16. Ctrl + G
    * <span class="Key">浏览markdown</span>
    * <span class="Key">开启LiveServer</span>
    * <span class="Key">Alt + G 关闭LiveServer</span>
17. Alt + .
    <span class="Key">Emmet 命令列表</span>
18. Alt + z
    <span class="Key">自动换行</span>
19. Ctrl + L
    <span class="Key">选中一行</span>
20. Ctrl + Shift + L
    <span class="Key">跳转行</span>
21. Ctrl + D
    <span class="Key">删除行</span>
22. Ctrl + F
    <span class="Key">搜索</span>
23. Ctrl + H
    <span class="Key">替换</span>
24. Ctrl + Shift + C
    <span class="Key">向下复制一行 </span>
25. Ctrl + Shift + V
    <span class="Key">打开Ditto</span>
26. Ctrl + Enter
    <span class="Key">在当前行下边插入一行 </span>
27. Shift + Enter
    <span class="Key">在当前行上方插入一行</span>
28. Alt + Up/Down
    <span class="Key">移动行</span>
30. Ctrl + Shift + []
    <span class="Key">折叠代码</span>
34. Alt + X
    <span class="Key">光标撤销</span>
35. Ctrl + F5
    <span class="Key">Code Run</span>
36. Ctrl + Shift + Space
    <span class="Key">显示参数</span>
37. Ctrl  + 左键
   <span class="Key">多处编辑</span>
38. Ctrl  + Shift + 左键
  <span class="Key">块选择</span>
40. Alt + Shift + Right
    <span class="Key">选中标签内中的内容</span>
41. Alt + Shift + Left
    <span class="Key">选中标签中的第一个子标签</span>
42. Alt + Left
    <span class="Key">移除包裹标签</span>
43. Alt + Right
    <span class="Key">键入标签名 包围所在标签 与 多光标一起使用 威力无穷</span>
44. Alt + Shift +Enter
    <span class="Key">将当前标签替换成键入的标签</span>
45. Ctrl + Shift + J
    <span class="Key">将标签内的内容全部缩成一行</span>
46. Alt + Enter
    <span class="Key">跳转到下一个编辑点</span>
47. F12
    <span class="Key">移动到定义处</span>
48. Alt + F12
    <span class="Key">定义处缩略图,可更改</span>
49. Shift + F12
    <span class="Key">列出所有的引用</span>
50. Ctrl + Alt + Up
    <span class="Key">定位到文件中上一个修改</span>
51. Ctrl + Alt + Down
    <span class="Key">定位到文件中下一个修改</span>

### 命令窗口
1. F1
2. Ctrl + Shift + P
3. Ctrl + E 输入 >
4. Ctrl + P 输入 >

其中在 Ctrl + E / P 窗口中还可以这么玩 :
- 直接输入文件名，跳转到文件
- ? 列出当前可执行的动作
- ! 显示 Errors或 Warnings，也可以 Ctrl+Shift+M
- : 跳转到行数
- @ 跳转到 symbol（搜索变量或者函数），也可以 Ctrl+Shift+O 直接进入
- @ 根据分类跳转 symbol，查找属性或函数，也可以 Ctrl+Shift+O 后输入:进入
- \# 根据名字查找 symbol

### 项目
1. Ctrl + O
    <span class="Key">打开文件</span>
2. Ctrl + Shift + O
    <span class="Key">打开文件夹</span>
3. Ctrl + Alt + O
    <span class="Key">打开本地Git项目</span>
4. Ctrl + B
    <span class="Key">打开最近项目</span>
5. Alt + R (需先Ctrl + Shift + E)
    <span class="Key">打开聚焦文件的路径</span>


### 标签
1. Ctrl + Shift + T
    <span class="Key">打开关闭后的标签</span>
2. Ctrl + Num
    <span class="Key">聚焦到某个标签</span>
3. Ctrl + W
    <span class="Key">关闭当前标签</span>

### 调试
1. F5
    <span class="Key">调试</span>
2. Shift + F5
    <span class="Key">运行 不调试</span>
3. F10
    <span class="Key">单步执行</span>

**注意事项**
-  先关掉所有的Chrome
-  启动调试 Launch to Chrome
-  可以使用断点，单独调试
-  还可以像Chrome调试台那样 去使用调试
``` js
$("#header").style.background
获取 header的背景颜色

$
document.querySelector 。

$$
相当于 document.querySelectorAll 。

$_
返回上一个表达式的值

dir
console.dir

keys
取对象的键名, 返回键名组成的数组

values(object)
返回一个数组，该数组包含属于指定对象的所有属性值。

dirxml(object)

$("#header").css("color","red");
使用页面中的框架,记录jQuery

1 + 2
普通输入

function(){alert(1);}
函数

```
### 设置
1. Ctrl + ,
    <span class="Key">设置</span>
2. Ctrl + Shift + ,
    <span class="Key">快捷键</span>
3. Ctrl + Alt + ,
    <span class="Key">代码片段</span>
4. Alt + F2
    <span class="Key">选择主题</span>
5. Alt + F1
    <span class="Key">改变语言</span>
6. Ctrl + Shift + S
   <span class="Key">设置</span>

### 窗口
1. Ctrl + M
    <span class="Key">打开新窗口</span>
2. Ctrl + Shift +M
    <span class="Key">重新载入</span>
3. Ctrl + \
    <span class="Key">多栏编辑</span>
4. Ctrl + Shift + \
    <span class="Key">切换多栏布局</span>
5. Alt + W
    <span class="Key">只保留当前栏</span>
6. Alt + A
    <span class="Key">当前栏增大视图</span>
7. Alt + Num
    <span class="Key">聚焦到第Num个栏</span>

### Booksmarks
1. Ctrl + Q
    <span class="Key">切换书签</span>
2. Ctrl + Shift + Q
   <span class="Key"> 跳转到下一个书签</span>
3. Ctrl + Alt + Q
   <span class="Key">跳转到上一个书签</span>
4. Ctrl + Shift + Alt + Q
    <span class="Key">书签列表</span>
5. F1 + Clear remove all bookmarks in the current file
   <span class="Key">清除当前文件的所有标签</span>
6. F1 + Clear from All Files remove all bookmarks from all files
   <span class="Key"> 清除所有标签</span>

### 文件
1. Ctrl + S
    <span class="Key">保存当前文件</span>
2. Ctrl + Shift +S
    <span class="Key">保存所有文件</span>
3. Ctrl + Alt + S
    <span class="Key">另存为</span>
4. Ctrl + Shift + N
   <span class="Key"> 在资源管理器中新建文件</span>

### 侧边栏
1. Ctrl + Shift + E
    <span class="Key">聚焦到资源管理器 </span>
2. Ctrl + Shift + F
    <span class="Key">全局搜索 </span>
3. Ctrl + Shift + D
   <span class="Key"> 调试代码  </span>
4. Ctrl + Shift + G
   <span class="Key"> Git版本库  </span>
5. Ctrl + Shift + X
   <span class="Key"> 插件商场  </span>
6. Ctrl + Shift + B
    <span class="Key">切换侧边栏</span>
7. Ctrl + Shift + H
   <span class="Key"> 全局替换</span>

### 底栏
1. Ctrl + Shift + W
    <span class="Key">问题</span>
    - F8
    <span class="Key">下一个错误/警告</span>
    - Shift + F8
    <span class="Key">上一个错误/警告</span>
2. Ctrl + Shift + R
    <span class="Key">调试控制台</span>
3. Ctrl + Shift + U
   <span class="Key"> 输出</span>
4. Alt + Q
    <span class="Key">终端</span>

### Markdown
1. Alt + B
    <span class="Key">粗体</span>
2. Ctrl + i
    <span class="Key">斜体</span>
3. Ctrl + Shift + [/]
    <span class="Key">增加标题等级</span>
4. Ctrl + G
    <span class="Key">浏览视图</span>
5. 右键Markdown视图
    <span class="Key">保存多种类型</span>

### 其他特性
1. 悬停提示
2. 文件拖拽移动
3. 双击变量 高亮匹配相同词
4. code ./ 使用VSCode打开当前文件
5. F11 全屏
6. 文件右键
  - 在资源管理器中打开
  - 在终端打开
  - 选择以比较 然后在选择一个文件 即可进行比较
  - 复制路径 Alt + Shift+C
  - Git 查看该文件的历史
7. Git
  1. F1
    - View Git History (git log) (git.viewHistory)
    - View File History (git.viewFileHistory)
    - View Line History (git.viewLineHistory)
  2. Alt + F3
      <span class="Key">查看文件更改</span>
8. NPM && Task
  1. Ctrl + I
      <span class="Key">导入模块 </span>
  2. Alt + F5
      <span class="Key">运行脚本</span>
  3. Ctrl+u
      <span class="Key">运行任务</span>


### 源文件
<sourceFile>
```json
[{
        "key": "tab",
        "command": "editor.emmet.action.expandAbbreviation",
        "when": "config.emmet.triggerExpansionOnTab && editorTextFocus && !editorHasMultipleSelections && !editorHasSelection && !editorReadonly && !editorTabMovesFocus"
    },
    {
        "key": "ctrl+c",
        "command": "-extension.vim_ctrl+c",
        "when": "editorTextFocus && vim.active && vim.overrideCtrlC && vim.use<C-c> && !inDebugRepl"
    },
    {
        "key": "ctrl+f",
        "command": "-extension.vim_ctrl+f",
        "when": "editorTextFocus && vim.active && vim.use<C-f> && !inDebugRepl"
    },
    {
        "key": "ctrl+l",
        "command": "expandLineSelection",
        "when": "editorTextFocus"
    },{
        "key": "ctrl+h",
        "command": "-extension.vim_ctrl+h",
        "when": "editorTextFocus && vim.active && vim.use<C-h> && !inDebugRepl && vim.mode == 'Insert'"
    },
    {
        "key": "ctrl+v",
        "command": "-extension.vim_ctrl+v",
        "when": "editorTextFocus && vim.active && vim.use<C-v> && !inDebugRepl && vim.mode != 'Insert'"
    },
    {
        "key": "ctrl+f1",
        "command": "-extension.viewInBrowser",
        "when": "editorTextFocus"
    },
    {
        "key": "alt+x",
        "command": "cursorUndo",
        "when": "editorTextFocus"
    },{
        "key": "shift+alt+f",
        "command": "-editor.action.formatDocument",
        "when": "editorHasDocumentFormattingProvider && editorTextFocus && !editorReadonly"
    },
    {
        "key": "ctrl+f",
        "command": "actions.find"
    },
    {
        "key": "ctrl+f",
        "command": "-actions.find"
    },
    {
        "key": "ctrl+shift+f",
        "command": "workbench.action.findInFiles",
        "when": "!searchInputBoxFocus"
    },
    {
        "key": "ctrl+shift+f",
        "command": "-workbench.action.findInFiles",
        "when": "!searchInputBoxFocus"
    },
    {
        "key": "ctrl+shift+f",
        "command": "workbench.view.search",
        "when": "!searchViewletVisible"
    },
    {
        "key": "ctrl+shift+f",
        "command": "-workbench.view.search",
        "when": "!searchViewletVisible"
    },
    {
        "key": "ctrl+r",
        "command": "editor.action.commentLine",
        "when": "editorTextFocus && !editorReadonly"
    },
    {
        "key": "ctrl+oem_2",
        "command": "-editor.action.commentLine",
        "when": "editorTextFocus && !editorReadonly"
    },
    {
        "key": "ctrl+d",
        "command": "editor.action.deleteLines",
        "when": "editorTextFocus && !editorReadonly"
    },
    {
        "key": "ctrl+shift+k",
        "command": "-editor.action.deleteLines",
        "when": "editorTextFocus && !editorReadonly"
    },
    {
        "key": "ctrl+alt+o",
        "command": "-extension.openWith",
        "when": "editorTextFocus && editorLangId == 'html'"
    },
    {
        "key": "alt+f1",
        "command": "workbench.action.editor.changeLanguageMode"
    },
    {
        "key": "ctrl+k m",
        "command": "-workbench.action.editor.changeLanguageMode"
    },
    {
        "key": "shift+enter",
        "command": "editor.action.insertLineBefore",
        "when": "editorTextFocus && !editorReadonly"
    },
    {
        "key": "ctrl+shift+enter",
        "command": "-editor.action.insertLineBefore",
        "when": "editorTextFocus && !editorReadonly"
    },
    {
        "key": "ctrl+shift+g",
        "command": "workbench.view.scm"
    },
    {
        "key": "ctrl+shift+g",
        "command": "-workbench.view.scm"
    },
    {
        "key": "alt+shift+g",
        "command": "markdown.showPreview",
        "when": "editorLangId == 'markdown'"
    },
    {
        "key": "ctrl+shift+v",
        "command": "-markdown.showPreview",
        "when": "editorLangId == 'markdown'"
    },
    {
        "key": "ctrl+shift+c",
        "command": "editor.action.copyLinesDownAction",
        "when": "editorTextFocus && !editorReadonly"
    },
    {
        "key": "shift+alt+down",
        "command": "-editor.action.copyLinesDownAction",
        "when": "editorTextFocus && !editorReadonly"
    },
    {
        "key": "alt+r",
        "command": "revealFileInOS",
        "when": "explorerViewletFocus && explorerViewletVisible"
    },
    {
        "key": "shift+alt+r",
        "command": "-revealFileInOS",
        "when": "explorerViewletFocus && explorerViewletVisible"
    },
    {
        "key": "ctrl+a",
        "command": "-extension.vim_ctrl+a",
        "when": "editorTextFocus && vim.active && vim.use<C-a> && !inDebugRepl"
    },
    {
        "key": "ctrl+g",
        "command": "extension.liveServer.goOnline",
        "when": "editorTextFocus && editorLangId != 'markdown'"
    },
    {
        "key": "alt+g",
        "command": "extension.liveServer.goOffline",
        "when": "editorTextFocus && editorLangId != 'markdown'"
    },
    {
        "key": "alt+l o",
        "command": "-extension.liveServer.goOnline",
        "when": "editorTextFocus"
    },
    {
        "key": "alt+l c",
        "command": "-extension.liveServer.goOffline",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+q",
        "command": "bookmarks.toggle",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+alt+k",
        "command": "-bookmarks.toggle",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+q",
        "command": "bookmarks.jumpToNext",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+alt+l",
        "command": "-bookmarks.jumpToNext",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+alt+q",
        "command": "bookmarks.jumpToPrevious",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+alt+j",
        "command": "-bookmarks.jumpToPrevious",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+shift+alt+q",
        "command": "bookmarks.listFromAllFiles"
    },
    {
        "key": "ctrl+n",
        "command": "-extension.vim_ctrl+n",
        "when": "editorTextFocus && vim.active && vim.use<C-n> && !inDebugRepl"
    },
    {
      "key": "ctrl+shift+n",
      "command": "explorer.newFile",
    },
    {
      "key": "ctrl+n",
      "command": "workbench.action.files.newUntitledFile" ,
    },

{
    "key": "ctrl+w",
    "command": "-extension.vim_ctrl+w",
    "when": "editorTextFocus && vim.active && vim.use<C-w> && !inDebugRepl"
},
{
    "key": "ctrl+w ctrl+w",
    "command": "-extension.vim_navigateGroups",
    "when": "vim.active && vim.use<C-w> && !editorTextFocus"
},
{
    "key": "ctrl+w l",
    "command": "-extension.vim_navigateRight",
    "when": "vim.active && vim.use<C-w> && !editorTextFocus"
},
{
    "key": "ctrl+w j",
    "command": "-extension.vim_navigateDown",
    "when": "vim.active && vim.use<C-w> && !editorTextFocus"
},
{
    "key": "ctrl+w k",
    "command": "-extension.vim_navigateUp",
    "when": "vim.active && vim.use<C-w> && !editorTextFocus"
},
{
    "key": "ctrl+w h",
    "command": "-extension.vim_navigateLeft",
    "when": "vim.active && vim.use<C-w> && !editorTextFocus"
},
{
    "key": "ctrl+u",
    "command": "-extension.vim_ctrl+u",
    "when": "editorTextFocus && vim.active && vim.use<C-u> && !inDebugRepl"
},
{
    "key": "ctrl+o",
    "command": "-extension.vim_ctrl+o",
    "when": "editorTextFocus && vim.active && vim.use<C-o> && !inDebugRepl"
},
{
    "key": "win+a",
    "command": "-extension.vim_cmd+a",
    "when": "editorTextFocus && vim.active && vim.use<D-a> && !inDebugRepl && vim.mode != 'Insert'"
},
{
    "key": "backspace",
    "command": "-extension.vim_backspace",
    "when": "editorTextFocus && vim.active && !inDebugRepl"
},
{
    "key": "ctrl+alt+down",
    "command": "workbench.action.editor.nextChange",
    "when": "editorTextFocus"
},
{   "key": "ctrl+alt+up",
    "command": "workbench.action.editor.previousChange",
    "when": "editorTextFocus"
},
{
    "key": "win+d",
    "command": "-extension.vim_cmd+d",
    "when": "editorTextFocus && vim.active && vim.use<D-d> && !inDebugRepl"
},
{
    "key": "win+right",
    "command": "-extension.vim_cmd+right",
    "when": "editorTextFocus && vim.active && vim.use<D-right> && !inDebugRepl && vim.mode != 'Insert'"
},
{
    "key": "win+v",
    "command": "-extension.vim_cmd+v",
    "when": "editorTextFocus && vim.active && vim.use<D-v> && !inDebugRepl && vim.mode == 'SearchInProgressMode'"
},
{
    "key": "ctrl+pagedown",
    "command": "-extension.vim_ctrl+pagedown",
    "when": "editorTextFocus && vim.active && vim.use<C-pagedown> && !inDebugRepl"
},
{
    "key": "ctrl+r",
    "command": "-extension.vim_ctrl+r",
    "when": "editorTextFocus && vim.active && vim.use<C-r> && !inDebugRepl"
},
{
    "key": "ctrl+pageup",
    "command": "-extension.vim_ctrl+pageup",
    "when": "editorTextFocus && vim.active && vim.use<C-pageup> && !inDebugRepl"
},
{
    "key": "ctrl+shift+2",
    "command": "-extension.vim_ctrl+shift+2",
    "when": "editorTextFocus && vim.active && vim.use<C-shift+2>"
},
{
    "key": "ctrl+x",
    "command": "-extension.vim_ctrl+x",
    "when": "editorTextFocus && vim.active && vim.use<C-x> && !inDebugRepl"
},
{
    "key": "ctrl+x",
    "command": "-extension.vim_ctrl+x",
    "when": "editorTextFocus && vim.active && vim.use<C-x> && !inDebugRepl"
},
{
    "key": "ctrl+x",
    "command": "-extension.vim_ctrl+x",
    "when": "editorTextFocus && vim.active && vim.use<C-x> && !inDebugRepl"
},
{
    "key": "ctrl+y",
    "command": "-extension.vim_ctrl+y",
    "when": "editorTextFocus && vim.active && vim.use<C-y> && !inDebugRepl"
},
{
    "key": "ctrl+y",
    "command": "-extension.vim_ctrl+y",
    "when": "editorTextFocus && vim.active && vim.use<C-y> && !inDebugRepl"
},
{
    "key": "ctrl+y",
    "command": "-extension.vim_ctrl+y",
    "when": "editorTextFocus && vim.active && vim.use<C-y> && !inDebugRepl"
},
{
    "key": "ctrl+y",
    "command": "-extension.vim_ctrl+y",
    "when": "editorTextFocus && vim.active && vim.use<C-y> && !inDebugRepl"
},
{
    "key": "ctrl+y",
    "command": "-extension.vim_ctrl+y",
    "when": "editorTextFocus && vim.active && vim.use<C-y> && !inDebugRepl"
},
{
    "key": "ctrl+y",
    "command": "-extension.vim_ctrl+y",
    "when": "editorTextFocus && vim.active && vim.use<C-y> && !inDebugRepl"
},
{
    "key": "ctrl+y",
    "command": "-extension.vim_ctrl+y",
    "when": "editorTextFocus && vim.active && vim.use<C-y> && !inDebugRepl"
},
{
    "key": "delete",
    "command": "-extension.vim_delete",
    "when": "editorTextFocus && vim.active && !inDebugRepl && vim.mode != 'Insert'"
},
{
    "key": "delete",
    "command": "-extension.vim_delete",
    "when": "editorTextFocus && vim.active && !inDebugRepl && vim.mode != 'Insert'"
},
{
    "key": "end",
    "command": "-extension.vim_end",
    "when": "editorTextFocus && vim.active && !inDebugRepl && vim.mode != 'Insert'"
},
{
    "key": "end",
    "command": "-extension.vim_end",
    "when": "editorTextFocus && vim.active && !inDebugRepl && vim.mode != 'Insert'"
},
{
    "key": "home",
    "command": "-extension.vim_home",
    "when": "editorTextFocus && vim.active && !inDebugRepl && vim.mode != 'Insert'"
},
{
    "key": "win+left",
    "command": "-extension.vim_cmd+left",
    "when": "editorTextFocus && vim.active && vim.use<D-left> && !inDebugRepl && vim.mode != 'Insert'"
},
{
    "key": "ctrl+oem_4",
    "command": "-extension.vim_ctrl+[",
    "when": "editorTextFocus && vim.active && vim.use<C-[> && !inDebugRepl"
},
{
    "key": "ctrl+ oem_6",
    "command": "-extension.vim_ctrl+]",
    "when": "editorTextFocus && vim.active && vim.use<C-]> && !inDebugRepl"
},
{
    "key": "ctrl+b",
    "command": "-extension.vim_ctrl+b",
    "when": "editorTextFocus && vim.active && vim.use<C-b> && !inDebugRepl && vim.mode != 'Insert'"
},
{
    "key": "ctrl+d",
    "command": "-extension.vim_ctrl+d",
    "when": "editorTextFocus && vim.active && !inDebugRepl"
},
{
    "key": "ctrl+e",
    "command": "-extension.vim_ctrl+e",
    "when": "editorTextFocus && vim.active && vim.use<C-e> && !inDebugRepl"
},
{
    "key": "ctrl+i",
    "command": "-extension.vim_ctrl+i",
    "when": "editorTextFocus && vim.active && vim.use<C-i> && !inDebugRepl"
},
{
    "key": "ctrl+j",
    "command": "-extension.vim_ctrl+j",
    "when": "editorTextFocus && vim.active && vim.use<C-j> && !inDebugRepl && vim.mode != 'Insert'"
},
{
    "key": "ctrl+k",
    "command": "-extension.vim_ctrl+k",
    "when": "editorTextFocus && vim.active && vim.use<C-k> && !inDebugRepl && vim.mode != 'Insert'"
},
{
    "key": "ctrl+p",
    "command": "-extension.vim_ctrl+p",
    "when": "suggestWidgetVisible && vim.active && vim.use<C-p>"
},
{
    "key": "down",
    "command": "-extension.vim_down",
    "when": "editorTextFocus && vim.active && !inDebugRepl && !suggestWidgetMultipleSuggestions && !suggestWidgetVisible"
},
{
    "key": "left",
    "command": "-extension.vim_left",
    "when": "editorTextFocus && vim.active && !inDebugRepl"
},
{
    "key": "right",
    "command": "-extension.vim_right",
    "when": "editorTextFocus && vim.active && !inDebugRepl"
},
{
    "key": "shift+backspace",
    "command": "-extension.vim_shift+backspace",
    "when": "editorTextFocus && vim.active && vim.use<shift+BS> && !inDebugRepl && vim.mode == 'SearchInProgressMode'"
},
{
    "key": "tab",
    "command": "-extension.vim_tab",
    "when": "editorFocus && vim.active && !inDebugRepl && vim.mode != 'Insert'"
},
{
    "key": "up",
    "command": "-extension.vim_up",
    "when": "editorTextFocus && vim.active && !inDebugRepl && !suggestWidgetMultipleSuggestions && !suggestWidgetVisible"
},
{
    "key": "win+c",
    "command": "-extension.vim_cmd+c",
    "when": "editorTextFocus && vim.active && vim.overrideCopy && vim.use<D-c> && !inDebugRepl"
},
{
    "key": "ctrl+y",
    "command": "editor.action.addSelectionToNextFindMatch",
    "when": "editorFocus"
},
{
    "key": "ctrl+shift+o",
    "command": "workbench.action.files.openFolder"
},
{ "key": "ctrl+/",
    "command": "editor.action.blockComment",
    "when": "editorTextFocus && !editorReadonly"
},
{
    "key": "ctrl+shift+s",
    "command": "workbench.action.files.saveAll"
},
{
    "key": "ctrl+alt+s",
    "command": "workbench.action.files.saveAs"
},
{
    "key": "ctrl+shift+y",
    "command": "editor.action.changeAll",
    "when": "editorTextFocus && !editorReadonly"
},
{
    "key": "ctrl+t",
    "command": "editor.action.formatDocument",
    "when": "editorFocus"
},
{
    "key": "ctrl+shift+t",
    "command": "HookyQR.beautifyFile",
    "when": "editorFocus"
},
{
    "key": "ctrl+j",
    "command": "editor.action.joinLines",
    "when": "editorFocus"
},
{
    "key": "ctrl+m",
    "command": "editor.action.insertSnippet",
    "when": "editorFocus"
},
{
    "key": "alt+enter",
    "command": "editor.action.inspectTMScopes",
    "when": "editorFocus"
},
{
    "key": "ctrl+p",
    "command": "editor.action.transposeLetters",
    "when": "editorFocus"
},
{
    "key": "ctrl+shift+a",
    "command": "eslint.executeAutofix",
    "when": "editorFocus"
},
{
    "key": "ctrl+alt+,",
    "command": "workbench.action.openSnippets",
    "when": "editorFocus"
},
{
    "key": "alt+f2",
    "command": "workbench.action.selectTheme",
    "when": "editorFocus"
},
{
    "key": "ctrl+m",
    "command": "workbench.action.newWindow"
},
{
    "key": "ctrl+shift+,",
    "command": "workbench.action.openGlobalKeybindings"
},
{
    "key": "ctrl+u",
    "command": "workbench.action.tasks.runTask"
},
{
    "key": "f11",
    "command": "workbench.action.toggleZenMode"
},
{
    "key": "ctrl+f5",
    "command": "code-runner.run"
},
{
    "key": "ctrl+i",
    "command": "npm-intellisense.import" ,
    "when": "editorLangId != 'markdown'"
},
{
    "key": "alt+f5",
    "command": "npm-script.run"
},
{ "key": "shift+f5",               "command": "workbench.action.debug.run",
    "when": "!inDebugMode" },
{
    "key": "ctrl+shift+\\",
    "command": "workbench.action.toggleEditorGroupLayout"
},
{
    "key": "ctrl+shift+b",
    "command": "workbench.action.toggleSidebarVisibility"
},
{
    "key": "ctrl+g",
    "command": "markdown.showPreview",
    "when": "editorLangId == 'markdown'"
},
{
    "key": "ctrl+shift+l",
    "command": "workbench.action.gotoLine"
},
{
    "key": "alt+a",
    "command": "workbench.action.increaseViewSize" ,
    "when": "editorLangId != 'markdown'&&editorFocus"
},
{
    "key": "alt+w",
    "command": "workbench.action.joinTwoGroups" ,
    "when": "editorFocus"
},
{ "key": "ctrl+1",                 "command": "workbench.action.openEditorAtIndex1" },
{ "key": "ctrl+2",                 "command": "workbench.action.openEditorAtIndex2" },
{ "key": "ctrl+3",                 "command": "workbench.action.openEditorAtIndex3" },
{ "key": "ctrl+4",                 "command": "workbench.action.openEditorAtIndex4" },
{ "key": "ctrl+5",                 "command": "workbench.action.openEditorAtIndex5" },
{ "key": "ctrl+6",                 "command": "workbench.action.openEditorAtIndex6" },
{ "key": "ctrl+7",                 "command": "workbench.action.openEditorAtIndex7" },
{ "key": "ctrl+8",                 "command": "workbench.action.openEditorAtIndex8" },
{ "key": "ctrl+9",                 "command": "workbench.action.openEditorAtIndex9" },
{ "key": "alt+1",                "command": "workbench.action.focusFirstEditorGroup" },
{ "key": "alt+2",                "command": "workbench.action.focusSecondEditorGroup" },
{ "key": "alt+3",                "command": "workbench.action.focusThirdEditorGroup" },
{
    "key": "ctrl+shift+m",
    "command": "workbench.action.reloadWindow"
},
{
    "key": "alt+.",
    "command": "workbench.action.showEmmetCommands",
    "when": "editorLangId != 'markdown'&&editorFocus"
},
{
    "key": "alt+enter",
    "command": "editor.emmet.action.nextEditPoint",
    "when": "editorFocus"
},
{
    "key": "ctrl+shift+j",
    "command": "editor.emmet.action.mergeLines",
    "when": "editorFocus"
},
{
    "key": "alt+left",
    "command": "editor.emmet.action.removeTag",
    "when": "editorFocus"
},
{
    "key": "alt+right",
    "command": "editor.emmet.action.wrapWithAbbreviation",
    "when": "editorFocus"
},
{
    "key": "alt+shift+right",
    "command": "editor.emmet.action.balanceOut",
    "when": "editorFocus"
},
{
    "key": "alt+shift+left",
    "command": "editor.emmet.action.balanceIn",
    "when": "editorFocus"
},
{
    "key": "alt+shift+enter",
    "command": "editor.emmet.action.updateTag",
    "when": "editorFocus"
},
{
    "key": "ctrl+shift+w",
    "command": "workbench.actions.view.problems"
},
{
    "key": "alt+q",
     "command": "workbench.action.terminal.toggleTerminal"
},
{
    "key": "ctrl+shift+r",
    "command": "workbench.debug.action.toggleRepl"
},
{
    "key": "ctrl+shift+a",
    "command": "autoprefixer.execute",
    "when": "editorTextFocus && editorLangId != 'javascript' && editorLangId != 'typescript'"
},
{
    "key": "ctrl+shift+a",
    "command": "tslint.fixAllProblems",
    "when": "editorTextFocus && editorLangId != 'javascript' && editorLangId != 'less' && editorLangId != 'css'"
},
{
    "key": "ctrl+alt+o",
    "command": "gitProjectManager.openProject"
},
{
    "key": "ctrl+b",
    "command": "workbench.action.openRecent"
},
{
    "key": "ctrl+r",
    "command": "-workbench.action.openRecent"
},
{
    "key": "alt+b",
    "command": "markdown.extension.editing.toggleBold",
    "when": "editorTextFocus && editorLangId == 'markdown'"
},
{
    "key": "alt+c",
    "command": "markdown-preview-enhanced.syncPreview",
    "when": "editorLangId == 'markdown'"
},
{
    "key": "win+`",
    "command": "search.action.collapseSearchResults"
}
]
```
</sourceFile>
***
## 结束
如果你的机器是Windows系统，同时也是VSCode重度使用者，不妨试试我的快捷键，可以让你的操作彻底飞起来~:sunglasses:

欢迎转载本站文章，请注明作者和出处  [simonaking.com](http://simonaking.com)。
<style>.Key{color:#999;font-size:98%;}</style>
