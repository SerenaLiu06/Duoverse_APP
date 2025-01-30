<template>
	<view>
<!--		<unicloud-db v-slot:default="{data,loading,error,options}" collection="post" orderby="index_post desc">
			 -->
			<view style="display:none">{{getwholepost(userInfo._id)}}</view>
			<view v-for="(item,index) in postdata"  :key="index" >
		
				<view class="contain-box">
					<view class="header-box">
						<view class="left">
							<unicloud-db v-slot:default="{data, loading, error, options}" collection="uni-id-users":where="`_id=='${item.user_id}'`">
									<view v-if="item.user_id==userInfo._id">
										<view class="container">
											<view>
												<text @click="dialogToggle(item._id)" style="font-size: 20px; font-weight: 600; margin-left: 650rpx;" >x</text>
											</view>										
										
										</view>
									</view>
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
							<image style="width:630rpx;height:630rpx;border-radius: 10rpx,margin-bottom:10rpx;" :src="item.url" mode="aspectFill" @click.stop="prviewImage(item.url,index)"></image>
						</view>
					</view>
					<view
						class="" 
						v-if="item.imgList.length==2" class="img2">
							<view v-for="(item, index) in item.imgList" class="img22">
								<image style="width:330rpx;height:330rpx;border-radius: 10rpx,margin-bottom:10rpx;" :src="item.url" mode="aspectFill" @click.stop="prviewImage(item.url,index)"></image>
							</view>
					</view>
					<view
						class="img3" 
						v-if="item.imgList.length==3" >
							<view v-for="(item, index) in item.imgList" class="img33">
								<image style="width:230rpx;height:230rpx;border-radius: 10rpx,margin-bottom:10rpx;" :src="item.url" mode="aspectFill" @click.stop="prviewImage(item.url,index)"></image>
							</view>
					</view>
					<view
						class="img4" 
						v-if="item.imgList.length==4" >
							<view v-for="(item, index) in item.imgList" class="img44">
								<image style="width:330rpx;height:330rpx;border-radius: 10rpx,margin-bottom:10rpx;" :src="item.url" mode="aspectFill" @click.stop="prviewImage(item.url,index)"></image>
							</view>
					</view>
					<view
						class="img5" 
						v-if="item.imgList.length>=5" >
							<view v-for="(item, index) in item.imgList" class="img55">
								<image style="width:230rpx;height:230rpx;border-radius: 10rpx,margin-bottom:10rpx;" :src="item.url" mode="aspectFill" @click.stop="prviewImage(item.url,index)"></image>
							</view>
					</view>
					<view style="clear: both;"></view>
						<view class="handle-box">
							<view>
						<!--		<view @tap="like(item._id,item.thumbs_up_count,item.index_post)">
									<span class="label" >
											<u-icon v-if="isClick[index]==0" name="heart"></u-icon>
											<u-icon v-if="isClick[index]==1" name="heart" style="color: #FF0000;"></u-icon>
									</span>
									<span>
										
											<text v-if="isClick[index]==0">{{item.thumbs_up_count}}</text>
											<text v-if="isClick[index]==1">{{item.thumbs_up_count+1}}</text>
									</span>
								</view> -->
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
							<view>
								<view @click="enc_others(item._id,item.encourage_content,userInfo._id,item.user_id)">
									<span class="label">
										<u-icon name="thumb-up"></u-icon>
									</span>
									<span>
										鼓励  {{item.encourage_content.length}}
									</span>
								</view>
							</view>
						</view>
				</view>
			</view>
<!--		</unicloud-db> -->
			<uni-popup ref="popup2" type="dialog">
				<uni-popup-dialog mode="base" title="警告" content="确定删除这条动态？" :before-close="true" @close="close2()" @confirm="dialogConfirm(postid)">
				</uni-popup-dialog>
			</uni-popup>
	</view>
</template>

