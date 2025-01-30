import App from './App'
import store from './store'
import i18n from './lang/i18n'
import GoEasy from "./lib/goeasy-2.2.5.min.js";


// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false

import uView from 'uview-ui';
Vue.use(uView);

Vue.prototype.$store = store
App.mpType = 'app'
const app = new Vue({
	i18n,
	store,
	...App
})
app.$mount()
// #endif

// Vue.prototype.goeasy = GoEasy.getInstance({
//     host:"hangzhou.goeasy.io",  //若是新加坡区域：singapore.goeasy.io
//     appkey:"BC-95e2f16fc46f43f1b9bea7a7b3c725a7",
//     modules:['im']//根据需要，传入‘pubsub’或'im’，或数组方式同时传入
// });

// Vue.prototype.GoEasy = GoEasy;
// Vue.prototype.goEasy = goEasy;

const goEasy = GoEasy.getInstance({
	host:"hangzhou.goeasy.io",//应用所在的区域地址: 【hangzhou.goeasy.io |singapore.goeasy.io】
	appkey:"BC-95e2f16fc46f43f1b9bea7a7b3c725a7",	// common key,
    modules:["im"],
	// true表示支持通知栏提醒，false则表示不需要通知栏提醒
    allowNotification:true //仅有效于app,小程序和H5将会被自动忽略

});

goEasy.onClickNotification((message) => {
	let currentUrl;
	const routes = getCurrentPages();

	if ( routes &&  routes.length ) {
		const curRoute = routes[routes.length - 1].route;
		const curParam = routes[routes.length - 1].options;
		currentUrl = '/' + curRoute + `?to=${curParam.to}`;
	}

    let newUrl;
    switch(message.toType) {
        case GoEasy.IM_SCENE.PRIVATE:
            newUrl = '/pages/chat/privateChat/privateChat?to=' + message.senderId;
            break;
        case GoEasy.IM_SCENE.GROUP:
            newUrl = '/pages/chat/groupChat/groupChat?to=' + message.groupId;
            break;
    }

    if (currentUrl !== newUrl) {
        uni.navigateTo({
            url: newUrl,
        });
    }

});

Vue.prototype.GoEasy = GoEasy;
Vue.prototype.goEasy = goEasy;


Vue.prototype.formatDate = function (t) {
    t = t || Date.now();
    let time = new Date(t);
    let str = time.getMonth() < 9 ? ('0' + (time.getMonth() + 1)) : (time.getMonth() + 1);
    str += '-';
    str += time.getDate() < 10 ? ('0' + time.getDate()) : time.getDate();
    str += ' ';
    str += time.getHours();
    str += ':';
    str += time.getMinutes() < 10 ? ('0' + time.getMinutes()) : time.getMinutes();
    return str;
}

// #ifdef VUE3
import {createSSRApp} from 'vue'

export function createApp() {
	const app = createSSRApp(App)
	app.use(i18n)
	app.use(store)
	return {app}
}
// #endif
