/**
 * @author 曹学习
 * @description coupon-bo
 * @date 2021/1/1 11:52
 */
import {CouponType} from "../core/enum";
import {accMultiply, accSubtract} from "../utils/number";

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

    //获取用了优惠券之后的总价格
    static getFinalPrice(orderPrice,couponObj){
        if (couponObj.satisfaction===false){
            throw new Error('优惠券不满足使用条件')
        }
        let finalPrice;
        switch (couponObj.type){
            case CouponType.FULL_MINUS:
                return{
                    finalPrice:accSubtract(orderPrice,couponObj.minus),
                    discountMoney: couponObj.minus
                }
            case CouponType.FULL_OFF:
                //这里不能直接返回accMultiply的结果，必须通过中间变量
                const actualPrice=accMultiply(orderPrice,couponObj.rate)
                finalPrice=CouponBO.roundMoney(actualPrice)
                const discountMoney=accSubtract(orderPrice,finalPrice)
                return {
                    finalPrice,
                    discountMoney
                }
            case CouponType.NO_THRESHOLD_MINUS:
                finalPrice=accSubtract(orderPrice,couponObj.minus)
                finalPrice=finalPrice<0? 0:finalPrice
                return {
                    finalPrice,
                    discountMoney: couponObj.minus
                }
        }
    }

    static roundMoney(money){
        //对于小数的约束可能有4种： 向上/向下取整、四舍五入、银行家模式
        //前端算法模式必须同服务端保持一致，否则对于浮点数金额的运算将导致订单无法通过验证
        //前后端匹配均使用向上取整算法 1.1111->111.11=112=1.12,为了保留两位小数去取
        const final=Math.ceil(money*100)/100
        return final
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
