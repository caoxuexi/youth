/**
 * @author 曹学习
 * @description coupon-bo
 * @date 2021/1/1 11:52
 */
import {CouponType} from "../core/enum";

class CouponBO{
    constructor(coupon) {
        //把coupon对象的属性放到CouponBO中
        this.type = coupon.type
        this.fullMoney = coupon.full_money
        this.rate = coupon.rate
        this.minus = coupon.minus
        this.id = coupon.id
        this.startTime = coupon.start_time
        this.endTime = coupon.end_time
        this.wholeStore = coupon.whole_store
        this.title = coupon.title
        this.satisfaction = false

        this.categoryIds = coupon.categories.map(category => {
            return category.id
        })
    }

    //判断优惠券是否满足使用条件
    meetCondition(order){
        let categoryTotalPrice;
        if (this.wholeStore){
            //如果是全场券 无视适用分类
            categoryTotalPrice=order.getTotalPrice()
        }else{
            //如果不是全场券，根据品类计算总价
            categoryTotalPrice=order.getTotalPriceByCategoryIdList(this.categoryIds)
        }
        let satisfaction =false

        switch (this.type){
            //这两项可以合并处理
            case CouponType.FULL_MINUS:
            case CouponType.FULL_OFF:
                satisfaction=this._fullTypeCouponIsOK(categoryTotalPrice)
                break;
            case CouponType.NO_THRESHOLD_MINUS:
                satisfaction=true
                break
            default:
                break
        }
        this.satisfaction=satisfaction
        return satisfaction
    }

    _fullTypeCouponIsOK(categoryTotalPrice){
        if (categoryTotalPrice>=this.fullMoney){
            return true
        }
        return false
    }
}

export {
    CouponBO
}
