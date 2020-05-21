<template>
    <div class="NewFriendPage wrapper">
        <applicationItem v-for="(item) in applicationList"
                         :key="item.applicantInfo.uid"
                         :applicationData="item">
        </applicationItem>
    </div>
</template>

<script>
    import applicationItem from "../components/applicationItem";
    import {getFriendApplication} from "../api/user";
    import {indexCallbackController} from "../api/indexWS";

    export default {
        name: "NewFriend",
        components : {
            applicationItem
        },
        data(){
            return {
                applicationList : []
            }
        },
        beforeRouteEnter(to,from, next){
            next(function (vm) {
                vm.$store.commit('others/changeTitle', "新的朋友");
                vm.$store.commit('others/setHasUnreadApplication', false);
            })
        },
        mounted() {
            let uid = localStorage.uid;
            getFriendApplication({uid}).then((data) => {
                this.applicationList = data.applicationList;
            },(err) => {
                this.$message({message : "获取列表失败", type : "error"});
            });
            indexCallbackController.on("receiveNewApplication", this.__receiveNewApplication);
        },
        beforeDestroy(){
            indexCallbackController.off("receiveNewApplication", this.__receiveNewApplication);
        },
        beforeRouteLeave(to, from, next){
            this.$store.commit('others/changeTitle', "");
            next();
        },
        methods : {
            __receiveNewApplication(list) {
                console.log("newFriend 收到新好友申请",list);
                for (let data of list){
                    let uid = data.applicantInfo.uid;
                    let applicationList = this.applicationList;
                    let index = applicationList.findIndex(application => {
                        return application.applicantInfo.uid === uid;
                    });
                    index !== -1 && applicationList.splice(index, 1);
                    applicationList.unshift(data);
                }
            }
        }
    };

</script>

<style scoped lang="less">
    .NewFriendPage.wrapper
    {
        width: 100%;
        height: 100%;
        overflow: auto;
    }
</style>