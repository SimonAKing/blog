# 肉鸡是怎样炼成的

Date: 2019-04-30  
Author: SimonAKing  
Categories: Linux  
Tags: Linux, 信安  
Source: https://simonaking.com/blog/server-security-manual/

> 服务器安全防范。

---
你的服务器正在被攻击！

## 前言

安全是一个服务器最基本的必备条件，在创建了服务器之后，你首先要做的事情就是将服务器加固。

由于服务器就相当于一台拥有独立IP的、直接暴露于互联网之上的电脑，这在为你带来便利的同时也直接让你的服务器与危险画上了等号，密码穷举、DDOS攻击、各种各样你想到的、想不到的攻击方法都在等着你。

说不定你的服务器正在被攻击！



## 正文

*注：本人主机为 CentOS 7 x64系统，以下内容均基于此环境*。

### 查看攻击情况

1. 查看登录失败的日志

   ```sh
   sudo lastb
   ```

2. 统计尝试暴力破解机器密码的IP

   ```sh
   sudo grep "Failed password for invalid" /var/log/secure | awk '{print $13}' | sort | uniq -c | sort -nr | more
   ```

3. 统计有哪些用户名尝试登录

   ```sh
   sudo grep "Failed password for invalid" /var/log/secure | awk '{print $11}' | sort | uniq -c | sort -nr | more
   ```



嗯哼，结果可怕吗?



### 安全措施

#### 禁止 root

**永远不要以 `root` 登录服务器。**

你可以新建一个用户来管理，而非直接使用root用户，防止密码被破解。

1. 增加用户

   ```sh
   useradd -m username
   # -m 可以为用户创建相应的帐号和用户目录/home/username
   ```

2. 设置新用户密码

   ```sh
   passwd username
   ```

3. 将新用户加入到 `Wheel` 组

   ```sh
   usermod -G wheel username
   ```

4. 限制`su`命令

   ```shell
   vi /etc/pam.d/su

   # 去除下面命令的注释
   #auth required pam_wheel.so use_uid

   # 只允许管理员组的用户执行 sh 命令
   echo "SU_WHEEL_ONLY yes">>/etc/login.defs
   ```

5. 除去验证密码

  ```sh
  vi /etc/sudoers
  # 在 root 下面增加 以下内容：
username ALL=(ALL) NOPASSWD: ALL
  ```

6. 禁止 `root` 登陆

   ```sh
   vi /etc/ssh/sshd_config

   PermitRootLogin no #禁止root登录
   PermitEmptyPasswords no #禁止空密码登录
   AllowUsers username #设置刚才创建的用户可以登录
   ```

7. 重启服务器

  ```sh
  reboot
  ```



#### 禁用不必要的账号

```sh
passwd -l dbus
passwd -l nobody
passwd -l ftp
passwd -l mail
passwd -l shutdown
passwd -l halt
passwd -l operator
passwd -l sync
passwd -l adm
passwd -l lp
```



#### 禁止非授权用户获得权限

```sh
sudo chattr +i /etc/passwd
sudo chattr +i /etc/shadow
sudo chattr +i /etc/group
sudo chattr +i /etc/gshadow

sudo chmod -R 700 /etc/rc.d/init.d/*
```

这样操作之后也无法创建账号和修改密码，后面可以使用`chattr -i`命令恢复之后再进行操作。




#### 修改端口

ssh登陆默认的端口是`22`，那些扫描穷举密码的，也一定从`22`开始。

1. 编辑配置文件

   ```sh
   sudo vi /etc/ssh/sshd_config
   ```

2. 将其中的`Port 22`改为其他端口

   `port`的取值范围是 `0 – 65535(即2的16次方)`

   0到1024是众所周知的端口（知名端口，常用于系统服务等，例如http服务的端口号是80）

3. 配置防火墙

   ```sh
   #CentOS 6 中防火墙开启对应端口
   iptables -I INPUT -p tcp --dport 设置的端口号 -j ACCEPT
   #CentOS 7 中防火墙开启对应端口
   sudo firewall-cmd --zone=public --add-port=设置的端口号/tcp --permanent
   ```

4. 重启 `sshd`

   ```sh
   service sshd restart
   ```



#### 限制端口转发

1. 编辑配置文件

   ```sh
   sudo vi /etc/ssh/sshd_config
   ```

2. 修改以下内容

   ```sh
   ChrootDirectory /home/%u
   X11Forwarding no
   AllowTcpForwarding no
   UseDNS no
   ```

3. 重启服务器

   ```sh
   service sshd restart
   ```



#### ssh 密钥登录

> 如果一定要使用密码登录，请查考正文最后 `fail2ban` 与 `DenyHosts` 的介绍。

