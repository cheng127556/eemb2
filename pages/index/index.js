//index.js
//获取应用实例
var login = require('../../utils/util.js');
var token = require('../../utils/token.js');
const app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        product: [],
        hot: []
    },
    //热销里的查看全部
    selectAll: function() {
        wx.navigateTo({
            url: '/pages/product/product?name=Hot_Sale'
        })
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

      this.setData({
        img1: app.globalData.IMGURL + 'images/diandongc.jpg',
        img2: app.globalData.IMGURL + 'images/assets/hotimg.png',
        img3: app.globalData.IMGURL + 'images/assets/right.jpg',
        img4: app.globalData.IMGURL + 'images/assets/new.png',
      });
      //微信登录
      var requestInfo = {
        type: "GET",
        url: "getIndexImg"
      };
      var data = {};
      token.noTokenRequest(this, requestInfo,data,this.afterInit)

      login.getToken();

    },
    /*搜索框功能 */
    showSearchHandle() {
        this.setData({ searchShowed: true })
    },
    hideSearchHandle() {
        this.setData({ searchText: '', searchShowed: false })
    },
  //获取数据库的hot 热销的产品
  afterInit: function (that,res) {
        console.log(res)
        var goodInfo = res.data;
        var hotgood = goodInfo.indexImg;
        var indexClassify = goodInfo.indexClassify;
        that.setData({
          hot: hotgood,
          product: indexClassify
        })
  },
})