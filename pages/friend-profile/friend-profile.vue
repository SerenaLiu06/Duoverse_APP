 <template>
	<view>
		<!-- <unicloud-db :where="`_id=='${userid}'`" v-slot:default="{data, loading, error, options}" :getone="true" collection="uni-id-users" field="nickname, avatar_file, register_date, last_login_date">
			<view v-if="error">{{error.message}}</view>
			<view v-else>
				{{data}} -->
				<view class="info">
					<image :src="imgurl" class="image"  :mode="mode"></image>
					<text class="name">{{name}}</text>
					<text class="last">\n上次登录：{{formatDate(logdate)}}</text>
				</view>
				<view class="interestbox1">
					<text class="interest">-------兴趣标签-------</text>
				</view>
				<view class="interestbox">
					<view class="interestlist" v-for="(item,index) in ilist" :key="index">
						<uni-icons type="heart"></uni-icons>
						<text>{{item}}</text>
					</view>
				</view>
				<view v-if="iffriend==0" class="add" @click="addFriend">
					<view><text class="add-text">添加好友</text></view>
				</view>
				<view v-if="iffriend==1" class="add" @click="navigateToChat">
					<view><text class="add-text">聊天</text></view>
				</view>
				<view v-if="iffriend==2" class="choice">
					<view @click="submitFriend" class="choice2">同意好友申请</view>
					<view @click="rejectFriend" class="choice2">拒绝好友申请</view>
				</view>
					
			<!-- </view>
		</unicloud-db> -->
	</view>
</template>

<script>
	import {mapGetters} from 'vuex';
	
	const db = uniCloud.database();
	// userTable = db.collection('uni-id-users')
	export default {
		computed: {
			...mapGetters({
				userInfo: 'user/info'
			})
		},
		data() {
			return {
				userid: '',
				imgurl: '',
				name: '',
				regdate: '',
				logdate: '',
				ilist: [],
				iffriend: 0 //0: 没有关系; 1: 已是朋友; 2: 对方已提交申请
			}
		},
		props: {
			mode: {
				type:String,
				default () {
					return 'widthFix'
				}
			},
			src: {
				// type:String,
				default () {
					return ""
				}
			},
			width: {
				type:String,
				default () {
					return '150rpx'
				}
			},
			height: {
				type:String,
				default () {
					return '150rpx'
				}
			}
		},
		methods: {
			addFriend() {
				// console.log('hi')
				
		
				
				// db.collection('new-friends').add({
				// 	// 'request_list': ['hi'],
				// 	// "user_id": this.userid,
				// 	"request_list": ['hi']
				// })
				db.collection('new-friends').where({
					user_id: this.userid
				}).field('_id, request_list').get().then((res)=>{
					
					if(res.result.data.length == 0){
						
						db.collection('new-friends').add({
							'user_id': this.userid,
							'request_list': [this.userInfo._id]
						})
						
					}
					else{
						let newlist = res.result.data[0].request_list
						let ifrequest = false
						for(var i = 0; i < newlist.length; i++){
							if(newlist[i] == this.userInfo._id){
								ifrequest = true
								break
							}
						}
						if(!ifrequest){
							newlist.push(this.userInfo._id)
							
							db.collection('new-friends').where({
								_id: res.result.data[0]._id
							}).update({
								'request_list': newlist
							})
							uni.showToast({
								title: "成功发送好友申请",
								icon: "none"
							})
						}
						else{
							uni.showToast({
								title: "已发送过好友申请",
								icon: "none"
							})
						}
						
						
					}
					
				})
			},
			submitFriend() {
				db.collection('new-friends').where({
					user_id: this.userInfo._id
				}).field('request_list').get().then((res)=>{
					let lst = res.result.data[0].request_list
					let newlst = []
					for(var i = 0; i < lst.length; i++){
						if(lst[i] !== this.userid){
							newlst.push(lst[i])
						}
					}
					db.collection('new-friends').where({
						user_id: this.userInfo._id
					}).update({
						'request_list': newlst
					})
				})
				db.collection('friends').where({
					user_id: this.userInfo._id
				}).get().then((res)=>{
					let lst = res.result.data[0].friend_list
					lst.push(this.userid)
					db.collection('friends').where({
						user_id: this.userInfo._id
					}).update({
						friend_list: lst
					})
				})
				db.collection('friends').where({
					user_id: this.userid
				}).get().then((res)=>{
					let lst = res.result.data[0].friend_list
					lst.push(this.userInfo._id)
					db.collection('friends').where({
						user_id: this.userid
					}).update({
						friend_list: lst
					})
				})
				uni.showToast({
					title: "添加成功",
					icon: "none"
				})
				uni.navigateBack()
			},
			rejectFriend() {
				db.collection('new-friends').where({
					user_id: this.userInfo._id
				}).field('request_list').get().then((res)=>{
					let lst = res.result.data[0].request_list
					let newlst = []
					for(var i = 0; i < lst.length; i++){
						if(lst[i] !== this.userid){
							newlst.push(lst[i])
						}
					}
					db.collection('new-friends').where({
						user_id: this.userInfo._id
					}).update({
						'request_list': newlst
					})
				})
				uni.showToast({
					title: "已拒绝好友申请",
					icon: "none"
				})
				uni.navigateBack()
			},
			navigateToChat () {
				let path = '../chat/privateChat/privateChat?to=' + this.userid
				uni.navigateTo({
					url: path
				});
			},
		},
		onLoad(option) {
			// console.log(option.to)
			this.userid = option.to
			db.collection('uni-id-users').where({
				_id: this.userid
			}).field("nickname, avatar_file, register_date, last_login_date, interests").get().then((res)=>{
				this.imgurl = res.result.data[0].avatar_file ? res.result.data[0].avatar_file.url : ''
				// console.log(res.result.data)
				this.name = res.result.data[0].nickname
				this.regdate = res.result.data[0].register_date
				this.logdate = res.result.data[0].last_login_date
				this.ilist = res.result.data[0].interests
			})
			
			db.collection('friends').where({
				user_id: this.userInfo._id
			}).field('friend_list').get().then((res)=>{
				if(res.result.data[0]){
					for(var i = 0; i < res.result.data[0].friend_list.length; i++){
						if(res.result.data[0].friend_list[i] === this.userid){
							this.iffriend = 1
							break
						}
					}
				}
			})
			db.collection("new-friends").where({
				user_id: this.userInfo._id
			}).field('request_list').get().then((res)=>{
				if(res.result.data[0]){
					for(var i = 0; i < res.result.data[0].request_list.length; i++){
						if(res.result.data[0].request_list[i] === this.userid){
							this.iffriend = 2
							break
						}
					}
				}
			})
		}
	}
