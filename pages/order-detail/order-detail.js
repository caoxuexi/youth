// pages/order-detail/order-detail.js
import {Order} from "../../models/order";
import {OrderDetail} from "../../models/order-detail";
import {Payment} from "../../models/payment";

Page({

    data: {
        oid: null
    },

    onLoad: async function (options) {
        const oid = options.oid
        this.data.oid = oid
        const order = await Order.getDetail(oid)
        const detail = new OrderDetail(order)
        this.setData({
            order: detail
        })
    },

    async onPay(event) {
        const oid = this.data.oid
        if (!oid) {
            // this.enableSubmitBtn()
            return
        }
        wx.lin.showLoading({
            type: "flash",
            fullScreen: true,
            color: "#157658"
        })
        const payParams = await Payment.getPayParams(oid)
        // let payStatus = OrderStatus.UNPAID
        let res
        try {
            res = await wx.requestPayment(payParams)
            wx.lin.hideLoading()
            wx.navigateTo({
                url: `/pages/pay-success/pay-success?oid=${oid}`
            })
        } catch (e) {
            wx.lin.hideLoading()
        }
    },

    async onCertain(event){
        const oid = this.data.oid
        if (!oid) {
            return
        }
        wx.lin.showLoading({
            type: "flash",
            fullScreen: true,
            color: "#157658"
        })
        let res

    },

    onPaySuccess(event) {
    }

})
