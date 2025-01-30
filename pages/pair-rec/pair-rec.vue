<template>
	<view>
		<scroll-view scroll-y="true" style="height: 100%">
			<view v-if="ifnointerests==true">
				<text style="display: flex; justify-content: center; color: #999; padding-top: 50px">
					请先在“我的”页面添加自己的兴趣哦！
				</text>
			</view>
			<view v-else>
				<!-- <view v-if="!flag">
					<button @click='generate_pair_list'>点击查看推荐匹配对象</button>
				</view> -->
				<view v-if="!pairlist.length">
					<text style="display: flex; justify-content: center; color: #999; padding-top: 50px">
						暂无推荐
					</text>
					
				</view>
				<!-- <view v-else-if="pairlist.length==pairlist.length && finalpairlist.length > 3">这里</view> -->
				<view v-else>
					<uni-list>
						<view v-for="(item, index) in pairlist" :key="index">
							<!-- <view v-if="item.avatar"> -->
								<uni-list-item :title="item.nickname"
									:thumb="item.avatar"
									thumbSize="lg"
									:clickable="true"
									:note='"共同兴趣：" + item.interest'
									@click="to_pair_profile(item.user_id)"></uni-list-item>
							<!-- </view>	 -->
							<!-- <view v-else> -->
								<!-- <uni-list-item :title="item.nickname"
									:clickable="true"
									:note='"共同兴趣：" + item.interest'
									@click="to_pair_profile({
										'user_id': item.user_id,
										'self_intro': item.self_intro
									})"></uni-list-item>
							</view> -->
						</view>
					</uni-list>
					<!-- <button @click='generate_pair_list'>换一批</button> -->
				</view>
				
			</view>
		</scroll-view>
		
	</view>
</template>

<script>
	import {mapGetters} from 'vuex'
	const db = uniCloud.database();
	
	export default {
		data() {
			return {
				myinterests: [],
				ifnointerests: false,
				pairlist: [],
				finalpairlist: [],
				// len: 0,
				flag: false,
				defaultavatar: "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b7ef8d49-ed26-4d4e-ae01-df1eb1688fb0/bc4fb287-399c-403b-a932-e75fc2563e20."
			}
		},
		computed: {
			...mapGetters({
				userInfo: 'user/info'
				// login: 'user/hasLogin'
			})
		},
		async onLoad() {
			this.flag = false
			this.ifnointerests = false
			uni.showLoading({
				mask:true,
				title:"加载中"
			})
			this.update_pair_options()
			// while(!this.flag){
				
			// }
			await uni.hideLoading()
		},
		methods: {
			async update_pair_options() {
				
				this.pairlist = []
				// console.log('here')
				db.collection('uni-id-users').where({
					_id: this.userInfo._id
				}).field("interests").get().then((res)=>{
					console.log(this.userInfo._id)
					if(res.result.data.length){
						if(res.result.data[0].interests.length){
							this.myinterests = res.result.data[0].interests
							for(var i = 0; i < this.myinterests.length; i++){
								let cur = this.myinterests[i]
								// console.log(cur)
								db.collection('to-be-paired').where({
									interest: cur,
									user_id: db.command.neq(this.userInfo._id),
									status: true
								}).get().then((res2)=>{
									this.flag=true
									if(res2.result.data.length){
										for(var j = 0; j < res2.result.data.length; j++){
											let intro = res2.result.data[j].self_intro
											let idd = res2.result.data[j].user_id
											db.collection('uni-id-users').where({
												_id: idd
											}).field("nickname, avatar_file").get().then((res3)=>{
												this.pairlist.push({
													'user_id': res3.result.data[0]._id,
													'nickname': res3.result.data[0].nickname,
													'avatar': res3.result.data[0].avatar_file ? res3.result.data[0].avatar_file.url : this.defaultavatar,
													'interest': cur,
													'self_intro': intro
												})
												
											})
							
										}
									}
									// this.pairlist.push({
									// 	// user_id: res2.result.data[0]user_id,
									// 	interest: cur
									// })
									// console.log(this.pairlist)
								})
								
							}
				
						}
						else{
							this.ifnointerests = true
						}
					}
				})
				// return 'test'
			},
			// generate_pair_list() {
			// 	console.log('pairlist is ', this.pairlist)
			// 	// console.log('hi')
			// 	this.flag = true
			// 	this.finalpairlist = []
				
			// 	let vis = []
				
			// 	// let len = this.pairlist.length
			// 	let lst = this.pairlist
			// 	let len = lst.length
			// 	this.flag = true
			// 	console.log(len)
			// 	if(len <= 3){
			// 		this.finalpairlist = this.pairlist
			// 		// console.log('1')
			// 		while(this.finalpairlist.length > 3){
			// 			this.finalpairlist.pop()
			// 			// console.log('2')
			// 		}
			// 		// console.log('2')
			// 		// console.log(this.finalpairlist)
			// 		return
			// 	}
				
			// 	// let lst = this.pairlist
			// 	// let newlst
			// 	for(var i = 0; i < 3; i++){
			// 		let id = Math.floor((Math.random() * lst.length));
					
			// 		// console.log("lst is", id, vis)
			// 		vis.push(id)
					
			// 		this.finalpairlist.push(lst[id])
			// 		// newlst = []
			// 		// fo
			// 		let newlst = []
			// 		for(var j = 0; j < lst.length; j++){
			// 			if(j != id){
			// 				newlst.push(lst[j])
			// 			}
			// 		}
			// 		lst = newlst
			// 	}
			// 	this.loadflag = false
				
			// 	// console.log('hi')
			// },
			to_pair_profile(id){
				let path = '../pair-profile/pair-profile?to=' + id
				uni.navigateTo({
					url: path
				})
			},
		}
	}
</script>

<style>

</style>
