<template>
	<view class="center">
		{{read(userInfo._id)}}
		<view style="display:none">{{getlevel(userInfo._id)}}</view>
		<uni-sign-in ref="signIn"></uni-sign-in>
		<view class="userInfo" @click.capture="toUserInfo">
			<cloud-image width="150rpx" height="150rpx" v-if="userInfo.avatar_file&&userInfo.avatar_file.url" :src="userInfo.avatar_file.url"></cloud-image>
			<image v-else class="logo-img" src="@/static/uni-center/defaultAvatarUrl.png"></image>
			<view class="logo-title">
				<text class="uer-name" v-if="hasLogin">{{userInfo.nickname||userInfo.username||userInfo.mobile}}</text>
				
				<text class="uer-name" v-else>{{$t('mine.notLogged')}}</text>
				<view class="levelbox" v-if="hasLogin"> <text>Lv:{{level}}</text> </view>
			</view>
		</view>
		<uni-grid class="grid" :column="3" :showBorder="false" :square="false" >
			<uni-grid-item class="item" v-for="(item,index) in gridList"  :key="index">
				<text class="text">{{item.text}}</text>
				<view v-if="item.text=='动态'" @click="mypost">
					<view style="display:none">{{getnumber(userInfo._id)}}</view>
					<text class="text" v-if="hasLogin">{{dataa}}</text>
					<text class="text" v-else="hasLogin"></text>
				</view>
				<view v-if="item.text=='鼓励指数'">
					<view style="display:none">{{check(userInfo._id)}}</view>
					<text class="text" v-if="hasLogin">{{points}}</text>
					<text class="text" v-else="hasLogin"></text>
				</view>
				<view v-if="item.text=='好友'">
					<view style="display:none">{{friendsnum(userInfo._id)}}</view>
					<text class="text" v-if="hasLogin">{{dataaa}}</text>
					<text class="text" v-else="hasLogin"></text>
				</view>
				
				
				
			</uni-grid-item>
		</uni-grid>
	
		<uni-list class="center-list" v-for="(sublist , index) in ucenterList" :key="index">
			<uni-list-item class="textt" v-for="(item,i) in sublist" :title="item.title" link :rightText="item.rightText" :key="i"
				:clickable="true" :to="item.to" @click="ucenterListClick(item)" :show-extra-icon="true"
				:extraIcon="{type:item.icon,color:'#999'}">
			</uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	import checkUpdate from '@/uni_modules/uni-upgrade-center-app/utils/check-update';
	import callCheckVersion from '@/uni_modules/uni-upgrade-center-app/utils/call-check-version';
	// #ifdef APP
	import UniShare from '@/uni_modules/uni-share/js_sdk/uni-share.js';
	const uniShare = new UniShare()
	// #endif
	const db = uniCloud.database();
	export default {
		// #ifdef APP
		onBackPress({from}) {
			if(from=='backbutton'){
				this.$nextTick(function(){
					uniShare.hide()
				})
				return uniShare.isShow;
			}
		},
		// #endif
		data() {
			return {
				dataa:0,
				dataaa:0,
				points:0,
				level:0,
				num:1,
				gridList: [
					{
						"text": "好友",
						"icon": "cloud-upload"
					},
					{
						"text": "动态",
						"icon": "contact",
						"to": '/pages/ucenter/my-post/my-post',
					},
					{
						"text": "鼓励指数",
						"icon": "download"
					}
				],
				ucenterList: [
					[
						{
							"title": "日志",
							"to": '/pages/daily/daily',
							"icon": "camera"
						},
						{
							"title": "成就",
							"to": '/pages/daily/daily',
							"icon": "paperplane"
						}, 
						{
							"title": "兴趣",
							"to": '/pages/interest/interest',
							"icon": "heart"
						},
						{
							"title":"设置",
							"to": '/pages/ucenter/settings/settings',
							"icon": "gear"
						}
					]
				],
			}
		},
		onLoad() {
			// console.log(313,this.userInfo,this.hasLogin);
			console.log("appversion:",this.appVersion)
			//#ifdef APP-PLUS
			this.ucenterList[this.ucenterList.length - 2].unshift({
				title:this.$t('mine.checkUpdate'),// this.this.$t('mine.checkUpdate')"检查更新"
				rightText: this.appVersion.version + '-' + this.appVersion.versionCode,
				event: 'checkVersion',
				icon: 'loop',
				showBadge: this.appVersion.hasNew
			})
			//#endif
		},
		computed: {
			...mapGetters({
				userInfo: 'user/info',
				
				hasLogin: 'user/hasLogin'
			})
			
			,
			appVersion() {
				return getApp().appVersion
			}
			
			,
			appConfig() {
				return getApp().globalData.config
			}
		},
		methods: {
			mypost(){
				uni.navigateTo({
					url: "/pages/ucenter/my-post/my-post"
				})
			},
			...mapMutations({
				setUserInfo: 'user/login'
			}),
			toSettings() {
				uni.navigateTo({
					url: "/pages/ucenter/settings/settings"
				})
			},
			read(id){
				const db = uniCloud.database();
				exports.main = async(event, context)=>{
					const collection = db.collection('post');
					const res = await collection.doc(id).get()
					console.log(res)
					}
				
			},
			signIn() { //普通签到
				this.$refs.signIn.open()
			},
			async check(id){
				const db = uniCloud.database();
				let res= await db.collection("exp-points").where({user_id:this.userInfo._id}).get()
				this.points= res.result.data[0].balance
			},
			async getlevel(id){
				const ddd = uniCloud.database();
				let res= await ddd.collection("exp-points").where({user_id:id}).get()
				this.level= res.result.data[0].level
			},
			signInByAd(){ //看激励视频广告签到
				this.$refs.signIn.showRewardedVideoAd()
			},
			/**
			 * 个人中心项目列表点击事件
			 */
			ucenterListClick(item) {
				if (!item.to && item.event) {
					this[item.event]();
				}
			},
			async checkVersion() {
				let res = await callCheckVersion()
				console.log(res);
				if (res.result.code > 0) {
					checkUpdate()
				} else {
					uni.showToast({
						title: res.result.message,
						icon: 'none'
					});
				}
			},
			toUserInfo() {
				uni.navigateTo({
					url: '/pages/ucenter/userinfo/userinfo'
				})
			},
			async friendsnum(){
				const de = uniCloud.database();
				let res = await de.collection("friends").where({user_id:this.userInfo._id}).get();
				this.dataaa = res.result.data[0].friend_list.length
			},
			async getnumber(id){
				const dd = uniCloud.database();
				let res = await dd.collection("post").where({user_id:this.userInfo._id,exist:"true"}).get();
				this.dataa = res.result.data.length
			},
			tapGrid(index) {
				uni.showToast({
					// title: '你点击了，第' + (index + 1) + '个',
					title: this.$t('mine.clicked') + " " + (index + 1) ,
					icon: 'none'
				});
			},
			/**
			 * 去应用市场评分
			 */
			gotoMarket() {
				// #ifdef APP-PLUS
				if (uni.getSystemInfoSync().platform == "ios") {
					// 这里填写appstore应用id
					let appstoreid = this.appConfig.marketId.ios; // 'id1417078253';
					plus.runtime.openURL("itms-apps://" + 'itunes.apple.com/cn/app/wechat/' + appstoreid + '?mt=8');
				}
				if (uni.getSystemInfoSync().platform == "android") {
					var Uri = plus.android.importClass("android.net.Uri");
					var uri = Uri.parse("market://details?id=" + this.appConfig.marketId.android);
					var Intent = plus.android.importClass('android.content.Intent');
					var intent = new Intent(Intent.ACTION_VIEW, uri);
					var main = plus.android.runtimeMainActivity();
					main.startActivity(intent);
				}
				// #endif
			},
			/**
			 * 获取积分信息
			 */
			getScore() {
				if (!this.userInfo) return uni.showToast({
					title: this.$t('mine.checkScore'),
					icon: 'none'
				});
				uni.showLoading({
					mask: true
				})
				db.collection("uni-id-scores")
					.where('"user_id" == $env.uid')
					.field('score,balance')
					.orderBy("create_date", "desc")
					.limit(1)
					.get()
					.then((res) => {
						console.log(res);
						const data = res.result.data[0];
						let msg = '';
						msg = data ? (this.$t('mine.currentScore')+ data.balance) : this.$t('mine.noScore');
						uni.showToast({
							title: msg,
							icon: 'none'
						});
					}).finally(()=>{
						uni.hideLoading()
					})
			},
			async share() {
				let {
					result
				} = await uniCloud.callFunction({
					name: 'uni-id-cf',
					data: {
						action: 'getUserInviteCode'
					}
				})
				console.log(result);
				let myInviteCode = result.myInviteCode || result.userInfo.my_invite_code
				console.log(myInviteCode);
				let {
					appName,
					logo,
					company,
					slogan
				} = this.appConfig.about
				// #ifdef APP-PLUS
				uniShare.show({
					content: { //公共的分享类型（type）、链接（herf）、标题（title）、summary（描述）、imageUrl（缩略图）
						type: 0,
						href: this.appConfig.h5.url +
							`/#/pages/ucenter/invite/invite?code=uniInvitationCode:${myInviteCode}`,
						title: appName,
						summary: slogan,
						imageUrl: logo +
							'?x-oss-process=image/resize,m_fill,h_100,w_100' //压缩图片解决，在ios端分享图过大导致的图片失效问题
					},
					menus: [{
							"img": "/static/app-plus/sharemenu/wechatfriend.png",
							"text": this.$t('common').wechatFriends,
							"share": {
								"provider": "weixin",
								"scene": "WXSceneSession"
							}
						},
						{
							"img": "/static/app-plus/sharemenu/wechatmoments.png",
							"text": this.$t('common').wechatBbs,
							"share": {
								"provider": "weixin",
								"scene": "WXSceneTimeline"
							}
						},
						{
							"img": "/static/app-plus/sharemenu/weibo.png",
							"text": this.$t('common').weibo,
							"share": {
								"provider": "sinaweibo"
							}
						},
						{
							"img": "/static/app-plus/sharemenu/qq.png",
							"text": "QQ",
							"share": {
								"provider": "qq"
							}
						},
						{
							"img": "/static/app-plus/sharemenu/copyurl.png",
							"text": this.$t('common').copy,
							"share": "copyurl"
						},
						{
							"img": "/static/app-plus/sharemenu/more.png",
							"text": this.$t('common').more,
							"share": "shareSystem"
						}
					],
					cancelText: this.$t('common').cancelShare,
				}, e => { //callback
					console.log(e);
				})
				// #endif
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* #ifndef APP-NVUE */
	view {
		display: flex;
		box-sizing: border-box;
		flex-direction: column;
	}

	page {
		background-color: #f8f8f8;
	}
	/* #endif*/
	.textt{
		height:110rpx;
	}
	.center {
		flex: 1;
		flex-direction: column;
		background-color: #f8f8f8;
	}
	
	.levelbox{
		width:100rpx;
		display:flex;
		box-sizing:border-box;
		overflow:hidden;
		align-items:center;
		justify-content:center;
		display:flex;
		box-sizing:border-box;
		background:linear-gradient(to right, #ff9569 0% ,#e92758 100%);
		border-radius:15px;
			flex-direction:row;
			align-items:center;
	}
	.userInfo {
		width: 750rpx;
		padding: 20rpx;
		padding-top: 50px;
		background-image: url(../../static/uni-center/headers.jpg);
		flex-direction: column;
		align-items: center;
	}

	.logo-img {
		width: 150rpx;
		height: 150rpx;
		border-radius: 150rpx;
	}

	.logo-title {
		flex: 1;
		align-items: center;
		justify-content: space-between;
		flex-direction: column;
	}

	.uer-name {
		height: 100rpx;
		line-height: 100rpx;
		font-size: 38rpx;
		color: #FFFFFF;
	}

	.center-list {
		margin-bottom: 30rpx;
		background-color: #f9f9f9;
	}

	.center-list-cell {
		width: 750rpx;
		background-color: #007AFF;
		height: 80rpx;
	}

	.grid {
		background-color: #FFFFFF;
		margin-bottom: 6px;
	}

	.uni-grid .text {
		font-size: 30rpx;
		height: 25px;
		line-height: 25px;
		color: #817f82;
	}

	.uni-grid .item ::v-deep .uni-grid-item__box {
		justify-content: center;
		align-items: center;
	}


	/*修改边线粗细示例*/
	/* #ifndef APP-NVUE */
	.center-list ::v-deep .uni-list--border:after {
		-webkit-transform: scaleY(0.2);
		transform: scaleY(0.2);
		margin-left: 80rpx;
	}

	.center-list ::v-deep .uni-list--border-top,
	.center-list ::v-deep .uni-list--border-bottom {
		display: none;
	}

	/* #endif */
	.item-footer {
		flex-direction: row;
		align-items: center;
	}

	.item-footer-text {
		color: #999;
		font-size: 24rpx;
		padding-right: 10rpx;
	}

	.item-footer-badge {
		width: 20rpx;
		height: 20rpx;
		/* #ifndef APP-NVUE */
		border-radius: 50%;
		/* #endif */
		/* #ifdef APP-NVUE */
		border-radius: 10rpx;
		/* #endif */
		background-color: #DD524D;
	}
</style>