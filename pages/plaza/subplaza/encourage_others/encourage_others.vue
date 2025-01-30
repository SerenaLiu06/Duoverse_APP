
<template>
	<view class="content">
		<view class="input_box">
			<textarea placeholder="输入鼓励的话语~" class="textarea border" v-model="item.encourage_content"></textarea>
			<button type="default"  @click="submit(userInfo._id)" class="submit">提交</button>
		</view>		
	</view>
</template>

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
				num:0
			}
		},
		computed: {
			...mapGetters({
				userInfo: 'user/info',
				
				hasLogin: 'user/hasLogin'
			})},
		methods:{
			async submit(idd){
				const db = uniCloud.database();
				let res= await db.collection("post").where({_id :this.id}).get()
				this.videoData=res.result.data[0].encourage_content;
				const dd = uniCloud.database();
				let collection=dd.collection("post")
				let resss=await collection.where({_id :this.id})
				.update({
				 encourage_content: {[this.videoData.length]:{content_id:idd,content:this.item.encourage_content,evaluate:"false"}},
				})      
				uni.switchTab({
				url: '/pages/plaza/plaza'
				    })
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

<style lang="scss">
.border{
	border-style: solid;
	border-width: 1px;
	border-color: #eeeeee;
	background-color: #FFF0F5;
}
.input{
	padding: 6rpx 8rpx;
	height: 42px;
}
.submit{
	width: 400upx;
	margin-left: 175rpx;
	margin-top: 10px;
	margin-bottom: 20px;
}
.delete{
	background-color: #dddddd;
	color: #FFFFFF;
	width: 40rpx;
	line-height: 50rpx;
	height: 50rpx;
	text-align: center;
	width: 80rpx;
	font-size: 30rpx;
	border-radius: 6px;
}
.list{
	width: 750rpx;
}
.input_box{
	width: 750rpx;
	background-color: #FFFFFF;
	margin-bottom: 6px;
}
.textarea{
	width: 730rpx;
	padding: 10rpx;
	margin: 10rpx;
}
.content{
	font-size: 38upx;
	color: #666666;
}
</style>
