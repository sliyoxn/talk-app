import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import bus from "./util/bus";
import './plugins/element.js'
import "devtools-detect";
import EasyPreview from "easy-preview";
Vue.config.productionTip = false;
Vue.use(EasyPreview);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');

// 创建eventBus
Vue.prototype.bus = bus;
// 取消默认右键菜单
document.oncontextmenu = function(){
    return false;
};
Array.prototype.remove = function (val) {
    let index = this.indexOf(val);
    if (index >= 0){
        this.splice(index, 1);
    }
    return this;
};

Array.prototype.set = function (index, val) {
    this.splice(index, 1, val);
};






