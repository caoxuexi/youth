import {Coupon} from "../../models/coupon";
import {CouponStatus} from "../../core/enum";

Page({
    data: {},
    onLoad:async function (options) {
        //获取所有可用的优惠券
        const coupons =await Coupon.getMyCoupons(CouponStatus.AVAILABLE);
        this.setData({
            couponCount:coupons.length
        })
    },

    onGotoMyCoupon(event) {
        wx.navigateTo({
            url: "/pages/my-coupon/my-coupon"
        })
    },

    onGotoMyOrder(event) {
        wx.navigateTo({
            url: "/pages/my-order/my-order?key=0"
        })
    },

    onGotoMyCourse(event) {
        wx.navigateTo({
            url:"/pages/about-course/about-course"
        })
    },

    onGotoLinUI() {
        wx.navigateToMiniProgram({
            appId:'Lin-UI AppID'
        })
    },
});
