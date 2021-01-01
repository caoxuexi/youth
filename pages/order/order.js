import {Cart} from "../../models/cart";
import {Sku} from "../../models/sku";
import {OrderItem} from "../../models/order-item";
import {Order} from "../../models/order";
import {Coupon} from "../../models/coupon";

const cart=new Cart()
Page({
    data: {},
    onLoad: async function (options) {
        let orderItems;
        let localItemCount
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
        console.log(coupons)
    },

    async getCartOrderItems(skuIds){
        //同步最新的sku数据，不从缓存中读
        const skus=await Sku.getSkusByIds(skuIds)
        const orderItems=this.packageOrderItems(skus)
        return orderItems
    },

    packageOrderItems(skus){
      return skus.map(sku=>{
          const count=cart.getSkuCountBySkuId(sku.id)
          return new OrderItem(sku,count)
      })
    },
});
