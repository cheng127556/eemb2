var app = getApp();
import { promisify } from '../../utils/promise'
import { $init, $digest } from '../../utils/common.util'
Page({
  data: {
    pid:2,
    orderId: 0,  //订单id
    reason: '',  //退货原因
    // remark: '',  //退货描述
    imgUrl: '',
    images: [
      "https://www.eemb.cn/wx//diandongc.jpg",
      "https://www.eemb.cn/wx//diandongc.jpg",
      "https://www.eemb.cn/wx//diandongc.jpg",
      "https://www.eemb.cn/wx//diandongc.jpg",
      "https://www.eemb.cn/wx//diandongc.jpg",
      "https://www.eemb.cn/wx//diandongc.jpg",
    ],  //上传的图片
  },
  onLoad: function (options) {
    console.log(options);
    //传递过来的订单id
    this.setData({
      orderId: 123456789,
      pid:2
    });
  },

  //退货原因
  reasonInput: function (e) {
    this.setData({
      reason: e.detail.value,
    });
  },
  //退货描述
  remarkInput: function (e) {
    this.setData({
      remark: e.detail.value,
    });
  },
  //选择图片
  uploadImgs: function () {
    var that = this
    wx.chooseImage({
      success: function (res) {
        console.log("res", res);
        var tempFilePaths = res.tempFilePaths
        var images = that.data.images;
        that.setData({
          images: tempFilePaths
        });
        // wx.uploadFile({
        //   url: 'http://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
        //   filePath: tempFilePaths[0],
        //   name: 'file',
        //   formData: {
        //     'user': 'test'
        //   },
        //   success: function (res) {
        //     var data = res.data
        //     //do something
        //   }
        // })
      }
    });
  },
  //展示图片
  showImg: function (e) {
    var that = this;
    //当前图片索引
    var index = e.currentTarget.dataset.index;
    //当前图片的url路径
    var url = that.data.images[index];
    //预览的图片地址只能是http 或https 本地加载不了.
    wx.previewImage({
      urls: that.data.images, //需要预览的图片http 链接列表
      current: url,  //当前显示图片的http链接
    })
  },
  //删除照片
  clearImg: function (e) {
    console.log("点击了删除照片按钮", e);
    var images = this.data.images;
    //获取点击的图片索引
    var index = e.currentTarget.dataset.index;
    images.splice(index, 1);
    this.setData({
      images: images,
    })
  },
  submitReturnData: function () {
    //数据验证
    if (!this.data.reason) {
      wx.showToast({
        title: '请填写退货原因',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    this.upload();
  },
  upload: function () {
    var orderId = this.data.orderId;
    var pid = this.data.pid;
    var reason = this.data.reason;
    var remark = this.data.remark;
    var infoObj = { orderId, reason, remark,pid }
    for (var i = 0; i < this.data.images.length; i++) {
      wx.uploadFile({
        url: 'https:***/submit',
        filePath: that.data.images[i],
        name: 'backGoodImg',
        formData: infoObj,
        success: function (res) {
          console.log(res)
          if (res) {
            wx.showToast({
              title: '已提交退货申请！',
              duration: 2000
            });
          }
        }
      })
    }
    this.afterUpload();
  },
  afterUpload: function () {
    this.setData({
      // orderId: '',
      reason: "",
      remark: "",
      images: "",
    });
    wx.navigateTo({
      // url: '/pages/user/dingdan?currentTab=4',
    });
  }
})