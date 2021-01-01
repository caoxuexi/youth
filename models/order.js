/**
 * @author 曹学习
 * @description order
 * @date 2020/8/14 11:32
 */
import {OrderExceptionType} from "../core/enum";
import {OrderException} from "../core/order-exception";
import {accAdd} from "../utils/number";

class Order {
    orderItems
    localitemCount

    constructor(orderItems, localitemCount) {
        this.orderItems = orderItems
        this.localitemCount = localitemCount
    }

    getTotalPrice() {
        return this.orderItems.reduce((onkeypress, item) => {
            const price = accAdd(onkeypress, item.finalPrice)
            return price
        }, 0)
    }

    //获取一组分类Id下商品的总价
    getTotalPriceByCategoryIdList(categoryIdList) {
        if (categoryIdList.length === 0) {
            return 0
        }
        //衣服 鞋子 书籍
        const price = categoryIdList.reduce((pre, cur) => {
            const eachPrice = this.getTotalPriceEachCategory(cur)
            return accAdd(pre, eachPrice)
        }, 0)
        return price
    }


    //获取每个分类下的商品总价
    getTotalPriceEachCategory(categoryId) {
        const price = this.orderItems.reduce((pre, orderItem) => {
            const itemCategoryId = this._isItemInCategories(orderItem,categoryId)
            if (itemCategoryId) {
                return accAdd(pre, orderItem.finalPrice)
            }
            return pre
        }, 0)
        return price
    }

    //判断商品是不是在category里
    _isItemInCategories(orderItem,categoryId){
        if (orderItem.categoryId===categoryId){
            return true
        }
        if (orderItem.rootCategoryId===categoryId){
            return true
        }
        return false
    }

    checkOrderIsOk() {
        this.orderItems.forEach(item => {
            item.isOk()
        })
    }

    _orderIsOk() {
        this._emptyOrder()
        this._containNotOnSaleItem()
    }

    _emptyOrder() {
        if (this.orderItems.length === 0) {
            throw new OrderException('订单没有任何商品', OrderExceptionType.EMPTY)
        }
    }

    _containNotOnSaleItem() {
        if (this.orderItems.length !== this.localitemCount) {
            throw new OrderException('服务器返回订单商品数量与实际不相符，可能有商品已下架', OrderExceptionType.NOT_ON_SALE)
        }
    }
}

export {
    Order
}
