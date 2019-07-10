var util = require('../../utils/util');
var login = require('../../utils/util.js');
var token = require('../../utils/token.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contexts: [],
    company: '',
    postid: '',
    no: '',
    postid: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //查物流
    //快递公司和，快递单号
    var orderId = options.id;
    this.data.oderId = orderId;
    this.getExpressNumber(this);
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getExpressNumber:function(that){
    var requestInfo = {
      type: "GET",
      url: "getExpressInfo"
    };
    var orderId = this.data.oderId;
    var data = {
      id:orderId
    };
    //公共函数，从数据库获取地址信息，如果成功就执行回调函数 dataInit
    token.getRequest(that, requestInfo, data, that.getExpress);
  },
  getExpress: function(that,res) {
    console.log(res.data);
    var type = res.data.express_company;

    var postid = res.data.express_number;
    //数据内容
    var RequestData = "{'OrderCode':'','ShipperCode':'" + type + "','LogisticCode':'" + postid + "'}"
    //utf-8编码的数据内容
    var RequestDatautf = encodeURI(RequestData)
    //签名
    // console.log(RequestData + 'apikey')
    var DataSign = encodeURI(util.Base64((util.md5(RequestData + '23ad451f-f178-4924-b7c9-cd0e2b0683e0'))))
    if (res.data != null) {
      wx.request({
        url: 'https://api.kdniao.com/Ebusiness/EbusinessOrderHandle.aspx',
        data: {
          //数据内容(进行过url编码)
          'RequestData': RequestDatautf,
          //电商ID
          'EBusinessID': '1528555',
          //请求指令类型：1002
          'RequestType': '1002',
          //数据内容签名把（请求内容（未编码）+ApiKey）进行MD5加密，然后Base64编码，最后进行URL（utf-8）编码
          'DataSign': DataSign,
          //请求、返回数据类型： 2-json；
          'DataType': '2',
        },
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          console.log(res)
          that.setData({
            Traces: res.data.Traces,
            postid: postid
          })
        }
      })
    }
  }
})