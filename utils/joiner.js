/**
 * @description joiner
 * @author 曹学习
 * @date 2020/7/18 13:50
 */

class Joiner {
    _str = ''
    _symbol = '-'
    _cutCharNum = 1
    constructor(symbol, cutCharNum) {
        if (symbol) {
            this._symbol = symbol
        }
        if (cutCharNum){
            this._cutCharNum = cutCharNum
        }
    }
    join(part) {
        if (part) {
            this._str += `${part}${this._symbol}`;
        }
    }
    getStr() {
        return this._str.substring(0, this._str.length - this._cutCharNum)
    }

}

export {
    Joiner
}
