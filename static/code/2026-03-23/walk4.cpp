// inv[i]=(p-p/i)*inv[p%i]%p; 正推 线性求出1-n的逆元
// 先求出阶乘fac 快速幂算出fac[n]的阶乘 线性倒推fac[n-1-1]的逆元 invfac[i-1]=invfac[i]*i 
//单个数的逆元是 inv[i]=fact[i-1]*invfact[i]
//v.insert(v.begin() + pos, x);
//插入x到当做pos下标
//*(pos--) 错误写法 是先引用在减
#include <bits/stdc++.h>
typedef long long ll;
typedef long double db;
const ll mod=1e9+7;
const db pi=acos(-1);
const db eps=1e-10;
const int maxn=3e3;
const int inf=1e8;
const ll INF=1e17;
using namespace std;
int n,m;
ll f[maxn];//fi代表从i出发到终点n的期望
ll du[maxn];
bool e[maxn][maxn];
ll deter[maxn][maxn];
void slove(){
    cin>>n>>m;
    for(int i=1;i<=m;i++){
        int u,v; cin>>u>>v;
        du[u]++;
        e[u][v]=1;
    }
    for(int i=1;i<n;i++){
        for(int j=1;j<n;j++){
            if(i==j) deter[i][j]=du[i];
            else{
                if(e[i][j]) deter[i][j]=mod-1;
            }
        }
        deter[i][n]=du[i];
    }
    auto Swap = [&](int x , int y)-> void {
        for(int i=1;i<=n;i++) swap(deter[x][i],deter[y][i]);
    };
    auto qpow = [&](ll a,ll b ) ->ll {
        ll s=1ll;
        while(b){
            if( (b&1)) {
                s=s*a;s%=mod;
            }
            a=a*a;a%=mod;
            b>>=1;
        }
        return s;
    };
    auto  Gauss = [&]() -> void{
        for(int i=1;i<n;i++){
            int flag=-1;
            for(int j=i;j<n;j++) {
                if(flag==-1 && deter[j][i]!=0) flag=j;
            }
            if(i!=flag) Swap(i,flag);
            ll base = qpow(deter[i][i],mod-2);
            for(int k=1;k<=n;k++) deter[i][k]*=base,deter[i][k]%=mod;
            for(int j=i+1;j<n;j++){
                ll factor = deter[j][i]; //这里先取一下 不然后面会被覆盖
                for(int k=1;k<=n;k++){
                    deter[j][k] = deter[j][k]-( factor*deter[i][k]%mod);
                    deter[j][k]%=mod;
                }
            }
        }
        for(int i=n-1;i>=1;i--){
            f[i] = (deter[i][n]*qpow(deter[i][i],mod-2)%mod);
            for(int k=i-1;k>=1;k--)
            {
                deter[k][n] =deter[k][n] -(f[i]*deter[k][i]%mod);
                deter[k][n]%=mod;
            }
        }
    };
    Gauss();
    cout<<(f[1]+mod)%mod;
    return;
}
int main(){
    ios::sync_with_stdio(0);
    cin.tie(0);
    cout.tie(0);
    int t=1;
    //cin>>t;
    while(t--){
        slove();
    }
    return (0-0);
}