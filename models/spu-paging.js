import {Paging} from "../utils/paging";

class SpuPaging{
    static getLatestPaging(count=5){
        return new Paging({
            url:`spu/latest`
        },count)
    }
    //1.一条数据没有 空
    //2.最后一页，还有没有更多的数据
    //3.累加 setData每次都是在原有的基础上加
    //4.非分页数据 a:正在加载 b。空
    //5.分页数据 a:正在加载 b.加载完成 c.没有更多数据
    //6.上滑页面触底 加载 避免用户重复发请求

    static getByCategoryPaging(cid, isRoot) {
        return new Paging({
            url: `spu/by/category/${cid}?is_root=${isRoot}`
        })
    }

}

export {
    SpuPaging
}