<script>
	import {
		mapMutations,
		mapGetters
	} from 'vuex';
	function replacepos(text,start,stop,replacetext){
		return text.substring(0,stop)+replacetext+text.substring(stop+1)
	}
	import date from '@/pages/plaza/subplaza/date/date.vue'
	export default {
		data() {
			return {
				postid:"",
				type: 'center',
				msgType: 'success',
				messageText: '这是一条成功提示',
				value: '',
				postdata:[],
				count:[],
				new_like_list:[],
				clickNum:10,
				isClick:"00000000000000000",
				videoData:""
			}
			},
		computed: {
			...mapGetters({
				userInfo: 'user/info',
				login: 'user/hasLogin'
			})},
		methods: {
			prviewImage(img, index) {
				var imgArr=[];
				imgArr.push(img);
				uni.previewImage({
					urls: imgArr,
					current: imgArr[0]
				})
			},
			async getwholepost(id){
				const db = uniCloud.database();
				let rese= await db.collection("post").where({exist :"true",user_id:id}).orderBy('index_post','desc').get()
				this.postdata=rese.result.data
				
			},
			async changelike(index,countindex,item,id,num){
				this.count.splice(index,1,countindex)
				console.log(this.count)
				
				var i;
				var new_list = []
				const db = uniCloud.database();
				let rese= await db.collection("post").where({_id :item}).get()
				var list=rese.result.data[0].like_list
				for(i=0;i<list.length;i++){
					if(list[i]!=id){
						new_list.push(list[i]);
					}
				}
				if(countindex==1){
					new_list.push(id);
				}
				const dd = uniCloud.database();
				let collection=dd.collection("post")
				let resss=await collection.where({_id :item})
				     .update({
				      like_list: new_list,
				     }) 
				if(countindex==1){
					await collection.where({_id :item}).update({
					 thumbs_up_count: num+1,
					}) 
				}
				if(countindex==0){
					await collection.where({_id :item}).update({
					 thumbs_up_count: num-1,
					}) 
				}
			},
			async change(id,list){
				console.log("click")
				const dd = uniCloud.database();
				let collection=dd.collection("post")
				let resss=await collection.where({_id :id})
				.update({
				 like_list: list
				}) 
			},
			async checkin(item,id){
				var i;
				var count = 0
				var new_list = []
				const db = uniCloud.database();
				let rese= await db.collection("post").where({_id :item}).get()
				var list=rese.result.data[0].like_list
				for(i=0;i<list.length;i++){					if(list[i]==id){
						count++;
					}
					else{
						new_list.push(list[i]);
					}				}
				if(count==0){
					new_list.push(id);
				}
				this.count.push(count);
			},
			cliekailai(id,comment_content){
				uni.navigateTo({
					url:"/pages/plaza/subplaza/comment/comment?id="+id+"&comment_content="+comment_content
				})
			},
			enc_others(id,encourage_content,userid,myid){
				if(userid!=myid){
					uni.navigateTo({
						url:"/pages/plaza/subplaza/encourage_others/encourage_others?id="+id+"&encourage_content="+encourage_content
					})
				}
			},
			toComment(){
						uni.navigateTo({
							url:"/pages/plaza/subplaza/comment/comment"
						})
			},
			like:async function(id,count,index_post){
						if(this.isClick[index_post]==0){
							
							this.isClick = replacepos(this.isClick,index_post,index_post,'1')
							const db = uniCloud.database();
							let rese= await db.collection("post").where({_id :id}).get()
							this.videoData=rese.result.data[0].thumbs_up_count;
							const dd = uniCloud.database();
							let collection=dd.collection("post")
							let resss=await collection.where({_id :id})
							.update({
							 thumbs_up_count: this.videoData+1,
							}) 
							console.log(this.isClick,index_post,id)
						}else{
							this.isClick = replacepos(this.isClick,index_post,index_post,'0')
							const dtbs = uniCloud.database();
							let res= await dtbs.collection("post").where({_id :id}).get()
							this.videoData=res.result.data[0].thumbs_up_count;
							const da = uniCloud.database();
							let collection=da.collection("post")
							let ress=await collection.where({_id :id})
							.update({
							 thumbs_up_count: this.videoData-1,
							}) 
							console.log(this.isClick,index_post,id)
						}
			},
			async zanzan(id,count,index){
				const dd = uniCloud.database();
				let collection=dd.collection("post")
				if(this.isClick[index]==0){
					this.isClick[index]=1
					let resss=await collection.where({_id :id})
					.update({
					 thumbs_up_count: count+1,
					})  
				}else{
					this.isClick[index]=0
					let resss=await collection.where({_id :id})
					.update({
					 thumbs_up_count: count-1,
					})  
				}
			   },
			async checkwhether(id){
				const db = uniCloud.database();
				let rese= await db.collection("post").where({_id :id}).get()
				console.log(rese.result.data[0].like_list)
			},
			getImgList(list){
				let newList = [[]]
				for(let i = 0; i < list.length; i++){
					newList[newList.length-1].push(list[i])
					if((i+1)%3 == 0){
						newList.push([])
					} 
				}
				console.log('数组', newList)
				return newList
			},
			dialogToggle(id) {
				this.postid = id
				this.$refs.popup2.open('center')
			},
			close2() {
				this.$refs.popup2.close()
			},
			async dialogConfirm(id){
				const dd = uniCloud.database();
				let collection=dd.collection("post")
				let resss=await collection.where({_id :id})
				     .update({
				      exist:"false"
				     }) 
				this.$refs.popup2.close()
			}
		},
		components:{
			date
		}
	}
</script>

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
