/**
 * @description cell
 * @author 曹学习
 * @date 2020/7/3 23:25
 */
import {CellStatus} from "../../core/enum";

class Cell{
    title
    id
    status= CellStatus.WAITING
    spec
    skuImg

    constructor(spec) {
        this.title=spec.value
        this.id=spec.value_id
        this.spec=spec
    }

    getCellCode(){
        return this.spec.key_id+'-'+this.spec.value_id
    }
}

export {
    Cell
}