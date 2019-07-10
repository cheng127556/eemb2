var app = getApp();
var orderListBottom = {
  payment: {
    title: '待付款',
    button1: '取消订单',
    button2: '支付订单',
    function1: 'cancelOder',
    function2: 'payOder'
  },
  ToBeDeliver: {
    title: '待发货',
    button1: null,
    button2: null,
    function1: null,
    function2: null
  },
  delived: {
    title: '已发货',
    button1: '查看物流',
    button2: null,
    function1: 'showExpress',
    function2: null
  },
  delete: {
    title: '回收站',
    button1: '恢复订单',
    button2: '彻底删除',
    function1: 'recoverOrder',
    function2: 'deleteOrder'
  },
  afterSale: {
    title: 'shou',
    button1: '恢复订单',
    button2: '彻底删除',
    function1: 'recoverOrder',
    function2: 'deleteOrder'
  },
};
//定义一个方法
function orderFormat(orderList, type) {
  orderList.forEach(function(value) {
    if (value.status == 1) {
      value['title'] = orderListBottom['payment']['title'];
      value['button1'] = orderListBottom['payment']['button1'];
      value['button2'] = orderListBottom['payment']['button2'];
      value['function1'] = orderListBottom['payment']['function1'];
      value['function2'] = orderListBottom['payment']['function2'];
    }
    if (value.status == 2) {
      value['title'] = orderListBottom['ToBeDeliver']['title'];
      value['button1'] = orderListBottom['ToBeDeliver']['button1'];
      value['button2'] = orderListBottom['ToBeDeliver']['button2'];
      value['function1'] = orderListBottom['ToBeDeliver']['function1'];
      value['function2'] = orderListBottom['ToBeDeliver']['function2'];
    }
    if (value.status == 3) {
      value['title'] = orderListBottom['delived']['title'];
      value['button1'] = orderListBottom['delived']['button1'];
      value['button2'] = orderListBottom['delived']['button2'];
      value['function1'] = orderListBottom['delived']['function1'];
      value['function2'] = orderListBottom['delived']['function2'];
    }
    if (type == 4) {
      value['title'] = orderListBottom['delete']['title'];
      value['button1'] = orderListBottom['delete']['button1'];
      value['button2'] = orderListBottom['delete']['button2'];
      value['function1'] = orderListBottom['delete']['function1'];
      value['function2'] = orderListBottom['delete']['function2'];
    }
    var snap_items = value.snap_items;
    snap_items.forEach(function(val) {
      if (val.productInfo.specifications) {
        val.productInfo.specifications = JSON.parse(val.productInfo.specifications);
        val.productInfo.specifications = val.productInfo.specifications[0] + val.productInfo.specifications[1] + val.productInfo.specifications[2]; 
        val.productInfo.specifications = val.productInfo.specifications.substr(0, 26) + '......';
      }
    });
  });
  console.log(orderList);
  return orderList;
 
}
module.exports = {
  orderFormat: orderFormat
}