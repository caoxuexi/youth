import {Coupon} from "../../models/coupon";
import {AuthAddress, CouponStatus} from "../../core/enum";
import {promisic} from "../../miniprogram_npm/lin-ui/utils/util";

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

    onGotoIot(event) {
        wx.navigateTo({
            url:"/pages/iot-control/iot-control"
        })
    },

    onGotoLinUI() {
        wx.navigateToMiniProgram({
            appId:'Lin-UI AppID'
        })
    },

    async onMgrAddress(event) {
        let authStatus = await this.hasAuthorizedAddress()
        if (authStatus === AuthAddress.DENY) {
            this.setData({
                showDialog: true
            })
            return
        }
        await this.openAddress()
    },

    async hasAuthorizedAddress() {
        //现在address不需要授权了，但是代码还是如下保留着(可以删)
        const setting = await promisic(wx.getSetting)();
        console.log(setting)
        const addressSetting = setting.authSetting['scope.address'] //返回一直是true
        console.log(addressSetting)
        if (addressSetting === undefined) {
            return AuthAddress.NOT_AUTH
        }
        if (addressSetting === false) {
            return AuthAddress.DENY
        }
        if (addressSetting === true) {
            return AuthAddress.AUTHORIZED
        }
    },

    async openAddress() {
        let res;
        res = await promisic(wx.chooseAddress)();
    },

    onDialogConfirm(event){
        wx.openSetting()
    }
});
