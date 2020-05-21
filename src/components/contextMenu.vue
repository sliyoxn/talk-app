<template>
    <div id="contextMenu" v-show="showContextMenu" :style="contextMenuPosStyle">
        <ul class="ul-menu">
            <li class="item" v-for="(item, index) in contextMenuData.renderList"
                :key="index" @click="item.clickEvent">{{item.renderText}}</li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "contextMenu",
        data () {
            return {
                showContextMenu : false,
                contextMenuData : {}
            }
        },
        props : {},
        computed : {
            contextMenuPosStyle() {
                let x = this.contextMenuData.x;
                let y = this.contextMenuData.y;
                let winH = window.innerHeight;
                let winW = window.innerWidth;
                let xStr = winW - x > 150 ? `left:${x}px;` : `right:${winW-x}px;`;
                let yStr = winH - y > 150 ? `top:${y}px;` : `bottom:${winH - y}px;`;
                return xStr + yStr;

            },
        },
        mounted() {
            let self = this;
            this.bus.$on("openContextMenu",(data) => {
                if (data.x == null || data.y == null) {
                    data.x =  data.event.clientX;
                    data.y  = data.event.clientY;
                }
                this.showContextMenu = true;
                this.contextMenuData = this.processContextMenuData(data);
            });
            this.bus.$on("closeContextMenu",(data) => {
                this.showContextMenu = false;
            });
            document.addEventListener("click", function() {
                self.bus.$emit("closeContextMenu");
            }, true);
        },
        methods : {
            processContextMenuData(contextMenuData) {
                if (!contextMenuData.renderList){
                    return contextMenuData;
                }
                let renderList = contextMenuData.renderList;
                for (let i = 0; i < renderList.length; i++) {
                    renderList[i].clickEvent = this.processClickEvent(renderList[i].clickEvent, contextMenuData.bindThis, contextMenuData.payload);
                }
                return contextMenuData;
            },
            processClickEvent(clickEvent, bindThis, payload){
                return function (event) {
                    setTimeout(function () {
                        clickEvent.call(bindThis, {
                            event,
                            payload
                        });
                    },4);
                }
            }
        }
    }
</script>

<style scoped lang="less">
    #contextMenu
    {
        position: fixed;
        border: 1px solid rgb(196, 196, 196);
        padding: 0 0;
        background-color: #fff;
        cursor: pointer;
        .ul-menu{
            margin: 0;
            padding: 0;
        }
        li.item
        {
            padding: 8px 40px;
            margin: 0;
            list-style: none;
            &:hover
            {
                background-color: rgba(226, 226, 226);
            }
        }
    }
</style>