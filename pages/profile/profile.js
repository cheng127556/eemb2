var utils = require('../../utils/utils');
var token = require('../../utils/token.js');
var login = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    shopcarcount: 0,
    collection: 0, //收藏
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showAvator: wx.getStorageSync("showAvator"),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that= this
    that.setData({
      img1: app.globalData.IMGURL + 'images/assets/order.png',
      img2: app.globalData.IMGURL + 'images/assets/nav1.png',
      img3: app.globalData.IMGURL + 'images/assets/nav2.png',
      img4: app.globalData.IMGURL + 'images/assets/nav3.png',
      img5: app.globalData.IMGURL + 'images/assets/nav4.png',
      img6: app.globalData.IMGURL + 'images/assets/navicon2.png',
      img7: app.globalData.IMGURL + 'images/assets/navicon3.png',
      img8: app.globalData.IMGURL + 'images/assets/navicon4.png',
      img9: app.globalData.IMGURL + 'images/assets/navicon7.png',
      img10: app.globalData.IMGURL + 'images/assets/navicon8.png',
    });
    that.setData({
      userInfo: app.globalData.userInfo,
    });

    //查看是否登录
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(1,res.userInfo);
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    //获取购物车的数量
    var num = 0;
    var collection = 0;
    // login.checkToken(this, this.init);

  },
  init : function(that){
    var requestInfo = {
      type: "GET",
      url: "getCount"
    };
    var data = {};
    token.getRequest(that, requestInfo, data, that.afterInit);
  },
  afterInit:function(that,res){

    that.setData({
      shopcarcount : res.data.shoppingCartCount,
      collection: res.data.collectCount
    })
  },

  //登录授权
  bindGetUserInfo(e) {
    console.log("授权登录", e)
    if(e.detail.userInfo){
      console.log("点击了同意授权", e);
      login.checkToken(this, this.init);
      //把用户信息保存在本地
      wx.setStorageSync("userInfo",e.detail.userInfo );
      wx.setStorageSync("showAvator", true);
    }else{
      console.log("点击了拒绝授权");
    }
    this.setData({
      userInfo:e.detail.userInfo,
      showAvator:true,
    })
  }
})