<template>
	<view class="contacts">
	    <view class="contacts-container">
				<!-- <view class="user-list">
					<view class="user-list-item" v-for="(group, uuid) in groups" :key="uuid" @click="enterChat(group.uuid, 'group')">
						<view class="user-item-avatar">
							<image :src="group.avatar" />
						</view>
						<view class="user-item-info">
							<span class="user-item-info__name">{{group.name}}</span>
						</view>
					</view>
				</view> -->
				<view class="contacts-title" v-if="friends && friends.length !=0">联系人</view>
				<!-- <view>{{friends}}</view> -->
	            <view class="user-list">
	                <view class="user-list-item" v-for="(friend, index) in friends" :key="index" @click="enterChat(friend[0]._id, 'private')">
	                    <!-- <text>{{friend[0].nickname}}</text> -->
						<!-- <view>{{friend[0]._id}}</view> -->
						<view class="user-item-avatar">
							<!-- {{friend}} -->
							<image :src="friend[0].avatar_file.url"></image>
	                    </view>
	                    <view class="user-item-info">
	                        <span class="user-item-info__name">{{friend[0].nickname}}</span>
							<span class="online-tips">{{friend[0].online ? '在线' :'离线'}}</span>
	                    </view>
	                </view>
	            </view>
	    </view>
	</view>
</template>

<script>
	const db = uniCloud.database();
	export default {
		name:"contact-list",
		data() {
			return {
				friends : [],
				groups : []
			};
		},
		mounted() {
			this.init()
		},
		methods: {
			init () {
				let friendList = []
				
				let currentUser = {}
				db.collection("uni-id-users").where({
					_id: db.getCloudEnv('$cloudEnv_uid')
				}).field('_id').get().then((res)=>{
					currentUser = res.result.data[0]

					db.collection("friends").where({
						user_id: currentUser._id
					}).get().then((res2)=>{
						friendList = res2.result.data[0].friend_list
						// console.log(friendList)
					// res 为数据库查询结果
						// friendList.map((friend ,index)=> {
						// 	friend.online = false;
						// 	this.$set(this.friends, index, friend);
						// }); 源代码
						
						
						for(var i = 0; i < friendList.length; i++){
							console.log(friendList[i])
							db.collection("uni-id-users").where({
								_id: friendList[i]
							}).field('_id, nickname, avatar_file').get().then((res3)=>{
								this.friends.push(
									res3.result.data
								)
								console.log(res3.result.data)
							})
							
						}
						// console.log(this.friends)
						//还没整呢
						// console.log(this.friends)
						// this.groups = restApi.findGroups(currentUser);
						// this.subscribeUserPresence();
						// this.hereNow();
						// this.goEasy.im.on(this.GoEasy.IM_EVENT.USER_PRESENCE, (user) => {
						// 	this.friends.map(friend => {
						// 		if (friend.uuid == user.id) {
						// 			let state = user.action === 'online' || user.action === 'join';
						// 			this.$set(friend, 'online', state);
						// 		}
						// 	})
						// })
					})
				})
			},
			subscribeUserPresence () {
				let friendIds = [];
				this.friends.map(friend => {
					friendIds.push(friend.uuid);
				});
				this.goEasy.im.subscribeUserPresence({
					userIds: friendIds,
					onSuccess: function () {
						console.log('订阅上下线成功')
					},
					onFailed: function (error) {
						console.log('订阅好友上下线失败',error)
					}
				});
			},
			hereNow () {
				let self = this;
				let friendIds = [];
				this.friends.map(friend => {
					friendIds.push(friend.uuid);
				})
				this.goEasy.im.hereNow({
					userIds: friendIds,
					onSuccess: function (result) {
						result.content.map(friend => {
							self.friends.map(item => {
								if(item.uuid == friend.id) {
									item.online = true;
								}
							})
						})
					},
					onFailed: function (error) {
						console.log('获取好友在线状态失败',error)
					}
				});
			},
			enterChat (uuid, type) {//进入私聊
				let path = type === this.GoEasy.IM_SCENE.PRIVATE
						? '../chat/privateChat/privateChat?to=' + uuid
						: '../chat/groupChat/groupChat?to=' + uuid;
				uni.navigateTo({
					url: path
				})
			}
		}
	}
</script>

<style lang="scss">
	// .contacts{
	// 	width: 100%;
	// 	height: 100%;
	// 	display: flex;
	// 	flex-direction: column;
	// }
	// .contacts .contacts-container{
	// 	width: 100%;
	// 	/* overflow: auto; */
	// }
	
	// .contacts .user-list-item{
	//   height: 132rpx;
	//   padding-left: 32rpx;
	// 	display: flex;
	// 	align-items: center;
	// }
	// .contacts .contacts-title{
	// 	height: 80rpx;
	// 	line-height: 100rpx;
	// 	font-size: 30rpx;
	// 	color: #666666;
	// 	background: #F3F4F7;
	// 	text-indent: 44rpx;
	// }
	
	// .contacts .user-list{
	// 	flex-grow: 1;
	// 	background: #ffffff;
	// 	display: flex;
	// 	flex-direction: column;
	// }
	// .contacts .user-item-avatar{
	//   width: 96rpx;
	//   height: 96rpx;
	//   margin-right: 32rpx;
	// 	overflow: hidden;
	// 	position: relative;
	// }
	// .contacts .user-item-avatar image{
	// 	width: 100%;
	// 	height: 100%;
	// 	display: block;
	// }
	// .contacts .user-item-info{
	//   	height: 130rpx;
	//   	padding-right: 32rpx;
	//   	line-height: 88rpx;
	// 	flex-grow: 1;
	// 	border-bottom: 1px solid #EFEFEF;
	// 	display: flex;
	// 	justify-content: space-between;
	// 	align-items: center;
	// }
	// .contacts .user-item-info__name{
	//   	font-size: 30rpx;
	// 	font-family: Source Han Sans CN;
	// 	font-style: normal;
	// 	font-weight: bold;
	// 	color: #262628;
	// }
	// .contacts .user-item-info__tips{
	//   height: 44rpx;
	//   width: 64rpx;
	//   border-radius: 24rpx;
	//   font-size: 26rpx;
	//   line-height: 44rpx;
	// 	background: #D02129;
	// 	color: #ffffff;
	// 	font-family: Cabin;
	// 	text-align: center;
	// }
	// .contacts .online-dot{
	//   position: absolute;
	//   width: 32rpx!important;
	//   height: 32rpx!important;
	//   right: 0;
	//   bottom: 0;
	// }
	// .contacts .online-tips{
	// 	font-size: 28rpx;
	// 	color: #666666;
	// }
</style>
