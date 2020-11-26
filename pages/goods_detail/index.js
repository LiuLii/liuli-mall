/**
 * 1 点击轮播图 预览大图的效果
 *  1 给轮播图绑定点击事件
 *  2 调用小程序的api previewImage
 * 2 点击加入购物车
 *  1 先绑定点击事件
 *  2 获取缓存中的购物车数据 数组格式
 *  3 先判断 当前的商品是否已经存在购物车中
 *  4 已存在，修改商品数据， 执行购物车数量++ 重新把购物车填充回缓存中
 *  5 不存在于购物车，直接给购物车数组添加一个新元素，新元素带上购买数量属性 num
 *  6 根据当前操作弹出用户提示
 */

import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{}
  },
  GoodsInfo:{
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {goods_id} = options;
    this.getGoodsDetail(goods_id);
  },

  /*
    获取商品详情
  */
  async getGoodsDetail(goods_id){
    const goodsObj = await request({url:'/goods/detail',data:{goods_id}})
    this.GoodsInfo = goodsObj;
    this.setData({
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        //ipone 部分手机， 不识别 webp图片格式
        // 最好找后台， 让他修改
        // 临时自己修改， 确保后台是存在 1.webp => 1.jpg  不是正常得企业开发路线
        goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:goodsObj.pics,
        num:0
      }
    })
  },

  //点击轮播图，放大预览
  handlePreviewImage(e){
     // 1 先构建要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
    // 2 接收传过来的url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    });
  },


  //加入购物车
  handleCartAdd(){
    // 1 获取缓存中的购物车 数组  ||[]:表示将第一次获取到的空字符串转换成数组格式
    let cart = wx.getStorageSync("cart")||[];
    // 2 判断商品是否存在购物车
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if(index === -1){
      console.log("--",this.GoodsInfo)
      // 3 不存在第一次添加
      this.GoodsInfo.num=1;
      this.GoodsInfo.checked=true;
      cart.push(this.GoodsInfo);
    }else{
      // 4 存在，更改数量
      cart[index].num++;
    }
    //5 把购物车重新添加回缓存
    wx.setStorageSync("cart", cart);
    //6 弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      //true 防止用户手抖 一直添加
      mask: true,
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})