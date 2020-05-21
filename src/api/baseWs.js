import WsConstructor from "../util/wsUtil";
let baseWs = new WsConstructor({
    baseUrl : "ws://121.199.10.4:9898/imsystem",
    sendInterceptor(data){
        return JSON.stringify(data);
    },
    messageInterceptor(res){
        return JSON.parse(res.data);
    }

});

export default baseWs;