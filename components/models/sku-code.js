/**
 * @description sku-code
 * @author 曹学习
 * @date 2020/7/11 10:33
 */
import {combination} from "../../utils/util";

class SkuCode{
    code;
    spuId;
    totalSegments=[];

    constructor(code) {
        this.code=code
        this._splitToSegments()
    }

    _splitToSegments(){
        // code码：2$1-44#3-9#4-14
        const spuAndSpec=this.code.split('$')
        this.spuId=spuAndSpec[0]
        // 拆分[1-44,3-9,4-14]
        const specCodeArray=spuAndSpec[1].split('#')
        const length=specCodeArray.length;
        for(let i=1;i<=length;i++){
            const segments=combination(specCodeArray,i)
            //在具体规格之间加#分割
            const newSegments=segments.map(segs=>{
                //seg也是数组就是segments内部那些数组
                return segs.join("#")
            })
            this.totalSegments=this.totalSegments.concat(newSegments)
            // console.log(newSegments)
        }
    }
}

export {
    SkuCode
}
