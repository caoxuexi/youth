import {config} from "../config/config";
import {promisic} from "./util";
import {Token} from "../models/token";

//http请求助手
class Http{
    //在参数列表外加一个{}，这样我们传参的时候传对象就可以了
    static async request({url,data,method='GET'}){
        let res;
        try{
            res= await promisic(wx.request)({
                url:`${config.apiBaseUrl}${url}`,
                data,
                method,
                header:{
                    'content-type':'application/json',
                    appkey:config.appkey,
                    //jwt令牌标准，必须要令牌带Bearer
                    'authorization': `Bearer ${wx.getStorageSync('token')}`
                },
            });
        }catch (e){
            //1. 无网 只能捕获这一类错误 无法捕获2错误(2错误由)
            //2. API 正整数  成功调用了API 但是参数错误/服务端
            //二次重发 401 HttpStatusCode 2开头表示请求成功
        }
        const code =res.statusCode.toString()
        if(code.startsWith('2')){
            return res.data
        }else{
            if(code==='401'){
                //二次重发
                if(data.refetch){
                    await this._refetch({
                        url,
                        data,
                        method
                    })
                }
            }
        }
        return res.data
    }

    static async _refetch(data){
        const token=new Token()
        await token.getTokenFromServer()
        data.refetch=false
        return await Http.request(data)
    }
}

export {
    Http
}