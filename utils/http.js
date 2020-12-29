import {config} from "../config/config";
import {promisic} from "./util";
import {Token} from "../models/token";
import {codes} from "../config/exception-config";
import {HttpException} from "../core/http-exception";

//http请求助手
class Http {
    //在参数列表外加一个{}，这样我们传参的时候传对象就可以了
    static async request({
                             url, data,
                             method = 'GET',
                             throwError = false,
                             refetch = true
                         }) {
        let res;
        try {
            res = await promisic(wx.request)({
                url: `${config.apiBaseUrl}${url}`,
                data,
                method,
                header: {
                    'content-type': 'application/json',
                    appkey: config.appkey,
                    //jwt令牌标准，必须要令牌带Bearer
                    'authorization': `Bearer ${wx.getStorageSync('token')}`
                },
            });
        } catch (e) {
            //如果想要个性化处理异常
            if (throwError) {
                throw new HttpException(-1, codes[-1])
            }
            Http.showError(-1)
            return null;
        }
        const code = res.statusCode.toString()
        if (code.startsWith('2')) {
            return res.data
        } else {
            if (code === '401') {
                //二次重发
                if (data.refetch) {
                    await this._refetch({
                        url,
                        data,
                        method
                    })
                }
            } else {
                if (throwError) {
                    throw new HttpException(res.data.code, res.data.message, code)
                }
                if (code === '404') {
                    //如果是单数据空，直接返回一个null，不反回unifyResponse,简化操作
                    if (res.data.code !== undefined) {
                        return null
                    }
                    return res.data
                }
                const error_code = res.data.code;
                Http.showError(error_code, res.data)
            }
        }
        return res.data
    }

    static async _refetch(data) {
        const token = new Token()
        await token.getTokenFromServer()
        data.refetch = false
        return await Http.request(data)
    }

    static showError(error_code, serverError) {
        let tip
        //如果error_code不存在，可能是服务器出现了一些内部错误,使用9999
        if (!error_code) {
            tip = codes[9999]
        } else {
            //如果我们没有找到前端的错误码配置(exception-config.js)，则直接返回服务器的错误消息
            if (codes[error_code] === undefined) {
                tip = serverError.message
            } else {
                tip = codes[error_code]
            }
        }
        wx.showToast({
            icon: "none",
            title: tip,
            duration: 3000
        })
    }
}

export {
    Http
}
