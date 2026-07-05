# Git 修炼手册

Date: 2018-01-27  
Author: SimonAKing  
Categories: 工具  
Tags: 工具, Git  
Source: https://simonaking.com/blog/git-training-manual/

> Git命令汇总。

---
Git 命令大汇总。
### 入门配置
#### 用户信息
1. git config --global user.name Simon
> 设置自己的用户名

2. git config --global user.email jinmaup@gmail.com
> 设置自己的邮箱

#### 查看配置
git config --list
> 查看自己git的配置信息

#### 设置编辑器
git config --global core.editor vim
> 当你用git编辑文件时，编辑文件的文本编辑器会默认调用vim

#### 文本着色
git config --global color.ui true
> 可为大部分git的代码布上颜色

### 基础命令
#### 建立版本库
1. git init
> 当前路径文件 初始化为Git仓库（可以发现 当前路径增加了.git文件夹）

2. git init 文件夹名
> 新建一个文件夹，并将其初始化为Git代码库

#### 文件添加到暂存区
1. git add .
> 把当前目录所有未追踪文件，已修改的文件，添加到暂存区 (不包括被删除的文件)

2. git add 文件（夹）名
> 把特定文件（夹）添加到暂存区

3. git add -A
> 提交所有的文件操作到暂存区

4. git add -u
> 提交已修改的文件,被删除的文件（不包括新文件）

5. git add -p
> 交互式的缓存提交，会提供多个选项来自定义提交内容、方式

#### 文件添加到本地仓库
1. git commit -m"commit message"
> 把暂存区的所有文件添加到本地仓库，-m"提交信息" （越详细越好）

2. git commit 文件（夹）名 -m"commit message"
> 把特定文件（夹）添加到本地仓库，-m"提交信息" （越详细越好）

3. git commit -am"commit message"
> 针对已经被追踪的文件，可以直接添加到本地仓库，不用先add在commit.

4. git commit --amend -m"commit message"
> 利用本次commit 重写上一次commit

5. git commit --amend --no-edit
> 利用本次commit 重写上一次commit 不会重写上次commit的提交信息


#### 仓库状态获取
git status
> 可以立即获取本地仓库状态 以及 git的步骤提示，建议多使用此命令

#### 版本回退
1. git reset --hard HEAD
> 将工作区，暂存区，本地仓库恢复到上一个版本（--hard）

2. git reset --soft HEAD^^^
> 将本地仓库恢复到上三个版本,不会修改暂存区，工作区（--soft）

3. git reset --mixd HEAD~5
> 将暂存区，本地仓库恢复到上五个版本，不会修改工作区（--mixd，默认）

4. git reset --hard commitID
> 将工作区，暂存区，本地仓库恢复到上指定版本
> 其中commitID就是每一次commit的版本号，可以使用git reflog获取

#### 撤销暂存
1. git reset HEAD file.txt
> 撤销file.txt的add操作，使其变成不跟踪状态

2. git reset HEAD^ file.txt
> 将上一次提交版本的file.txt重新置入缓存区

#### 撤销工作区
1.  git checkout -- file.txt
> （只针对未追踪文件）用历史中的file.txt替换现有工作区的file.txt
>  如果文件增加到暂存区后 又进行了修改，那么执行命令后 将回到暂存区文件状态

2.  git checkout HEAD -- file.txt
> 用最后一次提交版本中的file.txt 替换现有工作区的file.txt

3. git checkout commitID -- file.txt
> 用特定版本的file.txt 替换现有工作区的file.txt

#### 撤销提交
git revert commitID
> 撤销指定版本的commit，并将此操作生成一个全新的commit并提交

### 文件操作
#### 增
1. touch
> touch 文件名 ： 新建文件

2. mkdir
> mkdir 文件夹名： 新建文件夹

3. vim
> vim  文件名 ： 新建文件，并用vim模式打开该文件进行编写

4. git init
> git init 文件夹名：新建一个文件夹，并将其初始化为Git代码库

5. printf 
> printf 'content' > 文件名 ：新建一个文件，并把content注入其内容

6. echo 
> echo 'content' > 文件名 ：新建一个文件，并把content注入其内容

#### 删
1. rm
> rm 文件名 : 删除文件

2. clean
> git clean -f 文件名 ：删除未跟踪文件

#### 改
1. vim
> vim 文件名 ： 打开文件，并用vim模式进行修改

2. mv
> mv 选定文件名 新的文件名：把选定文件名 修改为 新的文件名

3. printf
> printf 'content' > 文件名 ： 将 content 替换 文件原有内容

4. echo
> echo 'content' > 文件名 ： 将 content 替换 文件原有内容

#### 查
1. pwd
> 得到当前路径

2. cd
> cd 路径 ：进到某一文件路径 
> cd .. : 回退文件路径
> cd    : 回到默认的路径 

