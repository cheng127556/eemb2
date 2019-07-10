//app.js
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    wx.setStorageSync("showAvator", false);
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // })
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     console.log("res1", res)
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo
    //           console.log("res2",res)

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })

    wx.getSetting({
      success: res => {
        // console.log("res1", res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // console.log("res2", res)

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
        //  else if (!res.authSetting['scope.userInfo']){
        //   wx.authorize({
        //     scope: 'scope.userInfo',
        //     success(){
        //       wx.wx.getUserInfo();
        //     }
        //   })
        // }

        // else if (!res.authSetting['scope.record']) {
        //   wx.authorize({
        //     scope: 'scope.record',
        //     success() {
        //       wx.startRecord();
        //     }
        //   })
        // }
      }
    });
    wx.getUserInfo({
      success: function (res) {
        // console.log("用户信息",res)
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country
      }
    })

  },
  globalData: {
    userInfo: {
      username: "成成", //用户名称
      usergrade: "普通会员", //会员等级
      balance: "1100", //用户余额
      points: "20.00", //用户积分
      
    },
    IMGURL: 'http://wx.io/',
       coupon: [{
        nouse: []
      },
      {
        used: []
      },
      {
        expired: []
      }
    ],
    // num:0 占时不用
  },

  //错误提示
  showtips(that, tipes) {
    that.setData({
      showTopTips: true,
      tipes: tipes
    });
    setTimeout(function() {
      that.setData({
        showTopTips: false,
        tipes: ""
      });
    }, 1000);

  },
  /*方法说明
   *@method showTitle
   *@param{参数类型为数字}}参数名：title用来传递提示的内容
   *@return {false} 默认没有返回值
   */
  showTitle(title) {
    wx.showModal({
      title: title,
    })
  },
  /*方法说明：成功之后跳转的方法
   *@method showToast
   *@param{参数类型为数字}}参数名：text用来传递提示的内容,url传递跳转页面，如果不传递，表示
   不跳转，time延迟执行跳转的时间，success是图标
   *@return {false} 默认没有返回值
   */
  showToast(text, url, time, success) {

    if (!time || time == undefined) {
      time = 1500;
    }
    if (!success || success == undefined) {
      success = 'success';
    }
    wx.showToast({
      title: text,
      icon: success,
      duration: 1500,
      success: function() {
        if (url) {
          setTimeout(function() {
            wx.switchTab({
              url: url
            })
          }, time)
        }
      }
    });

  },

  // 多张图片上传
  uploadimg(data) {
    var that = this,
    i = data.i ? data.i : 0,//当前上传的哪张图片
    success = data.success ? data.success : 0,//上传成功的个数
    fail = data.fail ? data.fail : 0;//上传失败的个数
    // var listObj = data.listObj
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'file',//这里根据自己的实际情况改
      formData: data,//这里是上传图片时一起上传的数据
      success: (resp) => {
        success++;//图片上传成功，图片上传成功的变量+1
        console.log(resp)
        console.log(i);
        //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
      },
      fail: (res) => {
        fail++;//图片上传失败，图片上传失败的变量+1
        console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        console.log(i);
        i++;//这个图片执行完上传后，开始上传下一张
        if (i == data.path.length) {   //当图片传完时，停止调用          
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
        } else {//若图片还没有传完，则继续调用函数
          console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }

      }
    });
  }
  
})