<template>
	<view>
		<view class="center">
			<view @click = "to_deadlines_page" class="todo">
				<image class="image1" src="../../static/todo.png"></image>
				<text class="textt">查看我的To-Do</text>
			</view>
			<view @click = "to_ranking_page" class="todo">
				<image class="image" src="../../static/ranking.png"></image>
				<text class="textt">排行榜</text>
			</view>
		</view>
		<view>
		</view>
		<view class = "calendar_page">
			<calendar/>
		</view>

	</view>
</template>

<script>
	import calendar from "../../components/calendar/calendartest.vue"
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			to_deadlines_page() {
				uni.navigateTo({
				            // url: 'test?id=1&name=uniapp'  c传递参数
					
				    url: "/pages/deadlines/deadlines"
				
				})
			},
			to_ranking_page(e) {
				uni.navigateTo({
					url: "/pages/ranking/ranking"
				})
			}
		},
		components: {
			calendar
		}
	}
</script>

<style>
	page{
		background:#B0C4DE;
	}
</style>

<style lang="scss">
	.enclose {
		position: fixed;
		/* bottom: var(--window-bottom, 0); */
		/* justify-content: center; */
		width: 100%;
		
	}
	.calendar_page {
		display: block;
		/* position: fixed; */
		
		left: auto;
		right: auto;
		/* padding-bottom: 5px; */
		flex-direction: column;
		justify-content: center;
		align-content: center;
		/* bottom: var(--window-bottom, 0); */
		/* vertical-align: bottom; */
		
	}
	.adjust{
		align-items: center;
		text-justify: center;
	}
	.todo{
		background-color:#FFFFFF;
		border-radius: 20rpx;
		height:200rpx;
		width:47%;
		margin-left: 10rpx;
		margin-bottom: 20rpx;
		margin-top: 20rpx;
		margin-right: 10rpx;
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
	.center{
		display: flex;
		flex-direction: row;
		justify-content: center;
	}
	.image{
		width:100rpx;
		height:100rpx;
		margin-left: 35%;
	}
	.image1{
		width:70rpx;
		height:70rpx;
		margin-left: 35%;
		margin-top: 5%;
		padding-bottom:20rpx;
	}
</style>

 

 