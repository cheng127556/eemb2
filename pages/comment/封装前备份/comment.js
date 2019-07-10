var token = require('../../utils/token.js');
var login = require('../../utils/util.js');
// var validate = require('../../utils/validate.js');
var promise = require('../../utils/promise.js')
Page({
  data: {
    list: [

    ],
    images: [
      // "https://www.eemb.cn/wx//diandongc.jpg",
      // "https://www.eemb.cn/wx//diandongc.jpg",
      // "https://www.eemb.cn/wx//diandongc.jpg",
      // "https://www.eemb.cn/wx//diandongc.jpg",
      // "https://www.eemb.cn/wx//diandongc.jpg",
      // "https://www.eemb.cn/wx//diandongc.jpg",
    ],
    // grades: [
    //   { selected: true, comment: "好评" },
    //   { selected: false, comment: "中评" },
    //   { selected: false, comment: "差评" }
    // ],
    commentGrade: "好评", // 发送给后台的评分
    listObj: {},
  },
  onLoad: function (o) {
    this.commentInit();
  },
  //评分按钮
  gradebtn: function (e) {
    console.log("获取当前商品的id", e.currentTarget.dataset)
    //当前产品id
    var pid = e.currentTarget.dataset.pid;
    // 当前产品index
    var pindex = e.currentTarget.dataset.pindex;
    // 当前索引评分选中index
    var gindex = e.currentTarget.dataset.gindex;
    var list = this.data.list;
    //当前选中产品对象
    var currentObj = list[pindex];
    var grades = currentObj.grades
    grades.forEach((e, i) => {
      e.selected = false;
    })
    grades[gindex].selected = true;
    list[pindex].grades = grades
    this.setData({
      list: list,
    })
  },
  //添加图片
  addPicture: function (e) {
    var that = this
    console.log("添加选中产品评论图片", e.currentTarget.dataset);
    var list = that.data.list;
    //当前商品索引;
    var pIndex = e.currentTarget.dataset.pindex;
    //当前对象;
    var currentObject = list[pIndex];
    //获取当前评论产品的评论图片 有就追加  没有就为空数组
    var commentimgs = currentObject.commentimgs;
    wx.chooseImage({
      count: 4, //最多可以选择的图片张数
      sizeType: ['original', 'compressed'],  //所选图片尺寸  original 原图  compressed 压缩图
      sourceType: ['album', 'camera'],   //选择图片路径    album 从相册选图  camera 使用相机
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        commentimgs = commentimgs.concat(res.tempFilePaths);
        currentObject.commentimgs = commentimgs;
        list[pIndex].commentimgs = commentimgs
        that.setData({
          list: list,
        })
      }
    })
  },
  //删除照片
  clearImg: function (e) {
    var that = this
    console.log("删除选中产品评论图片", e.currentTarget.dataset);
    var list = that.data.list;
    //当前商品索引;
    var pIndex = e.currentTarget.dataset.pindex;
    //获取点击的评论图片索引
    var imgindex = e.currentTarget.dataset.imgindex;
    //删除当前产品的评论选中图片;
    var currentObject = list[pIndex].commentimgs.splice(imgindex, 1);
    //获取当前评论产品的评论图片 
    // var commentimgs = currentObject.commentimgs.splice(imgindex, 1);
    this.setData({
      list: list,
    })
  },

  //展示图片
  showImg: function (e) {
    var that = this;
    var list = that.data.list;
    //当前商品索引;
    var pIndex = e.currentTarget.dataset.pindex;
    //获取点击的评论图片索引
    var imgindex = e.currentTarget.dataset.imgindex;
    console.log("点击图片全屏显示", e.currentTarget.dataset);

    // 需要预览的图片http 链接列表 预览的图片地址只能是http 或https 本地加载不了.
    var urls = that.data.list[pIndex].commentimgs;
    //当前图片的url路径
    var url = that.data.list[pIndex].commentimgs[imgindex];
    wx.previewImage({
      urls: urls, //需要预览的图片http 链接列表
      current: url,  //当前显示图片的http链接
    })
  },
  //发表评论按钮
  formsubmit: function (e) {
    // var list = [];
    // list = list.concat(this.data.list[0]);  //测试只有一个上评论
    // //多个商品评论
    // //订单id
    // var orderId = 123456789;
    // //拼接成评论对象传给后台
    // var commentInfo = { list, orderId }
    // console.log("点击发表按钮传给后台的数据", commentInfo);
    // this.setData({
    //   commentInfo: commentInfo
    // })  

    //多个商品评论对象  订单id 评论的商品id 评分 评价内容  评价图片 
    var list =this.data.list; 
    var orderId = 123456789;
    var obj = {};
    var listObj = [];
    list.forEach((v,i)=>{
      obj.comment = v.comment;
      obj.productId = v.productId;
      obj.commentimgs = v.commentimgs;
      obj.orderId = 123456789;
      v.grades.forEach((e,j)=>{
        if(e.selected){
          obj.grade = e.comment;
          return;
        }
      })
      listObj.push(obj);
      obj = {}
    }) 
    //订单id
    var orderId = 123456789;
    //拼接成评论对象传给后台
    // var commentInfo = { listObj, orderId }
    console.log("点击发表按钮传给后台的数据", list);
    console.log("点击发表按钮传给后台的数据", listObj);
    this.setData({
      listObj: listObj
    })  
    this.upload();
  },
  addComment: function (that) {
    var requestInfo = {
      type: "POST",
      url: "accept"
    };
    var listObj = that.data.listObj;
    token.getRequest(that, requestInfo, listObj, that.afterAddComment)
  },
  afterAddComment: function (res) {
    // if(res.data==201){
    var listObj = this.data.listObj;
    var list = this.data.list;
    list = [];
    listObj = [];
    // var images = this.data.images;
    // images = [];
    // //初始化数据  默认好评
    // grades.forEach((e) => {
    //   e.selected = false;
    // })
    // grades[0].selected = true;
    this.setData({
      listObj: listObj,
      list:list
    })
    // }
  },
  upload: function () {
    // // 上传一张图片成功
    // var that = this;
    // // var images = this.data.images;
    // var commentInfo = that.data.commentInfo;
    // var obj = commentInfo.list[0];
    // var path = obj.commentimgs[0];
    // console.log("上传图片", commentInfo, path);
    // wx.uploadFile({
    //   url: 'http://wx.io/upload',
    //   filePath: path,
    //   name: 'image',
    //   contentType:"multipart/form-data",
    //   formData: {pid:1},
    //   success: function (res) {
    //     console.log("上传图片成功", res);
    //     if (res) {
    //       wx.showToast({
    //         title: '已提交评论！',
    //         duration: 2000
    //       });
    //       that.afterAddComment();
    //     }
    //   },
    //   fail:function(res){
    //     console.log("上传图片失败",res);
    //   },
    //   complete:function(res){
    //     console.log("上传图片完成",res);
    //   }
    // })


    // //有图片就上传图片和数据
    // if (images.length > 0) {
    //   console.log("上传图片和数据");
    //   for (var i = 0; i < images.length; i++) {
        // wx.uploadFile({
        //   url: 'http://wx.io/test',
        //   filePath: images[i],
        //   name: 'images',
        //   formData: commentInfo,
        //   success: function (res) {
        //     console.log("res", res);
        //     if (res) {
        //       wx.showToast({
        //         title: '已提交评论！',
        //         duration: 2000
        //       });
        //       that.afterAddComment();
        //     }
        //   }
        // })
    //   };
    // }
    // //上传数据
    // else {
    //   login.checkToken(this, this.addComment);
    // }

    //多个商品评论
    var that = this;
    var listObj = this.data.listObj;
    console.log("listObj", listObj);
    var dataInfo = {}
    listObj.forEach((e,i)=>{
      dataInfo.comment = e.comment;
      dataInfo.grade = e.grade;
      dataInfo.orderId = e.orderId;
      dataInfo.productId = e.productId;
      console.log(dataInfo);
      //有图片
      if (e.commentimgs.length>0){
        e.commentimgs.forEach((v, j) => {
          wx.uploadFile({
            url: 'http://wx.io/accept',
            filePath: v,
            name: 'image',
            formData: dataInfo,
            success: function (res) {
              console.log("评论上传成功", res);
              //初始化数据
              var listObj = that.data.listObj;
              var list = that.data.list;
              listObj = []
              that.setData({
                listObj: listObj,
                list: list
              })
            },
            fail: function (res) {
              console.log("评论上传失败", res);
            },
            complete: function (res) {
              // console.log("评论上传完成",res);
            }
          })
        })
      }else{
        login.checkToken(this, this.addComment);
      }
    })
  },
  comInput: function (e) {
    console.log(e);
    var list = this.data.list;
    //当前产品id
    var pid = e.currentTarget.dataset.pid;
    // 当前产品index
    var pindex = e.currentTarget.dataset.pindex;
    list[pindex].comment = e.detail.value;
    this.setData({
      list: list,
    })
  },
  //初始化数据
  commentInit: function () {
    var that = this;
    var list = [
      { productId: 4, productImg: ['https://www.eemb.cn/wx//diandongc.jpg'] },
      { productId: 24, productImg: ['https://www.eemb.cn/wx//diandongc.jpg'] }]
    list.forEach((e, i) => {
      e.commentimgs=[];
      e.grades = [
      { selected: true, comment: "好评" },
      { selected: false, comment: "中评" },
      { selected: false, comment: "差评" }
      ];
      e.comment = ''
    })
    that.setData({
      list: list,
    })
  }
})