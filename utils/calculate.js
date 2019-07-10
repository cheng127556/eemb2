/*方法说明
 *@method getPrice
 *@param{参数类型为对象}}参数名：numInfo sale
 其中 numInfo为传入对象的数字信息，有三个值，数值如下 
  {
      "isMeal": isMeal,（值为0或者1） 0为单电芯套餐 1为带充电器套餐
      "num": comboNum, 商品的数量
      "price": price,   商品的单价
    };
  sale 为从后台接收的优惠相关信息
 *@return {false} 返回值说明:计算好的商品总价
*/
function getPrice(numInfo, sale) {
  //先保证购买的数量和价格为数字类型
  var num = parseInt(numInfo.num);
  var price = Number(numInfo.price);
  //参与优惠部分的价格，默认为0
  var discountPrice = 0;
  //先判断是不是带充电器的情况（有且只有一种情况带充电器，是电动车电池且选择充电器套餐）
  if (numInfo.isMeal == '1') {
    //充电套餐价格为充电器加电芯
    price += Number(sale.charger);
  } else {
    //判断是否有优惠（0为没有优惠，1为有优惠，2为是电动车）
    //如果没有优惠，就是直接数量乘以价格，无论普通电池还是电动车电池都是一样的算法
    if (sale.isDiscount == '1') {
      //获取达到优惠的数目
      var diacountNum = parseInt(sale.discount_num);
      if (num >= diacountNum){
        discountPrice = parseInt(num) * Number(sale.favorable_price);
      }else{
        discountPrice = parseInt(num) * price;
      }
      //算出不参与优惠的商品的数量
      num = 0;
    }

  }
  //总价为不参与优惠部分与参与优惠部分价格之和
  var totalPrice = num * price + discountPrice;
  totalPrice = totalPrice.toFixed(1);
  return totalPrice;
}

/*方法说明
 *@method shoppingCartFormat
 *@param{参数类型为数组}}参数名：goodList
  把后台传来的数据格式化，把电动车电池里单电芯和带充电器套餐的分开
 *@return {false} 格式化好的数组
*/
function shoppingCartFormat(goodList) {

  var newList = goodList.concat();
  goodList.forEach(function(value, index) {
    value.selected = false;
    if (value.classify == 4) {

      if (value.charger_count == 0) {
        value['comboName'] = '单电芯套餐';

      } else {
        var num = parseInt(value.count) - parseInt(value.charger_count);
        if (num == 0) {
          value['comboName'] = '带充电器套餐';
          if (goodList.length != newList.length) {
            index += newList.length - goodList.length;
          }
        } else {
          var temCount = parseInt(value['charger_count']);

          if (goodList.length != newList.length) {
            index = newList.length - goodList.length;
          }
          value['count'] = temCount;
          value['comboName'] = '带充电器套餐';
          if (goodList.length != newList.length) {
            index += newList.length - goodList.length;
          }
          var temValue = deepCopy(value);
          newList.splice(index, 0, temValue);
          value['count'] = num;
          value['charger_count'] = 0;
          value['comboName'] = '单电芯套餐';

        }

      }
    }
  });
  return newList;
}
function shoppingRefresh(goodList){
  goodList.forEach(function(value){
    if (value.classify == 4){
      if (value['charger_count'] != 0){
        value['charger_count'] = value['count'];
      }
    }
  });
  return goodList;
}

//计算得出所有商品的价格
function getAllPrice(goodList) {
  goodList.forEach(function(value, index) {
    var isMeal = 0
    if (value.charger_count != 0) {
      var isMeal = 1;
    }
    var num = value.count;
    var price = Number(value.price);
    var numInfo = {
      "isMeal": isMeal,
      "num": num,
      "price": price,
    }
    value['totalPrice'] = getPrice(numInfo, value.sale);
  });
  return goodList;
}
//计算得出所有商品的总价
function totalPrice(goodList) {
  var totalPrice = 0;
  goodList.forEach(function(element, index) {
    totalPrice += Number(element.totalPrice);
  });
  return totalPrice.toFixed(2);
}

//计算商品的运费
function getPriceInfo(goodList) {
  var totalPrice = 0;
  var freight = 0;
  var fivePinkage = 0;
  var tenPinkage = 0;
  var bicycle = 0;
  goodList.forEach(function(value, index) {
    if (index == 0) {
      freight = Number(value.freight);
      console.log(freight);
    } else {
      if (freight > Number(value.freight)) {
        freight = Number(value.freight);
      }
    }
    if (value.sale.packages_num == '5') {
      fivePinkage += parseInt(value.count);
    }
    if (value.sale.packages_num == '10') {
      tenPinkage += parseInt(value.count);
    }
    if (value.classify == 4) {
      bicycle += parseInt(value.count);
    }
    totalPrice += Number(value.totalPrice);
  });
  var freightPrice = 0;
  if (fivePinkage >= 5 || tenPinkage >= 10 || bicycle > 0) {
    freight = '包邮';
  } else {
    freightPrice = freight;
    freight = '￥' + freight;
  }
  var info2 = {
    'fivePinkage': fivePinkage,
    "tenPinkage": tenPinkage,
    'bicycle': bicycle
  };

  var info = {
    'freight': freight,
    'totalPrice': totalPrice.toFixed(2),
    'freightPrice': freightPrice
  }

  return info;

}
/*获取选中的商品列表*/
function getSelected(goodList) {

  var selectedList = [];
  var selectAllStatus = false;
  goodList.forEach(function(value, index) {
    if (value.selected == true) {
      selectedList.push(value);
    }
  });
  if (selectedList.length == goodList.length){
    var selectAllStatus = true;
  }
  var info = {
    'selectedList': selectedList,
    'selectAllStatus': selectAllStatus
  };
  return info;

}

function orderFormat(goodList) {
  var selectedList = [];
  goodList.forEach(function(value, index) {
    var select = {};

      select['count'] = value['count'];
      select['product_id'] = value['hid'];
      select['charger_num'] = value['charger_count'];
      var isHave = true;
      if(value.classify == 4){
        selectedList.forEach(function(val,key){
          if (val['product_id'] == value['hid']){
            isHave = false;
            val['count'] = parseInt(value['count']) + parseInt(val['count']);
            val['charger_num'] = parseInt(value['charger_count']) + parseInt(val['charger_num']);
          }
        });
        if(isHave){
          selectedList.push(select);
        }
      }else{
        selectedList.push(select);
      }

  });
  return selectedList;
}
/*深拷贝*/
function deepCopy(p, c) {
  var c = c || {};
  for (var i in p) {
    if (typeof p[i] === 'object') {
      c[i] = (p[i].constructor === Array) ? [] : {};
      deepCopy(p[i], c[i]);
    } else {
      c[i] = p[i];
    }
  }
  return c;
}
module.exports = {
  getPrice: getPrice,
  shoppingCartFormat: shoppingCartFormat,
  totalPrice: totalPrice,
  getAllPrice: getAllPrice,
  getPriceInfo: getPriceInfo,
  getSelected: getSelected,
  orderFormat: orderFormat,
  shoppingRefresh: shoppingRefresh
}