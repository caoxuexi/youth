import {Address} from "../../models/address";
import {AuthAddress} from "../../core/enum";

Component({
    properties: {},
    data: {
        address: Object,
        hasChosen: false,
        showDialog:false
    },

    lifetimes: {
        attached() {
            const address = Address.getLocal()
            if (address&&!(Object.keys(address).length===0)) {
                console.log(address)
                this.setData({
                    address,
                    hasChosen:true
                })
            }
        }
    },

    methods: {
        async onChooseAddress(event) {
            const authStatus=await this.hasAuthorizedAddress();
            if(authStatus===AuthAddress.DENY){
                this.setData({
                    showDialog:true
                })
                return
            }
            await this.getUserAddress()

        },

        async getUserAddress() {
            let res;
            try {
                res = await wx.chooseAddress({})
            } catch (e) {
                // console.error(e)
            }
            if (res) {
                this.setData({
                    hasChosen: true,
                    address: res
                })
                Address.setLocal(res)
            }
        },

        async hasAuthorizedAddress(){
            //获取配置总项
            const settings=await wx.getSetting({})
            const addressSetting=settings.authSetting['scope.address']
            if(addressSetting===undefined){
                return AuthAddress.NOT_AUTH
            } else if(addressSetting===false){
                return AuthAddress.DENY
            }else if(addressSetting===true){
                return AuthAddress.AUTHORIZED
            }
        },

        onDialogConfirm(event){
            wx.openSetting()
        }
    }
});
