import {parseSpecValue} from "../../utils/sku";
import {Cart} from "../../models/cart";

const cart = new Cart()
Component({
    properties: {
        cartItem:Object

    },
    data: {
        specStr:String,
        discount:Boolean,
        soldOut: Boolean,
        online:Boolean,
        stock:Cart.SKU_MAX_COUNT,
        skuCount: 1
    },
    observers:{
      cartItem:function (cartItem){
          if(!cartItem){
              return
          }
          const specStr=parseSpecValue(cartItem.sku.specs)
          const discount=cartItem.sku.discount_price? true:false
          const soldOut=Cart.isSoldOut(cartItem)
          const online=Cart.isOnline(cartItem)
          this.setData({
              specStr,
              discount,
              online,
              soldOut,
              stock:cartItem.sku.stock,
              skuCount:cartItem.count
          })
      }
    },
    methods: {
        onDelete(event){
            const skuId=this.properties.cartItem.skuId
            cart.removeItem(skuId)
            this.setData({
                cartItem:null
            })
            this.triggerEvent('itemdelete',{
                skuId
            })
        },

        checkedItem(event){
            const checked=event.detail.checked
            cart.checkItem(this.properties.cartItem.skuId)
            //cart里面的数据调正了，但是我们本身的还没调,也需要调一下
            this.properties.cartItem.checked=checked
            this.triggerEvent('itemcheck',{

            })
        },

        onSelectCount(event){
            let newCount=event.detail.count
            cart.replaceItemCount(this.properties.cartItem.skuId,newCount)
            this.triggerEvent("countfloat")
        },

        backDetail(event){
            const spuId=event.currentTarget.dataset.spuId
            wx.navigateTo({url:`/pages/detail/detail?pid=${spuId}`})
        }
    }
});
