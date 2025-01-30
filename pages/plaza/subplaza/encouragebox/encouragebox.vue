		<template>
			<view class="course_card_box">
				<view class="liuhai"></view>
				<view class="leftt">
					<view @click="toLastPage">
						<u-icon name="close"></u-icon>
					</view>
				</view>
				<view style="display:none">
					{{submit(userInfo._id)}}
				</view>	
				<button class="already" @click="toalready">已查看的鼓励</button>
				<template>
					<view>
							<view v-for="(itemm,index) in videoData"  :key="index" >
								
								<view  v-for="(item,index) in itemm.encourage_content" @click="change_click(item.content,item.content_id,index,itemm._id)" :key="index" >
									<view v-if="item.evaluate=='false'">
										<view class="contain-box">
												<view class="header-box">
													<view class="left">
														<view class="head-img">
															<u-image width="70rpx" height="70rpx" border-radius="35rpx" src="../../../../static/stranger.png"></u-image>
														</view>
														<view class="info">
															<view class="name">
																Ta的鼓励
															</view>
														</view>
													</view>
												</view>
												<view class="main-text">
														<unicloud-db v-slot:default="{data, loading, error, options}" collection="post">
															<view>
																{{item.content}}
															</view>
														</unicloud-db>
												</view>
												<view style="clear: both;"></view>
													<view class="handle-box">
														<view>
															<view>
																<span class="label">
																	<u-icon name="thumb-up"></u-icon>
																</span>
																<span>
																	查看
																</span>
															</view>
														</view>
													</view>
											</view>
										
										</view>
									</view>
							</view>
					</view>
				</template>
				
			</view>
		</template>




<style lang="scss" scoped>
	.leftt{
		flex: 1;
		view{
			padding: 10rpx;
		}
	}
	.contain-box{
		color: #222222;
		padding: 20rpx;
		background-color: #FFF;
		.header-box{
			display: flex;
			.left{
				flex: 1;
				display: flex;
				align-items: center;
				.head-img{
					width: 70rpx;
					height: 70rpx;
					border-radius: 50%;
					image{
						width: 70rpx;
						height: 70rpx;
						border-radius: 50%;
					}
				}
				.info{
					margin-left: 15rpx;
					.name{
						font-size: 32rpx;
						font-weight: 550;
						margin-bottom: 10rpx;
					}
					.tip{
						font-size: 23rpx;
						color: #bfbfbf;
					}
				}
					
			}
				
			.right{
				display: flex;
				align-items: center;
				.btn{
					color: #DDA0DD;
					background: linear-gradient(to right, #FF623E, #FCBC27);
					height: 50rpx;
					border-radius: 25rpx;
					font-size: 25rpx;
					display: flex;
					align-items: center;
					padding: 0 20rpx;
					.text{
						margin-left: 8rpx;
					}
				}
			}
		}	
		.main-text{
			margin-top: 20rpx;
			margin-bottom: 20rpx;
			font-size: 26rpx;
			font-weight: 500;
			color: #222222;
		}
		.img-list-box{
			.row-box{
				display: flex;
				justify-content: space-between;
				margin-bottom: 2vw;
				.column-box{
					display: flex;
					
					.img-single{
						width: 30vw;
						height: 30vw;
					}
				}
			}
		}
		.handle-box{
			display: flex;
			background-color:#FFF0F5;
			border-top: 1px solid #cccccc;
			padding-top: 20rpx;
			view{
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				.label{
					margin-right: 10rpx;
				}
			}
		}
	}
	.liuhai{
		display:flex;
		flex-direction:row;
		height:80rpx;
	}
	.already{
		margin-left:10%;
		margin-right: 10%;
		border-radius: 20rpx;
		background-color: #B0C4DE;
	}
</style>


<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				item:{
					"encourage_content":"",
					"user_id":'',
				},
				id:"",
				videoData:[],
				num:0,
				content:[]
			}
		},
		computed: {
			...mapGetters({
				userInfo: 'user/info',
				
				hasLogin: 'user/hasLogin'
			})},
		methods:{
			toalready(){
				uni.navigateTo({
					url:"/pages/plaza/subplaza/encouragebox/encourage-already/encourage-already"
				})
			},
			toLastPage(){
				uni.switchTab({
					url: '/pages/plaza/plaza'
				})
			},
			change_click(content,id,index,post_id){
				uni.navigateTo({
					url:"/pages/plaza/subplaza/click/click?content="+content+"&id="+id+"&index="+index+"&post_id="+post_id
				})
			},
			async submit(id){
				const db = uniCloud.database();
				let res= await db.collection("post").where({user_id:id}).get()
				this.videoData=res.result.data;
			   },
			   async check(){
			   }
		},
		onLoad(options) {
			console.log(options)
			this.content=options.encourage_content
			this.id=options.id
		}
	}
</script>

