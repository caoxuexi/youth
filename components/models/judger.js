/**
 * @description judger
 * @author 曹学习
 * @date 2020/7/11 10:29
 */
import {SkuCode} from "./sku-code";
import {CellStatus} from "../../core/enum";
import {SkuPending} from "./sku-pending";
import {Joiner} from "../../utils/joiner";

class Judger{
    fenceGroup;
    pathDict=[];
    skuPending

    constructor(fenceGroup) {
        this.fenceGroup=fenceGroup
        this._initPathDict()
        this._initSkuPending()
    }

    isSkuIntact(){
        return this.skuPending.isIntact()
    }

    getCurrentValues(){
        return this.skuPending.getCurrentSpecValue()
    }

    getMissingKeys(){
        const missingKeysIndex=this.skuPending.getMissingSpecKeysIndex()
        //根据规格序号查找到对应规格的名称
        return  missingKeysIndex.map(i=>{
            return this.fenceGroup.fences[i].title;
        })
    }

    _initSkuPending(){
        const specsLength=this.fenceGroup.fences.length
        this.skuPending=new SkuPending(specsLength)
        const defaultSku=this.fenceGroup.getDefaultSku()
        if(!defaultSku){
            return
        }
        this.skuPending.init(defaultSku)
        this._initSelectedCell()
        this.judge(null,null,null,true)
    }

    _initSelectedCell(){
        this.skuPending.pending.forEach(cell=>{
            this.fenceGroup.setCellStatusById(cell.id,CellStatus.SELECTED)
        })
    }

    _initPathDict(){
        this.fenceGroup.spu.sku_list.forEach(s=>{
            const skuCode=new SkuCode(s.code)
            this.pathDict=this.pathDict.concat(skuCode.totalSegments)
        })
        // console.log(this.pathDict)
    }

    //判断cell的状态
    judge(cell,x,y,isInit=false){
        if(!isInit){
            this._changeCurrentCellStatus(cell,x,y)
        }
        this.fenceGroup.eachCell((cell,x,y)=>{
            const path=this._findPotentialPath(cell,x,y)
            // console.log(path);
            if(!path){
                return
            }
            const isIn=this._isInDict(path)
            if(isIn){
                this.fenceGroup.setCellStatusByXY(x,y,CellStatus.WAITING)
            }else{
                this.fenceGroup.setCellStatusByXY(x,y,CellStatus.FORBIDDEN)

            }
        })
        // console.log(this.skuPending)
    }

    getDeterminateSku(){
        const code=this.skuPending.getSkuCode()
        const sku=this.fenceGroup.getSku(code)
        return sku
    }

    _isInDict(path){
        return this.pathDict.includes(path)
    }

    _findPotentialPath(cell,x,y){
        const joiner=new Joiner('#')
        for(let i=0;i<this.fenceGroup.fences.length;i++){
            const selected=this.skuPending.findSelectedCellByX(i)
            if(x===i){
                // cell id 1-42 当前行
                if(this.skuPending.isSelected(cell,x)){
                    //我们查找当前行的当前元素的时候就直接返回空
                    return
                }
                const cellCode=this._getCellCode(cell.spec)
                joiner.join(cellCode)
            }else{
                //其他行
                if(selected){
                    //selected cell path 3-56
                    const selectedCellCode=this._getCellCode(selected.spec)
                    joiner.join(selectedCellCode)
                }
            }
        }
        return joiner.getStr();
    }

    _getCellCode(spec){
        return spec.key_id+'-'+spec.value_id
    }

    _changeCurrentCellStatus(cell,x,y){
        if(cell.status===CellStatus.WAITING) {
            // cell.status=CellStatus.SELECTED
            this.fenceGroup.setCellStatusByXY(x,y,CellStatus.SELECTED)
            this.skuPending.insertCell(cell,x)
        }
        if(cell.status===CellStatus.SELECTED){
            // cell.status=CellStatus.WAITING
            this.fenceGroup.setCellStatusByXY(x,y,CellStatus.WAITING)
            this.skuPending.removeCell(x)
        }
    }
}

export {
    Judger
}

