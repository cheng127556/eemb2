var app = getApp();
var url = app.globalData.IMGURL;

//发送带有token请求
//参数：that,myRequest,data,func1,func2,func3
//that:把外物的指向传到函数内部
//data:请求的相关信息，格式为json eg:{"type" :"GET","url":"www.wx.io/xxx" }
//func1:请求成功的回调，会接收 that和res
//func2:请求失败的回调，会接收 that和res
//func3:请求完成的回调，会接收 that和res
function getRequest(that,myRequest,data,func1,func2,func3,info) {
  var website = url;
  
  var requestType = myRequest.type;
  var requestUrl = website + myRequest.url;
  if (!requestType){
    requestType = 'GET';
  }
  var requestContent = 'application/x-www-form-urlencoded';
  if(requestType == 'GET'){
    requestContent = 'application/json';
  }
  var token = wx.getStorageSync('token');
  wx.request({
    url: requestUrl,
    dataType: 'json',
    data: data,
    method: requestType, 
    header: {
      'content-type': 'application/json',
      'token': token
    }, 
    success: function (res) {
      if(func1){
        if(info){
          func1(that, res, info);
        }else{
          func1(that, res);
        }   
      }
    },
    fail:function(res){
      if (func2) {
        if (info) {
          func2(that, res, info);
        } else {
          func2(that, res);
        } 
      }
    },
    complete:function(res){
      if (func3) {
        if (info) {
          func3(that, res, info);
        } else {
          func3(that, res);
        } 
      }
    }
  })
}


//发送带有token请求
//参数：that,myRequest,data,func1,func2,func3
//that:把外物的指向传到函数内部
//data:请求的相关信息，格式为json eg:{"type" :"GET","url":"www.wx.io/xxx" }
//func1:请求成功的回调，会接收 that和res
//func2:请求失败的回调，会接收 that和res
//func3:请求完成的回调，会接收 that和res
function noTokenRequest(that, myRequest, data, func1, func2, func3, info) {
  var website = url;

  var requestType = myRequest.type;
  var requestUrl = website + myRequest.url;
  if (!requestType) {
    requestType = 'GET';
  }
  var requestContent = 'application/x-www-form-urlencoded';
  if (requestType == 'GET') {
    requestContent = 'application/json';
  }
  wx.request({
    url: requestUrl,
    dataType: 'json',
    data: data,
    method: requestType,
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      if (func1) {
        if (info) {
          func1(that, res, info);
        } else {
          func1(that, res);
        }
      }
    },
    fail: function (res) {
      if (func2) {
        if (info) {
          func2(that, res, info);
        } else {
          func2(that, res);
        }
      }
    },
    complete: function (res) {
      if (func3) {
        if (info) {
          func3(that, res, info);
        } else {
          func3(that, res);
        }
      }
    }
  })
}
//空函数，用来占位
function empty(){

}

module.exports = {
  getRequest: getRequest,
  noTokenRequest: noTokenRequest,
  empty: empty
}
