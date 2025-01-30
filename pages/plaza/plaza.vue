<template>
	<view>
	<postFab />
	<view class="indexContent">
		<view class="courseIntroduce_tab_box">
			<view class="courseIntroduce_tab_nav">
				<view v-for="(item,index) in items" :class="{'btna':count === index}" @tap="change(index)" :key="index">
					{{item}}
				</view>
			</view>
			<view class="courseIntroduce_tab_con">
				<view class="discount_info" :class="{dis:count===0}">

						<view class="goods-list">
							<view>
								<read></read>
							</view>
						</view>
				</view>
				<view class="discount_info" :class="{dis:count===1}">
						<view class="goods-list">
							<view>
								<read2></read2>
							</view>
						</view>

				</view>
			</view>
		</view>
	</view>
	</view>
</template>

<script>
	import postFab from "../../components/post-fab/post-fab.vue"
	import read from '@/components/read.vue'
	import read2 from '@/components/read2/read2.vue'
	import articlebox from '@/components/article_box.vue'
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	let tabItem = [{
			name: '推荐',
			goods: null,
			num: 1,
			y: 0,
			curPageLen: 0,
			hasNext: true
		},
		{
				name: '好友',
				goods: null,
				num: 1,
				y: 0,
				curPageLen: 0,
				hasNext: true
			}
	]
	export default {
		mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
		components: {
			articlebox,
			read,
			read2,
			postFab
		},
		data() {
			return {
				enable: true,
				tabs: tabItem,
				upOption: {},
				items:["推荐","好友"],
				count:0,
				tabIndex: 0, // 当前菜单下标
				preIndex: 0, // 前一个菜单下标
				
				/*吸顶悬浮，上拉加载，下拉刷新组件 end*/
				list: [],
				goods: [{},{}],
				windowWidth: 0
			}
		},
		onLoad() {
			this.list = this.$tabList;
			uni.getSystemInfo({
				success: (res) => {
					this.windowWidth = res.windowWidth;
				}
			})
			return
			
		},
		onPullDownRefresh() {
			console.log("触发了下拉刷新")
			uni.reLaunch({url: '/pages/plaza/plaza'})
			uni.stopPullDownRefresh()
		
		},
		// 在对应的show和hide页面生命周期中打开或关闭监听
		onShow() {
				this.enable= true
		},
		onHide() {
				this.enable= false
		},
		methods: {
			change(index){
				this.count=index;
			},
			// 切换菜单
			tabChange(index) {
				this.tabIndex = index
				this.downCallback()
			},
			toadd(){
						uni.navigateTo({
							url:"/pages/plaza/subplaza/qrcode/qrcode"
						})},
			toEB(){
						uni.navigateTo({
							url:"/pages/plaza/subplaza/encouragebox/encouragebox"
						})},
			changeTab(res) {
				console.log(res);
				if (res != 2) {
					this.$changeFun(res);
				}
			},
			mescrollInit(){
				
			},
			//下拉刷新
			downCallback(){
				//...自定义的页码设置为1；以及goods数据设置为[]
				this.upCallback()
			},
			//上拉加载下一页
			upCallback(){
				//...请求
				//...goods追加数据
				setTimeout(()=>{
					this.mescroll.endSuccess(this.goods.length);
				},1000)
				
			},
		}
	}
</script>

<style>
	
	padding-top:var(--status-bar-height);
	.u-mode-center-box {
		border-radius: 20rpx !important;
	}

	page {
		background-color: #f2f2f2;
	}

</style>
<style lang="scss" scoped>
	.add-back{
		.add{
			width: 80rpx;
			height:80rpx;
			bottom:80px;
			position: fixed;
			margin-left: 80%;
			background-image: white;
		}
	}
	.indexContent {
		position: relative;
		.tuijianguanzhu{
			margin-top: -40px;
			.box{
				width: 60rpx;
				height:60rpx;
				margin-left: 90%;
				margin-top: -40px;
			}
		}
	}

	.authorBtn {
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: 1000;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		opacity: 0;
	}

	/*吸顶悬浮，上拉加载，下拉刷新组件*/
	.demo-tip {
		padding: 18rpx;
		font-size: 24rpx;
		text-align: center;
	}

	/*吸顶悬浮，上拉加载，下拉刷新组件end*/

	.popup-content {
		border-radius: 20rpx;
		padding: 40rpx 20rpx;
		font-family: "Microsoft YaHei UI";

		.loginTip {
			font-size: 40rpx;
			text-align: center;
		}

		.loginBtn {
			position: relative;
			display: flex;
			width: 90%;
			height: 100rpx;
			margin: 60rpx auto;
			border-radius: 20rpx;
			background-color: #C69C6C;
			justify-content: center;
			align-items: center;
			font-size: 35rpx;
			color: #ffffff;

			.item {
				flex: auto;

				&:nth-child(2) {
					padding-right: 10rpx;
				}
			}
		}
	}
	.courseIntroduce_tab_box{
		display:flex;
		box-sizing:border-box;
		flex-direction:column;
		
		
		.courseIntroduce_tab_nav{
			
			display:flex;
			box-sizing:border-box;
			flex-direction: row;
			background-color:#fff;
			border-bottom:1px solid #e4e4e4;
			margin-bottom:20px;
			view{
				height:50px;
				line-height:50px;
				font-size:16px;
				flex-grow:1;
				text-align:center;
				background-color:#fff;
			}
		}
		.discount_info{
			display:none;
		}
		.btna{
			display:flex;
			box-sizing:border-box;
			justify-content:center;
			color:#9370DB;
			position:relative;
		}
		.btna::after{
			content:"";
			width:40px;
			height:3px;
			background-color:#9370DB;
			position:absolute;
			bottom:0;
			left:50%;
			margin-left:-20px;
		}
		.dis{
			display:block;
		}
	}
	.qiliuhai{
		height:30px;
		background-color:white;
	}
	.fit{
		height:44rpx;
		background-color:#FFFFFF;
	}
</style>