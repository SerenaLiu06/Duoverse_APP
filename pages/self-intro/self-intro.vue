<template>
	<view>
		<!-- <text style="padding-left: 20px; padding-top: 20px; font-weight: 500;">
			兴趣标签
		</text> -->
		<view style="display: flex; flex-direction: row;">
			<uni-icons style="padding-top: 8px; padding-left: 8px;" type="heart" size="30"></uni-icons>
			<text class="subtitle"> 兴趣标签 </text>
		</view>
		<!-- <view v-for="(item,ind<!-- ex) in interests" :key="index">
			{{item}}
		</view> -->
		<view class="interestlist">
			<view v-for="(item, index) in interests" :key="index">
				<view style="background-color: #EEDDFF; padding: 10px; border-radius: 40rpx; margin-right: 13px; color: #444444; font-weight: 500; margin-top:10rpx">
					{{item}}
				</view>
				
			</view>
		</view>
		
		
		<view style="display: flex; flex-direction: row;">
			<uni-icons style="padding-top: 8px; padding-left: 8px;" type="compose" size="30"></uni-icons>
			<text class="subtitle"> 留言 </text>
		</view>
		
		<view v-if="datastatus=='1'">
			<unicloud-db ref="udb" loadtime="manual" where="user_id==$cloudEnv_uid" getone="true" v-slot:default="{data, loading, error, options}" collection="to-be-paired">
				<view v-if="error">{{error.message}}</view>
				<view v-else>
					<view v-if="data">
						<view class="inputbox">
							<uni-easyinput type="textarea" :value="data.self_intro" v-model="value"></uni-easyinput>
						</view>
						
						<button></button>
						<!-- <view v-if="pairstatus==true">匹配状态中</view> -->
						<view style="padding-left: 15px; padding-bottom: 10px">
							<text>匹配状态：</text>
							<text v-if="data.status==true">匹配中</text>
							<text v-else>未在匹配</text>
						</view>
						<view v-if="data.status==false">
							<view class="postbutton" @click="re_post(data.self_intro)">
								<text style="display: flex; justify-content: center; font-weight: 500">
									发 布
								</text>
							</view>
							<!-- <button @click="re_post(data.self_intro)">发布</button> -->
						</view>
						<view v-else class="cancelbutton" @click="cancel_pair">
							<text style="display: flex; justify-content: center; font-weight: 500">
								取消匹配状态
							</text>
						</view>
						<!-- <button v-else @click="cancel_pair">取消匹配状态</button> -->
					</view>
					<!-- {{data}} -->
					
					
				</view>
			</unicloud-db>
			
		</view>
		<view v-else>
			<view class="inputbox">
				<uni-easyinput type="textarea" v-model="value" placeholder="简单介绍一下你和你的兴趣吧!"></uni-easyinput>
			</view>
			<view class="postbutton" @click="post">
				<text style="display: flex; justify-content: center; font-weight: 500">
					发 布
				</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapGetters} from 'vuex'
	const db = uniCloud.database();
	
	export default {
		data() {
			return {
				datastatus: '0',
				pairstatus: false,
				intro_content: '',
				interests: [],
				value: ''
				
			}
		},
		computed: {
			...mapGetters({
				userInfo: 'user/info'
			})
		},
		methods: {
			modify() {
				
			},
			refresh() {
				if(this.datastatus === '1'){
					this.$refs.udb.loadData({
						clear: true
					})
				}
			},
			re_post(intro) {
				let newcontent
				newcontent = this.value ? this.value : intro
				db.collection('to-be-paired').where({
					user_id: this.userInfo._id
				}).update({
					status: true,
					self_intro: newcontent,
					interest: this.interests
				})
				uni.showToast({
					title: '发布成功',
					icon: 'none'
				})
				this.refresh()
				// uni.navigateBack({
				// 	animationType: 'fade-out'
				// })
			},
			cancel_pair() {
				db.collection('to-be-paired').where({
					user_id: this.userInfo._id
				}).update({
					status: false,
					interest: this.userInfo.interests
				})
				uni.showToast({
					title: '取消成功',
					icon: 'none'
				})
				this.refresh()
				// uniCloud.refresh()
				// uni.navigateBack({
				// 	animationType: 'fade-out'
				// })
			},
			post() {
				db.collection('to-be-paired').add({
					user_id: this.userInfo._id,
					self_intro: this.value,
					interest: this.interests,
					status: true
				})
				uni.navigateBack({
					animationType: 'fade-out'
				})
				uni.showToast({
					title: '发布成功',
					icon: 'none'
				})
				this.datastatus = '1'
				// this.refresh()
				// uni.navigateBack({
				// 	animationType: 'fade-out'
				// })
			}
			
		},
		onLoad(option) {
			this.datastatus = option.status
			db.collection('uni-id-users').where({
				_id: this.userInfo._id
			}).field("interests").get().then((res)=>{
				this.interests = res.result.data[0] ? res.result.data[0].interests : []
			})
			// this.refresh()
			// if(this.datastatus == '1'){
			// 	// console.log(h)
			// 	db.collection('to-be-paired').where({
			// 		user_id: this.userInfo._id
			// 	}).get().then((res)=>{
					
			// 		this.intro_content = res.result.data[0].self_intro
			// 		this.pairstatus = res.result.data[0].status
			// 	})
			// }
		},
		onReady() {
			if(this.$refs.udb){
				this.$refs.udb.loadData()
			}
			
		}
	}
</script>

<style lang="scss">
	.subtitle {
		// padding: 10px;
		padding-top: 13px;
		padding-bottom: 5px;
		padding-left: 10px;
		padding-right: 10px;
		// font-size: 60px;
	}
	.inputbox {
		display: flex;
		padding-top: 10px;
		padding-bottom: 10px;
		margin-left: 10px;
		margin-right: 10px;
		border-radius: 30rpx;
	}
	.postbutton {
		display: flex;
		justify-content: center;
		margin-top: 10px;
		margin-left: 20px;
		margin-right: 20px;
		padding-top: 10px;
		padding-bottom: 10px;
		border-radius: 20rpx;
		background-color: #FFDDFF
		
	}
	.cancelbutton {
		display: flex;
		justify-content: center;
		margin-top: 10px;
		margin-left: 20px;
		margin-right: 20px;
		padding-top: 10px;
		padding-bottom: 10px;
		border-radius: 20rpx;
		background-color: #FFDDDD
	}
	.interestlist{
		display: flex; 
		flex-direction: row;
		flex-wrap: wrap;
		padding-top: 5px; 
		padding-left: 15px; 
		padding-right: 15px; 
		padding-bottom: 10px;
	}
</style>
