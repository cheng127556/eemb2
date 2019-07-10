var login = require('../../utils/util.js');
var address = require('../../utils/address');
var token = require('../../utils/token.js');
var validate = require('../../utils/validate');
var app = getApp()
Page({
  data: {
    region: [],//国家 省份 城市数组
    id: '',
    shippingAddress: {}//其他地址信息
  },
  onLoad(e) {
    //先获取被编辑的是哪个地址列表
    var id = e.id;
    this.setData({
      id: id
    });
    //把id存在data里方便以后拿出来使用

    if (id == 'new') {
      //如果传过来的是id等于new说明是一个新地址，没有初始化数据
    } else {
      //如果传过来的id是不是new，说明正在编辑一个地址，下面是初始化页面的函数
      login.checkToken(this, this.edtaileaddressInit);
      //login.checkToken是一个公共函数，用来检测用户的token值是否过期，如果过期，就重新获取之后执行回调函数，
      //否则直接执行回调函数
    }

  },
  //页面初始化函数，必须传入的值为that
  edtaileaddressInit(that) {
    //获取id，然后下面是封装的从数据库获取地址数据的函数
    var id = that.data.id;
    var requestInfo = {
      type: "GET",
      url: "editAddress"
    };
    var data = {
      "id": id
    };
    //公共函数，从数据库获取地址信息，如果成功就执行回调函数 dataInit
    token.getRequest(that, requestInfo, data, that.dataInit);
  },
  dataInit: function(that, res) {
    //从拿到后台数据库获取的地址信息的操作，具体内容为让页面初始化
    var thisAddress = res.data;
    thisAddress = address.formatAddress(thisAddress);
    that.setData({
      shippingAddress: thisAddress,
      region: thisAddress.region
    });
    console.log("region", that.data.region)
  },

  fromsubmit(e) {
    //修改地址或者新添地址的函数
    var shippingAddress = {};
    //接收从前台页面获取的数据，组成一个对象
    shippingAddress.name = e.detail.value.name;
    shippingAddress.mobile = e.detail.value.mobile;
    shippingAddress.detail = e.detail.value.detail;
    shippingAddress.region = this.data.region;

    var isValidate = validate.mobile(shippingAddress.mobile);
    if(!isValidate){
      return false;
    }

    //把前台页面数据组成的对象规范成后台需要的格式（使用了一个公共函数 address.decodeAddress）
    shippingAddress = address.decodeAddress(shippingAddress);

    //把数据对象存入data之中方便调用
    this.data.setData = shippingAddress;

    login.checkToken(this, this.setAddressData);
  },

  setAddressData:function(that){
    //从data处拿到需要发送的数据
    var shippingAddress = that.data.setData;

    //通过id来判断这个请求是发送给新增还是修改
    if (that.data.id == 'new') {
      //如果是新增的时候，发送的请求参数
      var doEditInfo = {
        type: "POST",
        url: "addAddress"
      };
    } else {
      //如果是修改的时候，除了需要发送的请求参数之外，还需要一个id
      var doEditInfo = {
        type: "POST",
        url: "doEditAddress"
      };
      shippingAddress.id = this.data.id;
    }
    // console.log("shippingAddress",shippingAddress);
    var func = function (that, res) {
      //发送请求完之后的一个回调函数，用来返回上一个页面
      wx.navigateBack({});
    }
 
    //发送请求
    token.getRequest(this, doEditInfo, shippingAddress, func);
  },

  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },

})