import axios from './axiosInstance';
export function resister({username, password, email, emailCode}) {
    return axios.post("/api/user/regist",{
        username,
        password,
        emailCode,
        email,
        code : "1234"
    },{
        method : "POST"
    });
}
export function sendEmailCode({email, type}) {
    return axios.get("/api/security/sendEmailCode",{
        params : {
            email,
            type
        }
    })
}

export function resetPassword({newPassword, email, emailCode}) {
    return axios.post("/api/user/resetUserPassword",{
        newPassword,
        emailCode,
        email
    },{
        method : "POST"
    });
}