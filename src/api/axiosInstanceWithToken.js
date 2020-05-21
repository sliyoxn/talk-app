// 后台说要在请求头里搞个token，那就在写一个instance
// 名字好难起啊，难受，起个什么名字哟
// 只能用在index页面, 因为这里嵌入了对token的处理
import axios from "axios";
const instance  = axios.create({
    baseURL : "http://121.199.10.4:8080/imsystem",
    timeout : 3000,
    withCredentials : true
});
export default instance;



instance.interceptors.response.use((response) => {
    // console.log(response);
    const data = response.data;
    const status = data.status;
    const realData = data.data;
    if (status){
        return realData;
    }
    try {
        const code = data.code;
        const errMsg = (data.errMsg && data.errMsg.text) || "";
        switch (code) {

            case 1000 :
                console.warn("后台错误",response);
                break;
            case 1001:
                console.warn("缺少请求参数",response);
                break;
            case 1002:
                console.warn("参数格式错误", response);
                break;
            case 1003:
                console.warn("无token信息,需要登录",response);
                window.location.pathname = "/login";
                break;
            case 1004:
                console.warn("token已经过期",response);
                window.location.pathname = "/login";
                break;
            case 1005:
            case 1006:
            case 1007:
            case 1008:
                console.warn(errMsg);
                break;
            default:
                break;
        }
    }catch (e) {
        console.warn(e, response);
    }
    return Promise.reject(data);
});
instance.interceptors.request.use((config) => {
    config.headers.token = localStorage.token;
    config.headers['Cache-Control']  = 'no-cache';
    return config;
}, function (error) {
    return Promise.reject(error);
});













// }
//     const code = data.code;
//     // const errMsg = (data.errMsg && data.errMsg.text) || "";
//     switch (code) {
//
//         case 1000 :
//             console.warn("后台错误",response);
//             break;
//         case 1001:
//             console.warn("缺少请求参数",response);
//             break;
//         case 1002:
//             console.warn("参数格式错误", response);
//             break;
//         case 1003:
//             console.warn("无token信息,需要登录",response);
//             break;
//         case 1004:
//             console.warn("token已经过期",response);
//             break;
//         case 1005:
//         case 1006:
//         case 1007:
//         case 1008:
//             alert("嘤嘤嘤");
//             break;
//         default:
//             break;
//     }
//     return realData;
// }, (error) => {
//     console.log("请求失败", error);
//     return error;



