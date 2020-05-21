<template>
    <div class="wrapper TalkItem" @click="onclick" @mousedown.right.prevent="onmousedownRight">
        <div class="avatar-wrapper">
            <img :src="talkData.avatar" alt="" draggable="false" class="avatar">
            <i v-show="talkData.newMessageCount" class="red-icon"></i>
        </div>
        <div class="main-content">
            <span class="talk-name">{{talkData.talkTitle}}</span>
            <span class="last-message">
                <span v-show="talkData.newMessageCount">[{{talkData.newMessageCount}}条] </span>{{talkData.lastMessage}}
            </span>
        </div>
        <div class="right-content">
            <div class="time">{{talkData.lastMessageTime}}</div>
        </div>
    </div>
</template>

<script>
    import {makeTalkHasRead} from "../api/talk";

    export default {
        name: "TalkItem",
        data : function () {
            return {}
        },
        props : {
            talkData : {
                type : Object,
                default(){
                    return {}
                }
            }
        },
        methods : {
            onclick() {
                this.__makeHasRead();
            },
            __makeHasRead(){
                this.talkData.newMessageCount = 0;
                makeTalkHasRead({
                    talkId : this.talkData.talkId,
                    gid : this.talkData.gid,
                    isGroup : this.talkData.isGroup
                }).then();
            },
            onmousedownRight(){
                this.$emit("mousedownRight", this.talkData);
            }

        },

    }
</script>

<style scoped lang="less">
    @import "../assets/style/components/TalkItem.less";

</style>