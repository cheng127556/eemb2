// includes/search-bar.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        lists: [], // 接收搜索的内容
        wxSearchData: '', // 输入的值
    },
    searchChangeHandle: function(value) {
        console.log(value);
        var that = this;
        if (value.detail.value.length > 0) {
            wx.request({
                url: 'http://127.0.0.1:3000/hot_sale',
                data: {
                    value: value.detail.value
                },
                header: { 'content-type': 'application/x-www-form-urlencoded' },
                method: 'POST',
                // dataType: json,
                // responseType: text,
                success: function(res) {
                    if (res.code) {
                        var data = that.data.lists;
                        for (let i = 0; i < res.data.length; i++) {
                            data.push(res.data[i]);
                        }
                        that.setData({
                            searchText: value.detail.value,
                            lists: data
                        })
                    }
                },
                fail: function(res) {},
                complete: function(res) {},
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})