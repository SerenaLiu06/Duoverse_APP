<template>
 	<view class="calendar-content" v-if="showCalendar">
 		
 		<!-- <uni-section title="插入模式" type="line"></uni-section> -->
		<view>
			<uni-calendar class="uni-calendar--hook" :selected="info.selected" :showMonth="false" @change="change" @monthSwitch="monthSwitch" />
		</view>
 		<!-- <uni-section class="hideOnPc" title="弹出模式" type="line"></uni-section> -->
 	
		<!-- <view class="example-body hideOnPc">
 			<button class="calendar-button" type="button" @click="open">打开日历</button>
 		</view> -->
		
 		<uni-calendar ref="calendar" class="uni-calendar--hook" :clear-date="true" :date="info.date" :insert="info.insert" :lunar="info.lunar" :startDate="info.startDate"
 		 :endDate="info.endDate" :range="info.range" @confirm="confirm" @close="close"/>
 	</view>
 </template>
 
 <script>
 	/**
 	 * 获取任意时间
 	 */
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
		name: "calendar",
 		components: {},
 		data() {
 			return {
 				showCalendar: false,
 				info: {
 					lunar: true,
 					range: true,
 					insert: false,
 					selected: []
 				}
 			}
 		},
 		mounted() {
 			this.$nextTick(() => {
 				this.showCalendar = true
 			})
 			// TODO 模拟请求异步同步数据
 			setTimeout(() => {
 				this.info.date = getDate(new Date(),-30).fullDate
 				this.info.startDate = getDate(new Date(),-60).fullDate
 				this.info.endDate =  getDate(new Date(),30).fullDate
 				this.info.selected = [
 				]
 			}, 2000)
 		},
 		methods: {
 			open() {
 				this.$refs.calendar.open()
 			},
 			close(){
 				// console.log('弹窗关闭');
 			},
 			change(e) {
 				// console.log('change 返回:', e)
 				// 模拟动态打卡
 				if (this.info.selected.length > 5) return
 				this.info.selected.push({
 					date: e.fulldate
 					// info: '打卡'
 				})
 			},
 			confirm(e) {
 				// console.log('confirm 返回:', e)
 			},
 			monthSwitch(e) {
 				// console.log('monthSwitchs 返回:', e)
 			}
 		}
 	}
 </script>
 
 <style lang="scss">
 	.calendar-button {
 		flex: 1;
 		font-weight: bold;
 		font-size: 32rpx;
 	}
 </style>