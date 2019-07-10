var app = getApp();
var address = require('../../utils/address.js');
var login = require('../../utils/util.js');
var token = require('../../utils/token.js');
Page({
  data: {
    addressList: [],
    isdefault: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option) {

    this.setData({
      img1: app.globalData.IMGURL + 'images/assets/detaile.png'
    });
  },
  onShow: function(option) {
    //页面初始化，使用公共函数login来判断现在token是否过期，如果过期，就从前登录，
    //如果没有过期，就执行this.init,如果过期了，就先登录再执行this.init
    login.checkToken(this, this.init);
  },

  init: function(that) {
    //先获取token
    login.checkToken(this, this.addressInit);
  },
  addressInit:function(that){
    //发送改变默认地址的回调函数
    var setInfo = {
      type: "GET",
      url: "addressIndex"
    };
    var data = {};
    //执行发送数据到服务器，响应成功的时候执行回调函数 changeDefault
    token.getRequest(that, setInfo, data, that.afterInit);
  },
  afterInit:function(that,res){
    var addressList = res.data;
    //把从后端拿过来的数据格式化成前端能识别的格式
    addressList = address.formatAddress(addressList, true);
    //渲染页面
    that.setData({
      addressList: addressList
    });
  },

  // 更改默认地址
  changeaddress: function (e) {
    //获取默认地址的id    
    var id = e.currentTarget.dataset.id;
    //先把数据存到data里方便调用
    this.data.defaultId = id;
    //页面初始化，使用公共函数login来判断现在token是否过期，如果过期，就从前登录，
    //如果没有过期，就执行回调函数,如果过期了，就先登录再执行回调函数
    login.checkToken(this, this.setChange);
    
  },
  setChange:function(that){
    //发送改变默认地址的回调函数
    var id = that.data.defaultId;
    var deleteInfo = {
      type: "GET",
      url: "default"
    };
    var deleteData = {
      id: id
    };
    //执行发送数据到服务器，响应成功的时候执行回调函数 changeDefault
    token.getRequest(that, deleteInfo, deleteData, that.changeDefault);


  },
  changeDefault: function (that, res) {
    //先获取从前面拿到的id
    var id = that.data.defaultId;
    var code = res.data;
    //检查返回码，如果是201就是改变成功了
    if (code == '201') {
      //获取地址列表
      var addressList = that.data.addressList;
      //循环地址列表，把默认id更新显示在界面上
      addressList.forEach(function (value) {
        if (value.id == id) {
          if (value.default == 0) { 
            value.default = 1;
          } else { value.default = 0;}
          
        } else {
          value.default = 0;
        }
      });
      that.setData({
        addressList: addressList
      });
    } else {
      //如果响应码不是201则更改失败
      wx.showModal({
        title: '设置默认失败',
      })
      return false;
    }
  },
  //删除地址
  deleteaddress(e) {
    //先获取需要删除的地址的id号码
    var id = e.currentTarget.dataset.id;

    this.data.deleteId = id;
    //页面初始化，使用公共函数login来判断现在token是否过期，如果过期，就从前登录，
    //如果没有过期，就执行回调函数,如果过期了，就先登录再执行回调函数
    login.checkToken(this, this.setDelete);
  },
  setDelete:function(that){
    //先获取需要更改的id
    var id = that.data.deleteId;
    //准备需要向后台发送的数据的参数
    var deleteInfo = {
      type: "GET",
      url: "delAddress"
    };
    var deleteData = {
      id: id
    };
    //向后台发送数据请求
    token.getRequest(that, deleteInfo, deleteData, that.afterDelete);
  },
  afterDelete: function(that,res) {
    //获取尝试删除的地址的id
    var id = that.data.deleteId;
    //接受服务器返回值
    var code = res.data;
    //判断是否成功删除
    if(code == '201'){
      //获取收货地址栏
      var addressList = that.data.addressList;
      //这是一个特殊的结构，通过抛出异常来让forEach循环结束，
      //循环到删除的地址的Id，然后删除数组中这个地址，并中断循环
      try {
        addressList.forEach(function (value, index) {
          if (value.id == id) {
            addressList.splice(index, 1);
            //终止forEach循环
            throw new Error('endForEach');
          }
        });

      } catch (e) {
        if (e.message != 'endForEach') throw e;
      };
      that.setData({
        addressList: addressList
      });
      //end if(cod = 201)
    }else{
      wx.showModal({
        title: '删除失败',
      })
      return false;
    }
  },

 

  //点击任何地址，跳转到订单确定页
  jumpOrder: function (e) {
    var id = e.currentTarget.dataset.id; //获取点击的索引
    wx.getStorage({
      key: 'selectAddress',
      success(res) {
        if(res.data){
          wx.navigateTo({
            url: '../order_details/order_details?addressId=' + id
          })
        }
      }
    })
  },
  
})/*  */