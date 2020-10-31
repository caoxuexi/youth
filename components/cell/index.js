Component({
    properties: {
        cell:Object,
        y:Number,
        x:Number,
    },
    data: {},
    methods: {
        onTap(evemt){
            this.triggerEvent('celltap',{
                cell:this.properties.cell,
                x:this.properties.x,
                y:this.properties.y,
            },{
                bubbles:true,
                composed:true
            })
        }
    }
});
