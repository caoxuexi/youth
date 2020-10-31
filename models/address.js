/**
 * @description address
 * @author 曹学习
 * @date 2020/8/13 16:57
 */
class Address {
    static STORAGE_KEY = 'address'

    static getLocal() {
        const address = wx.getStorageSync(Address.STORAGE_KEY)
        return address ? address : null
    }

    static setLocal(address) {
        wx.setStorageSync(Address.STORAGE_KEY, address)
    }
}

export {
    Address
}

