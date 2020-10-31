Component({
    properties: {
        cartItemCount:Number
    },
    data: {},
    methods: {
        onGoToHome(event){
            this.triggerEvent('gotohome',{
            })
        },

        onGoToCart(event){
            this.triggerEvent('gotocart')
        },

        onAddToCart(event){
            this.triggerEvent('addtocart')
        },

        onBuy(event){
            this.triggerEvent('buy')
        }
    }
});