</script>

<style lang="scss">
.info{
	margin-left: 5%;
	margin-right: 5%;
	border-radius: 20rpx;
	margin-top: 10rpx;
	margin-bottom: 20rpx;
	display:flex;
	flex-direction: column;
	align-items: center;
	.image{
		margin-top: 20rpx;
		width:150px;
		border-radius: 20rpx;
	}
	.name{
		font-size: 20px;
		font-weight: 600;
	}
	.last{
		color:#666666;
		font-size:15px;
	}
}
.interestbox{
	margin-left: 10%;
	margin-right: 10%;
	border-radius: 20rpx;
	margin-top: 10rpx;
	margin-bottom: 20rpx;
	background-color: #FFF0F5;
	display:flex;
	flex-direction: column;
	align-items: center;
	padding-bottom: 10px;
	.interestlist{
		margin-top: 20rpx;
	}
}
.interest{
	// margin-left: 27%;
	// margin-right:27%;
	display: flex;
	justify-content: center;
	font-weight: 600;
}
.add{
	height:100rpx;
	margin-left: 5%;
	margin-right: 5%;
	border-radius: 100rpx;
	margin-top: 80%;
	background:linear-gradient(to right, #ff9569 0% ,#e92758 100%);
	display:flex;
	flex-direction: column;
	text-align: center;
	justify-content: center;
	.add-text{
		font-weight: 600;
		
	}
}
.choice{
	display:flex;
	flex-direction: row;
	.choice2{
			height:100rpx;			width:40%;
			margin-left: 5%;
			margin-right: 5%;
			border-radius: 100rpx;
			margin-top: 80%;
			background:linear-gradient(to right, #ff9569 0% ,#e92758 100%);
			display:flex;
			flex-direction: column;
			text-align: center;
			justify-content: center;
	}
}
</style>
