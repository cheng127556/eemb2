var app = getApp();
var address = require('../../utils/address.js');
var login = require('../../utils/util.js');
var token = require('../../utils/token.js');
var bool = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    favoriteList: [],
    show_edit: "block",
    edit_name: "编辑",
    edit_show: "none",
  },
  /*
   *生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      img1: app.globalData.IMGURL + 'images/assets/logoo2.png',
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //进入页面的时候首先检查是否是登录状态，如果是登录状态就直接执行回调函数this.init
    //如果不是登录状态就先登录再执行
    login.checkToken(this, this.init);
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },
  init: function(that) {
    //初始化页面函数

    //准备将要发送到后台的数据
    var requestInfo = {
      type: "GET",
      url: "collectIndex"
    };
    var data = {};
    //发送给后台，成功得到响应之后的执行函数
    token.getRequest(that, requestInfo, data, this.afterInit);
  },
  afterInit: function(that, res) {
    //如果成功得到收藏的信息，就把页面渲染出来
    var favoriteList = res.data;
    if(favoriteList instanceof String){
      favoriteList = JSON.parse(favoriteList);
    }
    //从页面详细信息里挑选一点出来展示在页面上
    favoriteList.forEach(function(value){
      value.detail = JSON.parse(value.detail );
      value.detail = value.detail[1] + value.detail[2];
    });
    that.setData({
      favoriteList: favoriteList
    });
  },
  // 删除收藏
  deletes: function (e) {
    //获取要删除收藏商品的id
    var hid = e.currentTarget.dataset.hid;
    this.data.delectId = hid;
    login.checkToken(this, this.deleteCollect);
  },
  deleteCollect: function (that) {
    //获取将要删除收藏商品的id
    var id = that.data.delectId;
    //准备要发送给后台的数据 
    var requestInfo = {
      type: "GET",
      url: "delShopCollect"
    };
    var data = {
      'product_id': id
    };
    //发送给后台，成功得到响应之后初始化数据
    token.getRequest(that, requestInfo, data, this.init);
  },
  // 点击跳转详情页
  btn_detail(e){
    var hid = e.currentTarget.dataset.hid;
    wx.navigateTo({
      url: `/pages/detail/detail?hid=${hid}`,
    })
  },
  // 编辑
  btn_edit: function () {
    var that = this;
    if (bool) {
      that.setData({
        edit_show: "block",
        edit_name: "取消",
        show_edit: "none"
      })
      bool = false;
      // console.log(1,"取消");
    } else {
      that.setData({
        edit_show: "none",
        edit_name: "编辑",
        show_edit: "block"
      })
      bool = true;
      // console.log(2, "编辑");
    }
  },
})