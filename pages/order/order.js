const app = getApp()
var login = require('../../utils/util.js');
var token = require('../../utils/token.js');
var utils = require('../../utils/utils');
var orderFormat = require('../../utils/order');
var pay = require('../../utils/pay');
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    navList: ["全部", "待付款", "待发货", "已发货", "退换货", "待评价"],
    orderList: [],
    navData: [
      { text: '全部' },
      { text: '待付款' },
      { text: '待发货' },
      { text: '已发货' },
      { text: '退换货' },
      { text: '待评价' },
    ],
    userInfo: {},
    hasUserInfo: false,
    currentTab: 0,
    navScrollLeft: 0,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  //事件处理函数
  onLoad: function (options) {
    //导航栏初始化
    this.navInit();
    this.data.orderType = options.type;
    this.setData({
      img1: app.globalData.IMGURL + 'images/assets/empty.png'
    });
  },
  onShow() {
    login.checkToken(this, this.pageInit);
  },
  pageInit: function (that) {
    var requestInfo = {
      type: "GET",
      url: "getOder"
    };
    var type = that.data.orderType;
    var data = {};
    that.setData({
      currentTab: parseInt(type)
    });
    if (type == '0') {
      data = {}
    } else {
      data = { 'type': type };
    }
    //公共函数，从数据库获取地址信息，如果成功就执行回调函数 dataInit
    token.getRequest(that, requestInfo, data, that.afterGetOder);
  },
  afterGetOder: function (that, res) {
    var orderList = res.data;
    var type = that.data.orderType;
    orderList = orderFormat.orderFormat(orderList, type);
    that.setData({
      orderList: res.data
    });
  },
  // selectOder:function(e){
  //   var orderId = e.currentTarget.dataset.index;
  //   this.data.orderType = orderId;
  //   login.checkToken(this, this.pageInit);
  //   this.setData({
  //     currentTab: orderId
  //   });
  // },
  paybtn: function (option) {
  },
  /*取消订单*/
  cancelOder: function (e) {
    var changeId = e.currentTarget.dataset.id;
    this.data.changeId = changeId;
    login.checkToken(this, this.setCanceOrder);
  },
  setCanceOrder: function (that) {
    var changeId = that.data.changeId;
    var requestInfo = {
      type: "GET",
      url: "exitOrder"
    };
    var data = {
      id: changeId
    };
    token.getRequest(that, requestInfo, data, that.afterCanceOrder);
  },
  afterCanceOrder: function (that, res) {
    if (res.data == 201) {
      var orderList = that.data.orderList;
      var id = that.data.changeId;
      var index = '';
      orderList.forEach(function (val, key) {
        if (val.id == id) {
          index = key;
        }
      });
      orderList.splice(index, 1);
      that.setData({
        orderList: orderList
      });
    } else {
      app.showTitle('网络好像除了点问题，请稍重试');
    }
  },
  /*恢复订单*/
  recoverOrder: function (e) {
    var changeId = e.currentTarget.dataset.id;
    this.data.changeId = changeId;
    login.checkToken(this, this.setRecoverOrder);
  },
  setRecoverOrder: function (that) {
    var changeId = that.data.changeId;
    var requestInfo = {
      type: "GET",
      url: "recoverOrder"
    };
    var data = {
      id: changeId
    };
    token.getRequest(that, requestInfo, data, that.afterRecoverOrder);
  },
  afterRecoverOrder: function (that, res) {
    if (res.data == 201) {
      var orderList = that.data.orderList;
      var id = that.data.changeId;
      var index = '';
      orderList.forEach(function (val, key) {
        if (val.id == id) {
          index = key;
        }
      });
      orderList.splice(index, 1);
      that.setData({
        orderList: orderList
      });
    } else {
      app.showTitle('网络好像除了点问题，请稍重试');
    }
  },
  //支付订单
  payOder: function (e) {
    var changeId = e.currentTarget.dataset.id;
    pay.payOrder(this, changeId);
  },
  //查看物流
  showExpress: function (e) {
    var changeId = e.currentTarget.dataset.id;
    console.log(changeId);
    var url = '../logistics/logistics?id=';
    url = url + changeId;
    wx.navigateTo({
      url: url
    })
  },
  deleteOrder: function (e) {
    var changeId = e.currentTarget.dataset.id;
    this.data.changeId = changeId;
    login.checkToken(this, this.setDeleteOrder);
  },
  setDeleteOrder: function (that) {
    var changeId = that.data.changeId;
    var requestInfo = {
      type: "GET",
      url: "deleteOrder"
    };
    var data = {
      id: changeId
    };
    token.getRequest(that, requestInfo, data, that.afterDeleteOrder);
  },
  afterDeleteOrder: function (that, res) {
    if (res.data == 201) {
      var orderList = that.data.orderList;
      var id = that.data.changeId;
      var index = '';
      orderList.forEach(function (val, key) {
        if (val.id == id) {
          index = key;
        }
      });
      orderList.splice(index, 1);
      that.setData({
        orderList: orderList
      });
    } else {
      app.showTitle('网络好像除了点问题，请稍重试');
    }
  },

  //导航切换
  switchNav(e) {
    //点击的nav index
    var cur = e.currentTarget.dataset.current;
    //每个tab选项宽度占1/5
    var singleNavWidth = this.data.windowWidth / 5;
    //tab选项居中                            
    this.setData({
      navScrollLeft: (cur - 2) * singleNavWidth
    })
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
    // console.log("cur", cur);
    var orderId = e.currentTarget.dataset.current;
    this.data.orderType = orderId;
    login.checkToken(this, this.pageInit);
  },
  //导航初始化
  navInit: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          pixelRatio: res.pixelRatio,
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      },
    })
  }
})