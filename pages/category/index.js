import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //左侧菜单
    leftMenuList: [],
    //右侧商品数据
    rightContent: [],
    //被点击的左侧的菜单
    currentIndex: 0,
    //左侧内容和顶部的距离
    scrollTop: 0
  },
  //接口返回数据
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*  添加缓存
    0 web中的本地存储 和 小程序中的区别
      1 写代码的方式不一样
        web: localStorage.setItem("key","value") localStorage..getItem("key")
      小程序: wx.setStorageSync("cates","value"); wx.getStorageSync("cates");
      2 存入的时候有没有类型转换
        web: 存入的时候，不管是什么类型，都会执行 同String() ,把数据变成字符串，再存进去
        小程序: 不存在类型转换这个操作，存进去什么类型数据，取出来就是什么类型
    1 先判断下本地存储中有没有数据
      缓存格式： {time:Date.now(),data:[...]}
    2 没有旧的数据 直接发送新请求
    3 有旧的数据 同时旧的数据没有过期 就使用本地的旧数据就好
    */

    // 1 获取本地存储中的数据（小程序也存在本地存储技术）
    const Cates = wx.getStorageSync("cates");
    // 2 判断缓存中是否有值
    if (!Cates) {
      this.getCates();
    } else {
      //有旧的数据  定义过期时间 10s
      if (Date.now() - Cates.time > 1000 * 600) {
        //超时之后 获取新的数据
        this.getCates();
      } else {
        // 可以使用旧的数据
        //获取缓存中的旧数据，重新渲染页面
        this.Cates = Cates.data;
        //构造左侧大菜单数据
        let leftMenuList = this.Cates.map(v => v.cat_name);
        //构造右侧内容数据
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },

  //获取分类数据
  async getCates() {
    // request({
    //   url:'/categories'
    // }).then(res=>{
    //   this.Cates=res.data.message;

    //   //数据请求成功之后，把数据存到本地
    //   wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});

    //   //构造左侧大菜单数据
    //   let leftMenuList = this.Cates.map(v=>v.cat_name);
    //   //构造右侧内容数据
    //   let rightContent = this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,rightContent
    //   })
    // })
    // 1 使用es7的async awit来发请求 async和awit搭配使用
    const res = await request({ url: '/categories'})
    // 回调获取 参数  res.data.message; 比较冗余，直接改成 res
    this.Cates = res;

    //数据请求成功之后，把数据存到本地
    wx.setStorageSync("cates", {
      time: Date.now(),
      data: this.Cates
    });

    //构造左侧大菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name);
    //构造右侧内容数据
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  //左侧菜单的点击事件
  handleItemTap(e) {
    /**
     * 1 获取被点击的标题上的索引
     * 2 给currentIdex赋值
     * 3 根据不同的索引渲染右边的数据
     */
    const {
      index
    } = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      //每次点击之后，重新设置 scroll-view标签和顶部的距离
      scrollTop: 0
    })
  }
})