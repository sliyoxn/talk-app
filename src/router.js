import Vue from 'vue'
import Router from 'vue-router'
import {verifyLocalStorageData} from "./api/user";

Vue.use(Router);

export default new Router({

    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            redirect(to) {
                let token = localStorage.token;
                return token ? "/index/talk" : "/login";
            }
        },
        {
            path: "/login",
            name: "login",
            component: () => import('./views/Login'),
        },
        {
            path: "/register",
            name: "register",
            component: () => import('./views/Register'),
        },
        {
            path: "/index",
            name: "index",
            component: () => import("./views/Index"),
            redirect: "/index/talk",
            beforeEnter(to, from, next) {
                let uid = localStorage.uid;
                verifyLocalStorageData().then(function (res) {
                    console.log(res);
                }, function (err) {

                });
                if (uid) {
                    next();
                } else {
                    next("./login");
                }
            },
            children:
                [
                    {
                        path: "talk",
                        name: "talk",
                        component: () => import("./views/Talk"),
                        children: [{
                            path: ":talkId",
                            name: "talkBox",
                            component: () => import("./views/TalkBox"),
                        }]
                    },
                    {
                        path: "friend",
                        name: "friend",
                        component: () => import("./views/Friend"),
                        children: [{
                            path: "newFriend",
                            name: "newFriend",
                            component: () => import("./views/NewFriend")
                        }, {
                            path: "FriendGroupManage",
                            name: "FriendGroupManage",
                            component: () => import("./views/FriendGroupManage")
                        }, {
                            path: "FriendMessage/:friendId",
                            name: "FriendMessage",
                            component: () => import("./views/FriendMessage")
                        }, {
                            path : "MyGroup",
                            name : "MyGroup",
                            component: () => import("./views/MyGroup")
                        }]
                    },
                    {
                        path: "setting",
                        name: "setting",
                        component: () => import("./views/Setting")
                    }
                ]
        },
        {
            path: '/NotFound',
            name : "NotFound",
            component: () => import('./views/NotFound')
        },
        {

            path: '/resetPassword',
            name : "/resetPassword",
            component: () => import('./views/ResetPassword')
        },
        {
            path : '*',
            redirect(to){
                return '/NotFound';
            }
        }
    ]
})
