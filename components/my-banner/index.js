// components/my-banner/index.js
import {User} from "../../models/user";
import {promisic} from "../../utils/util";

Component({
    properties: {
        couponCount:Number
    },

    data: {
        showLoginBtn: false,
        couponCount:Number
    },

    lifetimes: {
        async attached() {
            // wx.getUserInfo()
            console.log(this.properties.couponCount)
            if (!await this.hasAuthUserInfo()) {
                this.setData({
                    showLoginBtn: true
                })
            }
        }
    },

    observers:{
        'couponCount':function (couponCount) {
        }
    },

    methods: {
        async onAuthUserInfo(event) {
            console.log(event.detail)
            if (event.detail.userInfo) {
                const success = await User.updateUserInfo(event.detail.userInfo)
                this.setData({
                    showLoginBtn:false
                })
            }
        },

        async hasAuthUserInfo() {
            const setting = await promisic(wx.getSetting)();
            const userInfo = setting.authSetting['scope.userInfo']
            return !!userInfo;
        },

        onGotoMyCoupon(event) {
            wx.navigateTo({
                url:`/pages/my-coupon/my-coupon`
            })
        },

        aboutUs(event) {
            wx.navigateTo({
                url:`/pages/about/about`
            })
        }
    }
})
