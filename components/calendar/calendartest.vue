<template>
	<view>
		<view class = "calendar_mod">
		    <uni-calendar 
		    :insert = "true"
		    @change="change"
		    />
			<!-- <view>
				<button class = "button_box" @click = "click_event">
					<view class = "add_tab">
						添加任务
					</view>
				</button>
			</view> -->
			<view @click="open" class="addlist">
				<text class="textt">+ 添加任务</text>
			</view>

			<uni-popup ref="popup" :mask-click="false" type="bottom" background-color="#fff">
				
				<view class="popup_box">
					<!-- <text>
						日期：{{setdate}}
					</text> -->
					
					<uni-forms border>
					    <uni-forms-item label="日期">
					        {{setdate}}
					    </uni-forms-item>
					    <uni-forms-item label="内容" border>
					        <uni-easyinput type="textarea" v-model="content" :inputBorder="false" placeholder="请输入任务内容"></uni-easyinput>
					    </uni-forms-item>
					</uni-forms>
				</view>
				
				<!-- <view class="buttons"> -->
					<button @click="click_event">
						<!-- <text>返回</text> -->
						确认
					</button>
					<button @click="close">
						返回
					</button>
				<!-- </view> -->
				
			</uni-popup>
			
		</view>
	</view>
</template>

<script>
	import {mapGetters} from 'vuex'
	const db = uniCloud.database();
	const usersTable = db.collection('uni-id-users')
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
		data() {
			return {
				info: {
					
				},
				setdate: getDate(new Date()).fullDate,
				todaydate: getDate(new Date()).fullDate,
				content: ''
			}
		},
		mounted() {
			// this.setdate = getDate(new Date()).fullDate
			// this.$nextTick(() => {
			// 	this.showCalendar = true
			// })
			
			// this.setdate = this.info.date
		},
		computed: {
			...mapGetters({
				userInfo: 'user/info'
			})
		},
		methods: {
			change(e) {
				// console.log('change 返回:', e)
				// 模拟动态打卡
				// if (this.info.selected.length > 5) return
				// this.info.selected.push({
				// 	date: e.fulldate,
				// 	info: '打卡'
				// })
				this.setdate = e.fulldate
			},
			click_event() {
				// this.num++;
				if(this.content != ''){
					const todoTable = db.collection('todolist');
					
					db.collection('todolist').where({
						user_id: this.userInfo._id,
						date: this.setdate
					}).get().then((res)=>{
						if(res.result.data.length >= 3){
							uni.showToast({
								title: "当天已有3条任务",
								icon: "none"
							})
						}
						else{
							todoTable.add({
								"task": this.content,
								"date": this.setdate,
								// "_date": this.setdate,
								// "state": true,
								// "user_id": usersTable._id,
							})
						}
					})
					uni.showTabBar();
					this.$refs.popup.close()
				}
				else{
					uni.showToast({
						title: '任务内容不能为空',
						// duration: 2000,
						icon: 'none'
					});
					// this.$refs.popup3.open('center')
					// this.$refs.popup3.close()
				}
			},
			open(){
				if(this.setdate < this.todaydate){
					uni.showToast({
						title: '请在未来的日期添加任务',
						// duration: 2000,
						icon: 'none'
					});
				}
			        // 通过组件定义的ref调用uni-popup方法 ,如果传入参数 ，type 属性将失效 ，仅支持 ['top','left','bottom','right','center']
			    else{
					uni.hideTabBar();
					this.$refs.popup.open('bottom')
				}
			},
			close(){
				uni.showTabBar();
				this.$refs.popup.close()
			}
		}
	}
</script>

<style lang="scss">
	.calendar_mod {
		padding: 10px;
	}
	.button_box {
		display: flex;
		background-color: #eef;
		justify-content: center;
		width: 100px;
	}
	.add_tab {
		display: flex;
		font-size: 15px;
		line-height: 30px;
		align-items: center;
		justify-content: center;
		
		/* background-color: #eef; */
		/* text-font: 20px, */
	}
	.buttons {
		display: flex;
		flex-direction: row;
	}
	.popup_box {
		display: flex;
		flex-direction: column;
		padding: 20px;
	}
	.addlist{
		background-color:#FFFFFF;
		border-radius: 20rpx;
		height:60px;
		margin-left: 3rpx;
		margin-right: 3rpx;
		margin-bottom: 20rpx;
		margin-top: 100rpx;
		text-align: center;
		align-content: center;
		justify-content: center;
		display:flex;
		flex-direction: column;
		.textt{
			justify-content: center;
			font-weight: 600;
		}
	}
</style>
