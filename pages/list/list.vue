<template>
	<view class="pages">
		
		<!-- 搜索功能 -->
		<!-- <view class="uni-search-box">
			<uni-search-bar v-model="keyword" ref="searchBar" radius="100" cancelButton="none" disabled
				:placeholder="inputPlaceholder" />
			<view class="cover-search-bar" @click="searchClick"></view>
		</view>
		 -->		
		<section class="section">
			<view class="uni-padding-wrap uni-common-mt">
				<uni-segmented-control :current="current" :values="items" :style-type="styleType"
					:active-color="activeColor" @clickItem="onClickItem" />
			</view>
			<view class="content">
				<scroll-view v-if="current === 0" scroll-y="true" style="height: 100%">
					
					<view v-if="!ifpaired"> 
					
					<!-- 当前用户并未配对 -->
						<view style="display: flex; flex-direction: row; padding-bottom: 3px">
							<uni-icons style="padding-top: 8px; padding-left: 5px;" type="personadd" size="30"></uni-icons>
							<text class="subtitle"> 寻找同好 </text>
						</view>
						<view class="addlist" style="background-color:#ddddff;" @click='topair'>
							<text style="display: flex; justify-content: center; font-size: 20; font-weight: 600;">配对</text>
							<text  style="display: flex; justify-content: center; padding-top: 5px; size: 12; font-weight: 100;">点击开启配对模式</text>
						</view>
						<view class="addlist" style="background-color:#FFDDDD;" @click="topairrec">
							<text  style="display: flex; justify-content: center; font-size: 20; font-weight: 600;">匹配推荐</text>
							<text  style="display: flex; justify-content: center; padding-top: 5px; size: 12; font-weight: 100;">点击查看Duoverse上的同好</text>
						</view>
						<view> 
						<!-- 配对申请列表 -->
							<view style="display: flex; flex-direction: row;">
								<uni-icons style="padding-top: 8px; padding-left: 5px;" type="link" size="30"></uni-icons>
								<text class="subtitle"> 匹配申请列表 </text>
							</view>
							<!-- <text> 匹配申请列表 </text> -->
							<view>			
								<view v-if="new_pair_list.length==0" >
									<view class="addlist" style="background-color:#ffffff;">
										<text style="display: flex; justify-content: center; font-size: 15; font-weight: 400; color:#82868E">暂无匹配申请</text>
										
									</view>
								</view>
								<uni-list v-else>
									<view v-for="(item, index) in new_pair_list" :key="index">
										<uni-list-item :title="item.nickname"
											:thumb="item.avatar"
											thumbSize="lg"
											:clickable="true"
											@click="to_pair_profile(item._id)"></uni-list-item>
									</view> 
								</uni-list>
							</view>
							
						<!-- 	<view v-if="new_pair_list.length==0">
								<text>暂无匹配申请</text>
							</view>
							<uni-list v-else>
								<view v-for="(item, index) in new_pair_list" :key="index">
									<uni-list-item :title="item.nickname"
										:thumb="item.avatar"
										thumbSize="lg"
										:clickable="true"
										@click="to_pair_profile(item._id)"></uni-list-item>
								</view> 
							</uni-list>
							 -->
						</view>
						
						<!-- <button @click="topair">配对</button> -->
					</view>
					<view v-else>
						
						<pairedui />
					</view>
				</scroll-view>
				<view v-if="current === 1">
					<conversations />
					<text style="padding: 10px; display: flex; flex-direction: row; justify-content: center; font-size: 12px; color: #999">
						没有更多了
					</text>
				</view>
				<view v-if="current === 2" class="bordertest">
					<scroll-view class="myfriend" scroll-y="true">
						
					
					<!-- <text class="content-text">选项卡3的内容</text> -->
						<uni-search-bar @cancel="cancel" @confirm="confirm" v-model="search_content" :radius=100 placeholder="输入用户昵称搜索用户">
							<!-- <uni-icons slot="searchIcon" color="#999999" size="18" type="home" /> -->
						</uni-search-bar>
						<scroll-view class="searchfriend" scroll-y="true">
							<!-- <text>a \n b \n c \n d \n d \n d \n d \n d \n d \n d</text> -->
							<view v-if="!flist.length">
								<view v-if="this.flag">
									<text style="display: flex; justify-content: center; padding-top: 5px; color: #999;">
										无结果
									</text>
								</view>	
							</view>
							<view v-else>
						
								<view v-if="flist.length==1 && flist[0] == userInfo._id">
									<text style="display: flex; justify-content: center; padding-top: 5px; color: #999;">
										无结果
									</text>
								</view>
								<view v-else>
								
									<uni-list>
										<view v-for="(item, index) in flist" :key="index">
											<view v-if="item._id != userInfo._id">
										
												<view v-if="item.avatar_file">
													<uni-list-item :title="item.nickname"
														:thumb="item.avatar_file.url"
														thumbSize="lg"
														:clickable="true"
														@click="to_friend_profile(item._id)"></uni-list-item>
												</view>	
												<view v-else>
													<uni-list-item :title="item.nickname"
														:thumb="defaultavatar"
														thumbSize="lg"
														:clickable="true"
														@click="to_friend_profile(item._id)"></uni-list-item>
												</view>
											
											</view>
											
										</view>
									</uni-list>
								</view>
								
						
							</view>
						</scroll-view>
						
						<view style="display: flex; flex-direction: row;">
							<uni-icons style="padding-top: 8px; padding-left: 5px;" type="staff" size="30"></uni-icons>
							<text class="subtitle"> 新的朋友 </text>
						</view>
						
						<!-- <view class="newfriends"> -->
							<view class="searchfriend" >
								
								<view v-if="new_friend_list.length==0">
									<text style="display: flex; justify-content: center; padding-top: 5px; padding-bottom: 5px; color: #999;">
										暂无好友申请
									</text>
								</view>
								<uni-list v-else>
									<view v-for="(item, index) in new_friend_list" :key="index">
										<uni-list-item :title="item.nickname"
											:thumb="item.avatar"
											thumbSize="lg"
											:clickable="true"
											@click="to_friend_profile(item._id)"></uni-list-item>
									</view> 
								</uni-list>
							</view>
							
						<!-- </view> -->
						
						
						<view style="display: flex; flex-direction: row;">
							<uni-icons style="padding-top: 8px; padding-left: 5px;" type="contact" size="30"></uni-icons>
							<text class="subtitle"> 我的好友 </text>
						</view>
						
						<!-- <scroll-view class="myfriend" scroll-y="true"> -->
							<view v-if="myflist.length==0">
								<text style="display: flex; justify-content: center; padding-top: 5px; color: #999;">
									暂无好友
								</text>
							</view>
							<uni-list v-else>
								<view v-for="(item, index) in myflist" :key="index">
									<uni-list-item :title="item.nickname"
										:thumb="item.avatar"
										thumbSize="lg"
										:clickable="true"
										@click="to_friend_profile(item._id)"></uni-list-item>
								</view> 
							</uni-list>
						<!-- </scroll-view> -->
						
					
						<!-- </unicloud-db> -->
					</scroll-view>
				</view>
			</view>
		</section>
	</view>
