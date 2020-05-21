export default {
    setCookie : function (name,value,time) {
        document.cookie = name + '=' + value + ';max-age=' + time;
    },
    removeCookie : function (name) {
        this.setCookie(name,null,-1);
    },
    getCookie : function (name) {
        let allCookie = document.cookie.split('; ');
        for (let i = 0; i < allCookie.length; i++) {
            let itemCookie = allCookie[i].split('=');
            if (itemCookie[0] === name){
                return itemCookie[1];
            }
        }
    }
};