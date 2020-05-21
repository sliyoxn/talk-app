<template>
    <div class="MyGroup">
        <group-item @click="createGroup" :pic-img="addImg" text="创建群聊"></group-item>
        <group-item v-for="(item , index) in groupList" @mouseDownRight="onMouseDownRight"
                    :pic-img="item.groupAvatar" :text="item.groupName" :payload="item" :key="item.gid">
        </group-item>
    </div>
</template>

<script>
    import SelectBox from "../components/SelectBox";
    import GroupItem from "../components/GroupItem";
    import MemberMessage from "../components/MemberMessage";
    import {createGroupTalk, getGroupTalkList, openGroupTalk} from "../api/talk";

    export default {
        name: "MyGroup",
        // components: {GroupItem, SelectBox},
        components: {MemberMessage, SelectBox, GroupItem},
        data() {
            return {
                groupList : [],
                addImg : "https://i.postimg.cc/vH5vcRT8/1.png"
            }
        },
        methods: {
            onMouseDownRight(data){
                let {event,payload} = data;
                this.bus.$emit("openContextMenu", {
                    event,
                    renderList : [{
                        renderText : "发送消息",
                        clickEvent : this.openGroupTalk,
                    }],
                    payload
                })
            },
            openGroupTalk(data){
                let payload = data.payload;
                let gid = payload.gid;
                openGroupTalk({gid}).then((data) => {
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
            },
            createGroup(){
                this.$prompt('请输入群名', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
                    inputErrorMessage: '群名不能为空'
                }).then((payload) => {
                    let action = payload.action;
                    if (action !== "confirm"){
                        return;
                    }
                    let groupName = payload.value;
                    createGroupTalk({groupName}).then((data) => {
                        this.groupList.push(data);
                    }, (err) => {
                        this.$message({message : "新建失败:" + err.errMsg.text})
                    });
                })
            },
            __refreshGroupList(){
                getGroupTalkList().then((data) => {
                    this.groupList = data.groupTalkList;
                })
            }
        },
        mounted(){
            this.__refreshGroupList();
        },

        beforeRouteEnter(to, from, next) {
            next(function (vm) {
                vm.$store.commit('others/changeTitle', "我的群组");
            })
        },
        beforeRouteLeave(to, from, next) {
            this.$store.commit('others/changeTitle', "");
            next();
        },

    }
</script>

<style scoped lang="less">
    @import "../assets/style/view/MyGroup";
</style>