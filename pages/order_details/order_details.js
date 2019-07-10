// pages/order_details/order_details.js
var login = require('../../utils/util.js');
var token = require('../../utils/token.js');
var address = require('../../utils/address');
var calculate = require('../../utils/calculate');
var pay = require('../../utils/pay');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    address: [],
    totalPrice: 0,
    isdefault: false,
    shopcarcount: 0,
    remarks:""
    //hasList: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.setData({
      img1: app.globalData.IMGURL + 'images/assets/right.png',
      img2: app.globalData.IMGURL + 'images/assets/eemb.jpg',
    });

    var that = this;
    wx.getStorage({
      key: 'orderList',
      success(res) {
        that.data.list = res.data;
        that.getRefresh(that);
      }
    })

    if (options.addressId) {
      wx.setStorageSync('selectAddress', false);
      var addressId = options.addressId;
      this.data.addressId = addressId;
    }
    login.checkToken(this, this.addressInit);

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(options) {},
  //公共函数，重新核算本页商品价格
  getRefresh: function(that) {
    var goodList = that.data.list;
    goodList = calculate.shoppingRefresh(goodList);
    goodList = calculate.getAllPrice(goodList);
    var priceInfo = calculate.getPriceInfo(goodList);
    var finalPrice = Number(priceInfo.totalPrice) + priceInfo.freightPrice;
    that.setData({
      list: goodList,
      freight: priceInfo.freight,
      totalPrice: priceInfo.totalPrice,
      finalPrice: finalPrice.toFixed(2)
    });
  },
  //公共函数：给出索引，改变商品列表里的值
  setGoodInfo: function(that,key,count) {
    var goodList = that.data.list;
    
    goodList.forEach(function(value,index){
      if(key == index){
        if (count == 'add') {
          value.count = ++value.count;
        }else if(count == 'minus' ){
          if (value.count <= 1){
            app.showTitle('已经到最低了');
            return false;
          }else{
            value.count = --value.count;
          }
          
        }else{
          value.count = count;
        }    
      }
    });
    that.getRefresh(that);
  },
  addressInit: function(that) {
    //发送改变默认地址的回调函数
    var setInfo = {
      type: "GET",
      url: "getOneAddress"
    };
    var addressId = that.data.addressId;
    var data = {};
    if (addressId) {
      data = {
        'id': addressId
      };
    }
    // //执行发送数据到服务器，响应成功的时候执行回调函数 changeDefault
    token.getRequest(that, setInfo, data, that.afterAddressInit);
  },
  afterAddressInit: function(that, res) {

    var userAddress = res.data;
    that.setData({
      address: userAddress
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  btn_submit: function(e) {
    var goodList = this.data.list;
    pay.getPay(this,goodList);
  },   

  /*绑定减数量事件*/
  btn_minus(e) {
    // 获取点击的索引
    const index = e.currentTarget.dataset.index;
    // 获取商品数据
    this.setGoodInfo(this, index,'minus');
      
  },
  /**
   * 绑定加数量事件
   */
  btn_add(e) {
    // 获取点击的索引
    const index = e.currentTarget.dataset.index;
    // 获取商品数据
    this.setGoodInfo(this,index,'add');


  },
  //购物车input值
  bindManual: function(e) {
    var index = e.currentTarget.dataset.index;
    var iname = e.target.dataset.iname;
    iname = parseInt(e.detail.value);
    this.setGoodInfo(this, index, iname);
  },

  /*添加地址 */
  img_url: function() {
    var selectAddress = true;

    try {
      wx.setStorageSync('selectAddress', selectAddress)
    } catch (e) {
      app.showTitle('网络异常，请刷新');
    }
    wx.navigateTo({
      url: '../address/address',
    })
  },
  remarksInput:function(e){
    this.setData({
      remarks: e.detail.value
    })
  },
})