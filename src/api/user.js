import axios from "./axiosInstanceWithToken";
export function getFriendGroup() {
    return axios.get("/api/friend/getFriendGroup",{

    });
}

export function addFriendGroup({groupName}) {
    let uid = localStorage.uid;
    return axios.post("/api/friend/addFriendGroup", {
        groupName,
        uid
    },{
        method : "POST"
    })
}


export function deleteFriendGroup({groupId}) {
    return axios.post("/api/friend/deleteFriendGroup",{
        groupId
    }, {
        method : "POST"
    })
}

export function updateFriendGroupName({uid, groupId, newGroupName}) {
    return axios.post("/api/friend/updateFriendGroupName",{
        uid,
        groupId,
        newGroupName
    },{
        method : "POST"
    })
}

export function moveFriendToNewGroup({oldGroupId, newGroupId, friendId}) {
    return axios.post("/api/friend/moveFriendToOtherGroup",{
        oldGroupId,
        newGroupId,
        friendId
    }, {
        method : "POST"
    });
}


export function applyAddFriend({friendId, applicationReason = "", groupId}) {
    let uid = localStorage.uid;
    return axios.post("/api/friend/applyAddFriend",{
        uid,
        friendId,
        applicationReason,
        groupId
    }, {
        method : "POST"
    })
}

export function getFriendApplication({uid}) {
    return axios.get("/api/friend/getFriendApplication",{
        params : {
            uid
        },
        method : "GET"
    })
}

export function acceptFriendApplication({friendId, groupId = "1"}) {
    let uid = localStorage.uid;
    return axios.post("/api/friend/acceptFriendApplication", {
        uid,
        friendId,
        groupId
    },{
        method : "POST"
    })
}

export function deleteFriend({friendId}) {
    let uid = localStorage.uid;
    return axios.post("/api/friend/deleteFriend", {
        uid,
        friendId
    },{
        method : "POST"
    })
}

export function searchUser({uid, keyWord}) {
    return axios.post("/api/friend/searchStranger", {
        uid,
        keyWord
    },{
        method : "POST"
    })
}


export function getFriendList({uid}) {
    return axios.get("/api/friend/getFriendList",{
        params : {
            uid
        },
        method : "GET"
    })
}

export function getFriendInfo({uid, friendId}) {

    return axios.get("/api/friend/getFriendInfo",{
        params : {
            uid,
            friendId
        },
        method : "GET"
    })
}

export function updateUserInfo({uid, signWord, username}) {

    return axios.post("/api/user/updateUserInfo", {
        uid,
        signWord,
        username
    },{
        method : "POST"
    })
}


export function getSelfInfo() {
    return axios.get("/api/user/getSelfInfo",{
        method : "GET"
    })
}

export function uploadAvatar(data) {
    return axios.post("/api/user/uploadAvatar", data,{
        headers: { "Content-Type": "multipart/form-data" },
    })
}


export function verifyLocalStorageData() {
    let uid = localStorage.uid;
    return axios.get("/api/security/verifyLocalStorageData",{
        params : {
            uid
        },
        method : "GET"
    })
}

export function getFriendListByGroup() {
    let uid = localStorage.uid;
    return axios.get("api/friend/getFriendListByGroup",{
        params : {
            uid
        },
        method : "GET"
    })
}


export function getTalkList() {
    let uid = localStorage.uid;
    return axios.get("/api/talk/getTalkList",{
        params : {
            uid
        },
        method : "GET"
    })

}


export function getMessageList({talkId, index, pageSize = 10}) {
    let uid = localStorage.uid;
    return axios.get("/api/talk/getMessageList", {
        params : {
            uid,
            talkId,
            index,
            pageSize
        }
    });
}

export function updatePassword({oldPassword, newPassword}) {
    return axios.post("/api/user/updateUserPassword", {
        oldPassword,
        newPassword
    })
}


export function validateFriendId({friendId}) {
    let uid = localStorage.uid;
    return axios.get("/api/friend/validateFriendId", {
        params : {
            friendId,
            uid
        }
    })
}