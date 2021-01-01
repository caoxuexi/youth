import {Cart} from "../../models/cart";
import {Sku} from "../../models/sku";
import {OrderItem} from "../../models/order-item";
import {Order} from "../../models/order";
import {Coupon} from "../../models/coupon";
import {CouponBO} from "../../models/coupon-bo";

const cart=new Cart()
Page({
    data: {
        totalPrice: 0,
        discountMoney: 0,
        orderItems:[],
        couponBOList:[],
        scrollHeight:0
    },
    onLoad: async function (options) {
        let orderItems
        let localItemCount
        let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
        let windowWidth = wx.getSystemInfoSync().windowWidth // 屏幕的宽度
        const skuIds = cart.getCheckedSkuIds()
        orderItems = await this.getCartOrderItems(skuIds)
        localItemCount = skuIds.length
        const order = new Order(orderItems, localItemCount)
        try {
            order.checkOrderIsOk()
        } catch (e) {
            console.error(e)
        }
        const coupons= await Coupon.getMySelfWithCategory()
        const couponBOList=this.packageCouponBOList(coupons,order)
        // console.log(orderItems)
        this.setData({
            orderItems,
            couponBOList,
            totalPrice: order.getTotalPrice(),
            finalTotalPrice: order.getTotalPrice(),
            scrollHeight: windowHeight * 750 / windowWidth - 88
        })
    },

    async getCartOrderItems(skuIds){
        //同步最新的sku数据，不从缓存中读
        const skus=await Sku.getSkusByIds(skuIds)
        const orderItems=this.packageOrderItems(skus)
        return orderItems
    },

    onChooseCoupon(event){
        const couponObj=event.detail.coupon
        const couponOperate=event.detail.operate
    },

    packageOrderItems(skus){
      return skus.map(sku=>{
          const count=cart.getSkuCountBySkuId(sku.id)
          return new OrderItem(sku,count)
      })
    },

    packageCouponBOList(coupons,order){
        return coupons.map(coupon=>{
            const couponBO=new CouponBO(coupon)
            couponBO.meetCondition(order)
            return couponBO
        })
    },
});
