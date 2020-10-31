import {Http} from "../utils/http";

class Theme{
    //加static类似于类方法不用实例化对象就可以调用
    static locationA='t-1';
    static locationE='t-2';
    static locationF='t-3';
    static locationH='t-4';

    themes=[];

    async getThemes(){
        const names=`${Theme.locationA},${Theme.locationE},${Theme.locationF},${Theme.locationH}`;
        this.themes= await Http.request({
            url:`theme/by/names`,
            data:{
                names
            }
        })
    }

   async getHomeLocationA(){
       return this.themes.find(t=>t.name===Theme.locationA);
   }

   async getHomeLocationE(){
       return this.themes.find(t=>t.name===Theme.locationE);
   }

   static async getHomeLocationESpu(){
        return Theme.getThemeSpuByName(Theme.locationE);
   }

    async getHomeLocationF(){
        return this.themes.find(t=>t.name===Theme.locationF);
    }

    async getHomeLocationH(){
        return this.themes.find(t=>t.name===Theme.locationH);
    }

   //获取单个专题的详情(含Spu数据)
   static async getThemeSpuByName(name){
        return await Http.request({
            url:`theme/name/${name}/with_spu`
        })
   }
}

export {
    Theme
}