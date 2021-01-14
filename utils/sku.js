/**
 * @description sku
 * @author 曹学习
 * @date 2020/8/8 16:28
 */

import {Joiner} from "./joiner";

//规格对象转字符串{key:...,value:...,key_id:...,value_id:....}
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

//规格数组转字符串["象牙白","小号"]
const parseSpecValueArray = function (specs) {
    if(!specs){
        return null
    }
    const joiner = new Joiner('; ', 2)
    specs.map(spec=>{
        joiner.join(spec)
    })
    return joiner.getStr()
}


export {
    parseSpecValue,
    parseSpecValueArray
}

