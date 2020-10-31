/**
 * @description sale-explain
 * @author 曹学习
 * @date 2020/7/28 19:23
 */

import {Http} from "../utils/http";

class SaleExplain{
    static async getFixed(){
        const explains=await Http.request({
            url:`sale_explain/fixed`
        })
        return explains.map(e=>{
            return e.text
        })
    }
}

export {
    SaleExplain
}

