<template>
    <div class="wrapper IndexPage">
        <div class="left-nav">
            <div class="head">
                <router-link :to="{name : 'setting'}" tag="img" :src="avatar" alt="" class="avatar" draggable="false"/>
            </div>
            <div class="content">
                <ul>
                    <router-link tag="li" :to="{name : 'talk'}" class="item"><i class="icon talk"></i></router-link>
                    <router-link tag="li" :to="{name : 'friend'}" class="item" :class="{unread : hasUnreadApplication}"><i class="icon friend"></i></router-link>
                    <router-link tag="li" :to="{name : 'setting'}" class="item"><i class="icon setting"></i></router-link>
                </ul>
            </div>
        </div>
        <div class="main-content">
            <div class="header">
                <div class="search">
                    <label>
                        <input type="text" placeholder="搜索" class="search-input" v-model="fitterWord" />
                    </label>
                    <label>
                        <img src="https://i.postimg.cc/cCnBR2cm/image.png" alt="" class="add-pic" @click="toShowSearchList">
                    </label>
                    <div class="search-friend-box mask" :class="{hide : hideSelectList}" @click="toHideSearchList" @keydown.esc="toHideSearchList">
                        <div class="content" @click="stopBubble">
                            <label>
                                <span class="key">用户名 / uid : </span>
                                <input type="text" class="search" v-model="keyWord" @keydown.enter="search"/>
                            </label>
                            <div class="select-list">
                                <select-item :selectItemData="item" v-for="(item) in searchDataList" :key="item.userInfo.uid"></select-item>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="title-box">
                    <span class="title">{{title}}</span>
                    <i class="menu" @click="onClickMenu" v-show="showMenuIcon"></i>
                </div>
            </div>
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </div>
        <context-menu></context-menu>
    </div>
</template>

<script>
    import FriendItem from "../components/FriendItem";
    import SelectItem from "../components/SearchFriendItem";
    import contextMenu from "../components/contextMenu";
    import cookieUtil from "../util/cookieUtil";
    import {getFriendGroup, getSelfInfo, searchUser} from "../api/user";
    import SetFriendGroupBox from "../components/setFriendGroupBox";
    import {indexCallbackController} from "../api/indexWS";
    export default {
        name: "index",
        components : {
            SetFriendGroupBox,
            contextMenu,
            SelectItem,
            FriendItem,
        },
        async mounted() {
            indexCallbackController.on("receiveNewApplication", this.__receiveNewApplication);
            let hasUnreadApplication = localStorage.hasUnreadApplication;
            if (hasUnreadApplication) {
                this.$store.commit('others/setHasUnreadApplication', JSON.parse(localStorage.hasUnreadApplication));
            }
            let data = await getSelfInfo();
            this.$store.commit('others/setAvatar', data.userInfo.avatar);
        },
        beforeDestroy(){
            indexCallbackController.off("receiveNewApplication", this.__receiveNewApplication);
        },
        data() {
            return {
                uid : "",
                activeItemIndex : 0,
                keyWord : "",
                hideSelectList : true,
                searchDataList : [],
                groupList : [],
                friendInfoForUpdate : {},
            }
        },
        computed : {
            title() {
                return this.$store.state.others.title
            },
            showMenuIcon(){
                return this.$store.state.others.showMenuIcon;
            },
            fitterWord : {
                get() {
                    return this.$store.state.others.fitterKeyword;
                },
                set(val) {
                    this.$store.commit('others/setFitterKeyword', val);
                }
            },
            hasUnreadApplication() {
                return this.$store.state.others.hasUnreadApplication;
            },
            avatar(){
                return this.$store.state.others.avatar
            },
        },
        methods : {
            search() {
                this.toShowSearchList();
                let keyWord = this.keyWord;
                if (!keyWord) {
                    return
                }
                let uid = localStorage.uid;
                let self = this;
                searchUser({uid, keyWord}).then(function (data) {
                    self.searchDataList = data.selectList;
                })
            },
            toHideSearchList(){
                this.hideSelectList = true;
            },
            toShowSearchList(){
                this.hideSelectList = false;
            },
            stopBubble(event){
                if (event.stopPropagation) {
                    event.stopPropagation();
                } else {
                    event.cancelBubble = true;
                }
            },
            onClickMenu(){
                this.bus.$emit("clickMenu");
            },
            __receiveNewApplication(data){
                let name = this.$route.name;
                if (name === "newFriend") return;
                this.$store.commit('others/setHasUnreadApplication', true);
            }
        },

    }
</script>

<style scoped lang="less">
    @import "../assets/style/view/index.less";
    @import "../assets/style/others/reset.less";
</style>