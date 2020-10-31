/**
 * @description ui
 * @author 曹学习
 * @date 2020/8/1 13:17
 */

const showToast=function (title){
    wx.showToast({
        icon:"none",
        duration:2000,
        title
    })
}

export {
    showToast
}
