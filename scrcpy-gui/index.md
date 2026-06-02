# [开源福利]Scrcpy-GUI

Date: 2019-08-24  
Author: SimonAKing  
Categories: 开源  
Tags: 工具, 开源  
Source: https://simonaking.com/blog/scrcpy-gui/

> Scrcpy-GUI, 展示并控制你的 Android 设备

---
高效控制你的 Android 设备。
## 前言

### 💡简介
<div align=center><img width="508" height="785.6" src="https://cdn.jsdelivr.net/gh/SimonAKing/images/scrcpy-gui/Chinese.gif"/></div>
<div align=center><img src="https://cdn.jsdelivr.net/gh/SimonAKing/images/scrcpy-gui/loading.gif"/></div>


[Scrcpy](https://github.com/Genymobile/scrcpy) 是由流行的`Android`模拟器`Genymotion`背后的团队创建的，但它本身并不是`Android`模拟器，它显示和控制通过`USB`（或通过`TCP/IP`）连接的`Android`设备，它不需要任何`root`访问权限，它适用于`GNU/Linux`、`Windows`和`MacOS`。

`Scrcpy`的工作原理是在你的`Android`设备上运行服务器，桌面应用程序使用`USB`（或使用`ADB`隧道无线）进行通信。服务器流式传输设备屏幕的[H.264](https://translate.googleusercontent.com/translate_c?depth=1&rurl=translate.google.com&sl=en&sp=nmt4&tl=zh-CN&u=https://en.wikipedia.org/wiki/H.264/MPEG-4_AVC&xid=25657,15700019,15700124,15700186,15700190,15700201,15700237,15700242,15700248&usg=ALkJrhiJZJWaUqBVRqUviQ4IlhKQCwqp_Q)视频。 客户端解码视频帧并显示它们。客户端捕获输入（键盘和鼠标）事件，将它们发送到服务器，服务器将它们注入设备。[文档](https://github.com/Genymobile/scrcpy/blob/master/DEVELOP.md)提供了更多详细信息。

如果你想在桌面上看到你的`Android`屏幕与应用程序或内容进行交互，记录你的手机屏幕或执行其他基本任务，那`Scrcpy`就是一个好的选择。

简而言之，`Scrcpy`是一种极好的方式，可以在你的计算机上轻松查看你的`Android`屏幕，并且可以实时与其进行交互。

*引用自[云网牛站](https://ywnz.com/linuxsj/5581.html)*



### ✨亮点

- **亮度** （原生，仅显示设备屏幕）
- **表演** （30~60fps）
- **质量** （1920×1080或以上）
- **低延迟** （70~100ms）
- **启动时间短** （显示第一张图像约1秒）
- **非侵入性** （设备上没有安装任何东西）
- **不需要 ROOT**
- **有线无线都可连接**
- **可以随便调整界面和码率**
- **画面随意裁剪，自带录屏（手游直播利器）**
- **支持多设备同时投屏**
- **利用电脑的键盘和鼠标可以控制手机**
- **把 APK 文件拖拽到电脑窗口即可安装应用到手机，把普通文件拖拽到窗口即可复制到手机**
- **手机电脑共享剪贴板**
- **自动检测USB连接的应用**
- **可直接添加设备的局域网IP，达到无线控制的效果**
- **将自动保存连接过的IP地址，下次输入时，自动提醒**
- **支持设备别名**
- **支持中英两种语言**
- **Tray menu**
- 等等等...

*部分引用自[最美应用](http://zuimeia.com/app/6771/?platform=2)*




## 正文
### 🌞要求

1. `Android 5.0`以上

2. 打开USB调试

   在 `开发人员选项` 打开 `USB调试`，USB连接手机

3. 安装好`ADB` ，并配置环境变量。

   [Windows](https://dl.google.com/android/repository/platform-tools-latest-windows.zip)
   [Mac OS](https://dl.google.com/android/repository/platform-tools-latest-darwin.zip)
   [Linux](https://dl.google.com/android/repository/platform-tools-latest-linux.zip)

   在任何路径下打开命令行，键入 `ADB` 有反馈。

4. 安装好`scrcpy`，并配置环境变量

  - Windows

    Windows 可以使用包含所有依赖项（包含`adb`）的预构建存档：

    下载下面`scrcpy`的压缩包，里面有`ADB`文件，然后把解压后的`scrcpy`文件夹添加到环境变量，再重启电脑，就可以了。

    1. [`scrcpy-win32-v1.10.zip`](https://github.com/Genymobile/scrcpy/releases/download/v1.10/scrcpy-win32-v1.10.zip)
    2. [`scrcpy-win64-v1.10.zip`](https://github.com/Genymobile/scrcpy/releases/download/v1.10/scrcpy-win64-v1.10.zip)

    你也可以[手动构建](https://github.com/Genymobile/scrcpy/blob/master/BUILD.md)。

  - Mac OS

    可以使用 [Homebrew](https://brew.sh/) 来安装：

    ```
    brew install scrcpy
    ```

    如果你还没有安装`ADB`，可以使用下面的命令：

    ```
    brew cask install android-platform-tools
    ```

    当然，你也可以[手动构建](https://github.com/Genymobile/scrcpy/blob/master/BUILD.md)。

  - Linux

    你可能需要[手动构建应用程序](https://github.com/Genymobile/scrcpy/blob/master/BUILD.md)。别担心，这并不难。

    此外，提供了 [Snap](https://en.wikipedia.org/wiki/Snappy_(package_manager)) 包：[`scrcpy`](https://snapstats.org/snaps/scrcpy)

    对于 Arch Linux， 可以使用 [AUR](https://wiki.archlinux.org/index.php/Arch_User_Repository) 包：[`scrcpy`](https://aur.archlinux.org/packages/scrcpy/)

    对于 Gentoo，可以使用 [Ebuild](https://wiki.gentoo.org/wiki/Ebuild) 包： [`scrcpy/`](https://github.com/maggu2810/maggu2810-overlay/tree/master/app-mobilephone/scrcpy)



### 🎉安装

点击此处下载[应用](https://github.com/SimonAKing/scrcpy-gui/releases)。



### 🎇使用

#### 连接方法

##### 必备条件

- 请确保 **adb , scrcpy** 可正常使用
- 请确保手机已打开 USB 调试, 并已认证电脑调试

##### 有线连接

1. 请确保手机已通过数据线连接到电脑

2. 等待软件自动检测到设备
3. 选中设备，点击`打开选中的镜像`
4. 等待设备打开

##### 无线连接

1. 请确保手机与电脑处在同一局域网

2. 第一次无线连接时:
   - **请确保手机已通过数据线连接到电脑**
   - **请确保只有一个手机通过数据线连接到电脑**
   - 第一次需设置端口，以后连接手机，只需要添加手机的静态IP即可

3. 输入手机的局域网`IP`地址（如果`IP`为`DHCP`分配，请更改为静态`IP`）

4. 点击`开启无线连接`

5. 等待无线连接成功

6. 选中设备，点击`打开选中的镜像`

7. 等待设备打开



### 🎯开发

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build

# lint all JS/Vue component files in `src/`
npm run lint
```



### 📃协议

**GNU GPLv3**

## 结束语

[Scrcpy-GUI](https://github.com/SimonAKing/scrcpy-gui)

如果你有任何问题，欢迎提交 `Issues` 或 `PR`！

欢迎转载本站文章，请注明作者和出处  [SimonAKing](http://simonaking.com)。
