<template>
	<view>
		<view style="display:none">{{getpost()}}</view>
					<view v-for="(item,index) in postdata"  :key="index" >
				
						<view class="contain-box">
							<view class="header-box">
								<view class="left">
									<unicloud-db v-slot:default="{data, loading, error, options}" collection="uni-id-users":where="`_id=='${item.user_id}'`">
							
											<view class="arrangement">
												<view class="head-img" v-if="data[0].avatar_file">
													<u-image width="70rpx" height="70rpx" border-radius="35rpx" :src="data[0].avatar_file.url"></u-image>
												</view>
												<view v-else>
													<view class="head-img" > 
														<u-image width="70rpx" height="70rpx" border-radius="35rpx" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b7ef8d49-ed26-4d4e-ae01-df1eb1688fb0/445fc178-3529-4b37-b71e-6f028cc45610."></u-image>
													</view>
												</view>
												<view class="info">
													<view class="name">
															<view>{{data[0].nickname}}</view>												
													</view>
													<view class="tip">
														{{item.date}}
													</view>
												</view>
										</view>
									</unicloud-db>		
								</view>
		<!--						<view class="right">
									<view class="btn">
										<u-icon name="plus" color="#FFFFFF"></u-icon>
										<span class="text">
											关注
										</span>
										
									</view> 
								</view>-->
							</view>
							<view class="main-text">
									<unicloud-db v-slot:default="{data, loading, error, options}" collection="post">
											{{item.message}}
									</unicloud-db>
							</view>
							<view  v-if="item.imgList.length==1" class="img1">
								
								<view v-for="(item, index) in item.imgList" class="img11">
									<image style="width:630rpx;height:630rpx;border-radius: 10rpx,margin-bottom:10rpx;" :src="item.url" mode="aspectFill"></image>
								</view>
							</view>
							<view
								class="" 
								v-if="item.imgList.length==2" class="img2">
									<view v-for="(item, index) in item.imgList" class="img22">
										<image style="width:330rpx;height:330rpx;border-radius: 10rpx,margin-bottom:10rpx;" :src="item.url" mode="aspectFill"></image>
									</view>
							</view>
							<view
								class="img3" 
								v-if="item.imgList.length==3" >
									<view v-for="(item, index) in item.imgList" class="img33">
										<image style="width:230rpx;height:230rpx;border-radius: 10rpx,margin-bottom:10rpx;" :src="item.url" mode="aspectFill"></image>
									</view>
							</view>
							<view
								class="img4" 
								v-if="item.imgList.length==4" >
									<view v-for="(item, index) in item.imgList" class="img44">
										<image style="width:330rpx;height:330rpx;border-radius: 10rpx,margin-bottom:10rpx;" :src="item.url" mode="aspectFill" ></image>
									</view>
							</view>
							<view
								class="img5" 
								v-if="item.imgList.length>=5" >
									<view v-for="(item, index) in item.imgList" class="img55">
										<image style="width:230rpx;height:230rpx;border-radius: 10rpx,margin-bottom:10rpx;" :src="item.url" mode="aspectFill" ></image>
									</view>
							</view>
								<!--
									<view>
										<view @click="cliekailai(item._id,item.comment_content)">
											<span class="label">
												<u-icon name="chat"></u-icon>
											</span>
											<span>
												评论 ({{item.comment_count}})
											</span>
										</view>
									</view>
								-->
						
						</view>
					</view>
		<!--		</unicloud-db> -->
		<view style="display:none">{{encourage_user_id}}</view>
		<view class="contentwhole">
			<view class="contenttitle">来自TA的鼓励：</view>
			<view class="content">
					{{content}}
			</view>
		</view>
		<HR style="border:3 double #000000" width=100% color=#000000 SIZE=3></HR>
		<view class="boxx">
			<text class="textt">Ta的鼓励你已收到！此时你的感受：</text>
		</view>
		<button class="buttonn" @click="good(encourage_user_id)">特别感谢Ta！很受鼓舞</button>
		<button class="buttonn" @click="medium(encourage_user_id)">一点点开心</button>
		<button class="buttonn" @click="bad(encourage_user_id)">没有实质性的帮助</button>
	</view>
</template>

