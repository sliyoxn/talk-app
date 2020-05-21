<template>
    <div class="wrapper TalkView">
        <div class="list-wrapper">
            <ul class="talk-list">
                <router-link v-for="(item, index) in fitterPassList" tag="li" class="talk-item-li" :data-id="item.talkId" :key="item.key"
                              :to="{ name : 'talkBox', params : { talkId : item.talkId }}"
                              >
                    <talkItem :talk-data="item" @mousedownRight="openContextMenu"></talkItem>
                </router-link>
            </ul>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
    import talkItem from "../components/TalkItem";
    import messageItem from "../components/MessageItem";
    import {getTalkList} from "../api/user";
    import {deleteTalk, makeTalkHasRead} from "../api/talk";
    import {indexCallbackController, sendMessage} from "../api/indexWS";
    import funUtil from "../util/FuncUtil";
    let talkIdSet = new Set();
    export default {
        name: "talk",
        data: function () {
            return {
                text: "",
                messageList: [],
                talkList: [],
                hasInitTalkItemList: false,
                userInfo: {},
                allPageSize : 1,
                nextLoadPageIndex : 1,
                lock : false,
                fitterPassList : [],
                isActivated : false,
                lastFitterWord : "",
                waitAddList : []
            }
        },
        components: {
            talkItem,
            messageItem
        },
        methods: {
            __refreshTalkItemList() {
                let self = this;
                getTalkList().then((data) => {
                    this.talkList = data.talkList;
                    this.talkList.unshift(...this.waitAddList);
                    this.waitAddList.length = 0;
                });
            },
            __initTalkItemList() {
                if (this.hasInitTalkItemList) {
                    return;
                }
                this.__refreshTalkItemList();
            },
            __deleteTalk(data){
                let talkId = data.payload.talkId;
                this.__removeTalk(talkId);
            },
            __removeTalk(talkId){
                deleteTalk({talkId}).then(() => {
                    let talkList = this.talkList;
                    let curTalkBoxTalkId = this.$route.params.talkId;
                    console.log(curTalkBoxTalkId, talkId);
                    if (curTalkBoxTalkId === talkId){
                        this.$store.commit('others/changeTitle', "");
                        this.$router.replace({
                            name : "talk"
                        }).then();
                    }
                    for (let i = 0; i < talkList.length; i++) {
                        if (talkList[i].talkId === talkId){
                            talkList.splice(i, 1);
                            break;
                        }
                    }
                })
            },
            openContextMenu(data){
                let talkId = data.talkId;
                if (!talkId){
                    console.log("没有talkId");
                    return
                }
                this.bus.$emit("openContextMenu", {
                    event,
                    renderList : [{
                        renderText : "删除聊天",
                        clickEvent : this.__deleteTalk
                    }],
                    payload : {
                        talkId
                    }
                })
            },
            onReceiveMessage(data){
                console.log("talk接收消息",data);
                let {isNewTalk,messageData,talkData, talkId} = data;
                let flag = this.$route.params.talkId === talkId;
                // 后台还没做好, 兼容一下
                talkId =  talkId || data.talkData.talkId;
                if (isNewTalk){
                    this.talkList.unshift(talkData);
                } else {
                    let talkList = this.talkList;
                    for (let i = 0; i < talkList.length; i++) {
                        if (talkList[i].talkId === talkId){
                            talkList[i].lastMessage = talkData.lastMessage;
                            talkList[i].newMessageCount = flag ? 0 : talkData.newMessageCount;
                            talkList[i].lastMessageTime = talkData.lastMessageTime;
                            makeTalkHasRead({talkId}).then();
                        }
                    }
                }
                this.setTalkTop(talkId);
            },
            __updateTalkItem(data){
                let {talkId,lastMessage,lastMessageTime} = data;
                let talkList = this.talkList;
                for (let i = 0; i < talkList.length; i++) {
                    if (talkList[i].talkId === talkId){
                        talkList[i].lastMessage = lastMessage;
                        talkList[i].lastMessageTime = lastMessageTime;
                    }
                }
            },
            __updateGroupName(data) {
                let {gid, groupName} = data;
                let talk = this.talkList.find(item => {
                    return item.gid.toString() === gid;
                });
                talk.talkTitle = groupName;

            },
            setTalkTop(talkId){
                if (!talkId) return;
                let talkList = this.talkList;
                for (let i = 0, length = talkList.length; i < length; i++) {
                    if (talkList[i].talkId === talkId){
                        talkList.unshift(...(talkList.splice(i, 1)));
                        break
                    }
                }
            },
            fitterTalkItem : funUtil.debounce(function(keyword){
                this.lastFitterWord = keyword;
                this.fitterPassList = this.talkList.filter((value) => {
                    return value.talkId.includes(keyword) || value.talkTitle.includes(keyword);
                });
            }, 200),
            __addToTalkList(data){
                if(!talkIdSet.has(data.talkId)){
                    this.waitAddList.push(data);
                }
            }
        },
        computed : {
            loadMoreAble(){
                return this.allPageSize >= this.nextLoadPageIndex;
            },
            globalFitterWord(){
                return this.$store.state.others.fitterKeyword;
            }
        },
        watch : {
            talkList : {
                handler(){
                    this.fitterTalkItem(this.lastFitterWord);
                    talkIdSet.clear();
                    talkIdSet.add(...this.talkList.map(value => value.talkId));
                },
                immediate : true,

            },
            globalFitterWord (keyword){
                this.isActivated && this.lastFitterWord !== keyword && this.fitterTalkItem(keyword);
            }
        },
        mounted() {
            this.__initTalkItemList();
            indexCallbackController.on("receiveMessage", this.onReceiveMessage);
            this.bus.$on("updateTalkItem", (data) => {
                this.__updateTalkItem(data);
            });
            this.bus.$on("refreshTalkList", () => {
                this.__refreshTalkItemList();
            });
            this.bus.$on("setTalkTop", (talkId) => {
                console.log("yyy");
                this.setTalkTop(talkId);
            });
            this.bus.$on("removeTalk", (talkId) => {
                this.__removeTalk(talkId);
            });
            this.bus.$on("groupNameChange", (data) => {
                this.__updateGroupName(data);
            });
            this.bus.$on("addTalk", this.__addToTalkList);
        },
        beforeDestroy(){
            indexCallbackController.off("receiveMessage", this.onReceiveMessage);
        },
        destroyed(){
            console.log("talk销毁");
        },
        beforeRouteUpdate(to, from, next) {
            next();
        },
        beforeRouteEnter(to, from, next) {
            next(function (self) {
                let historyPath = self.$store.state.history.talk;
                let curPath = self.$route.path;
                if (historyPath && historyPath !== curPath && self.$route.name === "talk"){
                    console.log("检测到talk history, 重定向到:", historyPath);
                    self.$router.replace({
                        path : historyPath
                    }).then();
                }
            });
        },
        beforeRouteLeave(to, from, next) {
            console.log("离开talk");
            let path = from.path;
            this.$store.commit('others/changeTitle', "");
            this.$store.commit('history/setTalk', path);
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
    @import "../assets/style/view/Talk.less";
</style>