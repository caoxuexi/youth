// pages/pay-success/pay-success.js
Page({
    data: {
        oid:null
    },

    onLoad: function (options) {
        this.data.oid = options.oid
        // wx.lin.showStatusShow({
        //     type: 'success'
        // })
    },

    onGotoOrderDetail(event) {
        wx.redirectTo({
            url:`/pages/order-detail/order-detail?oid=${this.data.oid}`
        })
    }
})
