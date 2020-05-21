<template>
    <div class="talk-box wrapper">
        <div @scroll="onMessageBoxScroll"  @click="hideRightBar" class="message-box">
            <span @click="loadMoreData" class="load-more" v-show="showLoadMoreBox">加载更多</span>
            <messageItem :key="item.messageId" :message-data="item"
                         v-for="(item, index) in messageList" :show-alias="isGroup"></messageItem>
        </div >
        <div @click="hideRightBar" class="edit-box">
            <label>
                <textarea @keydown.enter.prevent="sendTextMessage" class="edit-text" v-model="text"></textarea>
            </label>
            <button @click="sendTextMessage" class="send">发送</button>
            <div class="spec-file">
                <label>
                    <i class="el-icon-picture icon"></i>
                    <input @change="onSendPicInputChange" accept="image/*" id="send-picture" style="display: none"
                           type="file">
                </label>
                <label>
                    <i class="el-icon-files icon"></i>
                    <input @change="onSendFileInputChange" id="send-file" style="display: none" type="file">
                </label>
            </div>
        </div>
        <div :class="{hide : !showRightBar}" class="right-bar">
            <div class="search-box">
                <label style="width: 100%">
                    <input type="text" class="search-item" placeholder="搜索群成员" v-model="keyword"/>
                </label>
            </div>
            <div class="group-member-box">
                <group-member-item :img-src="addItemUrl" text="邀请好友" @click="inviteFriend"></group-member-item>
                <group-member-item :img-src="removeItemUrl" text="移除成员" @click="deleteMember"
                                   v-if="isGroupOwner"></group-member-item>
                <el-popover
                        placement="right"
                        trigger="click"
                        v-for="(item) in showMemberList" :key="item.uid"
                >
                    <member-message :data="item"></member-message>
                    <group-member-item slot="reference" :img-src="item.avatar" :text="item.groupAlias"></group-member-item>
                </el-popover>

            </div>
            <div class="option-box">
                <label class="label">
                    <span class="text">群名</span>
                    <input type="text" class="input" v-model="groupName" @change="onGroupNameChange"/>
                    <i class="el-icon-edit edit-icon"></i>
                </label>
                <label class="label">
                    <span class="text">我的群昵称</span>
                    <input type="text" class="input" v-model="groupAlias" @change="onGroupAliasChange"/>
                    <i class="el-icon-edit edit-icon"></i>
                </label>
            </div>
            <button class="delete-group" @click="leaveGroup" v-if="!isGroupOwner">删除并退出</button>
            <button class="delete-group" @click="dismissGroup" v-else>解散群聊</button>
        </div>
        <select-box :select-list-data="operationList" v-show="showSelectBox"
                    @clickCancel="onClickCancel" @clickConfirm="onClickConfirm"
                    @clickClose="onClickClose">
        </select-box>
    </div>
</template>

