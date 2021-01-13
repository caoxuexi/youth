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

const cart = new Cart()
Page({
    data: {
        address: null,
        totalPrice: 0,
        discountMoney: 0,
        currentCouponId: null,
        order: null,
        orderFail: false,
        orderFailMsg: "",
        orderItems: [],
        couponBOList: [],
        scrollHeight: 0,
        shoppingWay: ShoppingWay.BUY,
        submitBtnDisable: false,
        isOk: true,
    },
    onLoad: async function (options) {
        let isOK = true;
        let orderItems
        let localItemCount
        let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
        let windowWidth = wx.getSystemInfoSync().windowWidth // 屏幕的宽度
        //获取跳转方式，购物车还是立即购买
        const shoppingWay=options.way
        this.data.shoppingWay=shoppingWay
        if (shoppingWay===ShoppingWay.BUY){
            const skuId=options.sku_id
            const count=options.count
            orderItems=await this.getSingleOrderItems(skuId, count)
            localItemCount=1
        }else{
            const skuIds = cart.getCheckedSkuIds()
            orderItems = await this.getCartOrderItems(skuIds)
            localItemCount = skuIds.length
        }

        const order = new Order(orderItems, localItemCount)
        this.data.order = order
        try {
            order.checkOrderIsOk()
        } catch (e) {
            this.setData({
                isOK: false
            })
            console.error(e)
        }
        const coupons = await Coupon.getMySelfWithCategory()
        const couponBOList = this.packageCouponBOList(coupons, order)
        // console.log(orderItems)
        this.setData({
            isOK,
            orderItems,
            couponBOList,
            totalPrice: order.getTotalPrice(),
            finalTotalPrice: order.getTotalPrice(),
            scrollHeight: windowHeight * 750 / windowWidth - 88
        })
    },

    async getSingleOrderItems(skuId,count){
        //服务器只提供了了获取数组的方法，所以我们这里返回数组一样可以用
        const skus = await Sku.getSkusByIds(skuId)
        return [new OrderItem(skus[0],count)]
    },

    async getCartOrderItems(skuIds) {
        //同步最新的sku数据，不从缓存中读
        const skus = await Sku.getSkusByIds(skuIds)
        const orderItems = this.packageOrderItems(skus)
        return orderItems
    },

    //点击提交订单后触发的方法
    async onSubmit(event) {
        //判断是否填入了地址
        if (!this.data.address) {
            showToast('请选择收货地址')
            return
        }
        this.disableSubmitBtn()
        const order = this.data.order
        //组装订单要提交的数据，处理为蛇形格式
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
        if (this.data.shoppingWay === ShoppingWay.CART) {
            cart.removeCheckedItems()
        }

        wx.lin.showLoading({
            type: "flash",
            fullScreen: true,
            color: "#157658"
        })

        //向后端请求支付参数   wx.requestPayment调用就可以拉起微信支付
        const payParams = await Payment.getPayParams(oid)
        if (!payParams) {
            return
        }

        wx.redirectTo({
            url:`/pages/pay-success/paysuccess?oid=${oid}`
        })

        // 如果有微信支付的话才使用，wx.requestPayment传入服务端拼接参数,会自动拉起微信支付
        // try {
        //     const res = await wx.requestPayment(payParams)
        //     //支付成功  -redirectTo防止用户返回
        //     wx.redirectTo({
        //         url:`/pages/pay-success/paysuccess?oid=${oid}`
        //     })
        // } catch (e) {
        //     //支付失败--引导用户再次支付(我的订单)
        //     wx.redirectTo({
        //         //我的订单里面有对订单状态进行分类-这里转到支付失败的地方
        //         url:`/pages/my-order/my-order?key=${payStatus}`
        //     })
        // }

    },

    async postOrder(orderPost) {
        try {
            const serverOrder = await Order.postOrderToServer(orderPost)
            if (serverOrder) {
                return serverOrder.id //服务端生成的订单id号
            }
        } catch (e) {
            //code
            this.setData({
                orderFail: true,
                orderFailMsg: e.message
            })
        }
    },

    //在点击一次submit按钮后，禁用submit按钮
    disableSubmitBtn() {
        this.setData({
            submitBtnDisable: true
        })
    },

    //在订单提交失败的情况下重新开启submit按钮
    enableSubmitBtn() {
        this.setData({
            submitBtnDisable: false
        })
    },

    //address组件选择确定地址后的处理函数
    onChooseAddress(event) {
        const address = event.detail.address
        this.data.address = address
    },

    //选择优惠券触发的方法
    onChooseCoupon(event) {
        // console.log(event.detail)
        const couponObj = event.detail.coupon
        const couponOperate = event.detail.operate
        //区分一下是否是选中（不是取消选中）
        if (couponOperate === CouponOperate.PICK) {
            this.data.currentCouponId = couponObj.id
            const priceObj = CouponBO.getFinalPrice(this.data.order.getTotalPrice(), couponObj)
            this.setData({
                finalTotalPrice: priceObj.finalPrice,
                discountMoney: priceObj.discountMoney
            })
        } else {
            //如果是取消选中优惠券，就设置回原价就好了
            this.data.currentCouponId = null
            this.setData({
                finalTotalPrice: this.data.order.getTotalPrice(),
                discountMoney: 0
            })
        }
    },

    packageOrderItems(skus) {
        return skus.map(sku => {
            const count = cart.getSkuCountBySkuId(sku.id)
            return new OrderItem(sku, count)
        })
    },

    packageCouponBOList(coupons, order) {
        return coupons.map(coupon => {
            const couponBO = new CouponBO(coupon)
            couponBO.meetCondition(order)
            return couponBO
        })
    },

});
