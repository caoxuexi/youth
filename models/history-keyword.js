/**
 * @description history-keyword
 * @author 曹学习
 * @date 2020/7/31 0:08
 */

class HistoryKeyword{
    //单例模式
    static MAX_ITEM_COUNT=20
    //搜索记录数组
    keywords=[]
    //缓存中用保存的key
    static KEY='keywords'

    constructor() {
        if(typeof HistoryKeyword.instance==='object'){
            return HistoryKeyword.instance
        }
        this.keywords=this._getLocalKeywords()
        HistoryKeyword.instance=this
        return this
    }

    save(keyword){
        const items=this.keywords.filter(k=>{
            return k===keyword
        })
        if(items.length!==0){
            return
        }
        if(this.keywords.length>=HistoryKeyword.MAX_ITEM_COUNT){
            //弹出数组最后一个元素,shift是弹出第一个元素
            this.keywords.pop()
        }
        //放在数组第一项，push是在最后插入
        this.keywords.unshift(keyword)
        this._refreshLocal()
    }

    get(){
        return this.keywords
    }

    clear(){
        this.keywords=[]
        this._refreshLocal()
    }

    _refreshLocal(){
        wx.setStorageSync(HistoryKeyword.KEY,this.keywords)
    }

    _getLocalKeywords(){
        const keywords=wx.getStorageSync(HistoryKeyword.KEY)
        //如果是第一次，缓存中没有数据，会返回一个undefined
        //但是我们的操作是基于数组完成的，所以需要判断一下
        if(!keywords){
            wx.setStorageSync(HistoryKeyword.KEY,[])
            return []
        }
        return keywords;
    }

}

export {
    HistoryKeyword
}

