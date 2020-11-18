//es6 的promise语法
//将请求封装起来
//同时发送三个请求，请求都回来了再关闭
let ajaxTimes=0;
export const request=(params)=>{

  //显示加载中的效果
  wx.showLoading({
    title: "加载中",
    // mask : 用户看到这之后没办法再进行其他操作，把用户手势都挡住了
    mask: true,
  });

  //定义公共的url
  const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1'
  return new Promise((resolve,reject)=>{
    ajaxTimes++;
    var reqTask = wx.request({
      // ... 对参数进行解构
      ...params,
      url:baseUrl+params.url,
      //成功的回调函数
      success:(result)=>{
        resolve(result.data.message); 
      },
      //失败的回调函数
      fail:(err)=>{
        reject(err)
      },
      complete:()=>{
        ajaxTimes--;
        if(ajaxTimes === 0){
          // 关闭正在等待的图标
         wx.hideLoading();
        }
      }
    });
  })
}