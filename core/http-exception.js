/**
 * @author 曹学习
 * @description http-exception
 * @date 2020/12/29 20:55
 */

class HttpException extends Error{
    errorCode=9999
    statusCode=500
    message=''

    constructor(errorCode,message,statusCode) {
        super();
        this.message=message;
        this.errorCode=errorCode;
        this.statusCode=statusCode;
    }
}

export {
    HttpException
}
