/**
 * @author 曹学习
 * @description payment y
 * @date 2021/1/2 15:25
 */

class Payment{
    static async getPayParams(orderId){
        const serverParams=await Http.request({
            url:`payment/pay/order/${orderId}`,
            method:'POST'
        })
        return serverParams
    }
}

export {
    Payment
}

