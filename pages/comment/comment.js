var token = require('../../utils/token.js');
var login = require('../../utils/util.js');
var app = getApp();
// var validate = require('../../utils/validate.js');
var upImg = require('../../utils/promise.js')
Page({
  data: {
    list: [],
    images: [],
    commentGrade: "好评", // 发送给后台的评分
    // listObj: {},
    isUPloadImg:true,
    uploadImgArr:[],
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
    var pid = e.currentTarget.dataset.pid;
    //当前对象;
    var currentObject = list[pIndex];
    // obj.pid = list[pIndex].productId;
    //获取当前评论产品的评论图片 有就追加  没有就为空数组
    var commentimgs = currentObject.commentimgs;
    var arr = [];
    wx.chooseImage({
      count: 4, //最多可以选择的图片张数
      sizeType: ['original', 'compressed'],  //所选图片尺寸  original 原图  compressed 压缩图
      sourceType: ['album', 'camera'],   //选择图片路径    album 从相册选图  camera 使用相机
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        commentimgs = commentimgs.concat(res.tempFilePaths);
        currentObject.commentimgs = commentimgs;
        list[pIndex].commentimgs = commentimgs;
       
        that.setData({
          list: list,
        })
      },
    })
  },
  //删除照片
  clearImg: function (e) {
    var that = this
    console.log("删除选中产品评论图片", e.currentTarget.dataset);
    var list = that.data.list;
    var uploadImgArr = that.data.uploadImgArr;
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
    // 上传内容
    var list = this.data.list;
    var commentData = [];
    var obj = {};
    list.forEach((e, j) => {
      obj.productId = e.productId;
      obj.comment = e.comment;
      e.grades.forEach((o, k) => {
        if (o.selected) {
          obj.grade = o.comment;
          return;
        }
      })
      commentData.push(obj);
      obj = {}
    })
    this.setData({
      commentData: commentData
    })
    login.checkToken(this, this.addComment);
    //上传图片;
    var uploadImgArr = [];
    var list = this.data.list;
    var obj2 ;
    list.forEach((v,i)=>{
      if (v.commentimgs.length>0){
        v.commentimgs.forEach((n,k)=>{
          obj2 = {};
          obj2.pid = v.productId;
          obj2.path = n;
          uploadImgArr.push(obj2);
        })
      }
    })
    console.log("uploadImgArr111", uploadImgArr);
    uploadImgArr.forEach((v, i) => {
      var data = { pid: v.pid };
      wx.uploadFile({
        url: "http://wx.io/accept",
        filePath: v.path,
        name: 'image',
        formData: data,
        success: (res) => {
          console.log("success", res);
        },
        fail: (res) => {
          console.log('fail', res);
        },
        complete: (res) => {
          console.log("comlete", res);
        }
      });
    });
  },
  addComment: function (that) {
    var requestInfo = {
      type: "POST",
      url: "accept"
    };
    var commentData = that.data.commentData;
    var data = {
      commentData: commentData,
    };
    // console.log("data", data);
    token.getRequest(that, requestInfo, data, that.afterAddComment);
  },
  afterAddComment: function (res) {
    // if(res.data==201){
      //初始化数据  默认好评
    var listObj = this.data.listObj;
    var list = this.data.list;
    list = [];
    listObj = [];
    this.setData({
      // listObj: listObj,
      // list:list
    })
    // }
  },
  upload: function (listObj) {
    //多个商品评论  有图片就上传图片和数据
    var that = this;
    var listObj = this.data.listObj;
    //每张图片的产品id
    var productIds =[];
    //图片路径数组
    var path = [];
    var dataInfo = {
      listObj:listObj,
    };
    //定义一个bool值确定上传图片还是数据
    var isUPloadImg =false ;
    listObj.forEach((e,i)=>{
      
      // if (e.commentimgs.length == 0){
      //   isUPloadImg = false;
      //   return;
      // }
      //有评论图片就用上传图片的方式请求后台；
      if (e.commentimgs.length > 0) {
        isUPloadImg = true;
        e.commentimgs.forEach((v, j) => {
          productIds.push(e.productId);
          path.push(v);
        })
      }
    });
    dataInfo.productIds = productIds;
    dataInfo.path = path;
    //  没有图片就上传数据
    if (!isUPloadImg){
      isUPloadImg = false;
      login.checkToken(that, that.addComment);
    }
    if (isUPloadImg){
      that.uploadimg(dataInfo);
    }
    // console.log(dataInfo);
  },
  comInput: function (e) {
    // console.log(e);
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
      { productId: 24, productImg: ['https://www.eemb.cn/wx//diandongc.jpg'] },
      { productId: 8, productImg: ['https://www.eemb.cn/wx//diandongc.jpg'] },]
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
  },

  //多张图片上传
  uploadimg(data) {
    var that = this;
      var i =  0;//当前上传的哪张图片
      // data.productId = data.
      // success = data.success ? data.success : 0;//上传成功的个数
      // fail = data.fail ? data.fail : 0;//上传失败的个数
    // var listObj = data.listObj;
    data.productId = data.productIds[i]
    console.log("data1", data);
    wx.uploadFile({
      url: "http://wx.io/accept",
      filePath: data.path[i],
      name: 'file',//这里根据自己的实际情况改
      formData: data,//这里是上传图片时一起上传的数据
      success: (resp) => {
        // success++;//图片上传成功，图片上传成功的变量+1
        console.log("success",resp)
        // console.log(i);
        //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
      },
      fail: (res) => {
        // fail++;//图片上传失败，图片上传失败的变量+1
        console.log('fail:' );
      },
      complete: () => {
        // console.log(i);
        i++;//这个图片执行完上传后，开始上传下一张
        if (i == data.path.length) {   //当图片传完时，停止调用   
          console.log('上传完成：');
        } else {//若图片还没有传完，则继续调用函数
          // console.log(i);
          data.i = i;
          // data.success = success;
          // data.fail = fail;
          data.productId=data.productIds[i]
          // that.uploadimg(data);
          console.log("data2", data);
        }
      }
    });
  },
})