<script>
    import messageItem from "../components/MessageItem";
    import funcUtil from "../util/FuncUtil";
    import {getMessageList} from "../api/user";
    import {
        dismissGroup,
        getFileHasUploads, getFriendListForInvite,
        getGroupTalkMember,
        getTalkData, inviteFriendToGroup, leaveGroup,
        makeTalkHasRead, openGroupTalk, openPrivateTalk, removeMember, updateGroupAlias, updateGroupData,
        uploadFiles,
        uploadPictureToServe, validateTalkId
    } from "../api/talk";
    import {indexCallbackController, sendMessage} from "../api/indexWS";
    import {computedMd5} from "../util/md5Util";
    import GroupMemberItem from "../components/GroupMemberItem";
    import SelectBox from "../components/SelectBox";
    import MemberMessage from "../components/MemberMessage";
    import {formatFileSize, readFile} from "../util/fileUtil";
    import Vue from "vue";

    let messageMap = new Map();
    window.messageMap = messageMap;
    export default {
        name: "TalkMessage",
        components: {
            MemberMessage,
            SelectBox,
            GroupMemberItem,
            messageItem
        },
        data() {
            return {
                showRightBar: false,
                messageList: [],
                allPageSize: 1,
                nextLoadPageIndex: 1,
                hasInit: false,
                lock: false,
                text: "",
                talkId: 0,
                srcId: 0,
                destId: 0,
                gid: 0,
                isGroup: false,
                showSpecBox: true,
                groupName: "默认组名",
                groupAlias: "",
                addItemUrl: "https://i.postimg.cc/vH5vcRT8/1.png",
                removeItemUrl: "https://i.postimg.cc/xd6XZ84p/icon-remove.png",
                operationList: [],
                showSelectBox: false,
                selectType: 1,
                isGroupOwner: false,
                hasInitGroupMemberList: false,
                groupMemberList: [],
                inviteFriendList: [],
                keyword : "",
                passValidate : true
            }
        },
        methods: {
            loadMoreData() {
                this.__getTalkMessage();
            },
            onGroupNameChange(e) {
                let formData = new FormData();
                formData.append("gid", this.gid);
                formData.append("groupName", this.groupName);
                updateGroupData(formData).then((res) => {
                    this.$store.commit('others/changeTitle', this.groupName);
                    this.bus.$emit("groupNameChange", {
                        gid : this.gid,
                        groupName : this.groupName
                    });
                    this.__showSuccessMessage("群名更新成功");
                }, (err) => {
                    this.__showError(err.errMsg.text);
                })
            },
            hideRightBar(){
                this.showRightBar = false;
            },
            onGroupAliasChange(e) {

                updateGroupAlias({
                    groupAlias : this.groupAlias,
                    gid : this.gid
                }).then((res) => {
                    this.__showSuccessMessage("群昵称更新成功");
                    let messageList = this.messageList;
                    let groupAlias = this.groupAlias;
                    for (let i = 0, length = messageList.length; i < length; i++) {
                        if (messageList[i].userType){
                            messageList[i].groupAlias = groupAlias;
                        }
                    }
                }, (err) => {
                    this.__showError(err.errMsg.text);
                })
            },
            inviteFriend() {
                let gid = this.gid;
                this.operationList = [];
                getFriendListForInvite({gid}).then((data) => {
                    this.operationList = data.friendList.map((value) => {
                        return {
                            imgUrl: value.friendInfo.avatar,
                            text: value.friendInfo.username,
                            key: value.friendInfo.uid,
                            payload: {
                                username : value.friendInfo.username,
                                uid : value.friendInfo.uid
                            },
                            showType: value.canInvite ? 2 : 4,
                            reason : value.reason
                        }
                    });
                    this.showSelectBox = true;
                    this.selectType = 1;
                });
            },
            onClickCancel() {
                this.showSelectBox = false;
                this.selectType = 0;
            },
            onClickConfirm(data) {
                let type = this.selectType;
                this.showSelectBox = false;
                if (type === 1){
                    this.__inviteFriend(data);
                }else if (type === 2){
                    this.__deleteMember(data);
                }
            },
            __inviteFriend(data){
                inviteFriendToGroup({
                    gid : this.gid,
                    friendList : data
                }).then((data) => {
                    console.log(data);
                    this.__refreshMemberList();
                }, (err) => {
                    this.__showError(err.errMsg.text);
                });
            },
            __deleteMember(data){
                removeMember({
                    gid : this.gid,
                    memberList : data
                }).then((res) => {
                    this.__refreshMemberList();
                }, (err) => {
                    this.__showError(err.errMsg.text);
                });
            },
            onClickClose() {
                this.showSelectBox = false;
                this.selectType = 0;
            },
            leaveGroup(){
                let gid = this.gid;
                leaveGroup({gid}).then(() => {
                    this.__showSuccessMessage("退出成功");
                    this.bus.$emit("removeTalk", this.talkId);
                    this.$store.commit('others/setMenuIconShowAble', false);
                }, (err) => {
                    this.__showError("退出失败:" + err.errMsg)
                });
            },
            dismissGroup(){
                let gid = this.gid;
                dismissGroup({gid}).then(() => {
                    this.__showSuccessMessage("解散成功");
                }, (err) => {
                    this.__showError("解散失败:" + err.errMsg.text)
                })
            },
            deleteMember() {
                this.operationList = [];
                this.operationList = this.groupMemberList.slice(0).map((value) => {
                    return {
                        imgUrl: value.avatar,
                        text: value.groupAlias,
                        key: value.uid,
                        payload: {
                            groupAlias : value.groupAlias,
                            uid : value.uid
                        },
                        showType: value.uid === localStorage.uid ? 4 : 2,
                        reason : value.uid === localStorage.uid ? "这是你自己" : ""
                    }
                });
                this.showSelectBox = true;
                this.selectType = 1;
                this.showSelectBox = true;
                this.selectType = 2;
            },
            sendTextMessage() {
                if (this.text === "") {
                    return
                }
                let timeStamp = this.__getTimeStamp();
                let text = this.text;
                this.__sendMessage({
                    messageType: 1,
                    messageText: text,
                    timeStamp: timeStamp
                });
                this.__addMessageToMessageList({
                    messageType: 1,
                    messageText: text,
                    timeStamp,
                });

            },
            __toBottom() {
                this.$nextTick(() => {
                    let box = document.querySelector(".message-box");
                    box.scrollTop = box.scrollHeight;
                })

            },
            __getTimeStamp() {
                return new Date().getTime().toString();
            },
            __makeTalkHasRead() {
                let talkId = this.talkId;
                let gid = this.gid;
                let isGroup = this.isGroup;
                makeTalkHasRead({
                    talkId,
                    gid,
                    isGroup
                }).then(function (data) {
                }, (data) => {
                    this.$message({
                        message: "已读api出错",
                        showClose: true,
                    });
                })
            },
            __getTalkMessage() {
                if (this.lock) {
                    return;
                }
                if (!this.loadMoreAble) {
                    return;
                }
                let talkId = this.talkId;
                let index = this.nextLoadPageIndex;
                let self = this;
                if (!talkId) {
                    return
                }
                this.lock = true;
                getMessageList({
                    talkId,
                    index
                }).then((data) => {
                    if (data.curPageIndex === 1) {
                        this.allPageSize = data.allPageSize;
                        this.hasInit = true;
                        this.messageList.length = 0;
                        Vue.nextTick(() => {
                            this.__toBottom();
                        })
                    }
                    this.messageList.unshift(...data.messageList);
                    this.nextLoadPageIndex++;
                    this.lock = false;
                });
            },
            onMessageBoxScroll: funcUtil.debounce(function (event) {
                let target = event.target;
                if (target.scrollTop.toString() === "0") {
                    this.__getTalkMessage();
                }
            }, 500),
            __initData(talkId) {
                this.messageList.length = 0;
                this.nextLoadPageIndex = 1;
                this.lock = false;
                this.allPageSize = 1;
                this.hasInit = false;
                this.showRightBar = false;
                this.hasInitGroupMemberList = false;
                this.groupMemberList = [];
                messageMap.clear();
            },
            __getTalkData() {
                let talkId = this.talkId;
                getTalkData({talkId}).then((data) => {
                    this.isGroup = data.isGroup;
                    this.isGroupOwner = data.isGroupOwner;
                    this.destId = data.destId;
                    this.srcId = data.srcId;
                    this.avatar = data.avatar;
                    this.lastTimeStamp = data.lastTimeStamp;
                    this.groupAlias = data.groupAlias;
                    this.groupName = data.groupName || data.title;
                    this.gid = data.gid;
                    this.$store.commit('others/changeTitle', data.title);
                    this.$store.commit('others/setMenuIconShowAble', this.isGroup);
                })
            },
            __reLoadData() {
                console.log("加载数据");
                let params = this.$route.params;
                this.talkId = params.talkId;
                this.__initData();
                this.__getTalkMessage();
                this.__makeTalkHasRead();
                this.__getTalkData();
            },
            onReceiveMessage(data) {
                console.log("服务器推送",data);
                let talkId = data.talkData.talkId;
                if (talkId !== this.talkId) {
                    console.log("talkId不符合");
                    return;
                }
                let messageData = data.messageData;
                this.messageList.push(messageData);
            },
            onMessageSendSuccess(data) {
                let ts = data.timeStamp || data.timestamp;
                let messageData = messageMap.get(ts);
                if (!messageData) {
                    return
                }
                messageMap.delete(ts);
                messageData.messageId = data.messageId;
                let messageType = messageData.messageType;
                switch (messageType) {
                    case 1 :

                    case 2:
                        messageData.status = 1;
                        messageData.talkId = data.talkId;
                        break;
                    case 3:
                        setTimeout(() => {
                            messageData.status = 1
                        }, 700);
                        messageData.talkId = data.talkId;
                        break;

                }
                this.bus.$emit("updateTalkItem", data);
            },
            onMessageSendFail(data) {
                console.log("fail", data);
                let errText = data.errMsg.text;
                let timeStamp = data.data.timeStamp;
                let messageData = messageMap.get(timeStamp);
                messageMap.delete(timeStamp);
                messageData.status = -1;
                messageData.errText = errText;
                this.__toBottom();
            },
            onClickMenu() {
                this.showRightBar = !this.showRightBar;
                if (this.hasInitGroupMemberList) return;
                this.__refreshMemberList();
            },
            __refreshMemberList(){
                let gid = this.gid;
                getGroupTalkMember({gid}).then((data) => {
                    this.groupMemberList = data.memberList;
                    this.hasInitGroupMemberList = true;
                })
            },
            __addMessageToMessageList({messageType, messageText, messageImgUrl, fileInfo, timeStamp, status = 1, percentage}) {
                let date = new Date();
                let {srcId, avatar} = this;
                let data = {
                    messageId: Math.random() * 1000 + 1000 + "temp",
                    userType: 1,
                    messageText,
                    messageType,
                    messageImgUrl,
                    fileInfo,
                    userInfo: {
                        avatar,
                        uid: srcId
                    },
                    status,
                    percentage,
                    groupAlias : this.groupAlias,
                    showMessageTime: timeStamp - this.lastTimeStamp > 300000,
                    messageTime: date.getHours() + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes())
                };
                this.lastTimeStamp = timeStamp;
                messageMap.set(timeStamp, data);
                this.messageList.push(data);
                this.text = "";
                this.__toBottom();
                this.bus.$emit("setTalkTop", this.talkId);

            },
            __sendMessage({messageType, messageText, messageImgUrl, fileInfo, timeStamp}) {

                let {srcId, destId, isGroup, talkId, avatar, gid} = this;
                sendMessage({
                    messageText,
                    messageType,
                    talkId,
                    srcId,
                    destId,
                    timeStamp,
                    isGroup,
                    messageImgUrl,
                    fileInfo,
                    gid
                });
                // 1000ms后改变status
                setTimeout(() => {
                    let data = messageMap.get(timeStamp);
                    data && (data.status = 0);
                }, 1000);

            },
            __showError(errText) {
                this.$message({
                    showClose: true,
                    message: errText,
                    type: 'error',
                    duration: 60 * 1000
                });
            },
            async onSendPicInputChange(event) {
                let file = event.target.files[0];
                if (file){
                    event.target.value = '';
                } else {
                    return ;
                }
                if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG|bmp|webp|ico|svg)$/.test(file.name)) {
                    this.__showError("文件类型不符合");
                    return;
                }
                if (file.size > 10 * 1024 * 1024) {
                    this.__showError("请传输小于10M的图片");
                    return;
                }
                let formData = new FormData();
                let timeStamp = this.__getTimeStamp();
                formData.append("image", file);
                let self = this;
                readFile(file,  function () {
                    self.__addMessageToMessageList({
                        messageType: 2,
                        messageImgUrl: this.result,
                        timeStamp,
                        status: 0
                    });
                });

                try {
                    let data = await uploadPictureToServe(formData);
                    let imgUrl = data.imageUrl;
                    this.__sendMessage({
                        messageType: 2,
                        messageImgUrl: imgUrl,
                        timeStamp,
                    });
                } catch (e) {
                    console.log(e);
                    this.__showError(e)
                }
            },
            async onSendFileInputChange(event) {
                let file = event.target.files[0];
                if (file){
                    event.target.value = '';
                } else {
                    return ;
                }
                let fileForComputeMd5 = file.slice(0, Math.min(file.size, 5000000));
                let timeStamp = this.__getTimeStamp();
                try {
                    let md5 = await computedMd5(fileForComputeMd5);
                    this.__addMessageToMessageList({
                        messageType: 3,
                        timeStamp,
                        fileInfo: {
                            fileName: file.name,
                            downloadUrl: null,
                            fileSize: formatFileSize(file.size),
                        },
                        status: 0,
                        percentage: 0
                    });
                    let hasUploadData = await getFileHasUploads({md5});
                    let data = await this.__uploadFileToServe(md5, file, hasUploadData, (percentage) => {
                        let message = messageMap.get(timeStamp);
                        message.percentage = percentage;
                    });
                    messageMap.get(timeStamp).fileInfo.downloadUrl = data.downloadUrl;
                    console.log("发送消息");
                    this.__sendMessage({
                        timeStamp: timeStamp,
                        messageType: 3,
                        fileInfo: data
                    })


                } catch (e) {
                    console.warn(e);
                }
            },
            async __uploadFileBlock({data, md5, blockNum, fileData, filename, curBlock, totalSize}) {
                data.append("md5", md5);
                data.append("fileData", fileData);
                data.append("fileName", filename);
                data.append("currBlock", curBlock);
                data.append("blockNum", blockNum.toString());
                data.append("totalSize", totalSize);
                return await uploadFiles(data);
            },
            async __uploadFileToServe(md5, file, fileUploadData, onProgressUpdate) {
                let {downloadUrl, uploadType, blockList} = fileUploadData;
                let blockSize = 2 * 1024 * 1024;	                    // 单位字节 每一块的大小，前后端约定好，不改变
                let blockNum = Math.ceil(file.size / blockSize);	    // 总的块数
                let totalSize = file.size;
                let filename = file.name;
                let val = {};
                try {
                    switch (uploadType) {
                        case 1:
                            val.downloadUrl = downloadUrl;
                            val.fileName = filename;
                            onProgressUpdate && onProgressUpdate(100);
                            console.log("上传完成");
                            break;
                        case 2:
                            for (let i = 0; i < blockList.length; i++) {
                                let curBlock = blockList[i];
                                let beginSize = (curBlock - 1) * blockSize;
                                let endSize = Math.min(curBlock * blockSize, file.size);
                                let fileData = file.slice(beginSize, endSize);
                                let data = new FormData();
                                val = await this.__uploadFileBlock({data, md5, blockNum, fileData, filename, curBlock, totalSize});
                                let percent = (i + 1) / blockList.length * 100;
                                onProgressUpdate && onProgressUpdate(percent);
                            }
                            break;
                        case 3:
                            for (let curBlock = 1; curBlock <= blockNum; curBlock++) {
                                let beginSize = (curBlock - 1) * blockSize;
                                let endSize = Math.min(curBlock * blockSize, file.size);
                                let fileData = file.slice(beginSize, endSize);
                                let data = new FormData();
                                val = await this.__uploadFileBlock({data, md5, blockNum, fileData, filename, curBlock, totalSize});
                                let percent = curBlock / blockNum * 100;
                                onProgressUpdate && onProgressUpdate(percent);
                            }
                            break;
                    }

                    return {
                        downloadUrl: val.downloadUrl,
                        fileName: filename
                    }

                } catch (e) {
                    console.warn(e);
                }


            },
            __showSuccessMessage(message){
                this.$message({
                    showClose: true,
                    message,
                    type: 'success',
                    duration: 3 * 1000
                });
            }
        },
        computed: {
            loadMoreAble() {
                return this.allPageSize >= this.nextLoadPageIndex;
            },
            showLoadMoreBox() {
                return this.hasInit && this.loadMoreAble;
            },
            showMemberList(){
                let memberList = this.groupMemberList;
                let keyword  = this.keyword;
                return memberList.filter((value) => {
                    return value.username.includes(keyword) || value.groupAlias.includes(keyword) || value.uid.includes(keyword);
                })
            }
        },
        mounted() {
            console.log("挂载talkBox");
            indexCallbackController.on("receiveMessage", this.onReceiveMessage);
            indexCallbackController.on("messageSendSuccess", this.onMessageSendSuccess);
            indexCallbackController.on("messageSendFail", this.onMessageSendFail);
            this.bus.$on("clickMenu", this.onClickMenu);
            this.$store.commit('others/setMenuIconShowAble', false);
            setTimeout(this.__reLoadData());
        },
        beforeDestroy() {
            indexCallbackController.off("receiveMessage", this.onReceiveMessage);
            indexCallbackController.off("messageSendSuccess", this.onMessageSendSuccess);
            indexCallbackController.off("messageSendFail", this.onMessageSendFail);
        },
        async beforeRouteUpdate(to, from, next) {
            console.log("升级talkBox");
            let talkId = to.params.talkId;
            let data = await validateTalkId({talkId});
            let {hasThisTalk, hasInTalkList} = data;
            if (!hasThisTalk){
                this.__showError("找不到这个聊天, 跳转失败");
                return ;
            }
            this.talkId = to.params.talkId;
            this.__initData();
            this.__getTalkMessage();
            this.__makeTalkHasRead();
            this.__getTalkData();
            next();
        },
        beforeRouteLeave(to, from, next){
            this.$store.commit('others/changeTitle', "");
            this.$store.commit("others/setMenuIconShowAble", false);
            next();
        },
        async beforeRouteEnter(to, from, next){
            let talkId = to.params.talkId;
            let data = await validateTalkId({talkId});
            let {hasThisTalk, hasInTalkList, payload} = data;
            console.log(data);
            if (!hasThisTalk){
                Vue.prototype.$message({message : "路径无效", type : "error"});
                next({path : from.path});
                return;
            }
            next((vm) => {
                if (!hasInTalkList){
                    let {gid, friendId} = payload;
                    gid ? openGroupTalk({gid}).then() : openPrivateTalk({friendId}).then();
                    vm.bus.$emit("addTalk", payload);
                }
            });
            next();
        },
        activated() {
            console.log("talkBox activated");
            this.__reLoadData();
            this.__toBottom();
            this.$store.commit('others/setMenuIconShowAble', true);
        },
        deactivated() {
            console.log("talkBox deactivated");
            this.$store.commit('others/setMenuIconShowAble', false);
        }
    }


</script>

<style lang="less" scoped>
    @import "../assets/style/view/TalkBox.less";
</style>