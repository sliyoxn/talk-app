import baseWs from "./baseWs";
import {IndexConstant as talkConstants} from "../constant/IndexConstant";
import CallbackController from "../util/CallbackControler";
let restartCount = 0;
let indexWS = createTalkWsInstance();
let indexCallbackController = new CallbackController(false);
window.talkCallbackController = indexCallbackController;
window.indexWs = indexWS;
export {indexCallbackController, sendMessage};


function createTalkWsInstance() {
    return baseWs.createInstance({
        url: "/talk",
        onmessage,
        onopen,
        onclose,
        onerror,
        data: {
            token: localStorage.token
        }
    });
}

function onopen() {
    console.log("talk websocket on ");
    restartCount = 0;
}
function onclose(event) {
    if (restartCount < 10) {
        setTimeout(function () {
            indexWS = createTalkWsInstance();
            window.talkWs = indexWS;
        }, 1000);
    }

}
function onerror(err) {
    console.log("talk websocket err: ", err);
}
function onmessage(resData, ws) {
    console.log("接收到消息", resData);
    let eventCode = resData.eventCode;
    let data = resData.data;
    switch (eventCode) {
        case talkConstants.eventCode.SERVER_PUSH_MESSAGE :
            indexCallbackController.fire("receiveMessage", data);
            break;
        case talkConstants.eventCode.SERVER_RECEIVE_MESSAGE_SUCCESS:
            indexCallbackController.fire("messageSendSuccess", data);
            break;
        case talkConstants.eventCode.SERVER_RECEIVE_MESSAGE_FAIL:
            indexCallbackController.fire("messageSendFail", resData);
            break;
        case talkConstants.eventCode.RECEIVE_NEW_APPLICATION:
            indexCallbackController.fire("receiveNewApplication", data);
            indexWS.send({
                eventCode : talkConstants.eventCode.CLIENT_RECEIVE_FRIEND_APPLICATION
            });
            break;
        case talkConstants.eventCode.HAS_NEW_FRIEND:
            indexCallbackController.fire("hasNewFriend", data);
            indexWS.send({
                eventCode : talkConstants.eventCode.CLIENT_RECEIVE_NEW_FRIEND_NOTIFICATION
            });
            break;

    }
}



function sendMessage({messageType, messageText, talkId, srcId, destId, messageImgUrl, fileInfo, timeStamp, isGroup, gid}) {
    indexWS.send({
        eventCode : talkConstants.eventCode.CLIENT_SEND_MESSAGE,
        data : {
            messageText,
            messageType,
            talkId,
            srcId,
            destId,
            messageImgUrl,
            fileInfo,
            timeStamp,
            isGroup,
            gid
        }
    });
}

