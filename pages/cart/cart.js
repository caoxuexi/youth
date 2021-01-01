import {Cart} from "../../models/cart";
import {getSystemSize} from "../../utils/system";
import {px2rpx} from "../../miniprogram_npm/lin-ui/utils/util";
import {Calculator} from "../../models/calculator";
import {SpuPaging} from "../../models/spu-paging";

const cart = new Cart()
Page({
    data: {
        cartItems: [],
        isEmpty: false,
        segHeight: 0,
        allChecked: false,
        totalPrice:0,
        totalSkuCount:0,
        spuPaging: null,
        KEY:'RECOMMEND_GOOD',//推荐商品的缓存写入key
    },

    onLoad: async function (options) {
        const res = await getSystemSize()
        //这是lin-ui提供的px转rpx函数(小程序中所有机型的宽度都是rpx)
        //原理:用750rpx/当前机型的宽度px  就可以得出倍率
        const windowHeightRpx = px2rpx(res.windowHeight)
        const h = windowHeightRpx - 100
        this.setData({
            segHeight: h
        })
        const cartData=await cart.getAllSkuFromServer()
        await this.recommendSpu()
    },

    async recommendSpu() {
        const paging = SpuPaging.getLatestPaging(4);
        this.setData({
            spuPaging:paging
        })
        const data = await this.data.spuPaging.getMoreData();
        // console.log(data)
        if (!data) {
            return
        }
        //写入缓存 避免每次重复发起请求 提升性能 在onshow中加载数据
        wx.setStorageSync(this.data.KEY,data.items);
    },

    //页面显示
    onShow: async function () {
        const cart = new Cart()
        const cartItems = cart.getAllCartItemFromLocal().items
        if (cart.isEmpty()) {
            this.empty()
            return
        }
        this.setData({
            cartItems: cartItems
        })
        this.notEmpty()
        this.isAllChecked()
        this.refreshCartData()
        //累加 第二个参数是是否清空原来的数据
        await wx.lin.renderWaterFlow(wx.getStorageSync(this.data.KEY),true)
    },

    empty() {
        this.setData({
            isEmpty: true
        })
        //控制
        wx.hideTabBarRedDot({
            index: 2
        })
    },

    notEmpty() {
        this.setData({
            isEmpty: false
        })
        //控制
        wx.showTabBarRedDot({
            index: 2
        })
    },

    isAllChecked() {
        const allChecked = cart.isAllChecked()
        this.setData({
            allChecked
        })
    },

    onSingleCheck(event){
        this.isAllChecked()
        this.refreshCartData()
    },

    onDeleteItem(event){
        this.isAllChecked()
        this.refreshCartData()
    },

    onCheckAll(event){
        const checked=event.detail.checked
        cart.checkAll(checked)
        //页面里面的CartItems就是从cart模型类里来的，这里看上去好像没有操作cartItems，
        //但是cartItems这个引用类型指向的是cart模型类中的cartData，已经修改过了，这里更新一下ui就好
        this.setData({
            cartItems:this.data.cartItems
        })
        this.refreshCartData()
    },

    refreshCartData(){
        const checkedItems=cart.getCheckedItems()
        const calculator=new Calculator(checkedItems)
        calculator.calc()
        this.setCalcData(calculator)
    },

    onCountFloat(){
        this.refreshCartData()
    },

    setCalcData(calculator){
        const totalPrice=calculator.getTotalPrice()
        const totalSkuCount=calculator.getTotalSkuCount()
        this.setData({
            totalPrice,
            totalSkuCount
        })
    },

    onSettle(event){
        if(this.data.totalSkuCount<=0){
            return
        }
        wx.navigateTo({
            url:"/pages/order/order"
        })
    }
});
