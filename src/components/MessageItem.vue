<template>
    <div :class="{my : messageData.userType === 1}" class="wrapper MessageItem">
        <span class="time" v-if="messageData.showMessageTime">{{messageData.messageTime}}</span>
        <div class="content-box" v-if="messageData.messageType !== 4">
            <div class="avatar-box">
                <img :src="messageData.userInfo.avatar" alt="" draggable="false">
            </div>
            <div class="content-container">
                <div class="group-cn" v-if="showAlias">{{messageData.groupAlias}}</div>
                <div class="message-box" v-if="messageData.messageType === 1">
                    <span class="message">{{messageData.messageText}}</span>
                    <i :class="{loading : messageData.status === 0, error : messageData.status === -1}" v-if="messageData.status !== 1"></i>
                </div>
                <div class="message-img-box" v-else-if="messageData.messageType === 2">

                    <i :class="{loading : messageData.status === 0, error : messageData.status === -1}" v-if="messageData.status !== 1"></i>
                    <EasyPreview :img-src="messageData.messageImgUrl">
                        <img :src="messageData.messageImgUrl" alt="" class="pic" @click="showMaskView"/>
                    </EasyPreview>
                </div>
                <a :href="messageData.fileInfo.downloadUrl" :download="messageData.fileInfo.fileName" target="_blank" class="message-file-box" v-else-if="messageData.messageType === 3">
                    <div class="preview">
                        <img src="../assets/icon/icon-unknown.png" class="prev-img" alt=""/>
                    </div>
                    <div class="detail">
                    <span class="title">
                        {{messageData.fileInfo.fileName}}
                    </span>
                        <span class="size">{{messageData.fileInfo.fileSize}}</span>
                    </div>
                    <div class="progress-box" v-show="messageData.status === 0 | messageData.status === -1">
                        <el-progress :text-inside="true" :show-text="false" :stroke-width="5" :percentage="messageData.percentage"></el-progress>
                    </div>
                </a>
            </div>
        </div>
        <div class="group-notice" v-else-if="messageData.messageType === 4">{{messageData.messageText}}</div>
        <span class="errText" v-if="messageData.status === -1">{{messageData.errText}}</span>
    </div>


</template>

<script>
    export default {
        name: "messageItem",
        data : function () {
            return {
                showBigImg : false,
            }
        },
        props : {
            messageData : {
                type : Object,
                default () {
                    return {}
                }
            },
            showAlias : {
                default : false
            }
        },
        methods : {
            showMaskView(){
                this.showBigImg = true;
            },
            closeMaskView(){
                this.showBigImg = false;
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../assets/style/components/MessageItem.less";
</style>