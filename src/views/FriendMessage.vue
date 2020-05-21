<template>
    <div class="content-box wrapper">
        <div class="form-box">
            <img :src="friendInfo.avatar" alt="" class="avatar"/>
            <label>
                <span class="key">uid</span>
                <span class="val" :value="friendInfo.uid">{{friendInfo.uid}}</span>
            </label>
            <label>
                <span class="key">用户名</span>
                <span class="val">{{friendInfo.username}}</span>
            </label>
            <label>
                <span class="key">签名</span>
                <span class="val">{{friendInfo.signWord}}</span>
            </label>
            <button class="sendMessage" @click="toTalkView">发消息</button>
        </div>
    </div>
</template>

<script>
    import {getFriendInfo, validateFriendId} from "../api/user";
    import {openPrivateTalk} from "../api/talk";
    import Vue from "vue";

    export default {
        name: "FriendMessage",
        data(){
            return {
                friendInfo : {}
            }
        },
        methods : {
            __refreshFriendInfo(friendId){
                friendId = friendId ? friendId : this.$route.params.friendId;
                let self = this;
                if (!friendId){ return }
                getFriendInfo({
                    uid : localStorage.uid,
                    friendId
                }).then((data) => {
                    this.friendInfo = data.friendInfo;
                    this.$store.commit('others/changeTitle', data.friendInfo.username);
                })
            },
            toTalkView(){
                let friendId = this.$route.params.friendId;
                openPrivateTalk({friendId}).then((data) => {
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
        mounted() {
            let params = this.$route.params;
            let friendId = params.friendId;
            this.__refreshFriendInfo(friendId);
        },
        beforeRouteUpdate(to, from, next) {
            let params = to.params;
            let friendId = params.friendId;
            this.__refreshFriendInfo(friendId);
            next();
        },
        async beforeRouteEnter(to, from, next){
            let friendId = to.params.friendId;
            let data = await validateFriendId({friendId});
            let {hasThisFriend} = data;
            if (hasThisFriend){
                next();
            } else {
                Vue.prototype.$message({type : "error", message : "好友ID无效"});
                next({name : "friend"})
            }
        },
        beforeRouteLeave(to, from, next){
            this.$store.commit('others/changeTitle', "");
            next();
        },
    }
</script>

<style scoped lang="less">
    @import "../assets/style/view/FriendMessage";
</style>