// components/empty-scrren/index.js
Component({

  properties: {
    text: {
      type: String,
      value: '暂无相关商品'
    },
    show: {
      type: Boolean,
      value: false
    }
  },

  data: {

  },

  lifetimes: {
    attached() {
      this._init()
    }
  },

  methods: {
    _init() {
      wx.lin = wx.lin || {};
      wx.lin.showEmptyScreen = (options) => {
        console.log('enter')
        const {
          text = this.properties.text
        } = {...options};
        this.setData({
          text,
          show: true
        });
      };
      wx.lin.hideEmpty = () => {
        this.setData({
          show: false
        });
      };
    },
  }
})
