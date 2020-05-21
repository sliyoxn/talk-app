<template>
    <div class="groupMemberItem wrapper" @click="onClick">
        <img :src="imgSrc" alt="" class="avatar"/>
        <div class="name">{{text}}</div>
    </div>
</template>

<script>
    export default {
        name: "groupMemberItem",
        props : {
            imgSrc : {
                default : "http://121.199.10.4:8088/imsystem/static/msg_img/4d5107b5571019d53fa2a34a0cb4b4d4.png"
            },
            text :  {
                default : "默认文本"
            }
        },
        methods : {
            onClick(){
                this.$emit("click");
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../assets/style/components/GroupMemberItem.less";
</style>