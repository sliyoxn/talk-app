/**
 * websocket实例工厂化函数
 * @param baseUrl 基础url
 * @param sendInterceptor  拦截发送数据, 对发送的数据进行统一处理
 * @param messageInterceptor  消息接收拦截器, 对接收到的数据进行统一处理
 * @constructor
 */
function WsConstructor({baseUrl, sendInterceptor, messageInterceptor})
{
    if (!this instanceof WsConstructor){
        console.warn("这个函数只能通过new调用");
        return
    }
    this.baseUrl = baseUrl;
    this.sendInterceptor = sendInterceptor;
    this.messageInterceptor = messageInterceptor;
}

/**
 * 创建实例
 * @param url
 * @param onopen
 * @param onclose
 * @param onmessage
 * @param onerror
 * @param data  拼在URL后的数据
 * @param flag 启用拦截器, 原型修改
 * @returns {WebSocket}
 * @private
 */
WsConstructor.prototype.createInstance = function ({
                                                       url = "", onopen, onclose,
                                                       onmessage, onerror, data = {}, flag = true}) {
    url = this.baseUrl + url;
    if (url.indexOf("?") === -1){
        url += __parseData(data);
    }
    let ws = new WebSocket(url);
    ws.addEventListener("open", onopen);
    ws.addEventListener("close", onclose);
    ws.addEventListener("error", onerror);
    if (!flag){
        ws.addEventListener("message", onmessage);
        return ws;
    }
    if (typeof this.sendInterceptor === "function"){
        let send = ws.__proto__.send;
        ws.send =  (data) => {
            data = this.sendInterceptor(data);
            send.call(ws, data);
        }
    }
    if (typeof this.messageInterceptor === "function"){
        ws.addEventListener("message",  (res) => {
            let data = this.messageInterceptor(res);
            onmessage(data, ws);
        });
    }

    return ws;
};





function __parseData(data) {
    let str = "?";
    let keys = Object.keys(data);
    if (!keys.length) {
        return ""
    }
    for (let i = 0; i < keys.length; i++) {
        str += keys[i];
        str += "=";
        str += data[keys[i]];
        str += "&";
    }
    return str.slice(0, str.length - 1);
}



Object.defineProperty(WsConstructor.prototype, "createInstance", {
    writable : false,
    configurable : false,
    enumerable : true,
});




export default WsConstructor;



