/**
 * 将wx的callback形式的API转换成支持Promise的形式
 */

// 向后台发送请求
function fetch(url, data, method = 'GET', header = {}) {
  wx.showLoading({ title: 'Loading...' })
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'http://wx.io/' + url,
      data,
      header,
      method,
      dataType: 'json',
      success: resolve,
      fail: reject,
      complete: wx.hideLoading
    })
  })
}
// 向后台上传评论  上传图片
function uploadImg(path,data, method = 'post', header = {}){
  // wx.showLoading({ title: 'uploading...' })
  return new Promise((resolve, reject) => {
    // wx.request({
    //   url: 'http://wx.io/' + url,
    //   data,
    //   header,
    //   method,
    //   contentType: "multipart/form-data",
    //   dataType: 'json',
    //   success: resolve,
    //   fail: reject,
    //   complete: wx.hideLoading
    // })
    wx.uploadFile({
      url: 'http://wx.io/accept',
      filePath: path,
      name: "images",
      formData: data,
      method,
      // contentType: "multipart/form-data",
      success: resolve,
      fail: reject,
      // complete: wx.hideLoading
    })
  })
}
// module.exports = {

//   promisify: api => {
//     return (options, ...params) => {
//       return new Promise((resolve, reject) => {
//         const extras = {
//           success: resolve,
//           fail: reject
//         }
//         api({ ...options, ...extras }, ...params)
//       })
//     }
//   }

// }
function promisify(api){
  return (options, ...params) => {
    return new Promise((resolve, reject) => {
      const extras = {
        success: resolve,
        fail: reject
      }
      api({ ...options, ...extras }, ...params)
    })
  }
}
module.exports = {
  promisify: promisify,
  fetch: fetch,
  uploadImg: uploadImg
}