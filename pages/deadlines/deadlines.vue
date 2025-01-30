<template>
	<view>
		
		<unicloud-db ref="udb" where="user_id._id == $cloudEnv_uid" orderby="date" v-slot:default="{data, loading, error, options}" collection="todolist, uni-id-users" field="_id, task, date, user_id._id">
			<view v-if="error">{{error.message}}</view>
			<view v-else>
			
				<!-- {{data}} -->
				<view v-for="(item,index) in data" v-if="item.date >= todaydate" :key="index" class="itembox">
					<view class="textbox">
						<text class="textdate">
							{{item.date}}					
							{{item.task}}
						</text>
					</view>
					
					<button class="donebutton" @click="done_event(item)" type="default"><text class="editl">完成</text></button>
					<button class="editbutton" @click="edit_event(item)" type="default"><text class="editl">编辑 </text></button>
					<view class="delbutton" @click="delete_event(item)">
						<u-icon name="close"></u-icon>
					</view>
				
					
				</view>
			</view>
		</unicloud-db>
		<uni-popup ref="popup" type="dialog">
		    <!-- <uni-popup-message type="info" message="请在未来的日期添加任务"></uni-popup-message> -->
			
			<uni-popup-dialog mode="base" title="编辑任务" :before-close="true" @close="close()" @confirm="confirm()">
				
				<uni-forms border>
				    <uni-forms-item label="日期">
				        <uni-datetime-picker type="date" :value="setdate" v-model="setdate" />
				    </uni-forms-item>
				    <uni-forms-item label="内容">
				        <uni-easyinput type="textarea" :value="pretext" v-model="newtext" :inputBorder="true" placeholder="不填写则默认任务无改动" />
				    </uni-forms-item>
				</uni-forms>
			</uni-popup-dialog>
			
		</uni-popup>
		<uni-popup ref="popup2" type="dialog">
			<uni-popup-dialog mode="base" title="完成任务" content="确定完成任务？" :before-close="true" @close="close2()" @confirm="confirm2()">
				
				
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import {mapGetters} from 'vuex'
	const db = uniCloud.database();
	
	function getDate(date, AddDayCount = 0) {
		if (!date) {
			date = new Date()
		}
		if (typeof date !== 'object') {
			date = date.replace(/-/g, '/')
		}
		const dd = new Date(date)
	
		dd.setDate(dd.getDate() + AddDayCount) // 获取AddDayCount天后的日期
	
		const y = dd.getFullYear()
		const m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1 // 获取当前月份的日期，不足10补0
		const d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate() // 获取当前几号，不足10补0
		return {
			fullDate: y + '-' + m + '-' + d,
			year: y,
			month: m,
			date: d,
			day: dd.getDay()
		}
	}
	export default {
		data() {
			return {
				todaydate: getDate(new Date()).fullDate,
				pretext: '',
				newtext: '',
				newid: '',
				setdate: getDate(new Date()).fullDate,
				doneid: '',
			}
		},
		computed: {
			...mapGetters({
				userInfo: 'user/info'
			})
		},
		methods: {
			edit_event(item) {
				// this.selected = item
				this.setdate = item.date
				// console.log(this.newtext)
				
				this.pretext = item.task
				this.newtext = item.task
				// console.log(this.pretext, this.newtext)
				this.newid = item._id
				// console.log(this.newtext)
				this.$refs.popup.open('center');
				
				
			},
			done_event(item) {
				this.doneid = item._id
				this.$refs.popup2.open('center')
			},
			confirm() {
				if(this.newtext != '' && this.setdate >= this.todaydate){
					this.$refs.udb.update(this.newid, {
						"task": this.newtext,
						"date": this.setdate,
					})
					this.$refs.popup.close()
					this.$refs.udb.refresh()
				}
				else if(this.newtext == ''){
					uni.showToast({
						title: '任务内容不能为空',
						icon: 'none'
					})
				}
				else if(this.setdate < this.todaydate){
					uni.showToast({
						title: '请在未来的日期添加任务',
						icon: 'none'
					})
				}
			},
			confirm2() {
				db.collection('todolist').where({
					_id: this.doneid
				}).remove()
				
				uniCloud.callFunction({
					name: 'edit-exp',
					data: {
						user_id: this.userInfo._id,
						points: 3
					}
				})
				uni.showToast({
					title: '任务完成，经验+3'
					// icon: 'none'
				})
				this.$refs.popup2.close()
				this.$refs.udb.refresh()
			},
			close() {
				this.$refs.popup.close()
			},
			close2() {
				this.$refs.popup2.close()
			},
			delete_event(item) {
				console.log(item._id)
				this.$refs.udb.remove(item._id)
				
			}
			
		}
	}
</script>

<style lang="scss">
	.itembox {
		margin-left: 10px;
		margin-right: 10px;
		margin-bottom: 10px;
		display: flex;
		padding: 10px;
		background-color: #FFFFF0;
		border-bottom:1px solid #cccccc;
		.textbox{
			width: 160px;
			.textdate{
				font-size: 14px;
				font-weight: 400;
				// text-overflow: ellipsis;
				word-wrap: break-word;
				// width: 20px
			}
		}
		
		.delbutton{
			padding:10px;
			color:#444444;
		}
		.editbutton{
			font-size:14px;
			margin-left: 15px;
			background-color: #FFEFD5;
			width: 60px;
			height: 35px;
			.editl{
				color:#666666;
				
			}
		}
		.donebutton{
			font-size:14px;
			margin-left: 15px;
			// margin-left: 45%;
			background-color: #FFFFDD;
			width: 60px;
			height: 35px;
			.editl{
				color:#666666;
				
			}
		}
	}
</style>
