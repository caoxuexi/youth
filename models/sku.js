/**
 * @description sku
 * @author 曹学习
 * @date 2020/8/12 23:08
 */
import {Http} from "../utils/http";

class Sku{
    static async getSkusByIds(ids){
        const res=await Http.request({
            url:`sku?ids=${ids}`
        })
        return res
    }
}

export {
    Sku
}
