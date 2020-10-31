/**
 * @author 曹学习
 * @description order
 * @date 2020/8/14 11:32
 */
import {OrderExceptionType} from "../core/enum";
import {OrderException} from "../core/order-exception";

class Order{
    orderItems
    localitemCount

    constructor(orderItems,localitemCount) {
        this.orderItems=orderItems
        this.localitemCount=localitemCount
    }

    checkOrderIsOk(){
        this.orderItems.forEach(item=>{
            item.isOk()
        })
    }

    _orderIsOk(){
        this._emptyOrder()
        this._containNotOnSaleItem()
    }

    _emptyOrder(){
        if(this.orderItems.length===0){
            throw new OrderException('订单没有任何商品',OrderExceptionType.EMPTY)
        }
    }

    _containNotOnSaleItem() {
        if(this.orderItems.length!==this.localitemCount){
            throw new OrderException('服务器返回订单商品数量与实际不相符，可能有商品已下架',OrderExceptionType.NOT_ON_SALE)
        }
    }
}

export {
    Order
}
