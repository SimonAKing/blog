# HDU1874-畅通工程续

Date: 2017-11-22  
Author: SimonAKing  
Categories: 算法  
Tags: 算法  
Source: https://simonaking.com/blog/hdu1874-problem/

> HDU,最短路,Dijkstra,ACM

---
[题目传送门](http://acm.hdu.edu.cn/showproblem.php?pid=1874)大一做的最短路模板题，很适合练手
我分别利用了3种数据结构+Dijkstra/Floyd来解决，解题步骤具体如下：
### 邻接矩阵 
15ms
```cpp
#include<bits/stdc++.h>
using namespace std;
const int maxn = 2e2+5;
const int INF = 0x3f3f3f3f;
int Map[maxn][maxn];
bool Vis[maxn];
int Dis[maxn];
int N,M,S,D;
inline void Init(){
    memset(Map,INF,sizeof(Map));
    memset(Vis,false,sizeof(Vis));
    memset(Dis,0,sizeof(Dis));
    int x,y,z;
    while(M--){
        scanf("%d%d%d",&x,&y,&z);
        Map[x][y]=Map[y][x]=min(Map[x][y],z);
    }
    scanf("%d%d",&S,&D);
    for(int i=0;i<N;++i){
        Dis[i]=Map[S][i];
    }
    Dis[S]=0;
    Vis[S]=true;
}
inline void Dijkstra(){
    for(int l=0;l<N;++l){
        int Min=INF,k;
        for(int i=0;i<N;++i){
            if(!Vis[i]&&Dis[i]<Min){
                Min=Dis[i];
                k=i;
            }
        }
        Vis[k]=true;
        if(Min!=INF){
            for(int j=0;j<N;++j){
                if(!Vis[j]&&Dis[j]>Dis[k]+Map[k][j]){
                    Dis[j]=Dis[k]+Map[k][j];
                }
            }
        }
    }
    Dis[D]==INF?printf("-1n"):printf("%dn",Dis[D]);
}
int main(){
    while(~scanf("%d%d",&N,&M)){
        Init();
        Dijkstra();
    }
    return 0;
}
```
### 邻接表
15ms
```cpp
#include<bits/stdc++.h>
using namespace std;
const int maxn = 1e5;
const int INF = 0x3f3f3f3f;
struct Node{
    int from,to,cost;
    Node(int a,int b,int c):from(a),to(b),cost(c){}
};
vector<Node>Edges;
vector<int>G[maxn];
int Dis[maxn];
int N,M,S,T;
typedef pair<int,int> Pair;
priority_queue<Pair,vector<Pair>,greater<Pair> >Q;
inline void AddEdge(int x,int y,int z){
    Edges.push_back(Node(x,y,z));
    G[x].push_back(Edges.size()-1);
}
inline void Init(){
    Edges.clear();
    memset(Dis,INF,sizeof(Dis));
    for(int i=0;i<N;G[i++].clear());
    int x,y,z;
    while(M--){
        scanf("%d%d%d",&x,&y,&z);
        AddEdge(x,y,z);
        AddEdge(y,x,z);
    }
    scanf("%d%d",&S,&T);
    Dis[S]=0;
    Q.push(Pair(0,S));
}
inline void Dijkstra(){
    int Now,Val,L;
    while(!Q.empty()){
        Now=Q.top().second;
        Val=Q.top().first;
        Q.pop();
        if(Dis[Now]<Val){continue;}
        L=G[Now].size();
        for(int i=0;i<L;++i){
            if(Dis[Edges[G[Now][i]].to]>Dis[Now]+Edges[G[Now][i]].cost){
                Dis[Edges[G[Now][i]].to]=Dis[Now]+Edges[G[Now][i]].cost;
                Q.push(Pair(Dis[Edges[G[Now][i]].to],Edges[G[Now][i]].to));
            }
        }
    }
    Dis[T]==INF?printf("-1n"):printf("%dn",Dis[T]);
}
int main(){
    while(~scanf("%d%d",&N,&M)){
        Init();
        Dijkstra();
    }
    return 0;
}
```
### 链式向前星
0ms
```cpp
#include<bits/stdc++.h>
using namespace std;
const int maxn = 2017;
const int INF = 0x3f3f3f3f;
struct Node{
    int End;
    int Value;
    int Front;
    Node(){}
    Node(int a,int b,int c):End(a),Front(b),Value(c){}
}Edge[maxn];
int Head[maxn];
int Dis[maxn];
int N,M,S,D,Idx;
typedef pair<int,int>Pair;
priority_queue<Pair,vector<Pair>,greater<Pair> >Q;
inline void AddEdge(int S,int D,int V){
    Edge[Idx]=Node(D,Head[S],V);
    Head[S]=Idx++;
}
inline void Init(){
    Idx=0;
    memset(Head,-1,sizeof(Head));
    memset(Dis,INF,sizeof(Dis));
    int x,y,z;
    while(M--){
        scanf("%d%d%d",&x,&y,&z);
        AddEdge(x,y,z);
        AddEdge(y,x,z);
    }
    scanf("%d%d",&S,&D);
    Pair pNew;
    Dis[S]=0;
    pNew.first=0;
    pNew.second=S;
    Q.push(pNew);
}
inline void Dijkstra(){
    int Now,Val;
    while(!Q.empty()){
        Now=Q.top().second;
        Val=Q.top().first;
        Q.pop();
        if(Dis[Now]<Val)continue;
        for(int i=Head[Now];~i;i=Edge[i].Front){
            if(Dis[Edge[i].End]>Dis[Now]+Edge[i].Value){
                Dis[Edge[i].End]=Dis[Now]+Edge[i].Value;
                Q.push(Pair(Dis[Edge[i].End],Edge[i].End));
            }
        }
    }
    Dis[D]==INF?printf("-1n"):printf("%dn",Dis[D]);
}
int main(){
    while(~scanf("%d%d",&N,&M)){
        Init();
        Dijkstra();
    }

```
### Floyd
62ms
```cpp
#include<bits/stdc++.h>
using namespace std;
const int maxn = 2e2+5;
const int INF = 0x3f3f3f3f;
int Map[maxn][maxn];
int N,M,S,D;
inline void Init(){
    int x,y,z;
    memset(Map,INF,sizeof(Map));
    for(int i=0;i<N;++i){
        Map[i][i]=0;
    }
    while(M--){
        scanf("%d%d%d",&x,&y,&z);
        Map[x][y]=Map[y][x]=min(Map[x][y],z);
    }
    scanf("%d%d",&S,&D);
}
inline void Floyd(){
    for(int k=0;k<N;++k){
        for(int i=0;i<N;++i){
            for(int j=0;j<N;++j){
                Map[i][j]=min(Map[i][j],Map[i][k]+Map[k][j]);
            }
        }
    }
    Map[S][D]==INF?printf("-1\n"):printf("%d\n",Map[S][D]);
}
int main(){
    while(~scanf("%d%d",&N,&M)){
        Init();
        Floyd();
    }
    return 0;
}
```
### 后记
自从退acm，很多东西都在遗忘...
