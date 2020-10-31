/**
 * @description matrix
 * @author 曹学习
 * @date 2020/7/1 23:09
 */

class Matrix{
    m
    constructor(matrix) {
        this.m = matrix
    }

    //获得矩阵的行数
    get rowsNum(){
        //即求二维数组的长度即行号
        return this.m.length
    }

    //获得矩阵的列数
    get colsNum(){
        return this.m[0].length
    }

    //遍历方法
    each(callback){
        for(let colNum=0;colNum<this.colsNum;colNum++){
            for(let rowNum=0;rowNum<this.rowsNum;rowNum++){
                const element=this.m[rowNum][colNum]
                //用回调的方式
                callback(element,rowNum,colNum)
            }
        }
    }

    transpose(){
        const desArr=[]
        for(let colNum=0;colNum<this.colsNum;colNum++){
            //创建内层的子数组
            desArr[colNum]=[];
            for(let rowNum=0;rowNum<this.rowsNum;rowNum++){
                desArr[colNum][rowNum]=this.m[rowNum][colNum]
            }
        }
        return desArr
    }
}

export {
    Matrix
}
