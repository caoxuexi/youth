/**
 * @description sku
 * @author 曹学习
 * @date 2020/8/8 16:28
 */

import {Joiner} from "./joiner";

const parseSpecValue = function (specs) {
    if(!specs){
        return null
    }
    const joiner = new Joiner('; ', 2)
    specs.map(spec=>{
        joiner.join(spec.value)
    })
    return joiner.getStr()
}


export {
    parseSpecValue
}

