// components/my-order-panel/index.js
import {Order} from "../../models/order";

Component({
    properties: {},

    data: {
        unpaidCount: 0,
        paidCount: 0,
        deliveredCount: 0
    },

    lifetimes: {
        async attached() {
        }
    },

    pageLifetimes: {
        async show() {
            const unpaidCount = await Order.getUnpaidCount()
            const paidCount = await Order.getPaidCount()
            const deliveredCount = await Order.getDeliveredCount()
            this.setData({
                unpaidCount,
                paidCount,
                deliveredCount
            })
        }
    },

    methods: {
        onGotoMyOrder(event) {
            const key = event.currentTarget.dataset.key
            wx.navigateTo({
                url: `/pages/my-order/my-order?key=${key}`
            })
        }
    }
})
