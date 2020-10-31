/**
 * @description search
 * @author 曹学习
 * @date 2020/7/31 15:20
 */
import {Paging} from "../utils/paging";

class Search{
    static search(q){
        return new Paging({
            url:`search?q=${q}`
        },6)
    }
}

export {
    Search
}