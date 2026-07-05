# 链式向前星

Date: 2017-11-22  
Author: SimonAKing  
Categories: 算法  
Tags: 算法  
Source: https://simonaking.com/blog/chain-forward-star/

> 链式向前星,数据结构,ACM

---
这是一种神奇的数据结构。### 来源
听说是某个高中Oi菊苣发明，%%%
### 应用
有的时候有的图可能比较稀疏而且点数较多，邻接矩阵存不下，所以就要用到邻接表。
邻接表用vector数组比较方便，但是vector比较慢。所以就有了链式向前星。
### 理解
通过Head可以找到一个点的所有边,**可以把Head理解为：链表的有实际含义的头节点**

Head[N]永远保存最后一次输入的N点数组的下标值，

Head[N]=idx; 意思是，保存N点的数组的下标值

而Next保存变化中的Head，但不保存最后一次的Head

Edge[i].Next=Head[N]; Head[N]=idx++;
从而Head与Next数组实现链式向前星的整个过程，

Head相当于链表的有实际含义的头节点
Next保存链表中的节点，但值得注意的是Next与Head都是通过保存下标值的方式实现的
相当于：**索引式链表**。

End为终点，Value为权值，先不提
而Next就相当于链表中的节点的位置，而没有头节点Head ,是无法提取的。
保存下标值的方式很有趣，虽然开始理解起来有点怪。

int i=Head[S]; 此时i为最后一次保存S点数组的下标值，也就是最后一次输入的S点数据
Edge[i].End 便为最后一次输入S点的终点，Value也是同理，而S作为出发点，不再多提

之后很关键，i=Edge[i].Next，要知道，每次的Edge[i].Next 都是由Head变化而来
意思就是，i=Edge[i].Next,此后的 i为倒数第二次输入S点数组的下标值！
i=Edge[Head[S]].Next;之后 i=Edge[Edge[Head[S]].Next;].Next;
从而反复循环，直到，下一条边为0时，便是最后一次输入的S点的数组的下标值
因为 最开始时，Edge[i].Next=Head[S]=0;
### 代码
```cpp
#include<bits/stdc++.h>
using namespace std;
const int maxn = 1e5;
struct Node{
    int End;//保存一个边的终点
    int Next;//保存一个点（起点）的 除了最后一条（输入的顺序）之外的所有边的下标值
    int Value;//保存一条边的权值
    Node(){}
    Node(int a,int b,int c):
    End(a),Next(b),Value(c){}
}Edge[maxn];
bool Vis[maxn];
int Head[maxn];//Head数组 为边的索引
int Idx;
queue<int>Map;
inline void AddEdge(int Start,int End,int Value){
    Edge[Idx]=Node(End,Head[Start],Value);
    Head[Start]=Idx++;
}
inline void Init(){
    Idx=1;
    memset(Edge,0,sizeof(Edge));
    memset(Vis,false,sizeof(Vis));
    int N,M,x,y,z;
    scanf("%d%d",&N,&M);
    while(M--){
        scanf("%d%d%d",&x,&y,&z);
        AddEdge(x,y,z);
        AddEdge(y,x,z);
    }
    int Start;
    scanf("%d",&Start);
    Vis[Start]=true;
    Map.push(Start);
}
inline void Traverse(){
    while(!Map.empty()){
        int Start=Map.front();
        Map.pop();
        for(int i=Head[Start];i;i=Edge[i].Next){
            printf("%d->%d=%d\n",Start,Edge[i].End,Edge[i].Value);
            if(!Vis[Edge[i].End]){
                Map.push(Edge[i].End);
                Vis[Edge[i].End]=true;
            }
        }
    }
}
int main(){
    Init();
    Traverse();
    return 0;
}
/*
输入样例
5 5
1 2 3
2 3 4
3 4 5
4 5 6
5 6 7
1
*/
```
### 总结
> 优点：不会浪费数据空间;
> 缺点：无法直接判断两个点是否是邻接点
> 链式向前星是一个很不错的数据结构，利用数组索引特性，加上其他权值，存储了整个图。
