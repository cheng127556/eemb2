//
var login = require('../../utils/util.js');
var token = require('../../utils/token.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    bicycle:false,
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
    this.data.name = name;
    if (name == 'Bicycle'){
      this.data.name = 'all';
      this.setData({
        bicycle : true
      });
      var requestInfo = {
        type: "GET",
        url: "getBicycle"
      };
      var data = {};
      token.noTokenRequest(this, requestInfo, data, this.bicycleData);

    }else{
      var requestInfo = {
        type: "GET",
        url: "getAllinfo"
      };   
      var data = {};
      token.noTokenRequest(this, requestInfo, data, this.productInit);
    //获取首页传递的参数名字
    }
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(options) {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

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
  //电动车电池数据初始化
  bicycleData: function (that,res){
    var productList = res.data;
    var name = that.data.name;
    console.log(res.data);
    productList.all = [];
    productList['all'] = productList['all'].concat(productList['36V']);
    productList['all'] = productList['all'].concat(productList['48V']);
    productList['all'] = productList['all'].concat(productList['60V']);
    productList['all'] = productList['all'].concat(productList['72V']);
    console.log(productList);
    that.setData({
      productList: productList
    });
    that.DataInit(that, name);
   },
  bicycleInit:function(){

  },
  productInit:function(that,res) {
    var productList = res.data;
    console.log(productList);
    var name = that.data.name;
    that.setData({
      productList: productList
    });
    that.DataInit(that,name);
  },
  DataInit: function(that, name) {
    //默认产品页的展示页面为最热数据
    name = name.replace(/\s*/g, "");
    console.log(name)
    that.data.productList.product = that.data.productList[name];
    that.setData({
      productList: that.data.productList,
      _num: name
    })
  },
  /*搜索框 */
  showSearchHandle() {
    this.setData({
      searchShowed: true
    })
  },
  hideSearchHandle() {
    this.setData({
      searchText: '',
      searchShowed: false
    })
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