不要相信自己的密码，在暴力枚举面前，只是时间文件。

统计学告诉我们，请配置 `RSA`



有两种不同的密钥分发方式，但结果都是一样的。

- 在客户端生成公钥与私钥，上传公钥到服务器

- 在服务器生成公钥和私钥，复制私钥到客户端


我使用第二种方式进行演示：

1. 服务器生成密钥

   ```sh
   sudo ssh-keygen -b 2048 -t rsa
   ```

   这样一来，在根目录就生成了一个`.ssh`的隐藏目录，内含两个密钥文件。

   `xxx` 为私钥，需复制到客户端，`xxx.pub` 为公钥。

2. 服务器配置公钥

   ```sh
   cd ~/.ssh
   sudo cat xxx.pub >> authorized_keys # 默认允许的key存储的文件

   sudo chmod 600 authorized_keys
   sudo chmod 700 ~/.ssh
   ```

3. 配置 `ssh` 文件

   ```sh
   sudo vi /etc/ssh/sshd_config

   #编辑以下内容
   RSAAuthentication yes #RSA认证
   PubkeyAuthentication yes #开启公钥验证
   AuthorizedKeysFile .ssh/authorized_keys #验证文件路径
   ```

4. 复制私钥到本地，并且设置相应 `ssh` 工具的连接配置。

5. 重启服务器

   ```sh
   service sshd restart
   ```

6. 禁止密码登录

   **使用密钥登录成功之后，再设置此项。**

   ```sh
   sudo vi /etc/ssh/sshd_config

   #编辑以下内容
   PasswordAuthentication no #禁止密码认证
   PermitEmptyPasswords no #禁止空密码
   UsePAM no#禁用PAM
   ```



#### iptables

