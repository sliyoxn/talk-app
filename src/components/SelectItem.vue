<template>
    <div class="selectItem wrapper" @click="onClickSelectItem">
        <div class="left">
            <img :src="imgUrl" alt="" class="pic"/>
            <span class="name">{{text}}</span>
        </div>
        <div class="right">
            <i class="selected el-icon-check" v-show="showType === 1"></i>
            <i class="unselected" v-show="showType === 2"></i>
            <i class="delete el-icon-close" v-show="showType === 3" @click="onClickCloseButton"></i>
            <span class="cantInviteReason" v-show="showType === 4">{{reason}}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "selectItem",
        data () {
            return {

            }
        },
        props : {
            payload : {
                default(){
                    return {}
                }
            },
            imgUrl : {
                default: "http://121.199.10.4:8088/imsystem/static/msg_img/4d5107b5571019d53fa2a34a0cb4b4d4.png",
            },
            text : {
                default : "白玉子"
            },
            showType : {
                default : 2
            },
            reason :{
                default : "未知原因"
            },
            mark : {}
        },

        methods : {
            onClickSelectItem(){
                let showType = this.showType;
                let data = {
                    payload : this.payload,
                    mark : this.mark
                };
                switch (showType) {
                    case 1:
                        this.$emit("cancelSelectItem",data);
                        break;
                    case 2:
                        this.$emit("selectItem", data);
                        break;
                }
            },
            onClickCloseButton(){
                let data = {
                    payload : this.payload,
                    mark : this.mark
                };
                this.$emit("cancelSelectItem", data);
            }

        }
    }
</script>

<style scoped lang="less">
    @import "../assets/style/components/SelectItem.less";
</style>