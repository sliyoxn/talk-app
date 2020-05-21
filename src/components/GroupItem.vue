<template>
    <div class="groupItem wrapper" @mousedown.right="onMouseDownRight" @click="onClick">
        <img :src="picImg" alt="" class="avatar"/>
        <div class="name">{{text}}</div>
    </div>
</template>

<script>
    export default {
        name: "GroupItem",
        props : {
            picImg : {
                default : "http://121.199.10.4:8088/imsystem/static/msg_img/4d5107b5571019d53fa2a34a0cb4b4d4.png"
            },
            text : {
                default : "白玉子"
            },
            payload : {
                default(){
                    return {}
                }
            }
        },
        methods : {
            onMouseDownRight(event){
                this.$emit("mouseDownRight", {
                    event,
                    payload : this.payload
                });
            },
            onClick(e){
                this.$emit("click",e);
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../assets/style/components/groupItem.less";
</style>