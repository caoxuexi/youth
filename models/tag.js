/**
 * @description tag
 * @author 曹学习
 * @date 2020/7/31 15:07
 */

import {Http} from "../utils/http";

class Tag{
    static getSearchTags(){
        return Http.request({
            url:`tag/type/1`
        })
    }
}

export{
    Tag
}
