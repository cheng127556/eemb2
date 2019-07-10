var utils = require('../../utils/utils')
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
      this.setData({
        img1: app.globalData.IMGURL + 'images/assets/eemb.jpg',
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
        this.init();
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
    init() {
        // var footPrint = wx.getStorageSync('footPrint')
        // console.log(footPrint)
        // this.setData({
        //   footprintList: footPrint
        // })
        var that = this;
        // wx.request({
        //   url: 'http://127.0.0.1:3000/footPrint', //开发者服务器接口地址",
        //   // data: 'data', //请求的参数",
        //   method: 'GET',
        //   dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
        //   success: res => {
        //     console.log(res.data)
        //     that.setData({
        //       footprintList:res.data
        //     })
        //   },
        //   fail: () => {},
        //   complete: () => {}
        // });
        utils.fetch('footPrint').then(res => {
            that.setData({
                footprintList: res.data
            })
        })
    }
})