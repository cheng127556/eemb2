// pages/detail/detail.js
var login = require('../../utils/util.js');
var token = require('../../utils/token.js');
var calculate = require('../../utils/calculate.js');
var app = getApp();
Page({
  data: {
    carts: [],
    minusStatuses: ['disabled', 'disabled', 'normal', 'normal', 'disabled'],
    /*页面配置 */
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    currentTab1: 0,
    showModalStatus: false,
    height: '300',
    comboIndex: 0,
    cartNum : 1,
    isMeal:0,
    selectedText: '单电芯套餐',
    comment: [
      // {
      //   avater: "https://www.eemb.cn/wx//diandongc.jpg",
      //   name: "成慧芳",
      //   grade: "5",
      //   time: "2019-06-20",
      //   comment: "便宜好用耐用客服很好很热情便宜好用耐用客服很好很热情便宜好用耐用客服很好很热情便宜好用耐用客服很好很情便宜好用耐用客服很好很热情便宜好用耐用客服很好很热情便宜好用耐用客服很好很热情便宜好用耐用客服很好很热情便宜好用耐用客服很好很热情便宜好用耐用客服很好很热情便宜好用耐用客",
      //   images: ['https://www.eemb.cn/wx//diandongc.jpg', 'https://www.eemb.cn/wx//diandongc.jpg', 'https://www.eemb.cn/wx//diandongc.jpg', 'https://www.eemb.cn/wx//diandongc.jpg'],
      // },
      // {
      //   avater: "../../assets/diandongc.jpg",
      //   name: "程玉龙",
      //   grade: "5",
      //   time: "2019-06-22",
      //   comment: "便宜好用耐用客服很好很热情便宜好用耐用客服很好很热情便宜好用耐用客服很好很热情便宜好用耐用客服很好很情便宜好用耐用客服很好很热情便宜好用耐用客服很好很热情便宜好用耐用客服很好很热情便宜好用耐用客服很好很热情便宜好用耐用客服很好很热情便宜好用耐用客服很好很热情便宜好用耐用客",
      //   images: ["https://www.eemb.cn/wx//diandongc.jpg", "https://www.eemb.cn/wx//diandongc.jpg", "https://www.eemb.cn/wx//diandongc.jpg", "https://www.eemb.cn/wx//diandongc.jpg"],
      // },
      // {
      //   avater: "../../assets/diandongc.jpg",
      //   name: "杨双",
      //   grade: "1",
      //   time: "2019-06-30",
      //   comment: "便宜好用耐用客服很好很热情便宜好用耐用客服很好很热情便宜好用耐用客服很好很热情便宜好用耐用客服很好很情便宜好用耐用客服很好很热情便宜好用耐用客服很好很热情便宜好用耐用客服很好很热情便宜好用耐用客服很好很热情便宜好用耐用客服很好很热情便宜好用耐用客服很好很热情便宜好用耐用客",
      //   images: ["https://www.eemb.cn/wx//diandongc.jpg", "https://www.eemb.cn/wx//diandongc.jpg", "https://www.eemb.cn/wx//diandongc.jpg", "https://www.eemb.cn/wx//diandongc.jpg"],
      // }
    ]
  },
  //页面初始化事件
  onLoad: function(options) {
    var hid = options.hid; //页面初始化options为页面跳转所带来的参数
    //如果hid不为空，就从后台获取数据
    if (hid != undefined) {
      this.loadHid(hid);
    }
    var haveBottom = true;
    this.setData({
      haveBottom: haveBottom,
      img1: app.globalData.IMGURL + 'images/assets/right.png',
      img2: app.globalData.IMGURL + 'images/assets/check-circle.png',
      img3: app.globalData.IMGURL + 'images/assets/eemb.jpg',
      img4: app.globalData.IMGURL + 'images/assets/home.png',
      img5: app.globalData.IMGURL + 'images/assets/cart.png',
      img6: app.globalData.IMGURL + 'images/assets/close-circle.png',
    });

  },
  onReachBottom: function () {
    var haveBottom = this.data.haveBottom;
    if(haveBottom){
      this.GetSwiperHeight('applications');
      this.setData({
        haveBottom: false
      });
    }    
  },

  //获取数据库中对应的hid数据
  loadHid: function(hid) {

    var requestInfo = {
      type: "GET",
      url: "getone?id=" + hid
    };
    var data = {};
    //发送一个不带token的请求给后台获取当前product_id对应的商品的详细数据
    token.noTokenRequest(this, requestInfo, data, this.detailInit)
    
  },
  //接收从后台传来的数据，初始化界面
  detailInit: function(that, res) {
    //接收数据
    var newData = res.data;
    console.log("newData", newData)
    //判断这个电池是不是自行车电池，如果是，就显示套餐
    //发送到前台页面
    that.setData({
      carts: newData,
      totalPrice:newData.price
    })
  },
  span6: function(options) {
    wx.navigateTo({
      url: '../product/product'
    })
  },
  coupons: function() {
    wx.navigateTo({
      url: '/pages/receivecoupon/receivecoupon'
    })
  },
  // 跳到购物车
  toCar() {
    wx.switchTab({
      url: '/pages/cart/cart'
    })
  },
  //加入购物车事件
  addCar: function() {
    //先弹出商品套餐图，让客户选择商品套餐，点击确定后再发送请求加入购物车
    this.data.type = 'add';
    this.showModal()
  },
  //购物车商品选择按钮
  btn_select: function (e) {
    //获取套餐数量
    var comboNum = parseInt(e.currentTarget.dataset.combo);

    //把当前价格更新到this.data
    this.data.cartNum = comboNum;
    //获取选择的套餐的索引
    var comboIndex = e.currentTarget.dataset.combonum;
    //获取电池的类型
    var classify = this.data.carts.classify;
    //获取电池的价格套餐信息

    //默认信息为空
    var selectedText = '';
    //判断电池是否包含充电器
    if(classify == 4){
      //如果是电动车电池，就判断是单电芯套餐还是充电器套餐
      var isMeal = e.currentTarget.dataset.ismeal;
      var selectedText = "电芯加充电器套餐";
      if (isMeal != '1') {
        selectedText = "但电芯套餐";
      }
    }else{
      //如果不是电动车电池，肯定不含有充电器
      var isMeal = 0;
    }
    //把现在是否包含充电器更新到this.data
    this.data.isMeal = isMeal;
    var totalPrice = this.getNowPrice();
    this.setData({
      //控制样式的索引
      comboIndex: comboIndex,
      //现在购物车里的商品数量
      cartNum: comboNum,
      //总价格
      totalPrice: totalPrice,
      //是否含有充电器
      isMeal: isMeal,
      //套餐类型
      selectedText: selectedText,
    });
  },
  //获取计算商品价格必须的参数
  getNowPrice:function(){
    var comboNum = this.data.cartNum;
    //获取电池的类型
    //获取电池的价格套餐信息
    var sale = this.data.carts.sale;
    var price = this.data.carts.price;
    var isMeal = this.data.isMeal;
    var numInfo = {
      "isMeal": isMeal,
      "num": comboNum,
      "price": price,
    };
    //返回现在的总价
    return calculate.getPrice(numInfo, sale);

  },
  //购物车点击增加事件
  addCount: function (e) {
    var cartNum = this.data.cartNum;
    cartNum = ++cartNum;

    this.data.cartNum = cartNum;
    //调用函数，获取现在价格
    var totalPrice = this.getNowPrice();

    this.setData({
      cartNum: cartNum,
      totalPrice: totalPrice
    });

  },
  minusCount: function (e) {
    var cartNum = this.data.cartNum;
    if (cartNum <= 1){
      app.showTitle('已经到最小值，不能再减少了');
      return false;
    }
    cartNum = --cartNum;

    this.data.cartNum = cartNum;
    //调用函数，获取现在价格
    var totalPrice = this.getNowPrice();

    this.setData({
      cartNum: cartNum,
      totalPrice: totalPrice
    });

  },
  //购物车修改好了之后点击确定按钮发送到后台
  bindcart: function () {
    var type = this.data.type;
    if(type == 'add'){
      login.checkToken(this, this.GetShoppingCart);            
    }else{
      var isMeal = this.data.isMeal;
      var good = this.data.carts;
      console.log(good);
      var goodinfo = {};
      if (isMeal == 0) {
        goodinfo.charger_count = 0;
      }else{
        goodinfo.charger_count = this.data.cartNum;
      }
      goodinfo.classify = good.classify;
      goodinfo.count = this.data.cartNum;
      goodinfo.freight = good.freight;
      goodinfo.hid = good.hid;
      goodinfo.price = good.price;
      goodinfo.img = good.image;
      goodinfo.name = good.name;
      goodinfo.sale = good.sale;
      goodinfo = [goodinfo];
      try {
        wx.setStorageSync('orderList', goodinfo);
      } catch (e) {
        app.showTitle('网络异常，请重试');
      }
        wx.navigateTo({
      url: '../order_details/order_details',
    })
    }
    
  },
  //准备提交给后台添加购物车事件
  GetShoppingCart: function(that) {
    var isMeal = that.data.isMeal;
    var count = that.data.cartNum;
    var id = that.data.id;
    var requestInfo = {
      type: "POST",
      url: "shoppingcart"
    };
    var data = {
      "product_id": that.data.carts.hid,//商品的id
      'behavior': '',//行为，为''是加count,如果是add则是加1
      'isMeal': isMeal,//0或者1
      'count': count//商品的数量
    };
    //公共函数，从数据库获取地址信息，如果成功就执行回调函数 dataInit
    token.getRequest(that, requestInfo, data, that.afterAddCar);
  },
  //根据后台传来的修改购物车的返回值，判断修改成功与否
  afterAddCar: function(that, res) {

    if( parseInt(res.data) == 201){
      app.showToast('添加购物车成功');

    }else{
      app.showToast('网络异常，添加购物车失败',false,false,'none');
    }
  },
  /*跳回首页 */
  back() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  /** 
   * 滑动切换tab 
   */
  bindChange: function(e) {
    var that = this;

    that.setData({
      currentTab: e.detail.current
    });
  },

  /** 
   * 点击tab切换 
   */
  swichNav: function(e) {
    var that = this;
    var current = e.target.dataset.current;
    var id = e.target.dataset.id;
    if (this.data.currentTab === current) {
      return false;
    } else {
      that.setData({
        currentTab: current
      })
    }
    console.log(id);
    this.GetSwiperHeight(id);
  },

  /** 
   * 点击tab1切换 
   */
  swichNav1: function(e) {
    var that = this;
    if (this.data.currentTab1 === e.target.dataset.current1) {
      return false;
    } else {
      that.setData({
        currentTab1: e.target.dataset.current1
      })
    }
  },
  /*tab中的tab */
  bindChange1: function(e) {
    this.setData({
      currentTab1: e.detail.current1
    });
  },

  //显示对话框
  showModal: function() {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 10)
  },

  //隐藏对话框
  hideModal: function() {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  //弹出框input值
  bindManual: function(e) {
    var iname = e.target.dataset.iname;
    var cartNum = parseInt(e.detail.value);
    this.data.cartNum = cartNum;
    //调用函数，获取现在价格
    var totalPrice = this.getNowPrice();

    this.setData({
      cartNum: cartNum,
      totalPrice: totalPrice
    });
  },

  // 立即购买
  immeBuy: function() {
    this.data.type = 'buy';
    this.showModal();
  },
  //自动获取高度
  GetSwiperHeight: function(id) {
    id = '#' + id;
    var _this = this;
    var query = wx.createSelectorQuery();
    query.select(id).boundingClientRect();
    query.exec(function(res) {
      var height = res[0].height + 100;
      console.log("height", height);
      _this.setData({
        height: height
      })
    })
  },
  
})