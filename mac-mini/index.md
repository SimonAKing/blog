# Mac Mini 换机指南

Date: 2023-05-22  
Author: SimonAKing  
Categories: 设备  
Tags: MacOS, 设备  
Source: https://simonaking.com/blog/mac-mini/

> 详细记录了从公司 MacBook 迁移到个人 Mac Mini 的全过程，包括系统配置、开发环境搭建、效率工具安装等内容，适合开发者参考。

---
记录我的 Mac Mini 开发环境配置过程，分享一些实用的工具和经验

## 前言

自从工作后，我的学习与办公环境全面迁移到了 MacOS，而旧的 Windows 机逐渐沦为游戏机（虽然没多少时间玩）。由于手头只有公司发放的笔记本，使用时难免有诸多限制。今年 Apple 发布新设备后，我就一直心心念念想入手一台。考虑到自己没有移动办公需求，加上家里有闲置的显示器，最终选择了一台性能强劲的 Mac Mini。

> 购买建议：对于此类重大消费决策，建议不要被社交媒体（小红书、知乎、抖音、Bilibili）的种草内容过度影响。应该根据自己的实际需求做出选择。

我的设备配置如下：

1. 显示器：联想创新 MiniLED 屏幕（22年购入，支持 1000 尼特亮度）
2. 键盘：Magic Keyboard
3. 触控板：Magic Trackpad
4. 主机：Mac Mini 2（M2 Pro、32GB RAM、1TB SSD）
5. 桌面配件：
   - 屏幕支架
   - 屏幕挂灯
   - 桌垫
   - Mini 支架
   - 音响
   - 装饰玩具

![Mac Mini 换机指南 · 前言](./Macmini-换机指南/1.png)

购入新机后的第一步 当然是环境迁移啦，因为手动设备是公司电脑，出于安全考虑 不要用迁移助手，应手动迁移。

## 正文

### 系统环境配置

#### 系统设置

1. Apple ID
   - 登录并同步设置

2. 声音
   - 提醒声音设置为 Breeze

3. 通用
   - 修改设备名称
   - 更新系统到最新版本
   - 关闭所有共享功能
   - 隔空投送与接力设置为"没有人"或"仅当前用户"

4. 外观
   - 始终显示滚动条
   - 点击滚动条时跳转到点击位置

5. 控制中心
   - 仅保留 WiFi、蓝牙、声音的快速访问

6. 隐私与安全性
   - 关闭定位服务

7. 显示器
   - 调整至合适的缩放率（在保证清晰度的前提下最大化显示内容）

8. 墙纸
   - 根据个人喜好设置

9. 锁定屏幕
   - 屏保时间：10分钟
   - 关闭显示器：20分钟
   - 取消登录密码要求

10. 桌面与程序坞
    - 调整大小和放大效果
    - 最小化效果：神奇效果
    - 打开应用时弹跳
    - 连按窗口标题栏：缩放
    - 最小化窗口至应用图标
    - 自动隐藏和显示程序坞
    - 菜单栏：自动隐藏，最多显示10个项目
    - 启用最近使用的应用程序
    - 文档打开偏好：全屏视图
    - 关闭台前调度
    - 调度中心设置：
      - 根据使用情况重新排列
      - 应用切换不自动切换空间
      - 启用程序分组
      - 显示器使用独立空间
    - 禁用所有触发角

#### 设备设置

键盘设置：
- 将重复速率调至最快
- 重复前延迟调至最短
- 启用键盘导航
- Fn 键无操作
- 快捷键：
  - 仅保留调度中心为 Option + Esc
  - 其他全部取消

触控板设置：
- 启用三指拖动功能
- 根据个人习惯调整手势

#### Finder 设置
- 自定义工具栏
- 显示所有文件扩展名
- 显示状态栏
- 设置默认视图偏好

### 软件安装与配置

#### 浏览器

Chrome：
必备扩展：
1. Bitwarden（密码管理）
   - 关闭超时
   - 配置 PIN 码登录
2. Cubox（稍后读）
3. 沉浸式翻译
4. Ad blocker

Arc：
快捷键配置：
- C + D：复制链接
- C + T：快捷栏
- Tab：命令模式

