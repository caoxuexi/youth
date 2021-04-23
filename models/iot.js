/**
 * @author 曹学习
 * @description iot
 * @date 2021/4/3 13:23
 */

import {Http} from "../utils/http";

class Iot{
    temperature
    humidity

    static async getTemAndHum() {
        return await Http.request({
            url: `iot/getTemAndHum`,
        });
    }
}

export{
    Iot
}
