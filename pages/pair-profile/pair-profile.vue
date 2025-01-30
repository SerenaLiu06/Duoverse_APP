<template>
	<view>
		<view v-if="ifpaired" style="display: flex; justify-content: center; color: #999; padding-top: 50px">
			此用户已匹配
		</view>
		<view v-else style="display:inherit">
			<view class="info">
				<image :src="avatar" class="image"  :mode="mode"></image>
				<text class="name">{{nickname}}</text>
				<!-- <text class="last">\n上次登录：{{formatDate(logdate)}}</text> -->
			</view>
			<view class="interestbox1">
				<text class="interest">-------兴趣标签-------</text>
			</view>
			<view class="interestbox">
				<view class="interestlist" v-for="(item,index) in interests" :key="index">
					<uni-icons type="heart"></uni-icons>
					<text>{{item}}</text>
				</view>
			</view>
			<view class="intro">
				<text style="display: flex; justify-content: center; padding: 5px; font-weight: 600">留言</text>
				<text style="display: flex; padding: 10px 15px">
					{{self_intro}}
				</text>
			</view>
			<view v-if="ifrequest" class="choice">
				<view @click="confirm" class="choice2">同意匹配申请</view>
				<view @click="reject" class="choice2">拒绝匹配申请</view>
			</view>
			<view v-else class="add" @click="sendpairrequest">
				<view><text class="add-text">申请匹配</text></view>
			</view>
			
			
			<!-- <view v-if="ifrequest">
				<button @click='confirm'>同意匹配申请</button>
				<button @click='reject'>拒绝匹配申请</button>
			</view>
			
			<button v-else @click='sendpairrequest'>申请匹配</button> -->
		</view>
		
	</view>
</template>

<script>
	import {mapGetters} from 'vuex'
	const db = uniCloud.database();
	
	export default {
		data() {
			return {
				self_intro: '',
				interests: [],
				avatar: '',
				nickname: '',
				userid: '',
				ifpaired: false,
				ifrequest: false //true：对方已申请自己
			}
		},
		computed: {
			...mapGetters({
				userInfo: 'user/info'
			})
		},
		props: {
			mode: {
				type:String,
				default () {
					return 'widthFix'
				}
			},
			src: {
				// type:String,
				default () {
					return ""
				}
			},
			width: {
				type:String,
				default () {
					return '150rpx'
				}
			},
			height: {
				type:String,
				default () {
					return '150rpx'
				}
			}
		},
		methods: {
			sendpairrequest() {
				db.collection('new-pair').where({
					user_id: this.userid
				}).field('_id, request_list').get().then((res)=>{
					
					if(res.result.data.length == 0){
						
						db.collection('new-pair').add({
							'user_id': this.userid,
							'request_list': [this.userInfo._id]
						})
						
					}
					else{
						let newlist = res.result.data[0].request_list
						let ifrequest = false
						for(var i = 0; i < newlist.length; i++){
							if(newlist[i] == this.userInfo._id){
								ifrequest = true
								break
							}
						}
						if(!ifrequest){
							newlist.push(this.userInfo._id)
							
							db.collection('new-pair').where({
								_id: res.result.data[0]._id
							}).update({
								'request_list': newlist
							}).then(e=>{
								uni.showToast({
									title: "成功发送匹配申请",
									icon: "none"
								})
							})
							
						}
						else{
							uni.showToast({
								title: "已发送过匹配申请",
								icon: "none"
							})
						}
					}
				})
			},
			confirm() {
				db.collection('new-pair').where({
					user_id: this.userInfo._id
				}).update({
					request_list: []
				})
				
				db.collection('friends').where({
					user_id: this.userInfo._id
				}).get().then((res)=>{
					let lst = res.result.data[0].friend_list
					let flag = false
					for(var i = 0; i < lst.length; i++){
						if(lst[i] === this.userid){
							flag = true
							break
						}
					}
					if(!flag){
						lst.push(this.userid)
						db.collection('friends').where({
							user_id: this.userInfo._id
						}).update({
							friend_list: lst
						})
					}
				})
				db.collection('friends').where({
					user_id: this.userid
				}).get().then((res)=>{
					let lst = res.result.data[0].friend_list
					let flag = false
					for(var i = 0; i < lst.length; i++){
						if(lst[i] === this.userInfo._id){
							flag = true
							break
						}
					}
					if(!flag){
						lst.push(this.userInfo._id)
						db.collection('friends').where({
							user_id: this.userid
						}).update({
							friend_list: lst
						})
					}
				})
				db.collection('uni-id-users').where({
					_id: this.userid
				}).update({
					ifpaired: true
				})
				db.collection('uni-id-users').where({
					_id: this.userInfo._id
				}).update({
					ifpaired: true
				})
				db.collection('pair-list').add({
					user1_id: this.userid,
					user2_id: this.userInfo._id
				})
				db.collection('to-be-paired').where({
					user_id: this.userid
				}).remove()
				db.collection('to-be-paired').where({
					user_id: this.userInfo._id
				}).remove()
				uni.navigateBack({
					animationType: "fade-out"
				})
			},
			reject() {
				db.collection('new-pair').where({
					user_id: this.userInfo._id
				}).field('request_list').get().then((res)=>{
					let lst = res.result.data[0].request_list
					let newlst = []
					for(var i = 0; i < lst.length; i++){
						if(lst[i] !== this.userid){
							newlst.push(lst[i])
						}
					}
					db.collection('new-pair').where({
						user_id: this.userInfo._id
					}).update({
						'request_list': newlst
					})
				})
				uni.showToast({
					title: "已拒绝匹配申请",
					icon: "none"
				})
				uni.navigateTo({
					url: '../list/list'
				})
			}
		},
		onLoad(option) {
			this.userid = option.to
			this.interests = []
			db.collection('to-be-paired').where({
				user_id: option.to
			}).get().then((res)=>{
				if(res.result.data.length){
					this.self_intro = res.result.data[0].self_intro
					// this.interests = res.result.data[0].interest
					
				}
				else{
					this.self_intro = '暂无介绍'
					
				}
			})
			db.collection('uni-id-users').where({
				_id: option.to
			}).field('nickname, avatar_file, ifpaired, interests').get().then((res)=>{
				this.avatar = res.result.data[0].avatar_file ? res.result.data[0].avatar_file.url : ''
				this.nickname = res.result.data[0].nickname
				this.ifpaired = res.result.data[0].ifpaired ? res.result.data[0].ifpaired : false
				for(var i = 0; i < res.result.data[0].interests.length; i++){
					this.interests.push(res.result.data[0].interests[i])
					// if(i == 0){
					// 	this.interests += res.result.data[0].interests[i]
					// }
					// else{
					// 	this.interests += '、' + res.result.data[0].interests[i]
					// }
				}
				if(this.interests === ''){
					this.interests = '该用户暂未选择ta的兴趣'
				}
			})
			//denghuier
			db.collection("new-pair").where({
				user_id: this.userInfo._id
			}).field('request_list').get().then((res)=>{
				if(res.result.data[0]){
					for(var i = 0; i < res.result.data[0].request_list.length; i++){
						if(res.result.data[0].request_list[i] === this.userid){
							this.ifrequest = true
							break
						}
					}
				}
			})
		}
	}
