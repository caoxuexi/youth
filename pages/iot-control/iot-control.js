import {Iot} from "../../models/iot";

Page({
    data: {
        temperature: 0,
        humidity: 0,
        status: "开始监控",
        flag:null,
    },
    onLoad: function (options) {

    },

    //按钮点击，开始监控温湿度
    onMonitor() {
        if (this.data.status === "开始监控") {
            this.setData({status : "停止监控"})
            this.data.flag=setInterval(this.dealData,3000)
            console.log(this.data.flag)
        } else if (this.data.status === "停止监控") {
            if(this.data.flag){
                clearInterval(this.data.flag)
            }
            console.log(this.data.flag)
            this.setData({status : "开始监控"})
        }
    },
    //处理温湿度数据并显示到前端
    async dealData() {
        let iot_data;
        iot_data = await Iot.getTemAndHum();
        console.log(iot_data)
        this.setData({
            temperature: iot_data.temperature+" ℃",
            humidity: iot_data.humidity,
        })
    },

    //退出页面的时候停止监控
    onUnload() {
        if(this.data.status === "停止监控"){
            clearInterval(this.data.flag)
        }
    }

});
