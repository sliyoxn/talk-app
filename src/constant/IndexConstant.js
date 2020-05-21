import {deepFreeze} from "../util/objectUtil";

const IndexConstant  = {

    eventCode : {

        "CLIENT_SEND_MESSAGE" : 101,
        "CLIENT_RECEIVE_MESSAGE_SUCCESS" : 102,
        "CLIENT_RECEIVE_FRIEND_APPLICATION" : 104,
        "CLIENT_RECEIVE_NEW_FRIEND_NOTIFICATION" : 105,

        "SERVER_PUSH_MESSAGE" : 201,
        "SERVER_RECEIVE_MESSAGE_SUCCESS" : 202,
        "SERVER_RECEIVE_MESSAGE_FAIL" : 203,

        "RECEIVE_NEW_APPLICATION" : 204,
        "HAS_NEW_FRIEND" : 205
    },

    limit : {
        "PICTURE_MAX_SIZE" : 10 * 1024 * 1024
    }

};



deepFreeze(IndexConstant);
export {IndexConstant};

