import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    strict : true,
    modules : {
        userInfo : {
            namespaced : true,
            state : {

            },
            mutations : {
                saveInfo(state, payload){
                    state.avator = payload.avatar;
                    state.email = payload.email;
                    state.password = payload.password;
                    state.signWord = payload.signWord;
                    state.uid = payload.uid;
                    state.userName = payload.userName;
                }
            },
        },
        others : {
            namespaced : true,
            state : {
                title : "",
                showMenuIcon : false,
                fitterKeyword : "",
                hasUnreadApplication : false,
                avatar : ""
            },
            mutations : {
                changeTitle(state, payload){
                    state.title = payload;
                },
                setMenuIconShowAble(state, payload){
                    state.showMenuIcon = payload;
                },
                setFitterKeyword(state, payload){
                    state.fitterKeyword = payload;
                },
                setHasUnreadApplication(state, payload){
                    state.hasUnreadApplication = payload;
                    localStorage.hasUnreadApplication = payload;
                },
                setAvatar(state, payload){
                    state.avatar = payload;
                }
            },
        },
        history : {
            namespaced : true,
            state : {
                talk : "",
                friend : "",
            },
            mutations : {
                setTalk(state, payload){
                    state.talk = payload;
                },
                setFriend(state, payload){
                    state.friend = payload;
                }
            },
        }
    },
    state: {

    },
    mutations: {},
    actions: {}
})
