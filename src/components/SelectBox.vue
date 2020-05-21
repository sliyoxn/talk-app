<template>
    <div class="SelectBox wrapper">
        <div class="left">
            <div class="input-box">
                <label>
                    <input type="text" class="search-item" placeholder="搜索" @input="searchItem" v-model="searchVal"/>
                </label>
            </div>
            <div class="list-container">
                <selectItem v-for="(item, index) in cloneListData"
                            :text="item.text" :img-url="item.imgUrl"
                            :key="item.key" :show-type="item.showType" :mark="item.key"
                            :payload="item.payload" v-show="acceptSearchList[index]" :reason="item.reason"
                            @cancelSelectItem="onCancelSelectItem" @selectItem="onSelectItem"
                ></selectItem>
            </div>
        </div>
        <div class="right">
            <div class="title-box">
                <span class="title">已经选择了{{hasSelectedData.length}}个成员</span>
            </div>
            <div class="hasSelect-container">
                <selectItem v-for="(item, index) in hasSelectedData"
                            :text="item.text" :img-url="item.imgUrl"
                            :key="item.key" :show-type="3" :mark="item.key"
                            :payload="item.payload"
                            @cancelSelectItem="onCancelSelectItem" @selectItem="onSelectItem"
                ></selectItem>
            </div>
            <div class="button-container">
                <button class="cancel" @click="onClickCancelButton">取消</button>
                <button class="confirm" @click="onClickConfirmButton">确认</button>
            </div>
        </div>
        <i class="close el-icon-close" @click="onClickCloseButton"></i>
    </div>
</template>

<script>
    import SelectItem from "./SelectItem";
    import funcUtil from "../util/FuncUtil";

    export default {
        name: "SelectBox",
        components: {SelectItem},
        data() {
            return {
                cloneListData: [],
                hasSelectedData: [],
                acceptSearchList: [],
                searchVal: ""
            }
        },
        props: {
            selectListData: {
                default() {
                    return [];
                }
            }
        },
        watch: {
            selectListData: {
                handler(value) {
                    let cloneListData = this.easyClone(value);
                    this.cloneListData = cloneListData;
                    for (let i = 0, length = cloneListData.length; i < length; i++) {
                        cloneListData[i].showType === 1 && this.hasSelectedData.push(cloneListData[i]);
                        this.acceptSearchList.push(true);
                    }
                },
                immediate: true
            }
        },
        mounted() {
            // 如果数组上没有remove方法要自定义一个加上去
        },
        methods: {
            onCancelSelectItem(data) {
                let {payload, mark} = data;
                let selectList = this.cloneListData;
                for (let i = 0; i < selectList.length; i++) {
                    if (selectList[i].key === mark) {
                        selectList[i].showType = 2;
                        this.hasSelectedData.remove(selectList[i]);
                    }
                }
            },
            onSelectItem(data) {
                let {payload, mark} = data;
                let selectList = this.cloneListData;
                for (let i = 0; i < selectList.length; i++) {
                    if (selectList[i].key === mark) {
                        selectList[i].showType = 1;
                        this.hasSelectedData.push(selectList[i]);
                    }
                }
            },
            easyClone(data) {
                return JSON.parse(JSON.stringify(data));
            },
            onClickConfirmButton() {
                let hasSelectList = this.hasSelectedData;
                let data = [];
                data = hasSelectList.map((value, index, array) => {
                    return value.payload
                });
                this.$emit("clickConfirm", data);
                this.hasSelectedData = [];

            },
            onClickCancelButton(){
                this.$emit("clickCancel");
                this.hasSelectedData = [];
            },
            onClickCloseButton(){
                this.$emit("clickClose");
                this.hasSelectedData = [];
            },
            searchItem : funcUtil.debounce(function () {
                if (this.searchVal === "") {
                    this.acceptSearchList = this.acceptSearchList.map(() => true);
                    return
                }
                let val = this.searchVal;
                this.acceptSearchList = this.cloneListData.map((value) => {
                    return value.key.toString() === val || value.text.includes(val) || value === "";
                })
            }, 100)
        }
    }
</script>

<style scoped lang="less">
    @import "../assets/style/components/SelectBox";
</style>