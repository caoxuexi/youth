import {HistoryKeyword} from "../../models/history-keyword";
import {Tag} from "../../models/tag";
import {Search} from "../../models/search";
import {showToast} from "../../utils/ui";

const history = new HistoryKeyword()
Page({
    data: {
        historyTags: [],
        loadType: "loading",
        paging: "",
        items:[]
    },
    onLoad: async function (options) {
        const historyTags = history.get()
        const hotTags = await Tag.getSearchTags()
        this.setData({
            historyTags,
            hotTags
        })
    },

    bindItems(data) {
        if (data.accumulator.length !== 0) {
            this.setData({
                items: data.accumulator
            })
        }
    },

    onCancel(event) {
        this.setData({
            search: false,
            items: []
        })
    },

    async onSearch(event) {
        this.setData({
            search: true,
        })
        const keyword = event.detail.value || event.detail.name
        if (!keyword) {
            showToast("请输入关键字")
            return
        }
        history.save(keyword)
        this.setData({
            historyTags: history.get()
        })
        const paging = Search.search(keyword)
        this.data.paging = paging
        wx.lin.showLoading({
            color: '#157658',
            type: 'flash',
            fullScreen: true
        })
        const data = await paging.getMoreData()
        if (!data.moreData) {
            this.setData({
                loadingType: 'end'
            })
        }
        wx.lin.hideLoading()
        this.bindItems(data)
    },

    onDeleteHistory(event) {
        history.clear()
        this.setData({
            historyTags: []
        })
    },

    onReachBottom: async function () {
        console.log("bottom")
        const data = await this.data.paging.getMoreData()
        if (!data) {
            return
        }
        //accumulator自动帮我们累加上了
        this.setData({
            items: data.accumulator
        })
        if (!data.moreData) {
            this.setData({
                loadingType: 'end'
            })
        }
    }
})