/**
 * @description cart
 * @author 曹学习
 * @date 2020/7/26 13:43
 */

import {Sku} from "./sku";

class Cart {
    static SKU_MIN_COUNT = 1
    static SKU_MAX_COUNT = 77
    static CART_ITEM_MAX_COUNT = 99 //购物车最多存99件商品
    static STORAGE_KEY = 'cart';

    //真实的data存在缓存里，这里设置一个变量起到代理模式作用
    _cartData = null

    static isSoldOut(item) {
        return item.sku.stock === 0;
    }

    static isOnline(item) {
        return item.sku.online;
    }

    constructor() {
        if (typeof Cart.instance === 'object') {
            return Cart.instance
        }
        Cart.instance = this
        return this
    }

    checkItem(skuId) {
        const oldItem = this.findEqualItem(skuId)
        oldItem.checked = !oldItem.checked
        this._refreshStorage()
    }

    getSkuCountBySkuId(skuId) {
        const cartData = this._getCartData()
        const item = cartData.items.find(item => item.skuId === skuId)
        if (!item) {
            console.error('在订单里寻找CartItem时不应当出现找不到的情况')
        }
        return item.count
    }

    getCheckedSkuIds() {
        const cartData=this._getCartData()
        if(cartData.items.length===0){
            return []
        }
        const skuIds=[]
        cartData.items.forEach(item=>{
            if(item.checked){
                skuIds.push(item.sku.id)
            }
        })
        return skuIds
    }

    replaceItemCount(skuId, newCount) {
        const oldItem = this.findEqualItem(skuId)
        if (!oldItem) {
            console.error('异常情况，更新CartItem中的数量不应当找不到相应数据')
            return
        }
        if (newCount < 1) {
            console.error('异常情况，CartItem的Count不可能小于1')
            return
        }
        oldItem.count = newCount
        if (oldItem.count >= Cart.SKU_MAX_COUNT) {
            oldItem.count = Cart.SKU_MAX_COUNT
        }
        this._refreshStorage()
    }

    async getAllSkuFromServer() {
        const cartData = this._getCartData()
        if (cartData.items.length === 0) {
            return null;
        }
        const skuIds = this.getSkuIds()
        const serverData = await Sku.getSkusByIds(skuIds)
        this._refreshByServerData(serverData)
        this._refreshStorage()
        return this._getCartData()
    }

    _refreshByServerData(serverData) {
        const cartData = this._getCartData()
        cartData.items.forEach(item => {
            this.setLatestCartItem(item, serverData)
        })
    }

    setLatestCartItem(item, serverData) {
        let removed = true
        //item表示缓存里面的数据，serverData是服务器新数据
        for (let sku of serverData) {
            if (sku.id === item.skuId) {
                removed = false
                item.sku = sku
                break
            }
        }
        if (removed) {
            item.sku.online = false
        }
    }

    getSkuIds() {
        const cartData = this._getCartData()
        if (cartData.items.length === 0) {
            return []
        }
        return cartData.items.map(item => item.skuId)
    }

    getAllCartItemFromLocal() {
        return this._getCartData()
    }

    getCheckedItems() {
        const cartItems = this._getCartData().items
        const checkedCartItems = []
        cartItems.forEach(item => {
            if (item.checked) {
                checkedCartItems.push(item)
            }
        })
        return checkedCartItems
    }

    isAllChecked() {
        let allChecked = true
        const cartItems = this._getCartData().items
        for (let item of cartItems) {
            if (!item.checked) {
                allChecked = false
                break
            }
        }
        return allChecked
    }

    checkAll(checked) {
        const cartData = this._getCartData()
        cartData.items.forEach(item => {
            item.checked = checked
        })
        this._refreshStorage()
    }

    isEmpty() {
        const cartData = this._getCartData()
        return cartData.items.length === 0
    }

    addItem(newItem) {
        if (this.beyondMaxCartItemCount()) {
            throw new Error('超过购物车最大数量')
        }
        this._pushItem(newItem)
        this._refreshStorage()
    }

    removeItem(skuId) {
        const oldItemIndex = this._findEqualItemIndex(skuId)
        const cartData = this._getCartData()
        cartData.items.splice(oldItemIndex, 1)
        this._refreshStorage()
    }

    _pushItem(newItem) {
        const cartData = this._getCartData()
        //如果已经存在就只加数量，不存在则添加
        const oldItem = this.findEqualItem(newItem.skuId)
        if (!oldItem) {
            cartData.items.unshift(newItem)
        } else {
            this._combineItems(oldItem, newItem)
        }
    }

    //获取购物车数据
    _getCartData() {
        if (this._cartData !== null) {
            return this._cartData
        }
        //如果购物车数据时null，我们要去缓存中取读取数据
        let cartData = wx.getStorageSync(Cart.STORAGE_KEY)
        if (!cartData) {
            cartData = this._initCartDataStorage()
        }
        this._cartData = cartData
        return cartData
    }

    //若购物车缓存不存在，初始化缓存
    _initCartDataStorage() {
        const cartData = {
            items: []
        }
        wx.setStorageSync(Cart.STORAGE_KEY, cartData)
        return cartData
    }

    //超出最大数量处理函数
    beyondMaxCartItemCount() {
        const cartData = this._getCartData()
        return cartData.items.length >= Cart.CART_ITEM_MAX_COUNT
    }

    //寻找相同的商品
    findEqualItem(skuId) {
        let oldItem = null
        const items = this._getCartData().items
        for (let i = 0; i < items.length; i++) {
            if (this._isEqualItem(items[i], skuId)) {
                oldItem = items[i]
                break
            }
        }
        return oldItem;
    }

    //获取当前cart中item的数量
    getCartItemCount() {
        return this._getCartData().items.length
    }

    //移除购物车车中被选中的商品
    removeCheckedItems() {
        const cartData=this._getCartData()
        for (let i=0;i<cartData.items.length;i++){
            if (cartData.items[i].checked){
                //从数组中移除的一项的逻辑函数
                cartData.items.splice(i,1)
            }
        }
        //更新到缓存中去
        this._refreshStorage()
    }

    //合并老的和新的(新添加的在购物车存在的情况下)
    _combineItems(oldItem, newItem) {
        console.log(newItem)
        if (newItem.count + oldItem.count > newItem.sku.stock) {
            wx.showToast({
                icon: "none",
                duration: 3000,
                title: `购物车中数量超过了库存哦`
            })
            return
        }
        this._plusCount(oldItem, newItem.count)
    }

    //添加数量
    _plusCount(item, count) {
        item.count += count
        if (item.count >= Cart.SKU_MAX_COUNT) {
            item.count = Cart.SKU_MAX_COUNT
        }
    }

    //判断是否是相同的商品
    _isEqualItem(oldItem, skuId) {
        return oldItem.skuId === skuId;
    }

    //插入缓存
    _refreshStorage() {
        wx.setStorageSync(Cart.STORAGE_KEY, this._cartData)
    }

    _findEqualItemIndex(skuId) {
        const cartData = this._getCartData()
        return cartData.items.findIndex(item => {
            return item.skuId === skuId
        })
    }


}

export {
    Cart
}

