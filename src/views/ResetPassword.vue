<template>
    <div class="ResetPassword wrapper">
        <div class="content">
            <label>
                <span class="prev">新的密码</span>
                <input type="password" @blur="onPasswordInputBlur" @input="onPasswordInputBlur" v-model="password"/>
                <span class="hide-msg" v-show="showErrorMsg[0]">
                    <i class="icon err"></i>
                    请输入密码</span>
            </label>
            <label>
                <span class="prev">确认密码</span>
                <input type="password" @blur="onConfirmInputBlur" @input="onConfirmInputBlur" v-model="confirmPassword"/>
                <span class="hide-msg" v-show="showErrorMsg[1]">
                    <i class="icon err"></i>
                    两次输入的密码不一致</span>
            </label>
            <label>
                <span class="prev">邮箱</span>
                <input type="text" @blur="onEmailInputBlur" @input="onEmailInputBlur" v-model="email"/>
                <span class="hide-msg" v-show="showErrorMsg[2]">
                    <i class="icon err"></i>
                    请输入正确的邮箱</span>
            </label>
            <label class="code">
                <input type="text" class="code" v-model="emailCode">
                <button class="code" v-show="sendEmailCodeAble" @click="onSendCode">发送验证码</button>
                <button class="code" v-show="!sendEmailCodeAble" style="background-color: #555555; color: #27292c; border: none">重新发送:{{sec}}</button>
            </label>
            <button class="register" @click="resetPassword">重置密码</button>
        </div>
    </div>
</template>

<script>
    import {hasEmptyStr} from "../util/variableUtil";
    import {resetPassword, sendEmailCode} from "../api/register";

    export default {
        name: "ResetPassword",
        data : function () {
            return {
                showErrorMsg : [false,false,false],
                password : "",
                confirmPassword : "",
                email : "",
                emailCode : "",
                sec : 60,
                sendEmailCodeAble : true
            }
        },
        methods : {
            onPasswordInputBlur(){
                let password = this.password;
                if (password === ''){
                    this.showErrorMsg.splice(0,1,true);
                } else {
                    this.showErrorMsg.splice(0,1,false);
                }
                this.onConfirmInputBlur();
            },
            onConfirmInputBlur(){
                let password = this.password;
                let confirmPassword =  this.confirmPassword;
                if (password !== confirmPassword){
                    this.showErrorMsg.splice(1,1,true);
                } else {
                    this.showErrorMsg.splice(1,1,false);
                }
            },
            onEmailInputBlur(){
                let exp = /[0-9A-Za-z_$]+@[0-9A-Za-z_$]+\.com/g;
                let flag = exp.exec(this.email);
                if (!flag){
                    this.showErrorMsg.splice(2 ,1,true);
                } else {
                    this.showErrorMsg.splice(2 ,1,false);
                }
            },


            onSendCode(){
                let email = this.email;
                if (email === ''){
                    alert("请先填写邮箱");
                    return;
                }
                let exp = /[0-9A-Za-z_$]+@[0-9A-Za-z_$]+\.com/g;
                if (!exp.test(email)){
                    alert("邮箱格式错误");
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
                    type : 2
                }).then((res) => {
                    console.log(res);
                    let msg = res.data.errMsg;
                    let status = res.data.status;
                    status && this.$message({message : "发送成功", type : "success"});
                    !status && (this.$message({message : msg.text, type : "error"}), this.sendEmailCodeAble = true, this.sec = 0);
                })
            },

            __checkForm(password,email,confirmPassword, emailCode) {
                let flag = hasEmptyStr(password,email,confirmPassword, emailCode);
                if (flag){
                    alert("请填写所有字段");
                    return false;
                }
                if (confirmPassword !== password){
                    alert("请确认密码");
                    return false;
                }
                let exp = /[^0-9a-zA-Z]+/;
                if (exp.test(password)){
                    alert("密码只能包含字母数字");
                    return false;
                }
                if (password.length < 6 || password.length > 12){
                    alert("密码需要在6-12位之间");
                    return false;
                }
                exp = /[0-9A-Za-z_$]+@[0-9A-Za-z_$]+\.com/g;
                if (!exp.test(email)){
                    alert("邮箱格式错误");
                    return false;
                }
                return true;
            },

            resetPassword(){
                let {password, email, confirmPassword, emailCode} = this;
                let newPassword = password;
                let flag = this.__checkForm(password, email, confirmPassword, emailCode);
                flag && resetPassword({
                    newPassword,
                    email,
                    emailCode
                }).then((res) => {
                    let data = res.data;
                    let status = data.status;
                    if (status){
                        localStorage.removeItem("token");
                        this.$message({
                            message : "密码修改成功, 即将跳转....",
                            duration : "1000"
                        });
                        setTimeout(() => {
                            this.$router.replace({
                                name : "login"
                            }).then()
                        }, 1000);
                    } else {
                        this.$message({
                            message : "密码修改失败:" + data.errMsg.text,
                            duration : "3000",
                            type : "error"
                        });
                    }
                });
            }
        },
        // mounted() {
        //     window.addEventListener("devtoolschange", window.devtoolsChangeCallback);
        // },
        // beforeDestroy() {
        //     window.removeEventListener("devtoolschange", window.devtoolsChangeCallback);
        // }
    }
</script>


<style scoped lang="less" src="../assets/style/view/ResetPassword.less">

</style>