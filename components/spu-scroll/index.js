Component({
    externalClasses: ['l-class'],

    properties: {
        theme: Object,
        spuList: Array
    },

    data: {},

    methods: {
        onItemTap(event) {
            const pid = event.currentTarget.dataset.pid;
            wx.navigateTo({
                url: `/pages/detail/detail?pid=${pid}`
            })
        }
    }
});
