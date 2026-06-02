# 服务器初始化

Date: 2019-05-05  
Author: SimonAKing  
Categories: 开源  
Tags: 开源, Linux  
Source: https://simonaking.com/blog/server-initialization-step/

> 记一下服务器的初始配置，Centos 初始化的脚本汇总。

---
记一下服务器的初始配置。

## 前言

前些日子，入手了一台服务器，特此记录一下它的初始配置。



## 正文

*注：本人主机为 CentOS 7 x64系统，以下内容均基于此环境*。




### 安全设置

请查考 [肉鸡是怎样炼成的](https://simonaking.com/blog/server-security-manual/)



### 字符集修改

```sh
cd /etc/sysconfig/

sudo vi i18n
LANG="zh_CN.utf8"

source  /etc/sysconfig/i18n
```



### 设置 DNS

```sh
vi /etc/resolv.conf
nameserver 114.114.114.114
nameserver 8.8.8.8
```



### 配置 Yum 源

```sh
cd /etc/yum.repos.d/
sudo mv CentOS-Base.repo CentOS-Base.repo_bak

sudo wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
yum clean all
yum makecache
```



### 设置时区

```sh
yum install ntp -y
timedatectl set-timezone Asia/Shanghai
timedatectl set-ntp yes	#同步
timedatectl # 查看时区
```



### 软件安装

#### 常用软件

```sh
yum install epel-release -y
yum -y update
yum clean all
yum makecache
yum -y install wget bind-utils net-tools lrzsz gcc gcc-c++ make cmake libxml2-devel openssl-devel curl curl-devel unzip sudo ntp libaio-devel wget ncurses-devel autoconf automake zlib-devel  python-devel
```

#### Vim

```sh
yum -y install vim
curl -sLf https://spacevim.org/cn/install.sh | bash -s -- -h

vi  ~/.SpaceVim.d/
```

#### Git

```sh
yum -y install git
git config --global user.name SimonAKing
git config --global user.email hi@simonaking.com
git config --global http.sslverify false
git config --global https.sslverify false

# 远程仓库密钥生成
ssh-keygen -t rsa -C "hi@simonaking.com"
```

#### Zsh

```sh
# 安装 zsh 包
yum -y install zsh

# 切换默认shell为zsh
chsh -s /bin/zsh

# 重启服务器
reboot

# 安装on my zsh

sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"

vi ~/.zshrc
ZSH_THEME="agnoster"

# autojump
yum install autojump -y
yum install autojump-zsh


# zsh-autosuggestions
git clone git://github.com/zsh-users/zsh-autosuggestions $ZSH_CUSTOM/plugins/zsh-autosuggestions

# zsh-syntax-highlighting
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

# 配置.zshrc文件
plugins=(
  git
  autojump
  zsh-autosuggestions
  zsh-syntax-highlighting
  z
  extract
)

source ~/.zshrc

更新
upgrade_oh_my_zsh
卸载
uninstall_oh_my_zsh
```

1. 连按两次Tab会列出所有的补全列表并直接开始选择，补全项可以使用 ctrl+n/p/f/b上下左右切换
  2. 命令选项补全。在zsh中只需要键入 tar -<tab> 就会列出所有的选项和帮助说明
  3. 命令参数补全。键入 kill <tab> 就会列出所有的进程名和对应的进程号
  4. 更智能的历史命令。在用或者方向上键查找历史命令时，zsh支持限制查找。比如，输入ls,然后再按方向上键，则只会查找用过的ls命令。而此时使用则会仍然按之前的方式查找，忽略 ls
  5. 多个终端会话共享历史记录
  6. 智能跳转，安装了 autojump 之后，zsh 会自动记录你访问过的目录，通过 j 目录名 可以直接进行目录跳转，而且目录名支持模糊匹配和自动补全，例如你访问过 hadoop-1.0.0 目录，输入j hado 即可正确跳转。j --stat 可以看你的历史路径库。
  7. 目录浏览和跳转：输入 d，即可列出你在这个会话里访问的目录列表，输入列表前的序号，即可直接跳转。
  8. 在当前目录下输入 .. 或 ... ，或直接输入当前目录名都可以跳转，你甚至不再需要输入 cd 命令了。在你知道路径的情况下，比如 /usr/local/bin 你可以输入 cd /u/l/b 然后按进行补全快速输入
  9. 通配符搜索：ls -l **/*.sh，可以递归显示当前目录下的 shell 文件，文件少时可以代替 find。使用 **/ 来递归搜索
  10. 扩展环境变量，输入环境变量然后按 就可以转换成表达的值
  11. 在 .zshrc 中添加 setopt HIST_IGNORE_DUPS 可以消除重复记录，也可以利用 sort -t ";" -k 2 -u ~/.zsh_history | sort -o ~/.zsh_history 手动清除
  12. 至此，你现在的zsh应该具备如下几个特性：
      1. 各种补全：路径补全、命令补全，命令参数补全，插件内容补全等等。触发补全只需要按一下或两下`tab`键，补全项可以使用`ctrl+n/p/f/b上下左右`切换。比如你想杀掉java的进程，只需要输入`kill java + tab键`，如果只有一个java进程，zsh会自动替换为进程的pid，如果有多个则会出现选择项供你选择。`ssh + 空格 + 两个tab键`，zsh会列出所有访问过的主机和用户名进行补全；
      2. 即使你没有安装`autojump`，只要输入`d`，就会列出你在这个回话中访问的目录，输入前面的序号，就可以直接跳转；
      3. 可以忽略cd命令, 输入`..`或者`...`和当前目录名都可以跳转；
         当然，除了上面几点，zsh还有很多丰富的插件可以使用，这就需要继续的探索了...


#### Nodejs

```sh
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
source   ~/.bashrc

# 安装node的最新稳定版
nvm install stable

# 查看安装版本
nvm list

# 配置
npm config set registry https://registry.npm.taobao.org
npm config set disturl https://npm.taobao.org/dist
npm config set puppeteer_download_host https://npm.taobao.org/mirrors
```


#### Nginx

```sh
sudo rpm -Uvh http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm

sudo yum install -y nginx

# 启动 Nginx
sudo systemctl start nginx.service

# 将 Nginx 加入到开机启动
sudo systemctl enable nginx.service
```



### 命令别名

```sh
vi ~/.zshrc

alias shadow='/etc/init.d/shadowsocks'
alias vi='vim'

alias ls='ls --color=auto'
alias ll="ls --color -al"
alias grep='grep --color=auto'

# 查看当前时间
alias now='date "+%Y-%m-%d %H:%M:%S"'

alias reboot='sudo /sbin/reboot'
alias poweroff='sudo /sbin/poweroff'
alias halt='sudo /sbin/halt'
alias shutdown='sudo /sbin/shutdown'

# 自动创建父目录
alias mkdir='mkdir -pv'

# 解压任何文件
extract() {
    if [ -f $1 ] ; then
      case $1 in
        *.tar.bz2)   tar xjf $1     ;;
        *.tar.gz)    tar xzf $1     ;;
        *.bz2)       bunzip2 $1     ;;
        *.rar)       unrar e $1     ;;
        *.gz)        gunzip $1      ;;
        *.tar)       tar xf $1      ;;
        *.tbz2)      tar xjf $1     ;;
        *.tgz)       tar xzf $1     ;;
        *.zip)       unzip $1       ;;
        *.Z)         uncompress $1  ;;
        *.7z)        7z x $1        ;;
        *)     echo "'$1' cannot be extracted via extract()" ;;
         esac
     else
         echo "'$1' is not a valid file"
     fi
}

# 查看文件/目录大小
alias size='f(){ du -sh $1* | sort -hr; }; f'

# 开放端口
alias portopen='f(){ /sbin/iptables -I INPUT -p tcp --dport $1 -j ACCEPT; }; f'
# 关闭端口
alias portclose='f(){ /sbin/iptables -I INPUT -p tcp --dport $1 -j DROP; }; f'

# 解压
alias untar='tar xvf '

alias -s html='vim'   # 在命令行直接输入后缀为 html 的文件名，会在 Vim 中打开
alias -s rb='vim'     # 在命令行直接输入 ruby 文件，会在 Vim 中打开
alias -s py='vim'      # 在命令行直接输入 python 文件，会用 vim 中打开，以下类似
alias -s js='vim'
alias -s md='vim'
alias -s mjs='vim'
alias -s css='vim'
alias -s c='vim'
alias -s java='vim'
alias -s txt='vim'
alias -s gz='tar -xzvf' # 在命令行直接输入后缀为 gz 的文件名，会自动解压打开
alias -s tgz='tar -xzvf'
alias -s zip='unzip'
alias -s bz2='tar -xjvf'
alias -s json='vim'
alias -s go='vim'

alias cat=ccat
alias man=tldr
eval "$(thefuck --alias)"

# Load zsh-syntax-highlighting.
source ~/.oh-my-zsh/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
#
# Load zsh-autosuggestions.
source ~/.oh-my-zsh/plugins/zsh-autosuggestions/zsh-autosuggestions.zsh
#

# Enable autosuggestions automatically.
ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE="fg=10"

# 保存
source ~/.zshrc
```

```sh
# 列出 bash 别名
alias

# 创建一个 bash shell 别名
alias name=value
alias c='clear'

# 删除别名
unalias aliasname

# 如果想要使别名永久生效， 请编辑
vi ~/.zshrc
```



### 安装

这两天，我完成了 `CentosInit` 项目，一个高度自定义的 Centos 初始化脚本。

[项目地址](<https://github.com/SimonAKing/Centos-init>)
欢迎 `Star` , `PR` !

如果你想快速配置以上初始化措施，请执行以下命令：

**通过 curl**

```sh
sh -c "$(curl -fsSL https://simonaking.com/Centos-init/install.sh)"
```

**通过 wget**

```sh
sh -c "$(wget https://simonaking.com/Centos-init/install.sh -O -)"
```

#### 基本介绍

脚本功能一共分为四大类:

1. 初始化配置（update）

   ```sh
   updateLanguage
   updateTime
   updateLanguage
   updateTime
   updateDNS
   updateYumSource
   updateHostname
   updateUlimit
   updateCoreConfig
   ```

2. 安装常用软件（install）

   ```sh
   installCommonSoft
   installGit
   installVim
   installZsh
   installNode
   installNpmPackages
   installPython
   installPipPackages
   installDocker
   installNginx
   installCcat
   installShadowSocks
   ```

3. 配置安装后的软件（config）

   ```sh
   configVim
   configZsh
   configGit
   configNode
   configDocker
   configNginx
   configShadowSocks
   ```

4. 必要的安全配置（secure）

   - 基础项

     ```sh
     deleteOrLockUnnecessaryUsersAndGroups
     setPrivileges
     closeCtrlAltDel
     closeIpv6
     closeSELinux
     ```

   - 高阶项

     ```sh
        updateSSHPort
        useKeyLogin
        useIptable
        preventCrackingPassword
     ```

   - 用户相关项

     ```sh
        getUserInfo
        addUser
        joinWheelGroup
        banRootLogin
     ```



#### 单独功能安装

如果你想安装某一种功能`( Update | Install | Config | Secure )`

请参考以下案列:

```sh
# 在安装命令前设置 ONLY_UPDATE=Y 即可只安装 update 服务
ONLY_UPDATE=Y sh -c "$(curl -fsSL https://simonaking.com/Centos-init/install.sh)"

# Install and Config
ONLY_INSTALL=Y ONLY_CONFIG=Y sh -c "$(curl -fsSL https://simonaking.com/Centos-init/install.sh)"
```



#### 交互模式

你也设置设置交互模式，在交互模式下，可高达自定义化你想使用的功能。

每执行完一项功能，都会询问你下一步。



使用功能的方法如下:

```sh
# 在安装命令前设置 INTERACTIVE=Y
INTERACTIVE=Y sh -c "$(curl -fsSL https://simonaking.com/Centos-init/install.sh)"
```





## 结束语

欢迎转载本站文章，请注明作者和出处  [simonaking.com](http://simonaking.com)。
