let funcUtil = {

    // 函数柯里化
    curry(targetFun,targetLength,targetThis) {
        // 需要收集的参数个数
        targetLength = (targetLength >= 0 ? targetLength : 0) || targetFun.length;
        // 已经收集到的参数
        const allArgs = [];
        const wait = function (...arg) {
            allArgs.push(...arg);
            if (allArgs.length >= targetLength){
                return targetFun.apply(targetThis,allArgs);
            } else {
                return wait;
            }
        };
        return wait;
    },

    // 防抖
    debounce(handler, delay) {
        let timer = null;
        return function () {
            const args = arguments;
            clearTimeout(timer);
            timer = setTimeout( () => {
                handler.apply(this, args);
            }, delay);
        }
    },


    // 节流
    throttle(handler, time) {
        let preTime = 0;
        let curTime = 0;
        return function () {
            curTime = new Date().getTime();
            if (curTime - preTime > time){
                handler.apply(this,arguments);
                preTime = curTime;
            }
        }
    },

    // 函数管道
    pine(...args){
        let curFun  = null;
        let loop = function (...data) {
            curFun = args.shift();
            if (curFun == null){
                 return data[0];
            } else {
                return loop(curFun(...data));
            }
        };
        return loop;
    },

    pines(...args){

        let curFun  = null;
        let loop = function (...data) {
            console.log(data);
            curFun = args.shift();
            if (curFun == null){
                return data;
            } else {
                return loop(curFun(...data));
            }
        };
        return loop;
    },

};


export default funcUtil;
