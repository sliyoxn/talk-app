import axios from "./axiosInstance";

export function login({uid , password}) {
    return axios.post("/api/user/login",{
        uid,
        password,
        code : "123"
    },{
        method : "POST",
    });
}

export function logout({uid}) {
    return axios.post("/api/user/logout", {
        uid
    });
}

