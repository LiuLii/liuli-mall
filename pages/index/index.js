// pages/index/index.js
// 0 引入用来发送请求的方法
import {request} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //轮播图数组
    swiperList: [],
    //导航数据
    catesList:[],
    //楼层导航
    floorList:[]
  },

  /**
   * 页面开始加载时 触发
   */
  onLoad: function (options) {
    // 1 发送异步请求
    // 2 优化地狱回调 通过es6的promise优化这个问题
    // var reqTask = wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   method: 'GET',
    //   success: (result)=>{
    //     console.log(result)
    //     this.setData({
    //       swiperList:result.data.message,
    //     })
    //   }
    // });
    this.getSwiperList();
    this.getCatesList();
    this.getFloorList();
  },

  // 获取轮播图数据
  getSwiperList(){
    request({
      url: "/home/swiperdata"
    })
    .then(result => {
      this.setData({
        swiperList: result,
      })
    })
  },

   // 获取轮播图数据
   getCatesList(){
    request({
      url: "/home/catitems"
    })
    .then(result => {
      this.setData({
        catesList: result,
      })
    })
  },

   // 获取楼层数据
   getFloorList(){
    request({
      url: "/home/floordata"
    })
    .then(result => {
      this.setData({
        floorList: result,
      })
    })
  }
})