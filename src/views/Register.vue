<template>
    <div class="wrapper RegisterPage">
        <div class="content">
            <label>
                <span class="prev">用户名</span>
                <input type="text" @blur="onNameInputBlur" @input="onNameInputBlur" v-model="username"/>
                <span class="hide-msg" v-show="showErrorMsg[0]">
                    <i class="icon err"></i>
                    请输入用户名</span>
            </label>
            <label>
                <span class="prev">密码</span>
                <input type="password" @blur="onPasswordInputBlur" @input="onPasswordInputBlur" v-model="password"/>
                <span class="hide-msg" v-show="showErrorMsg[1]">
                    <i class="icon err"></i>
                    请输入密码</span>
            </label>
            <label>
                <span class="prev">确认密码</span>
                <input type="password" @blur="onConfirmInputBlur" @input="onConfirmInputBlur" v-model="confirmPassword"/>
                <span class="hide-msg" v-show="showErrorMsg[2]">
                    <i class="icon err"></i>
                    两次输入的密码不一致</span>
            </label>
            <label>
                <span class="prev">邮箱</span>
                <input type="text" @blur="onEmailInputBlur" @input="onEmailInputBlur" v-model="email"/>
                <span class="hide-msg" v-show="showErrorMsg[3]">
                    <i class="icon err"></i>
                    请输入正确的邮箱</span>
            </label>
            <label class="code">
                <input type="text" class="code" v-model="emailCode">
                <button class="code" v-show="sendEmailCodeAble" @click="onSendCode">发送验证码</button>
                <button class="code" v-show="!sendEmailCodeAble" style="background-color: #555555; color: #27292c; border: none">重新发送:{{sec}}</button>
            </label>
            <button class="register" @click="onResister">注册</button>
            <router-link tag="button" to="/login" class="login">已有账号？登录</router-link>

        </div>


    </div>


</template>

<script>
    import {resister, sendEmailCode} from "../api/register";
    import {hasEmptyStr} from '../util/variableUtil';
    export default {
        name: "register",
        data : function () {
            return {
                showErrorMsg : [false,false,false,false],
                username : "",
                password : "",
                confirmPassword : "",
                email : "",
                emailCode : "",
                sec : 60,
                sendEmailCodeAble : true
            }
        },
        methods : {
            onNameInputBlur(){
                let username = this.username;
                if (username === ''){
                    this.showErrorMsg.splice(0,1,true);
                } else {
                    this.showErrorMsg.splice(0,1,false);
                }
            },
            onPasswordInputBlur(){
                let password = this.password;
                if (password === ''){
                    this.showErrorMsg.splice(1,1,true);
                } else {
                    this.showErrorMsg.splice(1,1,false);
                }
                this.onConfirmInputBlur();
            },
            onConfirmInputBlur(){
                let password = this.password;
                let confirmPassword =  this.confirmPassword;
                if (password !== confirmPassword){
                    this.showErrorMsg.splice(2,1,true);
                } else {
                    this.showErrorMsg.splice(2,1,false);
                }
            },
            onEmailInputBlur(){
                let exp = /[0-9A-Za-z_$]+@[0-9A-Za-z_$]+\.com/g;
                let flag = exp.exec(this.email);
                if (!flag){
                    this.showErrorMsg.splice(3 ,1,true);
                } else {
                    this.showErrorMsg.splice(3,1,false);
                }
            },
            onResister(){
                let {username,password,email,confirmPassword, emailCode} = this;
                let flag = this.__checkForm(username,password,email,confirmPassword, emailCode);
                if (!flag){
                    return;
                }
                resister({username, password, email, emailCode}).then((res) => {
                    let data = res.data;
                    let status = data.status;
                    if (!status){
                        this.$message({message : data.errMsg.text, type : "error"})
                    } else {
                        this.$message({message : "注册成功, 即将跳转到登录页面", type : "success", duration : 1000});
                        setTimeout(() => {
                            this.$router.replace({
                                path : "/login"
                            }).then();
                        }, 1000)
                    }
                })
            },


            onSendCode(){
                let email = this.email;
                let code = this.emailCode;
                if (email === ''){
                    this.$message({message : "请先填写邮箱", type : "error"});
                    return;
                }
                let exp = /[0-9A-Za-z_$]+@[0-9A-Za-z_$]+\.com/g;
                if (!exp.test(email)){
                    this.$message({message : "邮箱格式错误", type : "error"});
                    return;
                }
                this.sendEmailCodeAble = false;
                let self = this;
                let timer = setInterval(function () {
                    if (self.sec > 1){
                        self.sec --;
                    } else {
                        clearInterval(timer);
                        self.sendEmailCodeAble = true;
                        self.sec = 60;
                    }
                },1000);
                sendEmailCode({
                    email,
                    type : 1
                }).then((res) => {
                    let data = res.data;
                    if (!data.status){
                        this.$message({message : data.errMsg.text, type : "error"});
                        this.sendEmailCodeAble = true;
                        this.sec = 60;
                    }
                })



            },

            __checkForm(username,password,email,confirmPassword, emailCode){
                let flag = hasEmptyStr(username,password,email,confirmPassword, emailCode);
                if (flag){
                    this.$message({message : "请填写所有字段", type : "error"});
                    return false;
                }
                if (confirmPassword !== password){
                    this.$message({message : "请确认两次输入的密码一致", type : "error"});
                    return false;
                }
                let exp = /[^0-9a-zA-Z]+/;
                if (exp.test(password)){
                    this.$message({message : "密码只能包含字母和数字", type : "error"});
                    return false;
                }
                if (password.length < 6 || password.length > 12){
                    this.$message({message : "密码要在6 - 12位之间", type : "error"});
                    return false;
                }
                if (username.length < 1 && username.length > 11){
                    this.$message({message : "用户名要在0 - 12位之间", type : "error"});
                    return false;
                }
                exp = /[0-9A-Za-z_$]+@[0-9A-Za-z_$]+\.com/g;
                if (!exp.test(email)){
                    this.$message({message : "邮箱格式错误", type : "error"});
                    return false;
                }

                return true;
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

<style scoped lang="less" src="../assets/style/view/register.less">

</style>