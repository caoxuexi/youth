/**
 * @description sku-pending
 * @author 曹学习
 * @date 2020/7/18 13:04
 */
import {Cell} from "./cell";
import {Joiner} from "../../utils/joiner";

class SkuPending{
    pending=[]
    size

    constructor(size) {
        this.size=size
    }

    init(sku){
        this.size=sku.specs.length
        for(let i=0;i<sku.specs.length;i++){
            const cell=new Cell(sku.specs[i])
            this.insertCell(cell,i)
        }
    }

    //获得已选择的规格的值
    getCurrentSpecValue(){
        //得到的还是一个数组
        return this.pending.map(cell => {
            if (cell) {
                return cell.spec.value
            }
            return null;
        })
    }

    //查找缺失的规格的序号(未选择的)
    getMissingSpecKeysIndex(){
        const keysIndex=[]
        for (let i = 0; i < this.size; i++) {
            if(!this.pending[i]){
                keysIndex.push(i)
            }
        }
        return keysIndex
    }

    getSkuCode(){
        const joiner=new Joiner('#')
        this.pending.forEach(cell=>{
            const cellCode=cell.getCellCode()
            joiner.join(cellCode)
        })
        return joiner.getStr()
    }

    isIntact(){
        //当我们一开始选择的是第三个规格时,数组为[undefined,同1,cell]
        if(this.size!==this.pending.length){
            return false
        }
        for (let i = 0; i < this.size; i++) {
            if(this._isEmptyPart(i)){
                return false
            }
        }
        return true
    }

    _isEmptyPart(index){
        return this.pending[index]?false:true;
    }

    insertCell(cell,x){
        this.pending[x]=cell
    }

    removeCell(x){
        this.pending[x]=null
    }

    findSelectedCellByX(x){
        return this.pending[x]
    }

    isSelected(cell,x){
        const pendingCell=this.pending[x]
        if(!pendingCell){
            return false
        }
        return cell.id === pendingCell.id
    }
}

export {
    SkuPending
}