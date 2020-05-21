<template>
    <div class="friendGroupPage wrapper" @mousedown.right="openContextMenu">
        <div class="options-box">

        </div>
        <friend-group v-for="(groupData, index) in groupList" :group="groupData"
                      @drop="onDrop(groupData)" :key="groupData.groupId"
                      :open-receive-drag="true" @itemDragStart="onDragStart"
                      :last-one="index === groupList.length - 1" :first-one="index === 0"
        ></friend-group>
    </div>
</template>

<script>
    import friendItem from "../components/FriendItem";
    import friendGroup from "../components/FriendGroup";
    import {
        addFriendGroup,
        deleteFriendGroup,
        getFriendGroup,
        getFriendListByGroup, moveFriendToNewGroup,
        updateFriendGroupName
    } from "../api/user";
    import * as talkCallbackController from "vue";
    import {indexCallbackController} from "../api/indexWS";

    export default {
        name: "FriendGroupManage",
        components: {
            friendGroup,
            friendItem
        },
        beforeRouteEnter(to, from, next) {
            next(function (vm) {
                vm.$store.commit('others/changeTitle', "分组管理");
            })
        },
        mounted() {
            let self = this;
            this.bus.$on("friendItemDragBegin", (data) => {
                this.onDragStart(data);
            });
            this.bus.$on("onFriendDelete",(data) => {
                let uid = data.uid.toString();
                let groupList = this.groupList;
                for (let i = 0; i < groupList.length; i++) {
                    let members = groupList[i].members;
                    for (let k = 0; k < members.length; k++){
                        if (members[k].uid === uid){
                            members.splice(k, 1);
                            return;
                        }
                    }
                }
            });
            indexCallbackController.on("hasNewFriend", this.__hasNewFriend);
            this.__initData();
        },
        data() {
            return {
                groupList: [],
                curDragFriendMessage: {},
                curDragGroupMessage: {},
                defaultGroupId : ""
            }
        },
        methods: {
            onDragOver(e) {
                e.preventDefault();
            },
            // 放手时获取之前保存的数据
            // 然后把数据移入新的group里
            onDrop(newGroup) {
                let curDragFriendMessage = this.curDragFriendMessage;
                let curDragGroupMessage = this.curDragGroupMessage;
                if (!curDragGroupMessage || !curDragFriendMessage) {
                    return;
                }
                let oldMemberList = curDragGroupMessage.members;
                moveFriendToNewGroup({
                    oldGroupId: curDragGroupMessage.groupId,
                    newGroupId: newGroup.groupId,
                    friendId: curDragFriendMessage.uid
                }).then((res) => {
                    for (let i = 0; i < oldMemberList.length; i++) {
                        if (oldMemberList[i].uid === curDragFriendMessage.uid) {
                            oldMemberList.splice(i, 1);
                        }
                    }
                    newGroup.members.push(curDragFriendMessage);
                    console.log("把:", curDragFriendMessage.username, "移出:", curDragGroupMessage.groupName, "移入:", newGroup.groupName);
                }, (err) => {
                    console.log(err);
                });

                this.curDragGroupMessage = null;
                this.curDragFriendMessage = null;
            },
            // friendItem把存储的groupId和friendId传递到这个函数里
            // 这个函数遍历groupList找出拖拽的群组和好友对应的数据并保存
            onDragStart(e) {
                let groupId = e.groupId;
                let uid = e.uid;
                let groupList = this.groupList;
                let curDragFriendMessage = null;
                let curDragGroupMessage = null;
                for (let i = 0; i < groupList.length; i++) {
                    if (Number(groupList[i].groupId) === Number(groupId)) {
                        curDragGroupMessage = groupList[i];
                        let friendList = groupList[i].members;
                        for (let j = 0; j < friendList.length; j++) {
                            if (Number(friendList[j].uid) === Number(uid)) {
                                curDragFriendMessage = friendList[j];
                            }
                        }
                    }
                }
                this.curDragGroupMessage = curDragGroupMessage;
                this.curDragFriendMessage = curDragFriendMessage;
                this.bus.$emit("closeContextMenu");
            },
            addNewGroup(event) {
                let self = this;
                this.$prompt('请输入新分组名', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
                    inputErrorMessage: '分组名不能为空'
                }).then((payload) => {
                    let action = payload.action;
                    if (action !== "confirm"){
                        return;
                    }
                    let groupName = payload.value;
                    addFriendGroup({groupName}).then(function (data) {
                        let groupId = data.groupId;
                        self.groupList.push({
                            groupId,
                            groupName,
                            members: []
                        })
                    }, function (err) {
                        alert(err.errMsg.text);
                    })
                });


            },
            async deleteGroup(data) {
                let groupId = data.payload.groupId;
                if (groupId.toString() === this.defaultGroupId.toString()) {
                    this.$message({message : "默认分组不能删除", type : "warning", duration : "1500"});
                    return;
                }
                try {
                    await this.$confirm('确认删除好友吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    });
                }catch (e) {
                    return ;
                }
                deleteFriendGroup({groupId}).then((data) => {
                    let length = this.groupList.length;
                    let groupList = this.groupList;
                    for (let i = 0; i < length; i++) {
                        if (groupList[i].groupId.toString() === groupId.toString()) {
                            let group = groupList.splice(i, 1)[0];
                            let members = group.members;
                            groupList[0].members.push(...members);
                        }
                    }

                }, function (err) {
                    console.log(err);
                })
            },
            async updateGroup(data) {
                let payload;
                try {
                    payload = await this.$prompt('请输入新分组名', '提示', {confirmButtonText: '确定',
                        cancelButtonText: '取消', inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
                        inputErrorMessage: '分组名不能为空'
                    });
                }catch (e) {
                    return
                }
                let action = payload.action;
                if (action !== "confirm"){
                    return;
                }
                let newGroupName = payload.value;
                let groupId = data.payload.groupId;
                if (!newGroupName) {
                    return
                }
                updateFriendGroupName({
                    groupId,
                    newGroupName
                }).then(() => {
                    let groupList = this.groupList;
                    let index = groupList.findIndex((value) => value.groupId.toString() === groupId.toString());
                    groupList[index].groupName = newGroupName;
                }, function (err) {
                    console.log(err);
                })

            },
            openContextMenu(e) {
                let groupId = e.target.dataset.id;
                let renderList = [{
                    renderText: "新建分组",
                    clickEvent: this.addNewGroup
                }];
                if (groupId) {
                    renderList.push({
                        renderText: "删除分组",
                        clickEvent: this.deleteGroup
                    }, {
                        renderText: "修改分组",
                        clickEvent: this.updateGroup
                    });
                }
                this.bus.$emit("openContextMenu", {
                    x: e.clientX,
                    y: e.clientY,
                    event: e,
                    payload: {
                        groupId
                    },
                    renderList
                });
            },
            __initData(){
                getFriendListByGroup().then( (data) => {
                    this.groupList = data.groupList;
                    this.defaultGroupId = data.defaultGroupId;
                })
            },
            __hasNewFriend(data){
                console.log("friendGroup hasNewFriend",data);
                let friendInfo = data.friendInfo;
                let groupId = data.groupId;
                let group = this.groupList.find(item => {
                    console.log(item.groupId, groupId);
                    return item.groupId.toString() === groupId.toString();
                });
                let index = group.members.findIndex((item) => {
                    return item.uid === friendInfo;
                });
                if (index === -1){
                    group.members.push(friendInfo);
                }
            }

        },
        beforeRouteLeave(to, from, next){
            this.$store.commit('others/changeTitle', "");
            next();
        },
    }
</script>

<style scoped lang="less">
    @import "../assets/style/view/FriendGroupManage.less";
</style>

