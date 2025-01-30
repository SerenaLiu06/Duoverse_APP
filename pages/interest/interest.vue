<template>
	<view class="interest">
		<view class="list-title">
			<text class='list-title-font'> 我的兴趣</text>
		</view>
		<view style="display:none">{{toget_interest(userInfo._id)}}</view>
		<robby-tags :value=interest_list></robby-tags>
		<view class="button">
			<button class="edit" @click="toeditI">编辑兴趣</button>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	import robbyTags from '@/components/robby-tags/robby-tags.vue'
	export default {
		data() {
			return {
				bgColorType : 'primary',
				interest_list: []
			}
		},
		computed: {
			...mapGetters({
				userInfo: 'user/info'
			})},
		methods: {
			async toget_interest(id){
				const dtbs = uniCloud.database();
				let res= await dtbs.collection("uni-id-users").where({_id :id}).get()
				this.interest_list = res.result.data[0].interests
			},
			toeditI(){
						uni.navigateTo({
							url:"/pages/interest/editInterest/editInterest"
						})
			},
			toback(){
						uni.navigateTo({
							url:"/pages/plaza/plaza"
						})
			}
		},
		components: {robbyTags}
	}
</script>

<style lang="scss">
	.interest{
		.close{
			width:70rpx;
			height:70rpx;
			margin-top: 30rpx;
			margin-right:30rpx;
			float:right;
		}
		.list-title{
			padding: 120rpx 100rpx 30rpx 30rpx;
			.list-title-font{
				font-size: 26px;
				font-weight: 550;
			}
		}
		.button{
			.edit{
				height: 100rpx;
				border-radius: 30px;
				bottom:50px;
				position: fixed;
				width: 60%;
				font-size: 1.2em;
				height: 45px;
				background-color: #F08080;
				color: #FFFFFF;
				margin-left: 20%;
				}
		}
	}
</style>