[iptables](https://www.vpser.net/security/linux-iptables.html) 是`Linux`上最强大的防火墙软件。

1. 安装

   ```sh
   yum install iptables -y
   yum install iptables-services -y #CentOS7需安装此iptables的service软件包#

   # Debian/Ubuntu执行：
   apt-get install iptables -y
   apt-get install iptables-persistent -y #持久化iptables规则服务#
   ```

   CentOS 7上默认安装了firewalld建议关闭并禁用：

   ```sh
   systemctl stop firewalld
   systemctl mask firewalld
   ```

2. 清除已有iptables规则

   ```sh
   iptables -F
   iptables -X
   iptables -Z
   ```

3. 开发指定端口

   ```sh
   # 允许本地回环接口(即运行本机访问本机)
   iptables -A INPUT -i lo -j ACCEPT
   # 允许已建立的或相关连的通行
   iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
   #允许所有本机向外的访问
   iptables -A OUTPUT -j ACCEPT
   # 允许访问22222(SSH)端口，以下几条相同，分别是22222,80,443端口的访问
   iptables -A INPUT -p tcp --dport 22222 -j ACCEPT
   iptables -A INPUT -p tcp --dport 80 -j ACCEPT
   iptables -A INPUT -p tcp --dport 443 -j ACCEPT
   #允许FTP服务的21和20端口
   iptables -A INPUT -p tcp --dport 21 -j ACCEPT
   iptables -A INPUT -p tcp --dport 20 -j ACCEPT
   #如果有其他端口的话，规则也类似，稍微修改上述语句就行

   #允许ping
   iptables -A INPUT -p icmp -m icmp --icmp-type 8 -j ACCEPT

   #禁止其他未允许的规则访问（注意：如果22端口未加入允许规则，SSH链接会直接断开。）
   iptables -A INPUT -j REJECT
   iptables -A FORWARD -j REJECT

   #屏蔽单个IP的命令是
   iptables -I INPUT -s 123.45.6.7 -j DROP
   #封整个段即从123.0.0.1到123.255.255.254的命令
   iptables -I INPUT -s 123.0.0.0/8 -j DROP
   #封IP段即从123.45.0.1到123.45.255.254的命令
   iptables -I INPUT -s 124.45.0.0/16 -j DROP
   #封IP段即从123.45.6.1到123.45.6.254的命令是
   iptables -I INPUT -s 123.45.6.0/24 -j DROP

   #屏蔽某IP访问指定端口，以22端口为例命令是
   iptables -I INPUT -s 123.45.6.7 -p tcp --dport 22 -j DROP
   #允许某IP访问指定端口，以22端口为例命令是
   iptables -I INPUT -p tcp --dport 22 -j DROP
   iptables -I INPUT -s 123.45.6.7 -p tcp --dport 22 -j ACCEPT

   #
   ACCEPT:允许通过.
   LOG:记录日志信息,然后传给下一条规则继续匹配.
   REJECT:拒绝通过,必要时会给出提示
   DROP:直接丢弃,不给出任何回应.

   PREROUTING:在进行路由选择前处理数据包

   INPUT:处理入站的数据包

   OUTPUT:处理出站的数据包

   FORWARD:处理转发的数据包

   POSTROUTING:在进行路由选择后处理数据包
   ```

4. 保存防火墙规则

   ```sh
   service iptables save
   ```

5. 设置防火墙开机启动

   ```sh
   chkconfig --level 345 iptables on

   # CentOS7可执行：
   systemctl enable iptables
   ```



#### fail2ban

如已经设置 `禁止密码登录`，可忽悠。

> 通过使用 `iptables` 防火墙，将尝试爆破 `ssh` 密码的 `IP` 封停，默认10分钟。

1. 安装

   ```sh
   yum install -y fail2ban
   ```

2. 配置

   ```sh
   cp -pf /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
   vim /etc/fail2ban/jail.local

   [sshd]
   enabled = trueport = 22222
   logpath = %(sshd_log)s
   backend = %(sshd_backend)s
   filter = sshd
   action = iptables[name=SSH, port=22222, protocol=tcp] sendmail-whois[name=SSH, dest=root, sender=fail2ban@example.com]
   logpath = /var/log/secure
   maxretry = 3
   ```



#### DenyHosts

如已经设置 `禁止密码登录`，可忽悠。

> 分析`sshd`的日志文件，当发现重复的攻击时就会记录`IP`到`/etc/hosts.deny`文件，从而达到自动屏蔽`IP`的功能。

和 `fail2ban` 一样，都是防止暴力破解密码，两者任选其一即可。

1. 安装

  ```sh
  yum install denyhosts
  ```

2. 配置

   ```sh
   vi /etc/denyhosts.conf

   # 配置相关说明
   SECURE_LOG = /var/log/secure #ssh 日志文件,系统不同,文件不相同
   HOSTS_DENY = /etc/hosts.deny #控制用户登陆的文件
   PURGE_DENY = #过多久后清除已经禁止的，空表示永远不解禁
   BLOCK_SERVICE = sshd #禁止的服务名，如还要添加其他服务，只需添加逗号跟上相应的服务即可
   DENY_THRESHOLD_INVALID = 5 #允许无效用户失败的次数
   DENY_THRESHOLD_VALID = 10 #允许普通用户登陆失败的次数
   DENY_THRESHOLD_ROOT = 1 #允许root登陆失败的次数
   DENY_THRESHOLD_RESTRICTED = 1
   WORK_DIR = /var/lib/denyhosts #运行目录
   SUSPICIOUS_LOGIN_REPORT_ALLOWED_HOSTS=YES
   HOSTNAME_LOOKUP=YES #是否进行域名反解析
   LOCK_FILE = /var/run/denyhosts.pid #程序的进程ID
   ADMIN_EMAIL = root@localhost #管理员邮件地址,它会给管理员发邮件
   SMTP_HOST = localhost
   SMTP_PORT = 25
   SMTP_FROM = DenyHosts <nobody@localhost>
   SMTP_SUBJECT = DenyHosts Report
   AGE_RESET_VALID=5d #用户的登录失败计数会在多久以后重置为0，(h表示小时，d表示天，m表示月，w表示周，y表示年)
   AGE_RESET_ROOT=25d
   AGE_RESET_RESTRICTED=25d
   AGE_RESET_INVALID=10d
   RESET_ON_SUCCESS = yes #如果一个ip登陆成功后，失败的登陆计数是否重置为0
   DAEMON_LOG = /var/log/denyhosts #自己的日志文件
   DAEMON_SLEEP = 30s #当以后台方式运行时，每读一次日志文件的时间间隔。
   ```

3. 启动

  ```sh
  /etc/init.d/daemon-control start         #启动denyhosts
  chkconfig daemon-control on              #将denghosts设成开机启动
  ```

4. 启动命令（yum安装，已默认配好）

  ```sh
  service denyhosts start
  service denyhosts stop
  service denyhosts status
  ```



### 安装

这两天，我完成了 `CentosInit` 项目，一个高度自定义的 Centos 初始化脚本。

[项目地址](<https://github.com/SimonAKing/Centos-init>)
欢迎 `Star`  `PR` !

如果你想快速配置以上安全措施，请执行以下命令：

**通过 curl**

```sh
ONLY_SECURE=Y sh -c "$(curl -fsSL https://simonaking.com/Centos-init/install.sh)"
```

**通过 wget**

```sh
ONLY_SECURE=Y sh -c "$(wget https://simonaking.com/Centos-init/install.sh -O -)"
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

希望上面的这些措施可以帮助你加强服务器的安全。

欢迎转载本站文章，请注明作者和出处  [SimonAKing](http://simonaking.com)。
