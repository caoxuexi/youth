const {Banner} = require("../../models/banner");
Component({
    properties: {
        banner:Object
    },

    observers:{
      'banner':function (banner) {
          if(!banner){
              return
          }
          if(banner.items.length===0){
              return;
          }
          const left=banner.items.find(i=>i.name==='left');
          const rightTop=banner.items.find(i=>i.name==='right-top');
          const rightBottom=banner.items.find(i=>i.name==='right-bottom');
          this.setData({
              left:left,
              rightTop:rightTop,
              rightBottom:rightBottom
          })
      }
    },
    data: {},
    methods: {
        onGotToTheme(event) {
            const tName = event.currentTarget.dataset.tname
            console.log(tName)
            wx.navigateTo({
                url: `/pages/theme/theme?tname=${tName}`
            })
        },

        onGotoDetail(event) {
            const keyword = event.currentTarget.dataset.keyword
            const type = event.currentTarget.dataset.type
            Banner.gotoTarget(type, keyword)
        }
    }
});
