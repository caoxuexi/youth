Component({
    properties: {
        categories:Array,
        bannerImg:String
    },
    data: {},
    methods: {
        onTapGridItem(event){
            const id=event.detail.key
            this.triggerEvent('itemtap',{
                cid:id
            })
        }
    }
});
