var app = getApp();
var utils = require('../../utils/utils.js');
var login = require('../../utils/util.js');
var token = require('../../utils/token.js');
var address = require('../../utils/address');
Page({
  data: {
    region: [],
    userBirthday: "请选择您的生日",
    startDate: "1919-01-01",
    userInfo : {}
  },
  onShow: function(e) {
    //载入界面初始化的功能，先确定登陆状态，如果是在登陆情况下，就执行回调函数，从后台请求初始化的数据
    login.checkToken(this, this.getUserData);
  },
  getUserData: function(that) {
    //准备发送的端口和数据
    var requestInfo = {
      type: "GET",
      url: "userIndex"
    };
    var data = {};
    //发送给后台，成功得到响应之后的执行函数
    token.getRequest(that, requestInfo, data, this.userInit);
  },
  userInit: function(that, res) {
    var userInfo = res.data;

    //把从后台接受到的数据编码成前台可以识别的格式
    userInfo = address.formatAddress(userInfo);
    that.setData({
      userInfo : userInfo,
      region : userInfo.region
    });
  },

  fromsubmit: function(e) {
    //定义一个变量接受从前台表单接受来的值
    var userInfo = e.detail.value;
    userInfo.birthday = this.data.userInfo.birthday;
    userInfo.region = this.data.region;
    //把前台的变量格式化成后台能接受的格式
    userInfo = address.decodeAddress(userInfo);
    //把准备好的变量存在this.data中
    this.data.userData = userInfo;
    console.log(userInfo)
    //检查现在是否是登陆状态，如果是就直接发送请求，如果不是就先登陆再发送请求
    login.checkToken(this, this.setUserInfo);
  },
  setUserInfo: function(that) {
    //准备发送请求的数据
    
    var userInfo = that.data.userData;
    var requestInfo = {
      type: "POST",
      url: "editUserIndex"
    };
    //发送数据到后台，如果成功就执行回调函数afterEdit
    token.getRequest(that, requestInfo, userInfo, that.afterEdit);
  },
  afterEdit: function(that, res) {
    //后来响应成功的回调函数
    if (res.data == 201) {
      app.showToast('保存地址成功','/pages/profile/profile',1000);
    }
  },

  // 地区选择
  bindCitiesChange: function (e) {
    var cities = this.data.cities
    this.setData({
      city: cities[e.detail.value]
    })
  },
  // 地区选择
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },

  // 日期选择
  bindDateChange: function (e) {
    var userInfo = this.data.userInfo;
    userInfo.birthday = e.detail.value;
    this.setData({
      userInfo: userInfo
    })
  },
})