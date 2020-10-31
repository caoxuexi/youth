import {Activity} from "../../models/activity";

Page({
    data: {},
    onLoad: async function (options) {
        const aName=options.name
        const type=options.type
        let coupons
        const activity=await Activity.getActivityWithCoupon(aName)
        coupons=activity.coupons
        console.log(coupons)
    }
});