<script>
	import {
		mapMutations,
		mapGetters
	} from 'vuex';
	export default {
		data() {
			return {
				encourage_user_id:"",
				content:"",
				index:"",
				post_id:"",
				result:[],
				postdata:[]
			}
		},
		computed: {
			...mapGetters({
				userInfo: 'user/info',
				login: 'user/hasLogin'
			})},
		methods:{
		async getpost(){
			const db = uniCloud.database();
			let rese= await db.collection("post").where({_id :this.post_id}).get()
			this.postdata=rese.result.data
			
		},
		async good(id){
			console.log(id)
			uniCloud.callFunction({
				name:'edit-exp',
				data:{
					user_id:id,
					points:4
				}
			})
//			uni.navigateTo({
	//			url: '/pages/plaza/subplaza/encouragebox/encouragebox'
		//	})
			const dd = uniCloud.database();
			let collection=dd.collection("post")
			let resss=await collection.where({_id :this.post_id}).get()
			
			this.result=resss.result.data[0].encourage_content
			this.result[this.index].evaluate="true"
			let ress=await collection.where({_id :this.post_id})
			.update({
			 encourage_content: this.result})  
			 console.log("更改成功")
			uni.reLaunch({url: '/pages/plaza/subplaza/encouragebox/encouragebox'})
		},
		async medium(id){
			console.log(id)
			uniCloud.callFunction({
				name:'edit-exp',
				data:{
					user_id:id,
					points:2
				}
			})
			const dd = uniCloud.database();
			let collection=dd.collection("post")
			let resss=await collection.where({_id :this.post_id}).get()
			
			this.result=resss.result.data[0].encourage_content
			this.result[this.index].evaluate="true"
			let ress=await collection.where({_id :this.post_id})
			.update({
			 encourage_content: this.result})  
			 console.log("更改成功")
			uni.reLaunch({url: '/pages/plaza/subplaza/encouragebox/encouragebox'})
		},
		async bad(id){
			const dd = uniCloud.database();
			let collection=dd.collection("post")
			let resss=await collection.where({_id :this.post_id}).get()
			
			this.result=resss.result.data[0].encourage_content
			this.result[this.index].evaluate="true"
			let ress=await collection.where({_id :this.post_id})
			.update({
			 encourage_content: this.result})  
			 console.log("更改成功")
			uni.reLaunch({url: '/pages/plaza/subplaza/encouragebox/encouragebox'})
		},
		onLoad(options) {
			console.log(options)
			this.encourage_user_id=options.id
			this.content=options.content
			this.index=options.index
			this.post_id=options.post_id
		}
	},
	}
</script>

<style lang="scss">
	.contentwhole{
		background-color: #FFF0F5;
		margin-left:20rpx;
		margin-top:20rpx;
		margin-right:20rpx;
		margin-bottom: 20rpx;
		border-radius: 20rpx;
		
	}
	.contenttitle{
		margin-left:5rpx;
		font-size:35rpx;
		font-weight:600;
	}
	.content{
		margin-top: 20rpx;
		margin-left: 20rpx;
		font-size: 35rpx;
		font-weight: 500;
		padding: 10rpx 10rpx;
		
	}
	.boxx{
		display: flex;
		margin-top: 30rpx;
		margin-bottom: 30rpx;
		justify-content: center;
		align-content:center;
		.textt{
			margin-left: 10rpx;
			font-weight: 580;
			color:#555555
		}
	}
	.buttonn{
		background-color: #B0C4DE;
		height: 100rpx;
		font-size: 30rpx;
		display: flex;
		align-items: center;
		padding: 0 20rpx;
		margin-bottom: 2rpx;
	}
</style>

<style lang="scss" scoped>
	.contain-box{
		color: #222222;
		padding: 20rpx;
		background-color: #FFFFFF;
		.header-box{
			display: flex;
		
			.left{
				flex: 1;
				display: flex;
				align-items: center;
	
				.head-img{
					display:flex;
					width: 70rpx;
					height: 70rpx;
					border-radius: 50%;
					
					image{
						width: 70rpx;
						height: 70rpx;
						border-radius: 50%;
					}
					flex-direction: row;
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
					color: #FFFFFF;
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
			margin-top:20rpx;
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
			border-top: 1px solid #f2f2f2;
			padding-top: 20rpx;
			padding-bottom: 20rpx;
			background-color: #DDA0DD;
			view{
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				.label{
					margin-left: -350rpx;
					align-items: center;
					justify-content: center;
				}
			}
		}
	}
	.arrangement{
		display:flex;
		flex-direction:row;
	}
	.image1{
		width:90%;
		height:30rpx;
	}
	.img1{
		display:flex;
		flex-direction:row;
		justify-content: center;
		.img11{
			margin-bottom:10rpx;
			margin-right:3rpx;
			margin-left:3rpx;
		}
	}
	.img2{
		display:flex;
		flex-direction:row;
		justify-content: center;
		.img22{
			margin-bottom:12rpx;
			margin-right:6rpx;
			margin-left:6rpx;
		}
	}
	.img3{
		display:flex;
		flex-direction:row;
		justify-content: center;
		.img33{
			margin-bottom:10rpx;
			margin-right:3rpx;
			margin-left:3rpx;
		}
	}
	.img4{
		display:flex;
		flex-wrap:wrap;
		justify-content: center;
		.img44{
			margin-bottom:12rpx;
			margin-right:6rpx;
			margin-left:6rpx;
		}
	}
	.img5{
		display:flex;
		flex-wrap:wrap;
		.img55{
			margin-bottom:10rpx;
			margin-right:3rpx;
			margin-left:3rpx;
		}
	}
	.closeicon{
		position: absolute;
		right:20px;
	}
</style>
