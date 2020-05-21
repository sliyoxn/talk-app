<template>
    <div class="setFriendGroup wrapper mask">

        <div class="container">
            <div class="header">
                <div class="title">移动至</div>
                <i class="close">×</i>
            </div>
            <ul style="margin: 0; padding: 0">
                <li class="item" v-for="(item) in groupList" :key="item.groupId">{{item.groupName}}</li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "setFriendGroupBox",
        data(){
            return {

            }
        },
        props : {
            groupList : {
                default(){
                    return []
                }
            },
            friendInfo : {
                default(){
                    return {}
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .setFriendGroup.mask
    {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: transparent;
        display: flex;
        justify-content: center;
        align-items: center;
        align-content: center;
        flex-direction: column;
        cursor: pointer;

        .container
        {
            background-color: #ffffff;
            padding: 0;
            margin: 0;
            /*border: 1px solid #9999b9;*/
            box-shadow: 0 0 2px rgba(0,0,0,0.2);
        }
        .item
        {
            list-style: none;
            padding: 10px 40px;
            &:hover
            {
                background-color: rgba(0,0,0,0.2);
            }
        }
        .header
        {
            background-color: #ffffff;
            display: flex;
            position: relative;
            .title
            {
                font-size: 16px;
                width: 200px;
                box-sizing: border-box;
                padding-left: 40px;
                margin-top: 20px;
                padding-bottom: 20px;
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            }
        }
        .close
        {
            height: 50px;
            width: 50px;
            font-size: 30px;
            position: absolute;
            text-align: center;
            line-height: 50px;
            top: 0;
            right: 0;
            color: #5f5f5f;
            opacity: 1;
            transition: all 0.4s;
            cursor: pointer;
            transform: rotate(0deg);
        }
        .close:hover
        {
            /*background-color: #ff1231;*/
            /*!*opacity: 1;*!*/
        }
    }
</style>