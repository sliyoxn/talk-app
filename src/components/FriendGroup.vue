<template>
    <div :class="[{lastOne : lastOne},{firstOne : firstOne}]" class="friendGroup wrapper" @dragover="onDragOver" @drop="onDrop(group)">
        <div class="title" draggable="false" :data-id="group.groupId" :data-name="group.groupName">{{group.groupName}}</div>
        <div class="friendList">
            <friend-item v-for="(friend) in group.members" :friend-data="friend" :key="friend.friendId"
                         :open-drag="true" @dragstart="onItemDragStart"
                         :group-id="group.groupId" :open-context-menu="true"></friend-item>
        </div>
    </div>
</template>

<script>
    import FriendItem from "./FriendItem";
    export default {
        name: "FriendGroup",
        components: {FriendItem},
        props : {
            openReceiveDrag : {
                type : Boolean,
                default : false
            },
            group : {
                type: Object,
                default(){
                    return {
                        groupName : "老婆",
                        groupId : "1",
                        members : []
                    }
                }
            },
            lastOne : {
                type : Boolean,
                default : false
            },
            firstOne : {
                type : Boolean,
                default : false
            }
        },
        methods : {
            onDragOver(e){
                e.preventDefault();
                this.$emit("dragover",e);
            },
            onDrop(newGroup){
                this.$emit("drop",newGroup);
            },
            onItemDragStart(data){
                this.$emit("itemDragStart",data);
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../assets/style/components/FriendGroup.less";
</style>