#### 输入法
1. 仅保留 ABC 与搜狗输入法
2. 登录并同步设置
3. 开启所有模糊音
4. 使用 [Boundary](https://github.com/xiaochunjimmy/Sogou-Input-Skin/blob/master/Boundary.mssf) 主题
5. 配置 F15 为切换上一个输入法
6. 配置 ABC 输入法

#### 效率工具
1. Ice（窗口管理）
```bash
brew install jordanbaird-ice
```

2. Snipaste（截图工具）
3. Manico（应用快速启动）
4. Hammerspoon（自动化工具）
```bash
brew install hammerspoon --cask

# 配置示例 option +s 打开软件的设置：
hs.hotkey.bind({ "alt" }, "s", function()
    hs.eventtap.keyStroke({ "cmd" }, ",")
end)
```

5. PasteNow（剪贴板管理）
6. AltTab（窗口切换）
7. Flux（护眼工具）
8. Keycastr（按键显示）
```bash
brew install --cask keycastr
```

9. Applite（应用管理）
```bash
brew install --cask applite
```

10. Input Source Pro（输入法管理）

#### 开发工具
1. VSCode
2. Cursor
3. Goland
4. Warp
5. Postman

Ideavimrc 配置：

<sourceFile>
```txt
" ==================================================
" 配置篇
" ==================================================

" 语法高亮
syntax on

" 关闭自动折行
set nowrap

" 横向滚动一次 40 个字符,
set sidescroll=40
" 垂直滚动时，光标距离顶部/底部的位置（单位：行）
set scrolloff=5
" 水平滚动时，光标距离行首或行尾的位置（单位：字符）。该配置在不折行时比较有用
set sidescrolloff=15

" 不创建备份文件
set noback

" 搜索时，高亮显示匹配结果
" set hlsearch
" 输入搜索模式时，每输入一个字符，就自动跳到第一个匹配的结果
set incsearch
" 搜索时忽略大小写
set ignorecase
" 如果同时打开了ignorecase，那么对于只有一个大写字母的搜索词，将大小写敏感
" 其他情况都是大小写不敏感。比如，搜索Test时，将不匹配test；搜索test时，将匹配Test
set smartcase

" 不与 Vi 兼容（采用 Vim 自己的操作命令）
set nocompatible

" 在状态栏显示光标的当前位置（位于哪一行哪一列）
set ruler
" 显示光标所在的当前行的行号，其他行都为相对于该行的相对行号
set relativenumber
" 显示行号
set number
" 光标所在的当前行高亮
set cursorline
" 是否显示状态栏。0 表示不显示，1 表示只在多窗口时显示，2 表示显示
set laststatus=2
" 命令模式下，在底部显示，当前键入的指令
set showcmd
" 光标遇到圆括号、方括号、大括号时，自动高亮对应的另一个圆括号、方括号和大括号
set showmatch
" 在底部显示，当前处于命令模式还是插入模式
set showmode

" Vim 需要记住多少次历史操作
set history=1000
" 与系统共用剪切板
set clipboard+=unnamed
set clipboard+=ideaput

" 打开文件监视。如果在编辑过程中文件发生外部改变（比如被别的编辑器编辑了），就会发出提示
set autoread

" 支持使用鼠标
set mouse=a

" Tab 转为多少个空格
set softtabstop=2
" 按下回车键后，下一行的缩进会自动跟上一行的缩进保持一致
set autoindent

" 出错时，不要发出响声
set noerrorbells

" 允许退格键在以下场景下正常执行
set backspace=indent,eol,start

" ==================================================
" 插件篇
" ==================================================
" {action}s{surround symbol} {target symbol}
set surround

" {action}ae -> {action}entire-content
set textobj-entire

" auto switch input model
set keep-english-in-normal

" ==================================================
" 映射篇
" ==================================================

" 禁用 esc 键
" inoremap <esc> <nop>

" 禁用方向键
"noremap <up> <nop>
"noremap <down> <nop>
"noremap <left> <nop>
"noremap <right> <nop>

" j k 映射成 gj gk
nnoremap k gk
nnoremap j gj

" 进入 insert model 快捷键
inoremap jk <Esc>
inoremap jj <Esc>

" L 移动到行尾
noremap L $
" H 移动到行首
noremap H ^

" 设置 x c d action 的寄存器不与系统进行交互
nnoremap x "xx
xnoremap x "xx
nnoremap X "xX
xnoremap X "xX
nnoremap c "cc
xnoremap c "cc
nnoremap C "cC
xnoremap C "cC
nnoremap d "dd
vnoremap d "dd
vnoremap D "dD
nnoremap D "dD

" 移动时 自动定位到屏幕中心
noremap j jzz
noremap k kzz
noremap G Gzz
noremap { {zz
noremap } }zz
noremap [{ [{zz
noremap ]} ]}zz

" 使用 Ctrl + j/k 可以滚动屏幕
" nnoremap <C-K> :action EditorScrollUp<CR>
" nnoremap <C-J> :action EditorScrollDown<CR>

" shift+arrow selection
nmap <S-Up> v<Up>
nmap <S-Down> v<Down>
nmap <S-Left> v<Left>
nmap <S-Right> v<Right>
vmap <S-Up> <Up>
vmap <S-Down> <Down>
vmap <S-Left> <Left>
vmap <S-Right> <Right>
imap <S-Up> <Esc>v<Up>
imap <S-Down> <Esc>v<Down>
imap <S-Left> <Esc>v<Left>
imap <S-Right> <Esc>v<Right>

" ==================================================
" Leader 键篇
" ==================================================

let mapleader=' '

" 多窗口操作
" 清除窗口
nnoremap <Leader>wq <C-W>c
" 光标窗口切换
nnoremap <Leader>ww <C-W>w
nnoremap <Leader>wj <C-W>j
nnoremap <Leader>wk <C-W>k
nnoremap <Leader>wh <C-W>h
nnoremap <Leader>wl <C-W>l
" 纵向新增窗口
nnoremap <Leader>ws <C-W>s
" 横向新增窗口
nnoremap <Leader>we <C-W>v

nnoremap <Leader>` :action SplitVertically<CR>

" v 列选择
nnoremap <Leader>v <C-V>

" hl 前进后退
nnoremap <Leader>h :action Back<CR>
nnoremap <Leader>l :action Forward<CR>

" H 替换文本
nnoremap <Leader>H :action Replace<CR>

" jk 错误定位
nnoremap <Leader>k :action GotoPreviousError<CR>
nnoremap <Leader>j :action GotoNextError<CR>

" 最近文件, 最近位置 列表显示
nnoremap <Leader>e :action RecentFiles<CR>
nnoremap <Leader>E :action RecentLocations<CR>

" 书签操作
nnoremap <Leader>q :action ToggleBookmark<CR>
nnoremap <Leader>Q :action ShowBookmarks<CR>

" 注释与重命名
nnoremap <Leader>r :action CommentByLineComment<CR>
nnoremap <Leader>R :action RenameElement<CR>

" 跳转到定位
nnoremap <Leader>d :action GotoDeclaration<CR>

" 查看使用案例
nnoremap <Leader>D :action FindUsages<CR>

" 展示错误信息
nnoremap <Leader>a :action ShowErrorDescription<CR>

" 展示文件内的大纲
nnoremap <Leader>o :action FileStructurePopup<CR>

" 使用 ESLint 格式化代码
nnoremap <Leader>t :action Javascript.Linters.EsLint.Fix<CR>
" 格式化代码
nnoremap <Leader>T :action ReformatCode<CR>

" 展示文件路径 可以快速打 Finder 中打开
nnoremap <Leader>F :action ShowFilePath<CR>

" 切换断点
nnoremap <Leader>b :action ToggleLineBreakpoint<CR>

" 聚焦项目栏
nnoremap <Leader>\ :action SelectInProjectView<CR>

" 显示隐藏 Todo List
nnoremap <Leader>A :action ActivateTODOToolWindow<CR>

" 显示隐藏 Git Panel
nnoremap <Leader>g :action ActivateVersionControlToolWindow<CR>

" 隐藏激活面板
nnoremap <Leader>z :action HideActiveWindow<CR>

" 应用建议
nnoremap <Leader>s :action ShowIntentionActions<CR>

" 数字加减
nnoremap <Leader>- <C-x>
nnoremap <Leader>= <C-a>

" 主题列表
nnoremap <Leader>1 :action ChangeLaf<CR>

" Reload .ideavimrc
nnoremap <Leader>S :source ~/.ideavimrc<CR>
```
</sourceFile>

#### 常用软件
1. 微信
2. 飞书
3. Telegram
4. 网易云音乐

#### 编辑器配置

Vim/Neovim：
1. 安装
```bash
# 安装 Vim（可选）
brew install vim

# 安装 Neovim
brew install neovim

# 安装 LazyVim（可选）
git clone https://github.com/LazyVim/starter ~/.config/nvim
rm -rf ~/.config/nvim/.git
```

2. Vim 配置

<sourceFile>
```vim
" ==================================================
" 配置篇
" ==================================================

" 语法高亮
syntax on

" 关闭自动折行
set nowrap

" 横向滚动一次 40 个字符
set sidescroll=40
" 垂直滚动时，光标距离顶部/底部的位置（单位：行）
set scrolloff=5
" 水平滚动时，光标距离行首或行尾的位置（单位：字符）
set sidescrolloff=15

" 搜索时，高亮显示匹配结果
" set hlsearch
" 输入搜索模式时，每输入一个字符，就自动跳到第一个匹配的结果
set incsearch
" 搜索时忽略大小写
set ignorecase
" 如果同时打开了ignorecase，那么对于只有一个大写字母的搜索词，将大小写敏感
set smartcase

" 不与 Vi 兼容（采用 Vim 自己的操作命令）
set nocompatible

" 显示行号和当前位置
set ruler
set relativenumber
set number
set cursorline
set laststatus=2
set showcmd
set showmatch
set showmode

" 历史记录和剪贴板
set history=1000
set clipboard+=unnamed

" 其他设置
set autoread
set mouse=
set softtabstop=2
set autoindent
set noerrorbells
set backspace=indent,eol,start
```
</sourceFile>

#### 编程语言环境

1. Rust 环境
```bash
# 安装 rustup
brew install rustup

# 初始化
rustup-init

# 验证安装
rustc -V
```

2. Python 环境
```bash
brew install pyenv
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.zshrc
echo 'command -v pyenv >/dev/null || export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.zshrc
echo 'eval "$(pyenv init -)"' >> ~/.zshrc

pyenv install 2.7.9
pyenv install 3.11
```

3. Go 环境
```bash
bash < <(curl -s -S -L https://raw.githubusercontent.com/moovweb/gvm/master/binscripts/gvm-installer)
source ~/.gvm/scripts/gvm

gvm listall
gvm install go1.20.4
gvm use go1.20.4 --default
```

4. Java 环境
```bash
curl -s "https://get.sdkman.io" | bash
source "~/.sdkman/bin/sdkman-init.sh"
sdk install java
```

#### 命令行工具增强

1. zoxide（目录快速跳转）
```bash
brew install zoxide
# 在 .zshrc 中添加
eval "$(zoxide init zsh --cmd cd)"
```

1. fd（文件查找）
```bash
brew install fd
```

2. fzf（模糊查找）
```bash
brew install fzf
$(brew --prefix)/opt/fzf/install
```

3. bat（文件查看）
```bash
brew install bat
```

4. dust（磁盘空间分析）
```bash
brew install dust
```

5. eza（ls 替代）
```bash
brew install eza
```

6. bottom（系统监控）
```bash
brew install bottom
```

7. broot（文件浏览）
```bash
brew install broot
```

8. difftastic（代码比较）
```bash
brew install difftastic
git config --global diff.external difft
```

9. jq（JSON 处理）
```bash
brew install jq
```

10. httpie（HTTP 客户端）
```bash
brew install httpie
```

11. the_silver_searcher（代码搜索）
```bash
brew install the_silver_searcher
```

12. ouch（解压缩工具）
```bash
brew install ouch
```

#### Shell 配置

ZSH 插件：
1. 必备插件
```bash
# zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

# fast-syntax-highlighting
git clone https://github.com/zdharma-continuum/fast-syntax-highlighting.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/fast-syntax-highlighting

# you-should-use
git clone https://github.com/MichaelAquilina/zsh-you-should-use.git $ZSH_CUSTOM/plugins/you-should-use

# git-open
git clone https://github.com/paulirish/git-open.git $ZSH_CUSTOM/plugins/git-open

# zsh-vi-mode
git clone https://github.com/jeffreytse/zsh-vi-mode $ZSH/custom/plugins/zsh-vi-mode

# zsh-completions
git clone https://github.com/zsh-users/zsh-completions ${ZSH_CUSTOM:=~/.oh-my-zsh/custom}/plugins/zsh-completions

# history-substring-search
git clone https://github.com/zsh-users/zsh-history-substring-search ${ZSH_CUSTOM:=~/.oh-my-zsh/custom}/plugins/zsh-history-substring-search

# fzf-tab
git clone https://github.com/Aloxaf/fzf-tab ${ZSH_CUSTOM:=~/.oh-my-zsh/custom}/plugins/fzf-tab
```

2. 插件配置
```bash
plugins=(
  zsh-autosuggestions
  fast-syntax-highlighting
  command-not-found
  you-should-use
  git-open
  vi-mode
  zsh-vi-mode
  sudo
  zsh-completions
  history-substring-search
  fzf-tab
)
```

ZSH 配置：

<sourceFile>
```bash
# 用户设置
DEFAULT_USER=majin
export USER=majin

# 基础配置
export ZSH="$HOME/.oh-my-zsh"
export LANGUAGE=en_US.UTF-8
export EDITOR='code'

# 历史记录
HIST_STAMPS="yyyy-mm-dd"
HISTFILE=~/.zsh_history
SAVEHIST=10000000

# 环境变量
export PATH=/usr/bin:$PATH
export PNPM_HOME="$HOME/Library/pnpm"
export PATH="$PNPM_HOME:$PATH"
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin

# 代理设置
export https_proxy=http://127.0.0.1:7897 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7897

# Shell 选项
setopt no_beep
setopt LOCAL_OPTIONS
setopt LOCAL_TRAPS
setopt no_flow_control
setopt transient_rprompt
setopt HIST_REDUCE_BLANKS

# 历史记录选项
setopt EXTENDED_HISTORY
setopt INC_APPEND_HISTORY
setopt SHARE_HISTORY
setopt HIST_EXPIRE_DUPS_FIRST
setopt HIST_IGNORE_DUPS
setopt HIST_IGNORE_ALL_DUPS
setopt HIST_FIND_NO_DUPS
setopt HIST_IGNORE_SPACE
setopt HIST_SAVE_NO_DUPS
setopt HIST_VERIFY
setopt APPEND_HISTORY
setopt HIST_NO_STORE

# 其他选项
setopt prompt_subst
setopt CORRECT
setopt complete_in_word
setopt IGNORE_EOF

# VI 模式设置
ZVM_VI_INSERT_ESCAPE_BINDKEY=jj

# 按键绑定
bindkey "^[[A" history-substring-search-up
bindkey "^[[B" history-substring-search-down
bindkey '\e[A' history-substring-search-up
bindkey '\e[B' history-substring-search-down
bindkey '\eOA' history-substring-search-up
bindkey '\eOB' history-substring-search-down

# FZF 配置
export FZF_PREVIEW_COMMAND="([[ -f {} ]] && (bat --style=numbers --color=always {} || cat {})) || ([[ -d {} ]] && (tree -C {} | less)) || echo {} 2> /dev/null | head -200"
export FZF_DEFAULT_OPTS="--multi --cycle --inline-info --ansi --border --layout=default --height 80% --no-reverse --preview-window=:hidden --bind '?:toggle-preview'"
export FZF_DEFAULT_COMMAND="ag --ignore-dir .git --ignore-dir .idea --ignore-dir .vscode --ignore-dir node_modules --ignore-dir pkg --ignore-dir bin --ignore-dir github.com --ignore-dir dist  -g ''"
export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_OPTS"
export FZF_CTRL_R_OPTS="$FZF_DEFAULT_OPTS"

# FZF-TAB 样式
zstyle ':fzf-tab:complete:kill:argument-rest' fzf-flags '--preview-window=down:3:wrap'
zstyle ':fzf-tab:complete:kill:argument-rest' fzf-preview 'ps --pid=$word -o cmd --no-headers -w -w'
zstyle ':fzf-tab:complete:kill:*' popup-pad 0 3
zstyle ':fzf-tab:complete:cd:*' fzf-preview 'eza -1 --color=always $realpath'
zstyle ':fzf-tab:complete:cd:*' popup-pad 30 0
zstyle ":fzf-tab:*" fzf-flags --color=bg+:23
zstyle ':fzf-tab:*' fzf-command ftb-tmux-popup
zstyle ':fzf-tab:*' switch-group ',' '.'
zstyle ':fzf-tab:*' fzf-preview '([[ -f $realpath ]] && (bat --style=numbers --color=always $realpath || cat $realpath)) || ([[ -d $realpath ]] && (tree -C $realpath | less)) || echo $realpath 2> /dev/null | head -200'

# 补全样式
zstyle ':completion:*' list-colors ${(s.:.)LS_COLORS}
zstyle ":completion:*:git-checkout:*" sort false
zstyle ':completion:*' file-sort modification
zstyle ':completion:files' sort false
zstyle ':completion:*:eza' sort false

# 别名设置
alias cat='bat --paging=never'
alias du='dust'
alias vim='nvim'
alias ls="eza"
alias mkdir='mkdir -pv'
alias cp='cp -i'
alias rm='rm -i'
alias mv='mv -i'
alias cls='clear'
alias extract='ouch'
alias ss="br"
alias diff="difft"
alias bi="brew install"
alias bs="brew search"
alias python='python3'
alias gs='git status'
alias gc='git checkout'
alias log="git log --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit --date=relative --graph --decorate"
alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'
alias .....='cd ../../../..'
alias ~="cd ~"
alias -- -="cd -"
alias config='code ~/.zshrc'
alias reload='source ~/.zshrc'
alias nc='rm -rf node_modules && rm -rf {package-lock.json,yarn.lock,pnpm-lock.yaml}'
alias kp="kill-port"

# 文件类型关联
alias -s {html,css,js}=code
alias -s git="git clone --depth 1"

# 自定义函数
function copy() {
  pbcopy < $1
}

# 工具初始化
eval "$(zoxide init zsh --cmd cd)"
source $HOME/.config/broot/launcher/bash/br
eval "$(fnm env --use-on-cd)"
[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh
export PATH="/opt/homebrew/bin:$PATH"
```
</sourceFile>

#### 字体配置

1. 编程字体
```bash
brew install font-roboto
brew install font-fira-code
brew install font-jetbrains-mono
brew install font-source-code-pro
```

2. Nerd Font
```bash
brew tap homebrew/cask-fonts
brew install font-jetbrains-mono-nerd-font font-fira-code-nerd-font
```

### 系统优化

#### 管理员权限配置
管理员权限配置：
```bash
# 编辑 sudoers 文件
sudo vim /etc/sudoers

# 修改配置
%admin ALL = (ALL) NOPASSWD: ALL
```

#### 系统调优
系统调优：
```bash
# 默认保存到本地而非 iCloud
defaults write NSGlobalDomain NSDocumentSaveNewDocumentsToCloud -bool false

# 显示隐藏文件
defaults write com.apple.Finder AppleShowAllFiles -bool true

# 扩展保存面板
defaults write NSGlobalDomain NSNavPanelExpandedStateForSaveMode -bool true
defaults write NSGlobalDomain PMPrintingExpandedStateForPrint -bool true

# 显示控制字符
defaults write NSGlobalDomain NSTextShowsControlCharacters -bool true

# 清理"打开方式"菜单
/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister -kill -r -domain local -domain system -domain user

# 禁用自动启动照片应用
defaults -currentHost write com.apple.ImageCapture disableHotPlug -bool true
```

#### 按键映射
按键映射：
将 Capslock 映射为 F15：

1. 创建文件：`~/Library/LaunchAgents/com.tomotoes.CapslockF15.plist`
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>com.tomotoes.CapslockF15</string>
    <key>ProgramArguments</key>
    <array>
      <string>/usr/bin/hidutil</string>
      <string>property</string>
      <string>--set</string>
      <string>{"UserKeyMapping":[{"HIDKeyboardModifierMappingSrc":0x700000039,"HIDKeyboardModifierMappingDst":0x70000006A}]}</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
  </dict>
</plist>
```

## 结语

参考：
- [Mac Setup for Web Development](https://www.robinwieruch.de/mac-setup-web-development/)
- [New Mac Setup 2021](https://www.swyx.io/new-mac-setup-2021)
- [Setting up a Brand New Mac for Development](https://www.taniarascia.com/setting-up-a-brand-new-mac-for-development/)
- [Awesome Alternatives in Rust](https://github.com/TaKO8Ki/awesome-alternatives-in-rust)

本文详细记录了我从公司 MacBook 迁移到个人 Mac Mini 的全过程。无论你是刚入手 Mac，还是想优化现有的开发环境，相信这篇文章都能为你提供有价值的参考。

欢迎转载本站文章，请注明作者和出处 [SimonAKing](http://simonaking.com)。
