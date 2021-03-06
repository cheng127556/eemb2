var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var utils = require('../../utils/utils')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: ["未使用", "已使用", "已过期"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        mycoupon: [{
                nouse: [
                    { img: "/assets/coupon1.png" },
                    { img: "/assets/coupon1.png" },
                    { img: "/assets/coupon1.png" },
                    { img: "/assets/coupon1.png" }

                ],
            },
            {
                used: [
                    { img: "/assets/coupon1.png" },
                    { img: "/assets/coupon1.png" },
                    { img: "/assets/coupon1.png" },
                    { img: "/assets/coupon1.png" }

                ],
            },
            {
                expir: [
                    { img: "/assets/coupon1.png" },
                    { img: "/assets/coupon1.png" },
                    { img: "/assets/coupon1.png" },
                    { img: "/assets/coupon1.png" }

                ],
            }

        ]
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
        this.init();
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

    },
    tabClick: function(e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    },
    init() {
        var that = this
        utils.fetch('mycoupon').then(res => {
            console.log(res.data)
            that.setData({
                mycoupon: res.data
            })
        })
    }
})