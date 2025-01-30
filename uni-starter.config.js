//这是应用的配置页面，App.vue挂载到getApp().globalData.config
export default {
	"h5": {
		"url": "https://uni-starter.dcloud.net.cn", //	前端网页托管的域名	
		 // 在h5端全局悬浮引导用户下载app的功能 更多自定义要求在/common/openApp.js中修改	
		// "openApp": { //如不需要本功能直接移除本节点即可	
		// 	//点击悬浮下载栏后打开的网页链接
		// 	"openUrl": '/#/pages/ucenter/invite/invite',
		// 	//左侧显示的应用名称	
		// 	"appname": 'uni-starter',
		// 	//应用的图标	
		// 	"logo": './static/logo.png',
		// }
	},
	"mp": {
		"weixin": {
			//微信小程序原始id，微信小程序分享时
			"id": "gh_33446d7f7a26"
		}
	},
	"router": {
		/*
			名词解释：“强制登录页”
				在打开定义的需强制登录的页面之前会自动检查（前端校验）uni_id_token的值是否有效,
				如果无效会自动跳转到登录页面
			两种模式：
				1.needLogin：黑名单模式。枚举游客不可访问的页面。
				2.visitor：白名单模式。枚举游客可访问的页面。
			* 注意：黑名单与白名单模式二选一
		*/
		"needLogin" : [
		 	{pattern:/^\/pages\/list.*/},	//支持正则表达式
			"/pages/ucenter/userinfo/userinfo",
			"/pages/schedule/schedule",
			"/pages/plaza/plaza",
			"/uni_modules/uni-news-favorite/pages/uni-news-favorite/list",
			"/uni_modules/uni-feedback/pages/uni-feedback/add"
		],
		
		// "visitor" : [
		// 	"/",//注意入口页必须直接写 "/"
		// 	{"pattern":/^\/pages\/list.*/},	//支持正则表达式
		// 	{"pattern":/^\/pages\/ucenter\/login-page.*/},
			
		// 	"/pages/common/webview/webview",
		// 	"/pages/grid/grid",
		// 	"/pages/ucenter/ucenter",
		// 	"/pages/ucenter/about/about",
		// 	"/pages/ucenter/settings/settings"
		// ],
		
		/*
		login:配置登录类型与优先级
			未列举到的，或设备环境不支持的选项，将被隐藏。如果你需要在不同平台有不同的配置，直接用条件编译即可
			根据数组的第0项，决定登录方式的第一优先级。
		*/
		"login": ["username"]
	},
	//关于应用
	"about": {
		//应用名称
		"appName": "Duoverse",
		//应用logo
		"logo": "/static/logo.png",
		//公司名称
		"company": "Duoverse Team",
		//口号
		"slogan": "一个让你变有趣的社交APP",
		//政策协议
		"agreements": [{
				"title": "用户服务协议", //如果开启了多语言国际化，本配置将失效。请在 lang/en.js 和 lang/zh-Hans.js中配置
				"url": "http://static-b7ef8d49-ed26-4d4e-ae01-df1eb1688fb0.bspapp.com/markdown-share-docs/e28acb273a9e8e49eff89fa334321f8a/" //对应的网络链接
			},
			{
				"title": "隐私政策", //如果开启了多语言国际化，本配置将失效。请在 lang/en.js 和 lang/zh-Hans.js中配置
				"url": "http://static-b7ef8d49-ed26-4d4e-ae01-df1eb1688fb0.bspapp.com/markdown-share-docs/d6f8171a532ff67e0de2bb169aa7b9ce/" //对应的网络链接
			}
		],
		//应用的链接，用于分享到第三方平台和生成关于我们页的二维码
		"download": "",
		//version
		"version":"1.0.0" //用于非app端显示，app端自动获取
	},
	"download":{ //用于生成二合一下载页面
		// "ios":"https://itunes.apple.com/cn/app/hello-uni-app/id1417078253?mt=8",
		"android":"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b7ef8d49-ed26-4d4e-ae01-df1eb1688fb0/f0be75cd-ff84-4065-a843-42337c3c6b5c.apk"
	},
	//用于打开应用市场评分界面
	"marketId":{
		"ios":"id1417078253",
		"android":"123456"
	},
	//配置多语言国际化。i18n为英文单词 internationalization的首末字符i和n，18为中间的字符数 是“国际化”的简称
	"i18n":{
		"enable":false //默认关闭，国际化。如果你想使用国际化相关功能，请改为true
	}
}