<template>
	<view>
		<!-- <scroll-view class="conversations" scroll-y="true">
			<view v-if="conversations.length !=0">
				<view class="scroll-item" v-for="(conversation, key) in conversations" :key="key">
					<view class="item-head">
						<image :src="conversation.data.avatar" class="head-icon"></image>
						<view class="item-head_unread" v-if="conversation.unread">{{conversation.unread}}</view>
					</view>
					<view class="scroll-item_info">
						<view class="item-info-top">
							<text class="item-info-top_name">{{conversation.data.name}}</text>
							<view class="item-info-top_time">{{formatDate(conversation.lastMessage.timestamp)}}</view>
						</view>
						<view class="item-info-bottom">
							<view class="item-info-bottom-item" @click="navigateToChat(conversation)">
								<view class="item-info-top_content" v-if="conversation.lastMessage.type == 'text'">{{conversation.lastMessage.payload.text}}</view>
								<view class="item-info-top_content" v-else-if="conversation.lastMessage.type == 'video'">[视频消息]</view>
								<view class="item-info-top_content" v-else-if="conversation.lastMessage.type == 'audio'">[语音消息]</view>
								<view class="item-info-top_content" v-else-if="conversation.lastMessage.type == 'image'">[图片消息]</view>
								<view class="item-info-top_content" v-else-if="conversation.lastMessage.type == 'file'">[文件消息]</view>
								<view class="item-info-top_content" v-else-if="conversation.lastMessage.type == 'order'">[自定义消息:订单]</view>
								<view class="item-info-top_content" v-else>[[未识别内容]]</view>
								<view class="item-info-bottom_action" @click.stop="showAction(conversation)"></view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="no-conversation" v-else>
				当前没有会话
			</view>
			<view class="action-container" v-if="action.show">
				<view class="layer" @click="action.show = false"></view>
				<view class="action-box">
					<view class="action-item" @click="topConversation">{{action.conversation.top ? '取消置顶' : '置顶聊天'}}</view>
					<view class="action-item" @click="removeConversation">删除聊天</view>
				</view>
			</view>
		</scroll-view>
		 -->
		
		<uni-list>
		    <uni-list :border="true">
				<!-- <text>私聊</text> -->
				<view v-if="conversations.length != 0">
					<!-- <view>{{conversations}}</view> -->
					<view v-for="(conversation, key) in conversations" :key="key">
						<view v-if="conversation.lastMessage.type == 'text'">
							<!-- {{conversation.unread}} -->
							<uni-list-chat :avatar-circle="false" 
							:title="conversation.data.name" 
							:avatar="conversation.data.avatar" 
							:clickable="true"
							@click="navigateToChat(conversation)" 
							:time="formatDate(conversation.lastMessage.timestamp)" 
							:note="conversation.lastMessage.payload.text" 
							:showbadge="conversation.unread" 
							badge-positon="left" 
							:badge-text="conversation.unread">
							</uni-list-chat>
						</view>
						<view v-else-if="conversation.lastMessage.type == 'video'">
							<uni-list-chat :avatar-circle="false"
							:title="conversation.data.name" 
							:avatar="conversation.data.avatar" 
							:clickable="true"
							@click="navigateToChat(conversation)" 
							:time="formatDate(conversation.lastMessage.timestamp)" 
							note="[视频消息]" 
							:showbadge="conversation.unread" 
							badge-positon="left" 
							:badge-text="conversation.unread">
							</uni-list-chat>
						</view>
						<view v-else-if="conversation.lastMessage.type == 'audio'">
							<uni-list-chat :avatar-circle="false"
							:title="conversation.data.name" 
							:avatar="conversation.data.avatar" 
							
							@click="navigateToChat(conversation)" 
							:time="formatDate(conversation.lastMessage.timestamp)" 
							note="[语音消息]" 
							:showbadge="conversation.unread" 
							badge-positon="left" 
							:badge-text="conversation.unread">
							</uni-list-chat>
						</view>
						<view v-else-if="conversation.lastMessage.type == 'image'">
							<uni-list-chat :avatar-circle="false"
							:title="conversation.data.name" 
							:avatar="conversation.data.avatar" 
							:clickable="true"
							@click="navigateToChat(conversation)" 
							:time="formatDate(conversation.lastMessage.timestamp)" 
							note="[图片消息]" 
							:showbadge="conversation.unread" 
							badge-positon="left" 
							:badge-text="conversation.unread">
							</uni-list-chat>
						</view>
						<view v-else-if="conversation.lastMessage.type == 'file'">
							<uni-list-chat :avatar-circle="false"
							:title="conversation.data.name" 
							:avatar="conversation.data.avatar" 
							:clickable="true"
							@click="navigateToChat(conversation)" 
							:time="formatDate(conversation.lastMessage.timestamp)" 
							note="[文件消息]" 
							:showbadge="conversation.unread" 
							badge-positon="left" 
							:badge-text="conversation.unread">
							</uni-list-chat>
						</view>
						<view v-else>
							<uni-list-chat :avatar-circle="false"
							:title="conversation.data.name" 
							:avatar="conversation.data.avatar" 
							:clickable="true"
							@click="navigateToChat(conversation)" 
							:time="formatDate(conversation.lastMessage.timestamp)" 
							note="[[未识别内容]]" 
							:showbadge="conversation.unread" 
							badge-positon="left" 
							:badge-text="conversation.unread">
							</uni-list-chat>
						</view>
					</view> 
				</view>
				<view class="no-conversation" v-else>
					<text style="color: #999; display: flex; justify-content: center;" >
						当前没有会话
					</text>
				</view>
		        
		    </uni-list>
		</uni-list>
	</view>