</script>

<style lang="scss">
	.info{
		margin-left: 5%;
		margin-right: 5%;
		border-radius: 20rpx;
		margin-top: 10rpx;
		margin-bottom: 20rpx;
		display:flex;
		flex-direction: column;
		align-items: center;
		.hi{
			
		}
		.image{
			margin-top: 20rpx;
			width:150px;
			border-radius: 20rpx;
		}
		.name{
			font-size: 20px;
			font-weight: 600;
		}
		.last{
			color:#666666;
			font-size:15px;
		}
	}
.interestbox{
	margin-left: 10%;
	margin-right: 10%;
	border-radius: 20rpx;
	margin-top: 10rpx;
	margin-bottom: 20rpx;
	background-color: #FFF0F5;
	display:flex;
	flex-direction: column;
	align-items: center;
	padding-bottom: 10px;
	.interestlist{
		margin-top: 20rpx;
	}
}
.interest{
	// margin-left: 27%;
	// margin-right:27%;
	display: flex;
	justify-content: center;
	font-weight: 600;
}
.add{
	height:100rpx;
	margin-left: 5%;
	margin-right: 5%;
	border-radius: 100rpx;
	margin-top: 80%;
	background:linear-gradient(to right, #ff9569 0% ,#e92758 100%);
	display:flex;
	flex-direction: column;
	text-align: center;
	justify-content: center;
	.add-text{
		font-weight: 600;
		
	}
}
.choice{
	display:flex;
	flex-direction: row;
	.choice2{
			height:100rpx;			width:40%;
			margin-left: 5%;
			margin-right: 5%;
			border-radius: 100rpx;
			margin-top: 80%;
			background:linear-gradient(to right, #ff9569 0% ,#e92758 100%);
			display:flex;
			flex-direction: column;
			text-align: center;
			justify-content: center;
	}
}
	
	.intro {
		
		display: flex;
		flex-direction: column;
		border-radius: 20rpx;
		padding-top: 5px;
		margin-top: 15px;
		margin-left: 10%;
		margin-right: 10%;
		background-color: #FFF4F8;
		
	}
</style>
