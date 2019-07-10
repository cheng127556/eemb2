var app = getApp();
var calculate = require('./calculate.js');
var login = require('./util.js');
var token = require('./token.js');

//定义一个方法来发起支付请求
function getPay(that,goodList) {
  //先把数据格式化成后台可以接收的格式
  goodList = calculate.orderFormat(goodList);
  var info = {};
  var remarks = that.data.remarks;
  info['remark'] = remarks;
  info['address_id'] = that.data.address.id;
  goodList.push(info);
  that.data.orderData = goodList;
  //向后台发起请求，创建一个订单
  login.checkToken(that, orderSet);
}
function orderSet(that) {
  
  var setInfo = {
    type: "POST",
    url: "order"
  };
  var data = that.data.orderData;
  console.log('fasong')
  console.log(data);
  data = {
    products: data
  };  
  token.getRequest(that, setInfo, data, afterSetOrder);
}
function afterSetOrder(that, res) {
  that.data.order_id = res.data.order_id;
  login.checkToken(that, orderPre);
}
function orderPre(that) {
  var order_id = that.data.order_id;
  var setInfo = {
    type: "POST",
    url: "pre_order"
  };
  var data = {
    id: order_id
  };

  token.getRequest(that, setInfo, data,afterOrderPre);
}
function afterOrderPre(that, res) {
  console.log(res.data)
  wx.requestPayment({
    timeStamp: res.data.timeStamp,
    nonceStr: res.data.nonceStr,
    package: res.data.package,
    signType: res.data.signType,
    paySign: res.data.paySign,
    success(res) {
      console.log(res);
    },
    fail(res) { }
  })

}
function payOrder(that,order_id){

  var setInfo = {
    type: "POST",
    url: "pre_order"
  };
  var data = {
    id: order_id
  };
  token.getRequest(that, setInfo, data, afterOrderPre);
}
module.exports = {
  getPay: getPay,
  payOrder: payOrder
}