</template>

<script>
	import IMService from "../../lib/imservice";
	const db = uniCloud.database();
	const userTable = db.collection('uni-id-users');
	export default {
		name:"conversation-list",
		data() {
			return {
				unreadTotal : 0,
				conversations : [],
				action : {
					conversation : null,
					show : false
				},
				current_user: {}
			};
		},
		mounted() {
			let currentUser = {}
			userTable.where({
				_id: db.getCloudEnv('$cloudEnv_uid')
			}).field('_id, nickname, avatar_file').get().then((res)=>{
				currentUser = res.result.data[0]
				// console.log(currentUser)
				// console.log(this.flist)
				// res 为数据库查询结果
				// getApp().globalData.imService.connect(currentUser);
				if(this.goEasy.getConnectionStatus() === 'disconnected') {
					getApp().globalData.imService= new IMService(this.goEasy,this.GoEasy);
					getApp().globalData.imService.connect(currentUser);
				}
				uni.showLoading();
						
				let self = this;
				this.goEasy.im.on(this.GoEasy.IM_EVENT.CONVERSATIONS_UPDATED, (content) => {
					self.renderConversations(content);
				});
				//加载会话列表
				this.goEasy.im.latestConversations({
					onSuccess: function (result) {
						let content = result.content;
							self.renderConversations(content);
							uni.hideLoading();
					},
					onFailed: function (error) {
						//获取失败
						uni.hideLoading()
						console.log("失败获取最新会话列表, code:" + error.code + " content:" + error.content);
					}
				});
						
						
						
						// goeasy.connect({
						//     id:"001", //pubsub选填，im必填，最大长度60字符
						//     data:{"avatar":"/www/xxx.png","nickname":"Neo"}, //必须是一个对象，pubsub选填，im必填，最大长度300字符，用于上下线提醒和查询在线用户列表时，扩展更多的属性
						//     onSuccess: function () {  //连接成功
						// 		console.log("GoEasy connect successfully.") //连接成功
						//     },
						//     onFailed: function (error) { //连接失败
						// 		console.log("Failed to connect GoEasy, code:"+error.code+ ",error:"+error.content);
						//     },
						//     onProgress:function(attempts) { //连接或自动重连中
						// 		console.log("GoEasy is connecting", attempts);
			//        }
						// });
				
			})
			// console.log(currentUser)
			// console.log(this.currentUser)
			
			// if(this.goEasy.getConnectionStatus() === 'disconnected') {
			// 	getApp().globalData.imService= new IMService(this.goEasy,this.GoEasy);
			// 	getApp().globalData.imService.connect(currentUser);
			// }
			// uni.showLoading();
			
			// let self = this;
			// this.goEasy.im.on(this.GoEasy.IM_EVENT.CONVERSATIONS_UPDATED, (content) => {
			// 	self.renderConversations(content);
			// });
			// //加载会话列表
			// this.goEasy.im.latestConversations({
			// 	onSuccess: function (result) {
			// 		let content = result.content;
			// 		self.renderConversations(content);
			// 		uni.hideLoading();
			// 	},
			// 	onFailed: function (error) {
			// 		//获取失败
			// 		uni.hideLoading()
			// 		console.log("失败获取最新会话列表, code:" + error.code + " content:" + error.content);
			// 	}
			// });
			
			
			
			// // goeasy.connect({
			// //     id:"001", //pubsub选填，im必填，最大长度60字符
			// //     data:{"avatar":"/www/xxx.png","nickname":"Neo"}, //必须是一个对象，pubsub选填，im必填，最大长度300字符，用于上下线提醒和查询在线用户列表时，扩展更多的属性
			// //     onSuccess: function () {  //连接成功
			// // 		console.log("GoEasy connect successfully.") //连接成功
			// //     },
			// //     onFailed: function (error) { //连接失败
			// // 		console.log("Failed to connect GoEasy, code:"+error.code+ ",error:"+error.content);
			// //     },
			// //     onProgress:function(attempts) { //连接或自动重连中
			// // 		console.log("GoEasy is connecting", attempts);
		 // //        }
			// // });
		},
		methods: {
			topConversation() {
				uni.showLoading({
					title:"加载中...",
					mask: true
				});
				let conversation = this.action.conversation;
				let failedDescription = conversation.top ? '取消置顶失败' : '置顶失败';
				this.action.show = false;
				if(conversation.type === this.GoEasy.IM_SCENE.PRIVATE){
					this.goEasy.im.topPrivateConversation({
						userId: conversation.userId,
						top: !conversation.top,
						onSuccess: function () {
							uni.hideLoading();
						},
						onFailed: function (error) {
							uni.hideLoading();
							uni.showToast({
								title: failedDescription,
								icon: "none"
							});
							console.log(error);
						}
					});
				}else {
					this.goEasy.im.topGroupConversation({
						groupId: conversation.groupId,
						top: !conversation.top,
						onSuccess: function () {
							uni.hideLoading();
						},
						onFailed: function (error) {
							uni.hideLoading();
							uni.showToast({
								title: failedDescription,
								icon: "none"
							});
							console.log(error);
						}
					});
				}
			},
			removeConversation() {
				uni.showLoading({
					title:"加载中...",
					mask: true
				});
				let failedDescription = "删除失败";
				let conversation = this.action.conversation;
				this.action.show = false;
				if(conversation.type === this.GoEasy.IM_SCENE.PRIVATE){
					this.goEasy.im.removePrivateConversation({
						userId: conversation.userId,
						onSuccess: function () {
							uni.hideLoading();
						},
						onFailed: function (error) {
							uni.hideLoading();
							uni.showToast({
								title: failedDescription,
								icon: "none"
							});
							console.log(error);
						}
					});
				}else {
					this.goEasy.im.removeGroupConversation({
						groupId: conversation.groupId,
						onSuccess: function () {
							uni.hideLoading()
						},
						onFailed: function (error) {
							uni.hideLoading();
							uni.showToast({
								title: failedDescription,
								icon: "none"
							});
							console.log(error);
						}
					});
				}
			},
			renderConversations(content){
				this.conversations = content.conversations || [];
				let unreadTotal = content.unreadTotal;
				this.setUnreadAmount(unreadTotal);
			},
			setUnreadAmount (unreadTotal) {
				this.unreadTotal = unreadTotal;
				if(this.unreadTotal > 0) {
					uni.setTabBarBadge({
						index: 0,
						text: this.unreadTotal.toString()
					});
				}else{
					uni.removeTabBarBadge({
						index: 0
					});
				}
			},
			navigateToChat (conversation) {
				let path = conversation.type === this.GoEasy.IM_SCENE.PRIVATE
						? '../chat/privateChat/privateChat?to=' + conversation.userId
						: '../chat/groupChat/groupChat?to=' + conversation.groupId;
				uni.navigateTo({
					url: path
				});
			},
			showAction (conversation) {
				this.action.conversation = conversation;
				this.action.show = true;
			}
		}
	}
</script>

<style lang='scss'>
	.conversations{
		width: 750rpx;
		overflow-x: hidden;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		height: 100%;
	}
	
</style>
