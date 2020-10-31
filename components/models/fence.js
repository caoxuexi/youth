/**
 * @description fence
 * @author Cao Study
 * @date 2020/6/29 22:08
 */

import {Cell} from "./cell";

class Fence{
    cells=[]
    specs
    title
    id

    constructor(specs) {
        //一组的spec，具体规格名
        this.specs=specs
        this.title=specs[0].key
        this.id=specs[0].key_id
    }

    init(){
        this._initCells();
    }

    _initCells(){
        this.specs.forEach(s=>{
           // some是只要有一个就行，every是每一个都要才行
           const existed= this.cells.some(c=>{
                return c.id === s.value_id
            })
            if(existed){
                return
            }
            const cell=new Cell(s);
            this.cells.push(cell)
        })
    }

    setFenceSketch(skuList){
        this.cells.forEach(c=>{
            this._setCellSkuImg(c,skuList)
        })
    }

    _setCellSkuImg(cell,skuList){
        const specCode=cell.getCellCode()
        const matchedSku= skuList.find(s=>s.code.includes(specCode))
        if(matchedSku){
            cell.skuImg=matchedSku.img
        }
    }

    // pushValueTitle(title){
    //     this.valueTitles.push(title)
    // }
}

export {
    Fence
}

