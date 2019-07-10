// pages/product/product.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        productList: {
            ER: [],
            CR: [],
            LP: [],
            LIR: [],
            Hot_Sale: [],
            product: []
        },
        _num: '',
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var name = options.name;
        this.loadHotSale(this.DataInit,name);
        //获取首页传递的参数名字
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function(options) {
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
  loadHotSale: function (fun, name) {
    var that = this;
    wx.request({
      url: 'http://wx.io/getAllinfo',
      dataType: JSON,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        var nowdata = JSON.parse(res.data);
        console.log(nowdata);
        that.setData({
          productList: nowdata
        })
        fun(that, name);
        console.log(that.data);
      }
    })
  },
    DataInit: function (that,name) {   
    name = name.replace(/\s*/g, "");
    //默认产品页的展示页面为最热数据
    that.data.productList.product = that.data.productList[name];
    that.setData({
      productList: that.data.productList,
      _num: name
    })
  },
    /*搜索框 */
    showSearchHandle() {
        this.setData({ searchShowed: true })
    },
    hideSearchHandle() {
        this.setData({ searchText: '', searchShowed: false })
    },
    /*头部选择系列*/
    btn_type: function(e) {
        var this_type = e.currentTarget.dataset.type;
        this.data.productList.product = this.data.productList[this_type];
        this.setData({
            productList: this.data.productList,
            _num: e.target.dataset.num
        })
    },
})