3. cat
> cat 文件名：查看该文件的内容

4. ls
> 查看该目录下的文件列表（不包括隐藏文件）

5. ls -a
> 查看该目录下的文件列表（包括隐藏文件）

6. show
> git show <branch-name>:<file-name> ：展示任意分支某一文件的内容


### 分支操作
#### 查看分支
1. git branch
> 列出本地分支   

2. git branch -r  
> 列出远端分支   

3. git branch -a 
> 列出所有分支   

4. git branch -v
> 查看各个分支最后一个提交对象的信息   

5. git branch --merge
> 查看已经合并到当前分支的分支   

6. git branch --no-merge
> 查看为合并到当前分支的分支  

7. git remote show origin 
> 可以查看remote地址，远程分支

#### 新建分支

1. git branch name
> 新建一个名为name的分支

2. git checkout -b name
> 新建一个名为name的分支，并自动切换为该分支

3. git branch [branch] [commit]
> 新建一个分支，指向指定commit

4. git branch --track [branch] [remote-branch]
> 新建一个分支，与指定的远程分支建立追踪关系

#### 删除分支

1. git branch -d name
> 删除一个名为name的分支

2. git branch -D name
> 强制删除一个名为name的分支

3. git push <originName> :<branch>
> 删除远程分支

4. git push origin --delete <remote-branchname>
> 删除远程分支

#### 切换分支

1. git checkout name
> 切换一个名为name的分支

2. git checkout -
> 切换上一个分支

#### 重命名分支
1. git branch -m name
> 将当前所在分支命名为 name

### 标签
#### 新建标签
1. git tag [tag]
> 新建一个tag在当前commit

2. git tag [tag] [commit]
> 新建一个tag在指定commit

3. git tag v0.9 commitID
> 对某次提交新建标签


#### 查看标签
1. git tag
> 列出所有tag

#### 删除标签
1. git tag -d [tag]
> 删除本地tag

2. git push origin :refs/tags/<tagname>
> 可以删除一个远程标签

#### 推送标签
1. git push origin --tags
> 一次性推送全部尚未推送到远程的本地标签

2. git push origin <tagname>
> 可以推送一个本地标签


### 远程仓库
1. git remote
> 显示所关联的远程仓库

2. git remote -v
> 显示更详细信息

3. git remote add origin git@server-name:path/repo-name.git
> 关联一个远程库

4. git remote rm name
> 删除一个远程库

5. git remote rename <old-name> <new-name>
> 将远程连接从 <old-name> 重命名为 <new-name>


### 合并

1. git rebase master
> 将master分之上超前的提交，变基到当前分支  

2. git rebase --interactive
> 交互模式，修改commit   

3. git rebase --continue
> 处理完冲突继续合并   

4. git rebase --skip
> 跳过合并

5. git rebase --abort
> 取消合并


### 查看汇总

#### 查看信息
1. git whatchanged --since='2 weeks ago'
> 查看两个星期内的改动

2. git log --follow [file]
> 显示某个文件的版本历史

3. git log --author="John"
> 它会显示所有作者叫 John 的提交

4. get log --after="yesterday"
> 查看昨天的历史信息

5. git log -3
> 展示最近3次历史信息

6. git log --graph
> 可以看到分支合并图

#### 修改历史

git rebase -i commitID 
> 将pick 替换成 r , 然后回车，vi退出可以使用 :x
> 修改 git的历史记录的提交信息

#### 查看文件
1. git diff HEAD -- readme.txt
> 可以查看工作区和版本库里面最新版本的区别

2. git diff --staged 
> 显示暂存区（已经add）的文件和版本库文件的比较

3. git ls-files
> 查看在暂存区的文件

#### 删除暂存
1. git rm --cached 文件名
> 把文件从暂缓区 返回至 工作区


### 其他
#### 忽略文件
echo node_modules/ >> .gitignore
> 添加忽略文件

#### 打包

2. git archive master --format=zip --output=master.zip
> 将Master分支打包

3. git bundle create <file> <branch-name>
> 将历史记录包括分支内容打包到一个文件中

4. git clone repo.bundle <repo-dir> -b <branch-name>
> 从某个Bundle中导入

#### 工作区

1. git stash 
> 将工作区现场（已跟踪文件）储藏起来

2. git stash list  
> 查看保存的工作现场   

3. git stash apply  
> 恢复工作现场   

4. git stash drop  
> 删除stash内容   

5. git stash pop   
> 恢复的同时直接删除stash内容   

6. git stash apply stash@{0}  
> 恢复指定的工作现场

#### 查找内容

1. git grep "Hello"
> 从当前目录的所有文件中查找文本内容

2. git grep "Hello" v2.5
> 在某一版本中搜索文本

#### 帮助
git help -a
<style>.post-toc-level-4{ display:none }</style>
