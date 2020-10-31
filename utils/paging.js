import {Http} from "./http";

//分页助手
class Paging{
    //不关心细节，直接获得下一页
    //保存状态 实例化 new Paging
    req; //封装请求对象
    count;
    start;
    locker=false;
    url; //用于保存原始的url
    moreData=true; //是否有更多数据
    accumulator=[] //用于存放所有的sku数据

    constructor(req,count=10,start=0) {
        this.start=start;
        this.count=count;
        this.req=req
        this.url=req.url;
    }

    async getMoreData(){
        //getLocker
        //request releaseLocker
        if(!this.moreData){
            return
        }
        if(!this._getLocker()){
            return;
        }
        const data= await this._actualGetData()
        this._releaseLocker();
        return data;
    }

    async _actualGetData(){
        const req=this._getCurrentReq();
        let paging=await Http.request(req);
        if(!paging){
            return null;
        }
        //直接返回一个对象
        if(paging.total===0){
            return {
                empty: true,
                items: [],
                moreData: false,
                accumulator: []
            }
        }
        this.moreData = Paging._moreData(paging.total_page,
            paging.page);
        if(this.moreData){
            this.start+=this.count;
        }
        this._accumulate(paging.items)
        return {
            empty: false,
            items: paging.items,
            moreData: this.moreData,
            accumulator: this.accumulator
        }
    }

    //把sku数据数组拼接在一起
    _accumulate(items){
        this.accumulator=this.accumulator.concat(items)
    }

    //判断当前页之后是否还有数据
    static _moreData(totalPage,pageNum){
        return pageNum<totalPage-1
    }

    //获取当前的req对象
    _getCurrentReq(){
        let url=this.url;
        const params=`start=${this.start}&count=${this.count}`;
        //判断url是不是已经有?了，来决定url路径拼接方式
        if(url.includes('?')){
            url+='&'+params;
        }else{
            url+='?'+params
        }
        this.req.url=url;
        return this.req;
    }

    //获取锁
    _getLocker(){
        if(this.locker){
            return false;
        }
        this.locker=true;
        return true
    }

    //释放锁
    _releaseLocker(){
        this.locker=false;
    }
}

export {
    Paging
}