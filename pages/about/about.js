// pages/about/about.js
import {showToast} from "../../utils/ui";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        urlCourse: 'http://www.caoxuexi.cn',
        urlGit: 'https://github.com/caoxuexi'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    onCopyGit() {
        wx.setClipboardData({
            data: this.data.urlGit
        })
    },

    onCopyCourse() {
        wx.setClipboardData({
            data: this.data.urlCourse
        })
    },

    save(event) {
        wx.previewImage({
            urls: ["http://www.caoxuexi.cn/wx.jpg"]
        })
        // wx.saveImageToPhotosAlbum()
    },

    onShareAppMessage: function () {

    }
})
