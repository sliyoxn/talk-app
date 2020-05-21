<template>
    <div class="MemberMessage wrapper">
        <div class="header">
            <div class="message">
                <span class="groupAlias">{{data.groupAlias}}</span>
                <span class="uid">uid : {{data.uid}}</span>
            </div>
            <div class="avatar-box">
                <img :src="data.avatar" alt="" class="avatar" draggable="false">
            </div>
        </div>
        <div class="body">
            <label class="label">
                <span class="key">用户名</span>
                <span class="val">{{data.username}}</span>
            </label>
            <label class="label">
                <span class="key">签名</span>
                <span class="val">{{data.signWord}}</span>
            </label>
        </div>
        <div class="footer">
            <button class="add-friend" @click="addFriend" v-if="data.relation === 1">加好友</button>
            <button class="send-message" @click="sendMessage" v-else-if="data.relation === 2">发消息</button>
        </div>
    </div>
</template>

<script>
    import {openPrivateTalk} from "../api/talk";
    import {acceptFriendApplication, applyAddFriend} from "../api/user";

    export default {
        name: "MemberMessage",
        methods : {
            addFriend(){
                let friendId = this.data.uid;
                console.log(friendId);
                applyAddFriend({friendId}).then((data) => {
                    this.$emit("refreshFriendList");
                    this.$message({
                        showClose: true,
                        message : "申请已发送",
                        type: 'success',
                        duration: 3 * 1000
                    })
                }, function (err) {
                    console.log(err);
                });
            },
            sendMessage(){
                let friendId = this.data.uid;
                console.log(friendId);
                openPrivateTalk({
                    friendId,
                }).then((data) => {
                    let talkId = data.talkId;
                    let isNewTalk = data.isNewTalk;
                    if (isNewTalk){
                        this.bus.$emit("refreshTalkList");
                    }
                    this.$router.replace({
                        name : "talkBox",
                        params : {
                            talkId
                        }
                    }).then();
                })
            }
        },
        props : {
            data : {
                default() {
                    return {

                    }
                }
            },
        }
    }
</script>

<style scoped lang="less">
    @import "../assets/style/components/MemberMessage.less";
</style>