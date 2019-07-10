var app = getApp();
/*方法说明
 *@method verifyMobile
 *@param{参数类型为数字}}参数名：MobileNum 参数说明：传入一个数字验证是不是正确的手机号格式
 *@return {false} 返回值说明:如果不是正确的手机号格式，就返回false终止函数
*/
function verifyMobile(MobileNum) {
  var tel = /^[1][3,4,5,6,7,8][0-9]{9}$/;
  if (MobileNum.length == 0) {
    wx.showModal({
      title: '输入的手机号为空',
    })
    return false;
  }
  if (MobileNum.length < 11) {
    wx.showModal({
      title: '手机号长度有误！',
    })
    return false;
  }
  if (!tel.test(MobileNum)) {
    wx.showModal({
      title: '手机号不存在！',
    })
    return false;
  }
  return true;
}
/*方法说明
 *@method verifyUser
 *@param{参数类型为数字}}参数名： userObj 参数说明：传入一个用户信息的对象来判断格式是不是正确
 *@return {false} 返回值说明:如果不是正确的格式式，就返回false终止函数
*/
function verifyUser(userInfo){

  var reg = /^[1]\d{10}$/;

  if (!userInfo.username) {
    app.showtips(that, '用户名不存在');
    return false;
  }
  if (verifyMobile(userInfo.mobile)) {
    return false;
  }
  if (!userInfo.userBirthday) {
    app.showtips(that, '日期不存在');
    return false;
  }
  if (!userInfo.city) {
    app.showtips(that, '地址不存在');
    return false;
  }
}
function verifyInt(num){
  if(isNaN(num)){
    app.showTitle('请输入数字');
    return false;
  }
  
  if(num <= 0){
    app.showTitle('请输入正整数');
    return false
  }
  return true;
}
module.exports = {
  mobile: verifyMobile,
  verifyInt: verifyInt
}