<template>
    <div class="wrapper">
        <div class="avatar-wrapper">
            <img :src="applicationData.applicantInfo.avatar" alt="" draggable="false">
        </div>
        <div class="main-content">
            <span class="talk-name">{{applicationData.applicantInfo.username}}</span>
            <span class="last-message">{{applicationData.applicationReason}}</span>
        </div>
        <div class="right-content">
            <button v-if="!applicationData.hasAccept" @click="acceptApplication">同意</button>
            <span v-else>已同意</span>
        </div>
    </div>
</template>

<script>
    import {acceptFriendApplication} from "../api/user";

    export default {
        name: "newFriendItem",
        props : {
            applicationData : {
                type : Object,
                default(){
                    return {
                        applicantInfo : {},
                        applicationReason: "",
                        hasAccept: true
                    }
                }
            }
        },
        methods : {
            acceptApplication() {
                let friendId = this.applicationData.applicantInfo.uid;
                let uid = localStorage.uid;
                let self = this;
                acceptFriendApplication({uid, friendId}).then(function (data) {
                    self.applicationData.hasAccept = true;
                    self.$emit("refreshFriendList");
                }, function (err) {
                    console.log(err);
                });
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../assets/style/components/applicationItem.less";
</style>