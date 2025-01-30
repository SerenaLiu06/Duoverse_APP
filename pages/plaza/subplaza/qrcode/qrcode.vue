<template>
  <view class="indexContent">
	<view class="liuhai"></view>
	<view style="display:none"></view>
	 <view class="header">
		<view class="left">
			<view @click="toLastPage">
				<u-icon name="close"></u-icon>
			</view>
		</view>
		<view class="right">
		  <view class="btn" @click="saveArticle">
			  发表
		  </view>
		</view>
	  </view>
	  <view class="text-box">
		  <input class="contentt" placeholder="分享点新鲜事" v-model="item.message">
	  </view>
	  <view style="display: none" v-model="item.date"><date></date></view>
	<view style="margin-left:30rpx,margin-right:30rpx;">
		<uni-file-picker file-mediatype="image" :limit="9" return-type="array" v-model="item.imgList" >
		</uni-file-picker>
	</view>
	  <view>{{videoData}}</view>
  </view>
</template>

<script>
	import {
		mapMutations,
		mapGetters
	} from 'vuex';
import date from '@/pages/plaza/subplaza/date/date.vue'
const db = uniCloud.database();
const usersTable = db.collection('uni-id-users')
function current_date() {
		     var nowDate = new Date();
		     let date = {
		       month: nowDate.getMonth() + 1,
							date:nowDate.getDate(),
							hour:nowDate.getHours(),
							minute:nowDate.getMinutes()
		     };
						  const newmonth = date.month>9?date.month:'0'+date.month
						  const day = date.date>9?date.date:'0'+date.date
						  const hour = date.hour>9?date.hour:'0'+date.hour
						  const minute = date.minute>9?date.minute:'0'+date.minute
		     // console.log(date);
		     let systemDate = newmonth + "-" +day+ "  "+hour+":"+minute;
		     return systemDate;
		   }
export default {
	name: "qrcode",
		data() {
			return {
				clicknum:0,
				imageurllist:[],
				univerifyStyle: {
					authButton: {
						"title": "本机号码一键绑定", // 授权按钮文案
					},
					otherLoginButton: {
						"title": "其他号码绑定",
					}
				},
				videoData:"",
				systemNavHeight: 0,
				fileList: [],
				getD:current_date(),
				item:{
					"imgList":[],
					"message":"",
					"comment_count": 0,
					"thumbs_up_count": 0,
					"date":current_date(),
					"comment_content":"",
					"encourage_content":[],
					"like_list":[],
					"index_post":0,
					"exist":"true"
				}
			}
		},
		components:{
			date
		},
		computed: {
			...mapGetters({
				userInfo: 'user/info',
				login: 'user/hasLogin'
			}),
			avatar_file() {
				if (this.userInfo.avatar_file && this.userInfo.avatar_file.url) {
					return this.userInfo.avatar_file
				}
			}
		},
		methods: {
			toLastPage(){
				uni.switchTab({
					url: '/pages/plaza/plaza'
				})
			},
			async saveArticle(){
				if(this.clicknum==0){
					this.clicknum=1
					const dtbs = uniCloud.database();
					let res= await dtbs.collection("post").get()
					this.item.index_post=res.result.data.length
					console.log(res.result.data.length)
					const db = uniCloud.database();
					db.collection('post').add(this.item).then(e=>{
						console.log(e);
					})
					uni.switchTab({
					url: '/pages/plaza/plaza'
					    })
				}}
		}
}
</script>
<style>
page {
	background-color: #FFFFFF;
}
</style>
<style scoped lang="scss">
	.text-box{
		margin-left: 30rpx;
		height:120rpx;
	}
.header{
	display: flex;
	padding: 20rpx;
	.left{
		flex: 1;
		view{
			padding: 10rpx;
		}
	}
	.right{
		.btn{
			height: 50rpx;
			width:100rpx;
			margin-left: 80%;
			padding: 0 20rpx;
			border-radius: 25rpx;
			font-size: 25rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			background: linear-gradient(to right, #2FC1DF, #057ED6);
			color: #FFFFFF;
		}
	}
}
.img-box{
	padding: 20rpx;
	margin-top: 20%;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	.chooseAvatar {
		text-align: center;
		justify-content: center;
		width: 90px;
		height: 90px;
		margin-right:20rpx;
		border: dotted 1px #ddd;
		border-radius: 10px;
	}
	
}
	/* #ifndef APP-NVUE */
	view {
		display: flex;
		box-sizing: border-box;
		flex-direction: column;
	}
	/* #endif */
	.item {
		width: 750rpx;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.image{
		width:90px;
		height:90px;
		display: flex;
		flex-direction: row;
		margin-right: 20rpx;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
	}
	
	.imglist{

	}
	.liuhai{
		display:flex;
		flex-direction: column;
		height:80rpx;
	}
</style>
