/**
 1 获取用户的收获地址
  1 绑定点击事件
  2 调用小程序的内置 api 获取用户的收货地址

  2 获取 当前用户对小程序 所授予 获取地址的 权限状态  scope
    1 假设用户在一开始点击收货地址提示框 确定，scope 值 为true
      authSetting  scope.address
    2 获取收货地址的时候点击取消
    3 假设 用户 从来没有调用过小程序 scope.address 是未定义
 
    4 获取到的收货地址，存到本地缓存中，方便其他页面使用
 2  页面加载完
  0 使用 onLoad ，购物车页面会被频繁的打开， 重新渲染，使用 onshow
  1 获取本地存储的地址数据
  2 把数据设置给data中的一个变量
 3 onShow
  0 回到详情，第一次添加商品，手动添加属性
    num 1
    chencked true
  1 获取缓存中购物车
4 全选的实现
  1 获取缓存中的购物车数组
  2 根据购物车的商品数据进行计算 所有商品都被选中，全选才被选中
5 总价格和 总数量
  1 都需要商品被选中 我们才拿它计算
  2 获取购物车数组
  3 遍历
  4 判断商品是否别选中
  5 总价格 += 商品的单价 * 商品的数量
  6 总数量 += 商品的数量
  7 将计算好的价格设置回 data中
6 商品选中
  1 绑定change事件
  2 获取到被修改的商品对象
  3 商品对象的选中状态取反，
  4 重新填回到data 和缓存中
  5 重新计算全选，总价格，总数量
    */
import {getSetting,openSetting,chooseAddress} from "../../utils/asyncWx";
import regeneratorRuntime from '../../lib/runtime/runtime.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0,
  },
  
  async handleChooseAddress(){
    // 1 获取 权限状态  
    // wx.getSetting({
    //   success: (result)=>{
    //     console.log(result)
    //     //2 获取权限状态 主要发现一些 属性名很怪异的时候，都要使用[]形式来获取属性值
    //     const scopeAddress = result.authSetting["scope.address"];
    //     console.log(scopeAddress)
    //     if(scopeAddress === true || scopeAddress === undefined ){
    //       wx.chooseAddress({
    //         //提前在微信个人信息中编辑
    //         success: (result1)=>{
    //           console.log(result1)
    //         },
    //       });
    //     }else{
    //       // 3 用户以前拒绝过授予权限，先诱导用户打开授权页面 wx.openSetting
    //       wx.openSetting({
    //         success: (result)=>{
    //           // 4 直接调用获取收货地址的代码
    //           wx.chooseAddress({
    //             //提前在微信个人信息中编辑
    //             success: (result2)=>{
    //               console.log(result2)
    //             },
    //           });
    //         },
    //       });
    //     }
    //   },
    // });
  try {
     // 使用 es6 将代码统一管理 防止回调地狱
    //1 获取授权状态
      const status = await getSetting();
      //2 获取权限状态 主要发现一些 属性名很怪异的时候，都要使用[]形式来获取属性值
      const scopeAddress = status.authSetting["scope.address"];
      if(scopeAddress === false){
        // 4 如果状态为false 诱导用户打开授权页面 wx.openSetting
        await openSetting();
      }   
      // 3 获取用户地址 会执行两次，将代码抽出来处理
      const address = await chooseAddress();
      // 将地址拼接起来 存储
      address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo;
      // 5 存入到缓存中
      wx.setStorageSync("address", address);

    } catch (error) {
      console.log(error)
    }
          
  },

   /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 1 获取本地存储中的地址值
    const address = wx.getStorageSync("address");
    //1 获取缓存中的购物车数组
    const cart = wx.getStorageSync("cart")||[];
    // 1 计算全选
    // every 方法是遍历数组中的每一个元素，接收一个回调函数，那么每一个回调函数都返回true，every方法的返回值为true
    // 只要有一个函数的返回值为false，循环就不再执行 every方法的返回值就为false
    // 当 一个空数组使用every方法的时候，会直接返回true
    // 页面中使用了两次循环，浪费性能，可以将全选的验证放到下面的数组执行
    //const allChecked =cart.length?cart.every(v => v.checked):false;
    // 总价格 总数量
    this.setData({address});
    this.setCart(cart);
  },

  handleItemChange(e){
    // 1 获取的被修改的商品id
    const goods_id = e.currentTarget.dataset.id;
    // 2 获取购物车数组
    let {cart} = this.data;
    // 3 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    // 4 将选中状态进行取反
    cart[index].checked = ! cart[index].checked;
    // 5 6 
    this.setCart(cart);
  },

  //设置购物车状态，重新计算底部工具栏的数据
  setCart(cart){
    let allChecked = true;
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v =>{
      if(v.checked){
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      }else{
        allChecked = false;
      }
    })
    // 如果数组为空，forEach 循环不会执行，需要再进行判断
    allChecked = cart.length != 0 ? allChecked : false;
    // 2 给data中的变量赋值
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
    wx.setStorageSync("cart", cart);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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