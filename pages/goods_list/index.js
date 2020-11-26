import {request} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:0,
        value:"销量",
        isActive:false
      },
      {
        id:0,
        value:"价格",
        isActive:false
      },
    ],
    goodsList:[],
    //总页数
    totalPages:1
  },
  
  // 从子组件传递过来
  handleTabsItemChange(e){
    //1 获取数据子组件传过来的数据
    const {index} = e.detail;
    //2 修改原数组
    let {tabs} = this.data;
    tabs.forEach((v,i)=> i===index?v.isActive=true:v.isActive=false)
    //3 将修改后的数据重新赋值到原数组
    this.setData({
      tabs
    })
  },

  //接口需要的参数
  QueryParams:{
    query:'',
    cid:'',
    pagenum:1,
    pagesize:10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid;
    this.getGoodsList();
  },

  //获取商品列表数据
  async getGoodsList(){
    const res = await request({url:'/goods/search',data:this.QueryParams})
    //获取总数
    const {total} = res;
    //计算总页数
    this.totalPages = Math.ceil(total/this.QueryParams.pagesize)
    this.setData({
      //获取到数据之后往后面进行拼接
      goodsList:[...this.data.goodsList,...res.goods]
    })

    //关闭下拉刷新的窗口
    // 如果没有调用下拉刷新的窗口，直接关闭也不会报错
    wx.stopPullDownRefresh();
  },


  /**
   1 用户上滑页面 滚动条触底 开始加载下一页数据
    1 找到滚动条触底事件
    2 判断还有没有下页数据
      1 加入能获取到数据总页数  总条数：total

      2 获取当前页码  pagenum
      3 判断当前页码是否大于等于总页数
        大于 表示没有数据
    3 没有下一页数据 弹出提示框，
    4 假如还有下一页 来加载下一页
      1 当前页码 ++
      3 返回的数据进行拼接
    1 下拉刷新
      1 下拉刷新事件
        下拉触发事件
      2 重置 数组
      3 重置页码  
   */

  /**
   * 1 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //1 判断还有没有下一页
    if(this.QueryParams.pagenum >= this.totalPages){
      // console.log("没有了")
      wx.showToast({
        title: '没有下一页数据了'
      });
    }else{
      // console.log("还有呢")
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },

  /**
    下拉触发事件
   */
  onPullDownRefresh(){
    //1 重置数组
    this.setData({
      goodsList:[]
    })

    //2 重置页码
    this.QueryParams.pagenum = 1;
    //3 发送请求
    this.getGoodsList();
    // 数据请求回来之后 手动关闭等待效果  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})