import axios from "./axiosInstanceWithToken";

export function makeTalkHasRead({talkId,isGroup,gid}) {
    let uid = localStorage.uid;
    return axios.post("/api/talk/setHasRead", {
        talkId : talkId.toString(),
        uid,
        isGroup,
        gid
    },{
        method : "POST"
    });
}


export function openPrivateTalk({friendId}) {
    let uid = localStorage.uid;
    return axios.post("/api/talk/openPrivateTalk", {
        friendId,
        uid,
    },{
        method : "POST"
    });
}

export function getTalkData({talkId}) {
    return axios.get("/api/talk/getTalkData",{
        params : {
            talkId,
        },
        method : "GET"
    })
}


export function deleteTalk({talkId}) {
    return axios.post("/api/talk/removeTalk", {
        talkId
    },{
        method : "POST"
    });
}

export function uploadPictureToServe(data) {
    return axios.post("/api/file/uploadMessageImage", data,{
        headers: { "Content-Type" : "multipart/form-data" },
        method : "POST"
    });
}

export function uploadFiles(data) {
    return axios.post("/api/file/uploadMultipartFile", data,{
        method : "POST",
    });
}

export function getFileHasUploads({md5}) {
    return axios.get("/api/file/getFileUploadInfo", {
        params : {
            md5
        }
    });
}


export function createGroupTalk({groupName}) {
    return axios.post("/api/talk/createGroupTalk", {
        groupName
    },{
        method : "POST",
    });
}

export function getGroupTalkList() {
    return axios.get("/api/talk/getGroupTalkList");
}

export function getGroupTalkMember({gid}) {
    return axios.get("/api/talk/getGroupTalkMember", {
        params : {
            gid
        }
    });
}

export function openGroupTalk({gid}) {
    return axios.post("/api/talk/openGroupTalk", {
        gid
    },{
        method : "POST",
    });
}

export function inviteFriendToGroup({gid, friendList}) {
    return axios.post('/api/talk/inviteFriendToGroupTalk', {
        gid,
        friendList
    },{
        method : "POST",
    });
}

export function getFriendListForInvite({gid}) {
    return axios.get("/api/friend/getFriendListForInvite", {
        params : {
            gid
        }
    });
}

export function removeMember({gid, memberList}) {
    return axios.post("/api/talk/removeMemberFromGroupTalk", {
        gid,
        memberList
    },{
        method : "POST",
    });
}

export function updateGroupAlias({uid, gid, groupAlias}) {
    return axios.post("/api/talk/changeGroupAlias", {
        uid,
        gid,
        groupAlias
    },{
        method : "POST",
    });
}

export function leaveGroup({gid}) {
    return axios.post("/api/talk/leaveGroupTalk", {
        gid
    });
}

export function dismissGroup({gid}) {
    return axios.post("/api/talk/dismissGroupTalk", {
        gid
    })
}

export function updateGroupData(data) {
    return axios.post("/api/talk/updateGroupTalkInfo", data);
}

export function validateTalkId({talkId}) {
    return axios.get("/api/talk/validateTalkId", {
        params :{
            talkId
        }
    })
}

