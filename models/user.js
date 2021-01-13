/**
 * @author 曹学习
 * @description payment y
 * @date 2021/1/13 9:52
 */
import {Http} from "../utils/http";

class User{

    static async updateUserInfo(data) {
        return Http.request({
            url:`user/wx_info`,
            data,
            method:'POST'
        })
    }
}

export {
    User
}
