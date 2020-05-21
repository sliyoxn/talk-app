<template>

    <div class="wrapper FriendItem" @mousedown.right.stop.prevent="onmousedownRight"
         @click="onClick" :draggable="openDrag" @dragstart="onDragStart">
        <div class="avatar-wrapper" :class="{unread : showRedPoint}">
            <img :src="friendData.avatar" alt="" draggable="false">
        </div>
        <div class="friend-name">
            <span>{{friendData.username}}</span>
        </div>
    </div>
</template>
<script>
    import {deleteFriend} from "../api/user";
    import {openPrivateTalk} from "../api/talk";

    export default {
        name: "FriendItem",
        data : function () {
            return {}
        },
        props : {
            friendData : {
                type : Object,
                default(){
                    return {
                        username : "星奏",
                        avatar : "https://i.postimg.cc/x8xnVDGJ/sena.png",
                        uid : "1"
                    }
                }
            },
            openContextMenu : {
                type : Boolean,
                default : false
            },
            callback : {
                type: Function,
                default() {
                    return function () {
                        console.log("没有传入点击回调哦");
                    }
                }
            },
            openDrag : {
                type : Boolean,
                default : false
            },
            groupId : {
                default : "-1"
            },
            showRedPoint : {
                default : false
            }
        },
        methods : {
            onClick(){
                this.$emit("click",JSON.parse(JSON.stringify(this.friendData)));
            },
            onDragStart(){
                this.bus.$emit("friendItemDragBegin", {
                    groupId : this.groupId,
                    uid : this.friendData.uid
                })
            },
            async deleteFriend(data){
                try {
                    await this.$confirm('确认删除好友吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    });
                }catch (e) {
                    return ;
                }
                let friendId = data.payload.friendId;
                deleteFriend({friendId}).then((data) => {
                    this.bus.$emit("onFriendDelete", {
                        uid : friendId
                    });
                })

            },

            onmousedownRight(event){
                if (!this.openContextMenu){
                    return;
                }
                let friendId = this.friendData.uid;
                if (!friendId) {
                    return
                }
                this.bus.$emit("openContextMenu", {
                    event,
                    x : event.clientX,
                    y : event.clientY,
                    payload : {
                        friendId
                    },
                    renderList : [{
                        renderText : "发消息",
                        clickEvent : this.toTalkView
                    },{
                        renderText : "删除好友",
                        clickEvent : this.deleteFriend
                    }]
                });
            },
            toTalkView(data){
                let friendId = data.payload.friendId;
                openPrivateTalk({friendId}).then((data) => {
                    console.log(data);
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
        }
    }
</script>

<style scoped lang="less">
    @import "../assets/style/components/FriendItem.less";
</style>