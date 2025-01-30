<template>
	<view class="container">
		<uni-fab ref="fab" :pattern="pattern" :content="content" :horizontal="horizontal" :vertical="vertical"
			:direction="direction" @trigger="trigger"/>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				title: 'uni-fab',
				directionStr: '垂直',
				horizontal: 'right',
				vertical: 'bottom',
				direction: 'horizontal',
				pattern: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					selectedColor: '#007AFF',
					buttonColor: '#4B0082',
					iconColor: '#fff'
				},
				is_color_type:false,
				content: [{
					text: '鼓励箱',
					active: false,
					iconPath:'/static/encourage_box.png'
				},
				{
					selectedIconPath: '/static/home-active.png',
					text: '发布',
					active: false,
					iconPath:'/static/upload.png'
				}]
			}
		},
		onBackPress() {
			if (this.$refs.fab.isShow) {
				this.$refs.fab.close()
				return true
			}
			return false
		},
		methods: {
			trigger(e) {
				console.log(e)
				if(e.index==0){
					uni.navigateTo({
						    url:"/pages/plaza/subplaza/encouragebox/encouragebox"
						
						})
				}
				if(e.index==1){
					uni.navigateTo({
						    url:"/pages/plaza/subplaza/qrcode/qrcode"
						
						})
				}

			}
		}
	}
</script>

<style lang="scss">
	.warp {
		padding: 10px;
	}

	.button {
		margin-bottom: 10px;
	}
</style>

