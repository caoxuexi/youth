/**
 * @author 曹学习
 * @description token
 * @date 2020/10/11 12:51
 */
import {config} from "../config/config";
import {promisic} from "../utils/util";

class Token {
    //1. 携带Token
    //登录token->storage
    //token 1.token不存在 2.token过期时间
    //静默登录
    constructor() {
        this.tokenUrl=config.apiBaseUrl+"token"
        this.verifyUrl=config.apiBaseUrl+"token/verify"
    }

    async verify() {
        const token = wx.getStorageSync('token')
        if (!token) {
            await this.getTokenFromServer()
        } else {
            await this._verifyFromServer(token)
        }
    }

    async getTokenFromServer(){
        const role=await wx.login()
        const code=role.code

        const res=await promisic(wx.request) ({
            url:this.tokenUrl,
            method:'POST',
            data:{
                account:code,
                type:0
            }
        })
        wx.setStorageSync('token',res.data.token)
        return res.data.token
    }


    async _verifyFromServer(token) {
        const res=await promisic(wx.request) ({
            url:this.verifyUrl,
            method:'POST',
            data:{
                token:token
            }
        })
        const valid = res.data.is_valid
        if (!valid) {
            return this.getTokenFromServer()
        }
    }
}

export {
    Token
}
