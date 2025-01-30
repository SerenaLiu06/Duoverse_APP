<template>
	<view style="width: 100%">
		<view class="dxbox">
			<image :src="info.avatar" class="image"></image>
			<view class="textbox">
				<text style="padding-left: 20px; padding-top: 10px; font-size: 20px; font-weight: 500;">
					{{info.nickname}}
				</text>
				<text style="padding-left: 20px; padding-top: 5px; font-size: 12px; color: #999999">
					上次登录：{{formatDate(this.info.last_login_date)}}
				</text>
				<view v-if="cominterests" style="padding-top: 10px; padding-left: 20px; display: flex; flex-direction: row">
					<view v-for="(item, index) in cominterests" :key="index">
						<view style="background-color: #EEDDFF; padding: 10px; border-radius: 20rpx; margin-right: 10px; color: #444444; font-weight: 500;">
							{{item}}
						</view>
						
					</view>
				</view>
				<view v-else>
					<text style="padding-top: 10px; padding-left: 20px; color: #999999">
						暂无共同兴趣
					</text>
				</view>
			<!-- </view> -->

			</view>
		</view>
		
		<view style="display: flex; flex-direction: row">
			<!-- <uni-icons style="padding-top: 8px; padding-left: 5px;" type="search" size="30"></uni-icons> -->
			<text class="subtitle"> 对方的To-Do </text>
		</view>
		
		<scroll-view class="scroll-y" scroll-y="true">
			<uni-list>
				<view v-for="(item, index) in todo"  :key="index">
					
					<uni-list-item :title="item.date + ': ' + item.task"></uni-list-item>
					
				</view>
				<text v-if="!tdflag" style="display: flex; justify-content: center; padding: 5px; color: #999999; font-size: 12px;">
					已经到底了
				</text>
				<text v-else style="display: flex; justify-content: center; padding: 5px; color: #999999; font-size: 12px;">
					仅显示5条
				</text>
			</uni-list>
		</scroll-view>
		
		<view style="display: flex; flex-direction: row">
			<!-- <uni-icons style="padding-top: 8px; padding-left: 5px;" type="calendar-filled" size="30"></uni-icons> -->
			<text class="subtitle"> 我的To-Do </text>
		</view>
		<scroll-view class="scroll-y" scroll-y="true">
			<uni-list>
				<view v-for="(item, index) in mytodo"  :key="index">
					
					<uni-list-item :title="item.date + ': ' + item.task"></uni-list-item>
					
				</view>
				<text v-if="!mtdflag" style="display: flex; justify-content: center; padding: 5px; color: #999999; font-size: 12px;">
					已经到底了
				</text>
				<text v-else style="display: flex; justify-content: center; padding: 5px; color: #999999; font-size: 12px;">
					仅显示5条
				</text>
			</uni-list>
		</scroll-view>
		<view class="button1" @click='navigateToChat()'>
			<text style="display: flex; justify-content: center; padding: 8px; font-weight: 500;">
				聊 天
			</text>
		</view>
		
		<view class="button2" @click="cancelpair">
			<text style="display: flex; justify-content: center; padding: 8px; font-weight: 500; color: #FF3333">
				解 绑
			</text>
		</view>
		<uni-popup ref="popup" type="dialog">
		    <uni-popup-dialog mode="base" message="提示" title="提示" content="确定要解绑吗？" @close="closepopup" @confirm="confirmpopup"></uni-popup-dialog>
		</uni-popup>
		<!-- <button @click='navigateToChat()'>私聊</button> -->
	</view>
</template>

