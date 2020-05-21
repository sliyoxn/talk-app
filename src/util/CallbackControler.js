/**
 *
 * @param flag 是否能给事件多次绑定一个函数
 * @constructor
 */
function CallbackController(flag = true) {

    if (!this instanceof CallbackController){
        console.error("CallbackController 只能通过new的方式调用");
        return
    }
    this.callbackMap = new Map();
    this.flag = flag;
}
export default CallbackController;


CallbackController.prototype.on = function (event, callback) {
    if (!(typeof callback === "function")){
        return
    }
    let list = this.callbackMap.get(event);
    if (list){
        if (!this.flag && list.indexOf(callback) >= 0){
            return;
        }
        list.push(callback);
    } else {
        this.callbackMap.set(event, [callback]);
    }
};

CallbackController.prototype.off = function (event, callback) {
    if (!event){
        return;
    }
    let callbackMap = this.callbackMap;
    if (callback){
        let list = callbackMap.get(event);
        if (list){
            for (let i = 0; i < list.length; i++) {
                if (list[i] === callback){
                    list.splice(i, 1);
                    return;
                }
            }
        }
    }
    else {
        callbackMap.delete(event);
    }

};

CallbackController.prototype.fire = function (event, ...data) {
    let list = this.callbackMap.get(event);
    if (!list){
        return
    }
    for (let i = 0; i < list.length; i++) {
        list[i](...data);
    }
};