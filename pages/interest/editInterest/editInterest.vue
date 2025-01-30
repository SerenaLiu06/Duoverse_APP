<template>
	<view class="interest">
		<view class="list-title">
			<text class='list-title-font'> 编辑/修改兴趣</text>
		</view>
		<view style="display:none">{{getdata(123)}}</view>
		<view class="course_card_box">
			<robby-tags v-model="tagList" @click="clickTag" ></robby-tags>
		</view>
		<hr/>
		<view class="course_card_box">
			<robby-tags v-model="tagList2"></robby-tags>
		</view>
		<view class="button">
			<button class="edit" @click="toeditI(tagList2,userInfo._id)">完成</button>
		</view>
	</view>
</template>

<script>
	function replacepos(text,start,stop,replacetext){
		return text.substring(0,stop)+replacetext+text.substring(stop+1)
	}
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	import robbyTags from '@/components/robby-tags/robby-tags.vue'
	export default {
		data() {
			return {
				data:[],
				bgColorType : 'primary',
				tagList: [],
				tagList2:[],
				count:"0000000000000000000000000000000"
				
			}
		},
		computed: {
			...mapGetters({
				userInfo: 'user/info',
				
				hasLogin: 'user/hasLogin'
			})},
		methods: {
				async toget_interest(id){
					const dtbs = uniCloud.database();
					let res= await dtbs.collection("uni-id-users").where({_id :id}).get()
					this.tagList2 = res.result.data[0].interests
				},
				async getdata(id){
					var interest_list=[];
					const dtbs = uniCloud.database();
					let res= await dtbs.collection("interest-list").get()
					for(var i=0;i<res.result.data.length;i++){
						interest_list.push(res.result.data[i].interest)
					this.tagList=interest_list
					} 
				},
			    clickTag: function(e){
			        console.log(e)
					for (var i = 0; i < this.tagList.length; i++) {
					if (this.tagList[i] == e) {
						if(this.count[i]==0){
							this.count = replacepos(this.count,i,i,'1')
							console.log(this.count)
							this.tagList2.push(e);
						}
						else{
							this.count = replacepos(this.count,i,i,'0')
							for (var j = 0; j < this.tagList2.length; j++) { 
							if (this.tagList2[j] == e) 
								this.tagList2.splice(j,1); 
								console.log(j); 
							};
							console.log(this.count)
						}
					}
					
					}
					
			    },
			toget_interest(id){
				
			},
			async toeditI(get,id){
				uni.switchTab({
				url: '/pages/ucenter/ucenter'
				    })
				console.log(get)
				console.log(id)
				const dd = uniCloud.database();
				let collection=dd.collection("uni-id-users")
				let resss=await collection.where({_id:id}).update({interests:get}) 
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
	.tag{
		color:#007AFF;
	}
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
	.course_card_box{
		width:100%;
		display:flex;
		box-sizing:border-box;
		padding:0 15px;
		overflow:hidden;
		.course_card_info{
			display:flex;
			box-sizing:border-box;
			width:100%;
			background:#ffffff;
			border-radius:15px;
			margin-left: 10px;
			margin-bottom:15px;
			flex-direction:row;
			align-items:center;
			justify-content: center;
			.course_card_des_T{
				line-height:24px;
				margin-bottom:5px;
			}
		}
	}
</style>
