// 设置了baseUrl和超时时间的axios实例
import axios from "axios";
const instance  = axios.create({
    baseURL : "http://121.199.10.4:8080/imsystem",
    timeout : 3000
});
export default instance;
