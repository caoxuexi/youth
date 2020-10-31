/**
 * @description cart-item
 * @author 曹学习
 * @date 2020/8/2 10:21
 */

class CartItem{
    skuId=null
    count=0
    sku=null
    checked=true

    constructor(sku,count) {
        this.skuId=sku.id
        this.sku=sku
        this.count=count
    }
}

export {
    CartItem
}

