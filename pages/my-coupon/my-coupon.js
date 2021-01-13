// pages/my-coupon/my-coupon.js
import {Coupon} from "../../models/coupon";
import {CouponStatus} from "../../core/enum";

Page({
    data: {
        activeKey:CouponStatus.AVAILABLE
    },


    onLoad: async function (options) {
        this.change(CouponStatus.AVAILABLE)
    },

    async change(status) {
        const coupons = await Coupon.getMyCoupons(status)
        this.setData({
            coupons,
            status
        });
    },

    onSegmentChange(event) {
        console.log(event)
        this.change(event.detail.activeKey)
    }
})
