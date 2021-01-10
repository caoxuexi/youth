import {Cart} from "../../models/cart";
import {Sku} from "../../models/sku";
import {OrderItem} from "../../models/order-item";
import {Order} from "../../models/order";
import {Coupon} from "../../models/coupon";
import {CouponBO} from "../../models/coupon-bo";
import {CouponOperate, ShoppingWay} from "../../core/enum";
import {showToast} from "../../utils/ui";
import {OrderPost} from "../../models/order-post";
import {Payment} from "../../models/payment";

const cart=new Cart()
Page({
    data: {
        address:null,
        totalPrice: 0,
        discountMoney: 0,
        currentCouponId:null,
        order:null,
        orderFail:false,
        orderFailMsg:"",
        orderItems:[],
        couponBOList:[],
        scrollHeight:0,
        shoppingWay:ShoppingWay.BUY,
        submitBtnDisable:false,

    },
    onLoad: async function (options) {
        let orderItems
        let localItemCount
        let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
        let windowWidth = wx.getSystemInfoSync().windowWidth // 屏幕的宽度
        const skuIds = cart.getCheckedSkuIds()
        const shoppingWay=options.way
        this.data.shoppingWay=shoppingWay
        orderItems = await this.getCartOrderItems(skuIds)
        localItemCount = skuIds.length
        const order = new Order(orderItems, localItemCount)
        this.data.order = order
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

    //点击提交订单后触发的方法
    async onSubmit(event) {
        if (!this.data.address) {
            showToast('请选择收货地址')
            return
        }
        this.disableSubmitBtn()
        const order = this.data.order
        //组装订单要提交的出局，处理为蛇形格式
        const orderPost = new OrderPost(
            this.data.totalPrice,
            this.data.finalTotalPrice,
            this.data.currentCouponId,
            order.getOrderSkuInfoList(),
            this.data.address
        )
        //提交订单
        const oid = await this.postOrder(orderPost)
        if (!oid) {
            this.enableSubmitBtn()
            return
        }

        //提交订单成功后，把购物车里的对应商品移除掉
        if (this.data.shoppingWay===ShoppingWay.CART){
            cart.removeCheckedItems()
        }

        //向后端请求支付参数
        const payParams=await Payment.getPayParams()
    },

    async postOrder(orderPost){
        try{
            const serverOrder=await Order.postOrderToServer(orderPost)
            if (serverOrder){
                return serverOrder.id //服务端生成的订单id号
            }
        }catch (e){
            //code
            this.setData({
                orderFail:true,
                orderFailMsg:e.message
            })
        }
    },

    //在点击一次submit按钮后，禁用submit按钮
    disableSubmitBtn(){
        this.setData({
            submitBtnDisable:true
        })
    },

    //在订单提交失败的情况下重新开启submit按钮
    enableSubmitBtn() {
        this.setData({
            submitBtnDisable:false
        })
    },

    //address组件选择确定地址后的处理函数
    onChooseAddress(event){
        const address=event.detail.address
        this.data.address=address
    },

    //选择优惠券触发的方法
    onChooseCoupon(event){
        // console.log(event.detail)
        const couponObj=event.detail.coupon
        const couponOperate=event.detail.operate
        //区分一下是否是选中（不是取消选中）
        if (couponOperate===CouponOperate.PICK){
            this.data.currentCouponId=couponObj.id
            const priceObj=CouponBO.getFinalPrice(this.data.order.getTotalPrice(),couponObj)
            this.setData({
                finalTotalPrice:priceObj.finalPrice,
                discountMoney:priceObj.discountMoney
            })
        }else{
            //如果是取消选中优惠券，就设置回原价就好了
            this.data.currentCouponId=null
            this.setData({
                finalTotalPrice:this.data.order.getTotalPrice(),
                discountMoney:0
            })
        }
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