</template>

<script>
	var cdbRef, currentWebview;
	import statusBar from "@/uni_modules/uni-nav-bar/components/uni-nav-bar/uni-status-bar";
	import conversations from "../../components/conversation-list/conversation-list.vue"
	import contacts from "../../components/contact-list/contact-list.vue"
	import Gps from '@/uni_modules/json-gps/js_sdk/gps.js';
	import {mapGetters} from 'vuex';
	import IMService from "../../lib/imservice";
	import pairedui from '../../components/paired-ui/paired-ui.vue'
	// const gps = new Gps();
	const db = uniCloud.database();
	
	export default {
		components: {
			statusBar,
			conversations,
			contacts,
			pairedui
		},
		computed: {
			...mapGetters({
				userInfo: 'user/info',
				login: 'user/hasLogin'
			}),
			inputPlaceholder(e) {
				if (uni.getStorageSync('CURRENT_LANG') == "en") {
					return 'Please enter the search content'
				} else {
					return '请输入搜索内容'
				}
			},
			colList(){
				return [
					db.collection('opendb-news-articles').where(this.where).field('avatar,title,last_modify_date,user_id').getTemp(),
					db.collection('uni-id-users').field('_id,username').getTemp()
				]
			}
		},
		data() {
			return {
				where: '"article_status" == 1',
				keyword: "",
				showRefresh: false,
				listHight: 0,
				//导入
				items: ['匹配', '私信', '联系人'],
				
				// colors: ['#007aff', '#4cd964', '#dd524d'],
				current: 0,
				// colorIndex: 0,
				activeColor: '#82529d',
				styleType: 'button',
				
				search_content: '',
				flist: [],
				flag: false,
				new_friend_list: [],
				new_pair_list: [],
				cur0loadflag: false,
				cur2loadflag: false,
				myflist: [],
				ifpaired: false,
				// pairlist: [],
				myinterests: [],
				ifnointerests: false,
				pairlist: [],
				finalpairlist: [],
				duixiang: '',
				loadflag: false,
				defaultavatar: "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b7ef8d49-ed26-4d4e-ae01-df1eb1688fb0/bc4fb287-399c-403b-a932-e75fc2563e20."
				
			}
		},
		watch: {
			keyword(keyword, oldValue) {
				let where = '"article_status" == 1 '
				if (keyword) {
					this.where = where + `&& /${keyword}/.test(title)`;
				} else {
					this.where = where;
				}
			}
		},
		// onLoad(e) {
		// 	console.log(e)
		// 	// const pairTable = db.collection("pair-list").where({
		// 	// 	"user1_id": 
		// 	// })
		// },
		async onReady() {
			// #ifdef APP-NVUE
			/* 可用窗口高度 - 搜索框高 - 状态栏高 */
			this.listHight = uni.getSystemInfoSync().windowHeight - uni.getSystemInfoSync().statusBarHeight - 50 + 'px';
			// #endif
			// #ifndef APP-NVUE
			this.listHight = 'auto'
			// #endif
			cdbRef = this.$refs.udb
			
			
		},
		async onShow() {
			// uni.showLoading({
			// 	mask: true,
			// 	title: "加载中"
			// })
			this.loadflag = true
			let currentUser = {
				'_id': this.userInfo._id,
				'nickname': this.userInfo.nickname,
				'avatar_file': this.userInfo.avatar_file ? this.userInfo.avatar_file : {url: this.defaultavatar}
			}
			
			this.flag = false
			this.keyword = getApp().globalData.searchText
			getApp().globalData.searchText = ''
			// console.log('login:', this.login)
			if(this.login){
				if(this.goEasy.getConnectionStatus() === 'disconnected') {
					getApp().globalData.imService= new IMService(this.goEasy,this.GoEasy);
					getApp().globalData.imService.connect(currentUser);
				}
			}
			//这里仅演示如何，在onShow生命周期获取设备位置，并在设备或者应用没有权限时自动引导。设置完毕自动重新获取。
			//你可以基于他做自己的业务，比如：根据距离由近到远排序列表数据等
			// uni.showLoading({
			// 	title:"获取定位中"
			// });
			//默认h5端不获取定位
			// // #ifndef H5
			// let location = await gps.getLocation({
			// 	geocode: true
			// })
			// console.log(location);
			// // #endif
			// if(location){
			// 	uni.showToast({
			// 		title: JSON.stringify(location),
			// 		icon: 'none'
			// 	});
			// }
			// uni.hideLoading()
			
			this.load_request()
			this.load_pair_request()
			this.load_friend()
			this.search_pair_list()
			// this.update_pair_options()
			// this.generate_pair_list() //
			
		},
		methods: {
			searchClick(e) { //点击搜索框
				uni.hideKeyboard();
				uni.navigateTo({
					url: '/pages/list/search/search',
					animationType: 'fade-in'
				});
			},
			retry() {
				this.refresh()
			},
			refresh() {
				cdbRef.loadData({
					clear: true
				}, () => {
					uni.stopPullDownRefresh()
					// #ifdef APP-NVUE
					this.showRefresh = false
					// #endif
					console.log('end');
				})
				console.log('refresh');
			},
			loadMore() {
				cdbRef.loadMore()
			},
			onqueryerror(e) {
				console.error(e);
			},
			onpullingdown(e) {
				console.log(e);
				this.showRefresh = true
				if(e.pullingDistance>100){
					this.refresh()
				}
			},
			expevent(item) {
				console.log(item)
				uniCloud.callFunction({
					name: "edit-exp",
					data: {
						user_id: item.user_id[0]['_id'],
						// user_id: '61f77e02cabbcc0001b734b9',
						points: 8,
					},
				})
			},
			
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex
				}
				if(this.current !== 2){
					this.flag = false
					this.search_content = ''
					this.flist = []
					this.cur2loadflag = false
				}
				if(this.current === 2 && this.cur2loadflag === false){
					this.cur2loadflag = true
					this.load_request()
					this.load_friend()
				}
				if(this.current !== 0){
					this.cur0loadflag = false
				}
				if(this.current === 0 && this.cur0loadflag === false){
					this.cur0loadflag = true
					this.search_pair_list()
				}
				
			},
			confirm() {
				this.flag = true
				// this.sWhere = "_id=='" + this.tempstr + "'"
				db.collection("uni-id-users").where({
					nickname: this.search_content
				}).field('_id, avatar_file, nickname').get().then((res)=>{
					this.flist = res.result.data
					console.log(this.flist)
				// res 为数据库查询结果
				})
				
				// console.log(this.flist)
				// this.flag = true;
			},
			cancel() {
				this.flag = false
				this.flist = []
			},
			to_friend_profile(friend) {

				let path = '../friend-profile/friend-profile?to=' + friend
				uni.navigateTo({
					url: path
				})
			},
			to_pair_profile(id){
				let path = '../pair-profile/pair-profile?to=' + id
				uni.navigateTo({
					url: path
				})
			},
			load_request() {
				this.new_friend_list = []
				db.collection("new-friends").where({
					user_id: this.userInfo._id
				}).get().then((res)=>{
					// console.log(res.result.data)
					if(res.result.data[0].request_list.length){
						
						let lst = res.result.data[0].request_list
						for(var i = 0; i < lst.length; i++){
							db.collection("uni-id-users").where({
								_id: lst[i]
							}).field("_id, nickname, avatar_file").get().then((res2)=>{
								
								// console.log('id is:', res2.result.data[0])
								if(res2.result.data[0]){
									let item = {
										"_id": res2.result.data[0]._id,
										"nickname": res2.result.data[0].nickname,
										"avatar": res2.result.data[0].avatar_file ? res2.result.data[0].avatar_file.url : this.defaultavatar
									}
									if(!(item in this.new_friend_list)){
										this.new_friend_list.push(item)
									}
									
								}
							})
						}
					}
					
					// this.new_friend_list = res.result.data[0].request_list
				})
			},
			load_pair_request() {
				this.new_pair_list = []
				db.collection("new-pair").where({
					user_id: this.userInfo._id
				}).get().then((res)=>{
					// console.log(res.result.data)
					if(res.result.data.length && res.result.data[0].request_list.length){
						
						let lst = res.result.data[0].request_list
						for(var i = 0; i < lst.length; i++){
							db.collection("uni-id-users").where({
								_id: lst[i]
							}).field("_id, nickname, avatar_file").get().then((res2)=>{
								
								// console.log('id is:', res2.result.data[0])
								if(res2.result.data[0]){
									this.new_pair_list.push({
										"_id": res2.result.data[0]._id,
										"nickname": res2.result.data[0].nickname,
										"avatar": res2.result.data[0].avatar_file ? res2.result.data[0].avatar_file.url : this.defaultavatar
									})
								}
							})
						}
					}
					
					// this.new_friend_list = res.result.data[0].request_list
				})
			},
			load_friend() {
				this.myflist = []
				db.collection('friends').where({
					user_id: this.userInfo._id
				}).orderBy('nickname asc').get().then((res)=>{
					if(res.result.data[0]){
						// this.myflist = res.result.data[0]
						let lst = res.result.data[0].friend_list
						for(var i = 0; i < lst.length; i++){
							db.collection("uni-id-users").where({
								_id: lst[i]
							}).field("_id, nickname, avatar_file").get().then((res2)=>{
								let item = {
									"_id": res2.result.data[0]._id,
									"nickname": res2.result.data[0].nickname,
									"avatar": res2.result.data[0].avatar_file ? res2.result.data[0].avatar_file.url : this.defaultavatar
								}
								if(!(item in this.myflist)){
									this.myflist.push(item)
								}
							})
						}
					}
				})
			},
			search_pair_list() {
				this.ifpaired = false
				db.collection('uni-id-users').where({
					_id: this.userInfo._id
				}).get().then((res)=>{
					this.ifpaired = res.result.data[0].ifpaired
					if(this.ifpaired) {
						db.collection('pair-list').where({
							user1_id: this.userInfo._id
						}).get().then((res)=>{
							if(res.result.data.length){
								this.duixiang = res.result.data[0].user2_id
							}
						})
						db.collection('pair-list').where({
							user2_id: this.userInfo._id
						}).get().then((res)=>{
							if(res.result.data.length){
								this.duixiang = res.result.data[0].user1_id
							}
						})
					}
				})
				
			},
			
			topair() {
				db.collection('to-be-paired').where({
					user_id: this.userInfo._id
				}).get().then((res)=>{
					let i = res.result.data.length.toString()
					// console.log(i)
					let path = '../self-intro/self-intro?status=' + i
					uni.navigateTo({
						url: path
					})
				})
			},
			
			cancelpair() {
				this.$refs.popup.open()
			},
			confirmpopup() {
				db.collection('uni-id-users').where({
					_id: this.userInfo._id
				}).update({
					'ifpaired': false
				})
				db.collection('uni-id-users').where({
					_id: this.duixiang
				}).update({
					'ifpaired': false
				})
				db.collection('pair-list').where({
					user1_id: this.userInfo._id
				}).remove()
				db.collection('pair-list').where({
					user2_id: this.userInfo._id
				}).remove()
				this.$refs.popup.close()
			},
			closepopup() {
				
				this.$refs.popup.close()
			},
			topairrec() {
				uni.navigateTo({
					url: "../pair-rec/pair-rec?id=" + this.userInfo._id
				})
			}
			
		},
		// #ifndef APP-NVUE
		onPullDownRefresh() {
			this.refresh()
		},
		onReachBottom() {
			this.loadMore()
		}
		// #endif
		
	}
