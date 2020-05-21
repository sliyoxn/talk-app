<template>

    <div class="selectItem wrapper">
        <div class="avatar-wrapper">
            <img :src="selectItemData.userInfo.avatar" alt="" draggable="false">
        </div>
        <div class="user-name">
            <span>{{selectItemData.userInfo.username}}</span>
        </div>
        <div class="right">
            <button v-if="selectItemData.applicable" class="add-btn" @click="onClickAddFriend">加好友</button>
            <button v-else class="others-btn">{{selectItemData.reason}}</button>
        </div>
    </div>
</template>

<script>
    import {acceptFriendApplication, applyAddFriend} from "../api/user";

    export default {
        name: "searchFriendItem",
        props: {
            selectItemData: {
                type: Object,
                default() {
                    return {
                        applicable: true,
                        reason: "已申请",
                        userInfo: {}
                    }
                }
            }
        },
        methods : {
            onClickAddFriend(){
                let friendId = this.selectItemData.userInfo.uid;
                applyAddFriend({friendId}).then( (res) => {
                    console.log(res);
                    this.selectItemData.applicable = false;
                    this.selectItemData.reason = "已申请";
                }, function (err) {
                    console.log(err);
                })
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../assets/style/components/SearchFriendItem.less";
</style>