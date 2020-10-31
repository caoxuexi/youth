// pages/home/home.js
import {Theme} from "../../models/theme";
import {Banner} from "../../models/banner";
import {Category} from "../../models/category";
import {Activity} from "../../models/activity";
import {SpuPaging} from "../../models/spu-paging";
import {CouponCenterType} from "../../core/enum";

Page({

    data: {
        themeA: null,
        bannerB: null,
        grid: [],
        activityD: null,
        themeE: null,
        spuPaging: null,
        loadingType: 'loading'
    },


    async onLoad(options) {
        this.initAllData();
        this.initBottomSpuList();
    },

    async initBottomSpuList() {
        const paging = SpuPaging.getLatestPaging();
        this.data.spuPaging = paging
        const data = await this.data.spuPaging.getMoreData();
        if (!data) {
            return
        }
        //累加 第二个参数是是否清空原来的数据
        wx.lin.renderWaterFlow(data.items);
    },

    onGoToCoupons(event) {
        const name = event.currentTarget.dataset.aname
        wx.navigateTo({
            url: `/pages/coupon/coupon?name=${name}&type=${CouponCenterType.ACTIVITY}`
        })
    },

    async initAllData() {
        // const themeA=await Theme.getHomeLocationA();
        //实例化一下，然后获取类属性
        const theme = new Theme();
        await theme.getThemes();

        const themeA = await theme.getHomeLocationA();
        const bannerB = await Banner.getHomeLocationB();
        const grid = await Category.getHomeLocationC();
        const activityD = await Activity.getHomeLocationD();
        const themeE = await theme.getHomeLocationE();
        let themeESpu = [];
        if (themeE.online) {
            const data = await Theme.getHomeLocationESpu();
            if (data) {
                themeESpu = data.spu_list.slice(0, 8)
            }
        }
        const themeF = await theme.getHomeLocationF();
        const bannerG = await Banner.getHomeLocationG();

        const themeH = await theme.getHomeLocationH();

        this.setData({
            themeA: themeA,
            bannerB: bannerB,
            grid,
            activityD,
            themeE,
            themeESpu,
            themeF,
            bannerG,
            themeH
        })
    },


    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: async function () {
        const data = await this.data.spuPaging.getMoreData()
        if (!data) {
            return
        }
        wx.lin.renderWaterFlow(data.items)
        if (!data.moreData) {
            this.setData({
                loadingType: 'end'
            })
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})