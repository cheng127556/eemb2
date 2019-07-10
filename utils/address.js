//公共方法格式化地址数组，传入值为数组格式的字符串（从后台接收）,
//return值为格式化好的数组（地址拼接）（如果传入的值是对象类型字符串，那么return的值也是字符串）
function formatAddress(addressList, merge){
  if((typeof addressList) == 'string'&& addressList != null && addressList != undefined){
    addressList = JSON.parse(addressList);
  }
  console.log(addressList);
  if(merge){
    if (!(addressList[0] instanceof Object)) {
      var thisAddress = [];
      thisAddress[0] = addressList;
      addressList = thisAddress;
    }
    console.log(addressList);
    if(addressList instanceof Object){
      var tem = [];
      Object.keys(addressList).forEach(function(key){
        tem[key] = addressList[key];
      });
      addressList = tem;
    }
    addressList.forEach(function (value) {
      value['address'] = value['country'] + ' ' + value['province'] + ' ' + value['city'];
      delete value.country;
      delete value.province;
      delete value.city;
      delete value.update_time;
    });
    return addressList;
  }else{
    addressList['region'] = [];
    addressList['region'][0] = addressList['country'];
    addressList['region'][1] = addressList['province'];
    addressList['region'][2] = addressList['city'];
    delete addressList.country;
    delete addressList.province;
    delete addressList.city;
    delete addressList.update_time;
    return addressList;
  }
  
}
//反格式化地址，把小程序的提交的地址格式转换成适合提交给后台的
//传入值为从小程序页面拿到的修改好的地址对象（region数组转三个变量：国家，省份，市）
function decodeAddress(addressList){
  addressList.country = addressList.region[0];
  addressList.province = addressList.region[1];
  addressList.city = addressList.region[2];
  delete addressList.region;
  
  return addressList;
}

module.exports = {
  formatAddress : formatAddress,
  decodeAddress: decodeAddress,
}
