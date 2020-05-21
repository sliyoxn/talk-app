<template>
    <div class="wrapper SettingView">
        <div class="content">
            <input type="file" id="avatar-uploader" @change="handlerUpload" style="display: none" accept="image/*"></input>
            <label for="avatar-uploader">
                <img :src="userInfo.avatar" alt="" class="avatar"/>
            </label>
            <label>
                <span class="key">uid</span>
                <span class="val" :value="userInfo.uid">{{userInfo.uid}}</span>
            </label>
            <label>
                <span class="key">用户名</span>
                <input type="text" class="val" v-model="cacheInfo.username"/>
            </label>
            <label>
                <span class="key">密码</span>
                <span class="val" @click="toChangePassword">**********</span>
            </label>
            <label>
                <span class="key">签名</span>
                <input type="text" class="val" v-model="cacheInfo.signWord"/>
            </label>
            <label>
                <span class="key">邮箱</span>
                <span class="val">{{userInfo.email}}</span>
            </label>
            <button class="logout" @click="logout">退出登录</button>
            <button class="updateInfo" v-show="showUpdateButton" @click="updateInfo">修改信息</button>
        </div>
        <div class="paw-change-box" v-show="showChangePasswordBox">
            <div class="form-box">
                <label>
                    <span class="key">旧密码</span>
                    <input type="password" v-model="oldPassword"/>
                </label>
                <label>
                    <span class="key">新密码</span>
                    <input type="password" v-model="newPassword" @input="checkPassword"/>
                    <span class="err-msg" v-show="errorData[0].show" >{{errorData[0].msg}}</span>
                </label>
                <label>
                    <span class="key">确认密码</span>
                    <input type="password" @input="checkConfirmPassword" v-model="confirmPassword"/>
                    <span class="err-msg" v-show="errorData[1].show">{{errorData[1].msg}}</span>
                </label>
                <label>
                    <button @click="changePassword">确认修改</button>
                </label>
                <i class="close" @click="closePasswordChangeBox"></i>
            </div>
        </div>
    </div>
</template>

<script>
    import {getSelfInfo, updatePassword, updateUserInfo, uploadAvatar} from "../api/user";
    import {logout} from "../api/login";
    import SelectBox from "../components/SelectBox";

    export default {
        name: "setting",
        components: {SelectBox},
        data : function () {
            return {
                userInfo : {},
                cacheInfo : {
                    username : "",
                    signWord : ""
                },
                showChangePasswordBox : false,
                newPassword : "",
                confirmPassword : "",
                oldPassword : "",
                errorData: [{
                    show : false,
                    msg : ""
                },{
                    show : true,
                    msg : ""
                }]
            }
        },
        computed : {
            showUpdateButton(){
                let {cacheInfo,userInfo} = this;
                return cacheInfo.username !== userInfo.username ||
                       cacheInfo.signWord !== userInfo.signWord ;
            }
        },
        mounted(){
            let self = this;
            let uid = localStorage.uid;
            getSelfInfo({uid}).then(function (data) {
                self.userInfo = data.userInfo;
                self.cacheInfo.username = data.userInfo.username;
                self.cacheInfo.signWord = data.userInfo.signWord;
            });
        },
        methods : {
            toChangePassword(){
                this.showChangePasswordBox = true;
            },
            closePasswordChangeBox(){
                this.showChangePasswordBox = false;
            },
            changePassword(){
                let flag = this.checkPassword();
                flag && this.__updatePassword();
            },
            updateInfo(){
                let cacheInfo = this.cacheInfo;
                let username = cacheInfo.username;
                let signWord = cacheInfo.signWord;
                let uid = localStorage.uid;
                console.log(username,signWord);
                updateUserInfo({
                    uid,
                    username,
                    signWord
                }).then(() => {
                    this.userInfo.username = this.cacheInfo.username;
                    this.userInfo.signWord = this.cacheInfo.signWord;
                    this.__showSuccessMessage("更新成功");
                }, (err) => {
                    console.log(err);
                })
            },
            __showConfirm(text){
                return this.$confirm(text, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                });
            },
            async logout() {
                try {
                    await this.__showConfirm("确定退出吗");
                }catch (e) {
                    return ;
                }
                let uid = localStorage.uid;
                logout({uid}).then((res) => {
                    localStorage.removeItem("uid");
                    localStorage.removeItem("token");
                    this.$router.replace({
                        path : '/login'
                    }).then();
                })
            },
            checkPassword(){
                let password = this.newPassword;
                let exp = /[^0-9a-zA-Z]+/;
                if (exp.test(password)){
                    this.errorData[0].show = true;
                    this.errorData[0].msg = "密码只能包含数字字母";
                    return false;
                }
                if (password.length < 6 || password.length > 12){
                    this.errorData[0].show = true;
                    this.errorData[0].msg = "密码需要在6-12位之间";
                    return false;
                }
                this.errorData[0].show = false;
                return true;
            },
            checkConfirmPassword(){
                let password = this.newPassword;
                let confirmPassword = this.confirmPassword;
                if (password !== confirmPassword){
                    this.errorData[1].show = true;
                    this.errorData[1].msg = "前后密码不一致"
                } else {
                    this.errorData[1].show = false;
                }
            },
            handlerUpload(event) {
                let file = event.target.files[0];
                let self = this;
                let formData = new FormData();
                formData.append("avatar", file);
                uploadAvatar(formData).then( (data) => {
                    this.__showSuccessMessage("上传成功");
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (e) {
                        self.userInfo.avatar = this.result;
                        self.$store.commit('others/setAvatar', this.result);
                    };
                }, function (err) {
                    this.$message({message : err.errMsg , type : "error"})
                });
            },
            __showSuccessMessage(message){
                this.$message({
                    showClose: true,
                    message,
                    type: 'success',
                    duration: 3 * 1000
                });
            },
            __updatePassword(){
                let {oldPassword,newPassword} = this;
                updatePassword({oldPassword, newPassword}).then((data) => {
                    this.__showSuccessMessage("修改成功");
                    this.showChangePasswordBox = false;
                    this.oldPassword = "";
                    this.newPassword = "";
                    this.confirmPassword = "";
                    localStorage.token = data.token;
                }, (err) => {
                    this.$message({message : err.errMsg.text, type : "error"})
                })
            }
        }
    }

</script>

<style scoped lang="less">
    @import "../assets/style/view/Setting.less";
</style>