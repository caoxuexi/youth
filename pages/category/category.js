import {getSystemSize} from "../../utils/system";
import {px2rpx} from "../../miniprogram_npm/lin-ui/utils/util";
import {Categories} from "../../models/categories";
import {SpuListType} from "../../core/enum";

Page({
    data: {
        defaultRootId: 2,
        categories: {}
    },

    onLoad: async function (options) {
        await this.initCategoryData();
        await this.setDynamicSegmentHeight()
    },

    async initCategoryData() {
        this.data.categories = new Categories()
        await this.data.categories.getAll()
        const roots = this.data.categories.getRoots()
        const defaultRoot = this.getDefaultRoot(roots)
        const currentSubs = this.data.categories.getSubs(defaultRoot.id)
        this.setData
        ({
            roots,
            currentSubs,
            currentBannerImg: defaultRoot.img
        })
    },

    getDefaultRoot(roots) {
        let defaultRoot = roots.find(r => r.id === this.data.defaultRootId)
        if (!defaultRoot) {
            defaultRoot = roots[0]
        }
        return defaultRoot
    },

    async setDynamicSegmentHeight() {
        const res = await getSystemSize()
        //这是lin-ui提供的px转rpx函数(小程序中所有机型的宽度都是rpx)
        //原理:用750rpx/当前机型的宽度px  就可以得出倍率
        const windowHeightRpx = px2rpx(res.windowHeight)
        const h = windowHeightRpx - 60 - 20 - 2
        this.setData({
            segHeight: h
        })
    },

    onSegChange(event){
        const rootId=event.detail.activeKey
        const currentSubs=this.data.categories.getSubs(rootId)
        const currentRoot=this.data.categories.getRoot(rootId)
        this.setData({
            currentSubs,
            currentBannerImg:currentRoot.img
        })
    },

    onJumpToSpuList(event){
       const cid=event.detail.cid
        wx.navigateTo({
            url:`/pages/spu-list/spu-list?cid=${cid}&type=${SpuListType.SUB_CATEGORY}`
        })
    },

    onGotoSearch(event) {
        wx.navigateTo({
            url: `/pages/search/search`
        })
    }
});