import {Spu} from "../../models/spu";
import {ShoppingWay} from "../../core/enum";
import {SaleExplain} from "../../models/sale-explain";
import {Cart} from "../../models/cart";
import {CartItem} from "../../models/cart-item";

Page({
    data: {
        scrollHeight: 0,
        spu: null,
        showRealm: false,
        orderWay: "",
        cartItemcount:0
    },
    onLoad: async function (options) {
        const pid = options.pid;
        const spu = await Spu.getDetail(pid);
        const explain = await SaleExplain.getFixed()
        let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
        let windowWidth = wx.getSystemInfoSync().windowWidth // 屏幕的宽度
        this.setData({
            spu,
            explain,
            scrollHeight: windowHeight * 750 / windowWidth - 100
        })
        this.updateCartItemCount()
    },

    onAddToCart(event) {
        this.setData({
            showRealm: true,
            orderWay: ShoppingWay.CART
        })
    },

    onBuy(event) {
        this.setData({
            showRealm: true,
            orderWay: ShoppingWay.BUY
        })
    },

    onGoToHome(event) {
        wx.switchTab({
            url: '/pages/home/home'
        })
    },

    onGoToCart(event) {
        wx.switchTab({
            url: '/pages/cart/cart'
        })
    },

    onSpecChange(event) {
        this.setData({
            specs: event.detail
        })
    },

    onShopping(event) {
        const chosenSku = event.detail.skuId
        const skuCount=event.detail.skuCount

        if(event.detail.orderWay===ShoppingWay.CART){
            const cart=new Cart()
            const cartItem=new CartItem(chosenSku,skuCount)
            cart.addItem(cartItem)
            this.updateCartItemCount()
        }

        if(event.detail.orderWay===ShoppingWay.BUY){
            wx.navigateTo({
                url:"/pages/order/order"
            })
        }
    },

    updateCartItemCount(){
        const cart=new Cart()
        this.setData({
            cartItemCount:cart.getCartItemCount(),
            showRealm:false
        })
    },
});