<script>
	import {mapGetters} from 'vuex'
	const db = uniCloud.database();
	function getDate(date, AddDayCount = 0) {
		if (!date) {
			date = new Date()
		}
		if (typeof date !== 'object') {
			date = date.replace(/-/g, '/')
		}
		const dd = new Date(date)
	
		dd.setDate(dd.getDate() + AddDayCount) // 获取AddDayCount天后的日期
	
		const y = dd.getFullYear()
		const m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1 // 获取当前月份的日期，不足10补0
		const d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate() // 获取当前几号，不足10补0
		return {
			fullDate: y + '-' + m + '-' + d,
			year: y,
			month: m,
			date: d,
			day: dd.getDay()
		}
	}
	export default {
		name:"paired-ui",
		data() {
			return {
				duixiang: '',
				todo: [],
				tdflag: false,
				mytodo: [],
				mtdflag: false,
				info: {},
				myinterests: [],
				cominterests: [],
				// theirinterests: [],
				today: getDate(new Date()).fullDate,
				defaultavatar: "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b7ef8d49-ed26-4d4e-ae01-df1eb1688fb0/bc4fb287-399c-403b-a932-e75fc2563e20."
			};
		},
		computed: {
			...mapGetters({
				userInfo: 'user/info'
			})
		},
		async mounted() {
			uni.showLoading({
				title: "加载中",
				mask: true
			})
			this.todo = []
			this.mytodo = []
			let res1 = await db.collection('pair-list').where({user1_id: this.userInfo._id}).get()
			let res2 = await db.collection('pair-list').where({user2_id: this.userInfo._id}).get()
			// let res
			if(res1.result.data.length){
				this.duixiang = res1.result.data[0].user2_id
			}
			else if(res2.result.data.length){
				this.duixiang = res2.result.data[0].user1_id
			}
			else{
				db.collection("uni-id-users").where({
					_id: this.userInfo._id
				}).update({
					ifpaired: false
				})
			}
			let res3 = await db.collection('uni-id-users').where({
				_id: this.duixiang
			}).field('avatar_file, nickname, interests, last_login_date').get()
			this.info = res3.result.data[0]
			this.info.avatar = this.info.avatar_file ? this.info.avatar_file.url : this.defaultavatar
			// this.info.interests = this.in
			let res4 = await db.collection('uni-id-users').where({
				_id: this.userInfo._id
			}).field('interests').get()
			this.myinterests = res4.result.data[0].interests
			// console.log('their:', this.info.interests)
			// console.log('my:', this.myinterests)
			for(var i = 0; i < this.info.interests.length; i++){
				for(var j = 0; j < this.myinterests.length; j++){
					if(this.info.interests[i] === this.myinterests[j]){
						this.cominterests.push(this.myinterests[j])
					}
				}
			}
			// console.log('info: ', this.info)
			let res5 = await db.collection('todolist').where({
				user_id: this.duixiang,
			}).orderBy('date asc').get()
			for(var i = 0; i < res5.result.data.length; i++){
				if(this.todo.length === 5){
					this.tdflag = true
				}
				if(res5.result.data[i].date >= this.today && this.todo.length < 5){
					this.todo.push(res5.result.data[i])
				}
			}
			// this.todo = res5.result.data
			let res6 = await db.collection('todolist').where({
				user_id: this.userInfo._id
			}).orderBy('date asc').get()
			for(var i = 0; i < res6.result.data.length; i++){
				if(this.mytodo.length === 5){
					this.mtdflag = true
				}
				if(res6.result.data[i].date >= this.today && this.mytodo.length < 5){
					this.mytodo.push(res6.result.data[i])
				}
			}
			// this.mytodo = res6.result.data
			// console.log('todo1: ', this.todo)
			uni.hideLoading()
			// console.log(res)
		},
		methods: {
			navigateToChat () {
				let path = '../chat/privateChat/privateChat?to=' + this.duixiang
				uni.navigateTo({
					url: path
				});
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
		}
	}
</script>

<style scoped lang="scss">
	.scroll-y {
		/* height: 300rpx */
	}
	.dxbox {
		display: flex;
		flex-direction: row;
		padding-left: 10px;
		padding-right: 10px;
	}
	.image{
		
		margin-top: 20rpx;
		height: 100px;
		width: 100px;
		border-radius: 20rpx;
	}
	.textbox {
		display: flex;
		flex-direction: column;
	}
	.subtitle {
		// padding: 10px;
		padding-top: 20px;
		padding-bottom: 5px;
		padding-left: 10px;
		padding-right: 10px;
	}
	.button1 {
		display: flex; 
		flex-direction: row;
		justify-content: center; 
		margin-left: 20px;
		margin-right: 20px;
		// width: 200px; 
		// position: relative;
		border-radius: 20rpx; 
		margin-top: 30px; 
		background-color: #DDDDFF;
	}
	.button2 {
		display: flex; 
		flex-direction: row;
		justify-content: center; 
		margin-left: 20px;
		margin-right: 20px;
		// width: 200px; 
		// position: relative;
		border-radius: 20rpx; 
		margin-top: 15px; 
		background-color: #FFDDDD;
	}
</style>