</script>

<style>
	
</style>

<style scoped lang="scss">
	/* #ifndef APP-NVUE */
	view {
		display: flex;
		box-sizing: border-box;
		flex-direction: column;
	}
	/* #endif */
	// page {
	// 	height: 100%!important;
	// }
	.searchfriend {
		// display: flex;
		border-style: solid;
		border-color: #ccc;
		border-width: 0.5px;
		
	}
	.myfriend {
		// border-style: solid;
		// border-color: #999;
		// border-width: 0.5px;
	}
	.bordertest {
	}
	.pages {
		background-color: #FFFFFF;
	}

	.avatar {
		width: 200rpx;
		height: 200rpx;
		margin-right: 10rpx;
	}

	.main {
		justify-content: space-between;
	}

	.title {
		width: 480rpx;
		font-size: 32rpx;
	}

	.info {
		flex-direction: row;
		justify-content: space-between;
	}

	.author,
	.last_modify_date {
		font-size: 28rpx;
		color: #999999;
	}
	.uni-search-box {
		background-color: #FFFFFF;
		position: sticky;
		height: 50px;
		top: 0;
		left: 0;
		/* #ifndef APP-PLUS */
		z-index: 9;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		width: 580rpx;
		/* #endif */
	}
	.cover-search-bar {
		height: 50px;
		position: relative;
		top: -50px;
		margin-bottom: -50px;
		/* #ifndef APP-NVUE */
		z-index: 999;
		/* #endif */
	}
	.content {
		padding: 5px 10px;
		/* #ifndef APP-NVUE */
		/* display: flex; */
		/* #endif */
		/* justify-content: center; */
		/* align-items: center; */
		
		/* text-align: center; */
	}
	.name-box {
		display: flex;
		background-color: #444;
	}
	.app-name {
		display: flex;
		flex-direction: row;
		justify-content: center;
		padding: 10px 0px;
		color: #eee;
	}
	.section {
	}
	.subtitle {
		// padding: 10px;
		padding-top: 15px;
		padding-bottom: 5px;
		padding-left: 10px;
		padding-right: 10px;
	}
	.newfriends {
		height: 30%;
	}
	.uni-padding-wrap {
		// font-size: 10px;
		// display: flex;
		// flex-direction: 
		padding: 5px 5%;
		// justify-content: center;
		// width: 80%
		display: flex;
		justify-content: center;
		// .uni-common-mt {
			// width: 80%
			// padding: 
		// }
	}
	.addlist{
		background-color:#FFFFFF;
		border-radius: 20rpx;
		height:120px;
		margin-left: 15%;
		margin-right: 15%;
		margin-bottom: 20rpx;
		margin-top: 5rpx;
		text-align: center;
		align-content: center;
		align-items: center;
		justify-content: center;
		display:flex;
		flex-direction: column;
		.textt{
			justify-content: center;
			align-content:center;
			font-weight: 600;
		}
	}
	.textbox{
		text-align: center;
		align-content: center;
		align-items: center;
		justify-content: center;
	}
</style>
