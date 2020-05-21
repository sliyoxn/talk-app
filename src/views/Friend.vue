<template>
    <div class="wrapper FriendView">
        <div class="list-wrapper">
            <router-link :to="{name : 'newFriend'}" tag="div">
                <friendItem :friend-data="newFriendItem" :show-red-point="hasUnreadApplication"></friendItem>
            </router-link>
            <router-link :to="{name : 'FriendGroupManage'}" tag="div">
                <friendItem :friend-data="friendGroupItem"></friendItem>
            </router-link>
            <router-link :to="{name : 'MyGroup'}" tag="div">
                <friendItem :friend-data="myGroupItem"></friendItem>
            </router-link>
            <ul class="friend-list">
                <router-link v-for="(item, index) in friendList" :key="item.uid"
                             tag="li" class="talk-item-li"
                             :to="{ name : 'FriendMessage', params : { friendId : item.uid }}"
                             v-show="fitterPassList[index]"
                >
                    <friend-item :friend-data="item" :open-context-menu="true"></friend-item>
                </router-link>

            </ul>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
    import friendItem from "../components/FriendItem";
    import {getFriendInfo, getFriendList} from "../api/user";
    import funcUtil from "../util/FuncUtil";
    import {indexCallbackController} from "../api/indexWS";
    export default {
        name: "friend",
        components : {
            friendItem
        },
        data(){
            return {
                friendInfo : {},
                uid : "",
                friendList : [],
                newFriendItem : {
                    username : "新的朋友",
                    avatar : "https://i.postimg.cc/9f56GxX7/new-Friend.png",
                    friendId : "-1",
                },
                friendGroupItem : {
                    username : "分组管理",
                    avatar : "https://i.postimg.cc/8CRqwhsn/friend-Group.png",
                    friendId : "-2",
                },
                myGroupItem : {
                    username : "我的群组",
                    avatar : "https://i.postimg.cc/YSCjV8bH/1.png",
                    friendId : "-3",
                },
                hasInitFriendList : false,
                fitterPassList : [],
                isActivated : false,
                lastFitterWord : "",
            }
        },

        methods : {
            __initFriendList(){
                let uid = localStorage.uid;
                if (this.hasInitFriendList){ return }
                getFriendList({
                    uid
                }).then((data) => {
                    console.log(data);
                    this.friendList = data.friendList;
                })
            },
            openContextMenu(e){
                console.log(e);
            },
            __onFriendDelete(data){
                let uid = data.uid.toString();
                let friendList = this.friendList;
                let index = friendList.findIndex(value => {
                    return value.uid === uid;
                });
                index !== -1 && friendList.splice(index, 1);
                let routerFriendId = this.$route.params.friendId;
                if (uid === routerFriendId){
                    this.$router.replace({
                        name : "friend"
                    }).then();
                }
            },
            __fitterItem : funcUtil.debounce(function(keyword){
                this.lastFitterWord = keyword;
                let friendList = this.friendList;
                let fitterPassList = this.fitterPassList;
                for (let i = 0, length = friendList.length; i < length; i++) {
                    let friend = friendList[i];
                    fitterPassList.splice(i, 1, friend.username.includes(keyword) || friend.uid.includes(keyword));
                }
            }, 200),
            __hasNewFriend(data){
                console.log("friend 有新的好友");
                let friendInfo = data.friendInfo;
                let friend = this.friendList.find((item) => {
                    return item.uid === friendInfo.uid;
                });
                !friend && (this.friendList.unshift(friendInfo));
            },
        },

        mounted() {
            this.__initFriendList();
            this.bus.$on("onFriendDelete", this.__onFriendDelete);
            indexCallbackController.on("hasNewFriend", this.__hasNewFriend);
            this.$store.commit('others/setMenuIconShowAble', false);
        },
        beforeDestroy(){
            indexCallbackController.off("hasNewFriend", this.__hasNewFriend);
        },
        computed : {
            globalFitterWord(){
                return this.$store.state.others.fitterKeyword;
            },
            hasUnreadApplication() {
                return this.$store.state.others.hasUnreadApplication;
            }
        },
        watch : {
            friendList(list){
                this.fitterPassList = new Array(list.length);
                this.fitterPassList.fill(true, 0, list.length);
                this.__fitterItem(this.lastFitterWord);
            },
            globalFitterWord(val){
                this.isActivated && this.__fitterItem(val);
            }
        },
        beforeRouteEnter(to, from, next){
            next(function (self) {
                let historyPath = self.$store.state.history.friend;
                let curPath = self.$route.path;
                if (historyPath && historyPath !== curPath && self.$route.name === "friend"){
                    console.log("检测到friend history", "重定向到:", historyPath);
                    self.$router.replace({
                        path : historyPath
                    }).then();
                }
            })
        },
        beforeRouteLeave(to, from, next){
            console.log("离开friend");
            let path = from.path;
            this.$store.commit('others/changeTitle', "");
            this.$store.commit('history/setFriend', path);
            next();
        },
        activated() {
            this.isActivated = true;
            this.$store.commit('others/setFitterKeyword', this.lastFitterWord);
        },
        deactivated() {
            this.isActivated = false;
        }
    }
</script>

<style scoped lang="less">
    @import "../assets/style/view/Friend";
</style>