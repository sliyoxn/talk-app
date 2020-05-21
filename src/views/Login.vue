<template>
    <div class="wrapper LoginPage">
        <div class="content">
            <div class="body">
                <label>
                    <span>账号</span>
                    <input type="text" v-model="uid" @keydown.enter="doLogin" placeholder="邮箱 / uid"/>
                </label>
                <label>
                    <span>密码</span>
                    <input type="password" v-model="password" @keydown.enter="doLogin"/>
                </label>
                <label>
                    <button class="login" @click="doLogin">登录</button>
                </label>
                <label>
                    <router-link tag="button" to="/register" class="register">没有账号? 注册</router-link>
                </label>
                <label>
                    <router-link tag="button" to="/resetPassword" class="resetPassword">忘记密码?</router-link>
                </label>
            </div>
            <div class="footer"></div>
        </div>


    </div>



</template>

<script>
    import {login} from '../api/login';
    import {hasEmptyStr} from '../util/variableUtil';

    export default {
        name: "login",
        data : function () {
            return {

                uid : "",
                password : "",
                labelPosition: 'right',
                formLabelAlign: {
                    name: '',
                    region: '',
                    type: ''
                },
                bgData : ""
            }
        },
        methods : {
            doLogin()
            {
                let {uid, password} = this;
                let flag = hasEmptyStr(uid,password);
                if (flag){
                    this.$message({message : "请填写全部字段", type : "waring"});
                    return;
                }
                login({uid, password}).then((res) =>
                {
                    console.log(res);
                    let data = res.data;
                    if (data.status === 0){
                        this.$message({message : "登录失败:" + data.errMsg.text, type : "error"});
                        return
                    }
                    localStorage.uid = data.data.uid;
                    localStorage.token = data.data.token;
                    this.$router.replace({
                        name : 'talk',
                    }).then();
                });
            }



        },
        mounted() {
            window.addEventListener("devtoolschange", window.devtoolsChangeCallback);
        },
        beforeDestroy() {
            window.removeEventListener("devtoolschange", window.devtoolsChangeCallback);
        }


    }

</script>




<style lang="less" src="../assets/style/view/login.less" scoped>




</style>