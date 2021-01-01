/**
 * @author 曹学习
 * @description coupon-bo
 * @date 2021/1/1 11:52
 */

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
}

export {
    CouponBO
}
