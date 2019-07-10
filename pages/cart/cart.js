// page/component/new-pages/cart/cart.js
var address = require('../../utils/address');
var token = require('../../utils/token.js');
var login = require('../../utils/util.js');
var validate = require('../../utils/validate.js');
var calculate = require('../../utils/calculate.js');
var numbers = 1;
var bool = true;
var app = getApp()
Page({
  data: {
    show_edit: "block",
    edit_name: "编辑",
    edit_show: "none",
    hasList: true,
    list: [],
    totalPrice: 0,
    selectAllStatus: false,
    count: 0, //购物车数量
  },
  onLoad() {
    this.setData({
      img1: app.globalData.IMGURL + 'images/assets/xinxin-active.png',
      img2: app.globalData.IMGURL + 'images/assets/navicon4.png'
    });

  },
  onShow() {
    wx.showToast({
      title: '加载中',
      icon: "loading",
      duration: 1000
    })
    login.checkToken(this, this.init);
  },
  updatePrice:function(that){
    var goodList = that.data.list;

    var selectedListInfo = calculate.getSelected(goodList);
    var selectedList = selectedListInfo.selectedList;
    var info = calculate.getPriceInfo(selectedList);
    // 重新渲染数据
    that.setData({
      list: goodList,
      totalPrice: info.totalPrice,
      freight: info.freight,
      selectAllStatus: selectedListInfo.selectAllStatus
    })
  },
  /**
   * 当前商品选中事件
   */
  selectList(e) {
    // 获取选中的radio索引
    var index = e.currentTarget.dataset.index;
    console.log(index);
    // // 获取到商品列表数据
    var goodList = this.data.list;
    goodList[index].selected = !goodList[index].selected;
    this.data.list = goodList;

    this.updatePrice(this);
  },
  // 编辑
  btn_edit: function() {
    var that = this;
    if (bool) {
      that.setData({
        edit_show: "block",
        edit_name: "取消",
        show_edit: "none"
      })
      bool = false;
    } else {
      that.setData({
        edit_show: "none",
        edit_name: "编辑",
        show_edit: "block"
      })
      bool = true;
    }

  },
  // 删除商品
  deletes: function(e) {
    //获取商品索引
    const index = e.currentTarget.dataset.index;
    var goodList = this.data.list;
    var setData = {};
    goodList.forEach(function(value, key) {
      if (key == index) {
        setData['product_id'] = value.hid;
        setData['classify'] = value.classify;
        setData['isMeal'] = 0;
        if (value['charger_count'] != 0) {
          setData['isMeal'] = 1;
        }
      }
    });
    //把商品索引存到data中，方便下次使用
    this.data.deleteIndex = index;
    this.data.setData = setData;
    // //检查是否是登陆状态，如果是登陆状态，就提删除事件的回调函数，如果不是登陆状态，就先登陆
    login.checkToken(this, this.deleteProduct);
  },
  deleteProduct: function(that) {
    //先获取要删除的商品的id
    var data = that.data.setData;
    var requestInfo = {
      type: "POST",
      url: "shoppingcartcut"
    };
    console.log(data);
    //公共函数，从数据库获取地址信息，如果成功就执行回调函数afterDelete
    token.getRequest(that, requestInfo, data, that.afterDeleteProduct);
  },
  afterDeleteProduct: function(that, res) {

    //如果返回值为201，则是更改成功
    if (parseInt(res.data) == 201) {
      var index = that.data.deleteIndex;
      var goodList = that.data.list;
      goodList.splice(index, 1);
      that.goodListSet(that, goodList);
    }

  },

  /**
   * 购物车全选事件
   */
  selectAll(e) {
    // 全选ICON默认选中
    var goodList = this.data.list;
    var selectAllStatus = this.data.selectAllStatus;

    if (selectAllStatus) {
      goodList.forEach(function(value) {
        value.selected = false;
      });
    } else {
      goodList.forEach(function(value) {
        value.selected = true;
      });
    }
    var selectedListInfo = calculate.getSelected(goodList);
    var selectedList = selectedListInfo.selectedList;
    var info = calculate.getPriceInfo(selectedList);
    // 重新渲染数据
    this.setData({
      list: goodList,
      totalPrice: info.totalPrice,
      freight: info.freight,
      selectAllStatus: selectedListInfo.selectAllStatus
    })
  },
  /*
    公共函数：根据现在的goodList渲染页面
  */
  goodListSet: function(that, goodList) {
    goodList = calculate.getAllPrice(goodList);
    that.data.list = goodList;
  

    that.updatePrice(that);
  },
  /*
    公共函数：goodList没有改变的情况下，刷新页面
  */
  goodListSet2: function(that) {
    var goodList = that.data.list;
    var totalPrice = that.data.totalPrice;
    that.setData({
      list: goodList,
      totalPrice: totalPrice
    })
  },
  /*
    购物车公共函数：准备参数
  */
  getSetData: function(key) {
    var goodList = this.data.list;
    var setData = {};
    goodList.forEach(function(value, index) {
      if (index == key) {
        setData['product_id'] = value['hid'];
        setData['isMeal'] = 0;
        if (value['charger_count'] != 0) {
          setData['isMeal'] = 1;
        }
        setData['count'] = value['count'];
        setData['behavior'] = 'add';
      }
      return false;
    });
    return setData;
  },

  /**
   * 购物车商品数目增加事件
   */
  btn_add(e) {
    // 获取点击的商品的hid
    const index = e.currentTarget.dataset.index;
    // 获取商品数据
    var setData = this.getSetData(index);
    this.data.setData = setData;
    this.data.setDataIndex = index;
    //检查是否是登陆状态，如果是登陆状态，就提删除事件的回调函数，如果不是登陆状态，就先登陆
    login.checkToken(this, this.addtNum);
  },
  addtNum: function(that) {
    //获取id，然后下面是封装的从数据库获取地址数据的函数
    var requestInfo = {
      type: "POST",
      url: "shoppingcart"
    };

    var data = that.data.setData;
    console.log("data",data);
    //公共函数，从数据库获取地址信息，如果成功就执行回调函数 dataInit
    token.getRequest(that, requestInfo, data, that.afterAddNum);
  },
  afterAddNum: function(that, res) {
    console.log(res.data);
    // 如果返回值为201，则是更改成功
    if (parseInt(res.data) == 201) {
      //获取增加的商品的hid
      var dataIndex = that.data.setDataIndex;
      //获取商品列表
      var goodList = that.data.list;
      //循环到对应商品的时候加1，然后重现渲染到页面
      goodList.forEach(function(value, index) {
        if (index == dataIndex) {
          value.count = ++value.count;
          if (value.charger_count != 0) {
            value.charger_count = value.count;
          }
        }
      });
      that.goodListSet(that, goodList);
    }
  },
  /**
   * 绑定减数量事件
   */
  btn_minus(e) {
    // 获取点击的商品的productId
    const index = e.currentTarget.dataset.index;
    // // 获取商品数据
    this.data.setData = this.getSetData(index);
    this.data.deleteId = index;
    var goodList = this.data.list;
    //购物车商品减少事件和其他有一个区别，那就是数量不能无限制减少
    //当购物车里商品数量已经是1的时候，就不会再减少了，也不用向后台发送请求了，这样更节省性能和流量
    var ifMinus = true;
    goodList.forEach(function(element, key) {
      if (key == index) {
        if (element.count <= 1) {
          ifMinus = false;
        }
      }
    });
    //当商品已经到最小值的时候，就不能再减小了，抛出提示并终止函数
    if (!ifMinus) {
      app.showTitle('已经到最小值不能再减了');
      return false;
    }
    //检查是否是登陆状态，如果是登陆状态，就提删除事件的回调函数，如果不是登陆状态，就先登陆
    login.checkToken(this, this.minusNum);
  },
  minusNum: function(that) {
    //获取id，然后下面是封装的从数据库获取地址数据的函数
    var requestInfo = {
      type: "POST",
      url: "shoppingcartMinus"
    };
    var data = that.data.setData;
    data['behavior'] = '';
    //公共函数，从数据库获取地址信息，如果成功就执行回调函数 dataInit
    token.getRequest(that, requestInfo, data, that.afterMinusNum);
  },
  afterMinusNum: function(that, res) {

    if (parseInt(res.data) == 202) {
      app.showTitle('已经到最小值不能再减了');
      return false;
    }
    if (parseInt(res.data) == 201) {
      var index = that.data.deleteId
      var goodList = that.data.list;
      //循环到对应商品的时候减1，然后重现渲染到页面
      goodList.forEach(function(value, key) {
        if (index == key) {
          value.count = --value.count;
          if (value.charger_count != 0) {
            value.charger_count = value.count;
          }
        }
      });
      that.goodListSet(that, goodList);
      return false;
    }
    app.showTitle('网络好像出小差了，请刷新');
  },
  // 提交订单
  btn_submit_order: function() {
    var that = this;
 
    var goodList = that.data.list;
    var selectedList = [];
    goodList.forEach(function(value,index){
      // console.log(value);
      if (value.selected){
        selectedList.push(value);
      }
    });
    if (selectedList.length == 0) {
      app.showTitle('购物车是空的，不能提交');
      return false;
    }
    console.log(selectedList);
    try {
      wx.setStorageSync('orderList', selectedList);
    } catch (e) {
      app.showTitle('网络异常，请重试');
     }
      wx.navigateTo({
      url: '../order_details/order_details',
    })
  },
  // 收藏
  btn_collert: function(e) {
    //获取要添加进收藏的商品的id
    var id = e.currentTarget.dataset.id;
    //获取商品是否为收藏
    var collect = e.currentTarget.dataset.collect;

    //把商品的id存到this.data中方便以后使用
    this.data.collectId = id;

    //如果商品是收藏的情况下，就取消收藏，如果是没有收藏情况，就加入收藏
    //执行检查token函数，如果登录状态没有问题就直接执行回调函数，否则就先登录再执行回调函数
    if (collect) {
      login.checkToken(this, this.deleteCollect);
    } else {
      login.checkToken(this, this.addCollect);
    }
  },
  deleteCollect: function(that) {
    //获取将要收藏的商品的id
    var id = that.data.collectId;
    //准备要发送给后台的数据 
    var requestInfo = {
      type: "GET",
      url: "delShopCollect"
    };
    var data = {
      'product_id': id
    };
    //发送给后台，成功得到响应之后的执行函数
    token.getRequest(that, requestInfo, data, this.afterDeleteCollect);
  },
  afterDeleteCollect: function(that, res) {
    //接收服务器的响应数据，正确的响应代码为201，如果成功则重新渲染列表，把收藏结果反应在界面上
    if (res.data == '201') {
      //获取收藏的产品的id
      var id = that.data.collectId;
      //获取当前商品列表
      var goodList = that.data.list;
      //循环列表，如果id和产品的hid相等，就渲染到界面上
      goodList.forEach(function(element) {
        if (element.hid == id) {
          element.collect = 0;
        }
        that.setData({
          list: goodList
        });
      });
    } else {
      //如果返回值是200就说明已经存在，不做操作
      if (res.data == '200') {
        return false;
      }
      //如果响应是其他失败就弹窗表示没有收藏成功
      wx.showModal({
        title: '取消收藏失败',
      })
    }
  },
  addCollect: function(that) {

    //获取将要收藏的商品的id
    var id = that.data.collectId;
    //准备要发送给后台的数据 
    var requestInfo = {
      type: "POST",
      url: "addCollect"
    };
    var data = {
      'product_id': id
    };
    //发送给后台，成功得到响应之后的执行函数
    token.getRequest(that, requestInfo, data, this.afterAdd);
  },
  afterAdd: function(that, res) {
    //接收服务器的响应数据，正确的响应代码为201，如果成功则重新渲染列表，把收藏结果反应在界面上
    if (res.data == '201') {
      //获取收藏的产品的id
      var id = that.data.collectId;
      //获取当前商品列表
      var goodList = that.data.list;
      //循环列表，如果id和产品的hid相等，就渲染到界面上
      goodList.forEach(function(element) {
        if (element.hid == id) {
          element.collect = 1;
        }
        that.setData({
          list: goodList
        });
      });
    } else {
      //如果返回值是200就说明已经存在，不做操作
      if (res.data == '200') {
        return false;
      }
      //如果响应是其他失败就弹窗表示没有收藏成功
      wx.showModal({
        title: '收藏失败',
      })
    }
  },


  //页面初始化获取需要的数据
  init(that) {
    var requestInfo = {
      type: "POST",
      url: "getShoppingcart"
    };
    var data = {};
    //公共函数，从数据库获取地址信息，如果成功就执行回调函数 dataInit
    token.getRequest(that, requestInfo, data, that.dataInit);
  },
  dataInit: function(that, res) {
    console.log(res.data)
    var goodList = res.data;
    goodList = calculate.shoppingCartFormat(goodList);
    that.goodListSet(that, goodList);
  },


  //购物车input值
  bindManual: function(e) {
    //获取用户输入的数量
    var changeNum = parseInt(e.detail.value);
    //获取修改的商品的hid
    var index = e.currentTarget.dataset.index;
    //调用一个公共函数验证用户提交的数字是不是非法类型
    var isPositiveInt = validate.verifyInt(changeNum);
    //如果用户提交的数字是非法类型，就重新渲染列表，并中断操作
    if (!isPositiveInt) {
      this.goodListSet2(this);
      return false;
    }
    //把改变的数量和 
    this.data.changeIndex = index;
    var setData = this.getSetData(index);
    setData['count'] = parseInt(changeNum);
    setData['behavior'] = '';
    this.data.setData = setData;


    login.checkToken(this, this.changeNum);
  },
  changeNum: function(that) {
    //获取id，然后下面是封装的从数据库获取地址数据的函数
    var requestInfo = {
      type: "POST",
      url: "changeShoppingcartNum"
    };
    var data = that.data.setData;
    //公共函数，从数据库获取地址信息，如果成功就执行回调函数 dataInit
    token.getRequest(that, requestInfo, data, that.afterChangeNum);
  },
  afterChangeNum: function(that, res) {
    console.log(res.data);
    if (Number(res.data) == 201) {

      var index = that.data.changeIndex;
      var count = that.data.setData.count;
      var goodList = that.data.list;
      goodList.forEach(function(value, key) {
        if (index == key) {
          value.count = count;
          if (value.charger_count != 0) {
            value.charger_count = value.count;
          }
        }
      });
      that.goodListSet(that, goodList);
      return true;
    }
    if (Number(res.data) == 202) {
      app.showTitle('商品数量必须为正整数');
      var goodList = that.data.list;
      that.setData({
        list: goodList
      });
      return true;
    }
    app.showTitle('网络好像开小差了，请重试');
    var goodList = that.data.list;
    that.setData({
      list: goodList
    });
    return true;
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();
    var that = this;
    // 隐藏导航栏加载框  
    wx.hideNavigationBarLoading();
    // 停止下拉动作  
    wx.stopPullDownRefresh();

  },


})