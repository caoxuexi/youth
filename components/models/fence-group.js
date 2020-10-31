/**
 * @description fence-group
 * @author Cao Study
 * @date 2020/6/29 22:08
 */
import {Matrix} from "./matrix";
import {Fence} from "./fence";

class FenceGroup{
    spu;
    skuList=[];
    fences=[];

    constructor(spu) {
        this.spu=spu;
        this.skuList=spu.sku_list
    }

    getDefaultSku(){
        const defaultSkuId=this.spu.default_sku_id
        if(!defaultSkuId){
            return
        }
        return this.skuList.find(s=>s.id===defaultSkuId)
    }

    getSku(skuCode){
        const fullSkuCode= `${this.spu.id}$${skuCode}`
        // console.log(fullSkuCode)
        const sku=this.spu.sku_list.find(s=>s.code===fullSkuCode)
        return sku?sku:null
    }

    setCellStatusById(cellId,status){
        this.eachCell((cell)=>{
            if(cell.id===cellId){
                cell.status=status;
            }
        })
    }

    setCellStatusByXY(x,y,status){
        this.fences[x].cells[y].status=status
    }

    //用真正矩阵转置方式设置spec
    initFences() {
        const matrix = this._createMatrix(this.skuList)
        const fences=[]
        const AT = matrix.transpose();
        AT.forEach(r=>{
            const fence=new Fence(r)
            fence.init()
            // console.log(this._isSketchFence(fence.id))
            if(this._hasSketchFence()&&this._isSketchFence(fence.id)){
                fence.setFenceSketch(this.skuList)
            }
            fences.push(fence)
        })
        this.fences=fences
        // console.log(fences)
    }

    _hasSketchFence(){
        return this.spu.sketch_spec_id?true:false;
    }

    _isSketchFence(fenceId){
        return this.spu.sketch_spec_id===fenceId?true:false
    }

    //创建Fence
    _createFence(element){
        return new Fence();
    }


    //根据sku的规格值生成矩阵
    _createMatrix(skuList){
        const m=[]
        skuList.forEach(sku=>{
            m.push(sku.specs)
        })
        return new Matrix(m)
    }

    eachCell(cb){
        for (let i=0;i<this.fences.length;i++){
            for(let j=0;j<this.fences[i].cells.length;j++){
                const cell=this.fences[i].cells[j]
                cb(cell,i,j)
            }
        }
    }
}

export {
    FenceGroup
}

