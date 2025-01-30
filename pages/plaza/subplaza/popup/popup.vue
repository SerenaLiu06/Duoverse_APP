<template>
	<view class="container">
			<view class="example-body box">
				<button class="button popup-warn" @click="dialogToggle('warn')"><text
						class="button-text warn-text">警告</text></button>
			</view>

		<view>
			<!-- 提示窗示例 -->
			<uni-popup ref="alertDialog" type="dialog">
				<uni-popup-dialog :type="msgType" cancelText="取消" confirmText="确认" title="通知" content="是否要删除这条动态" @confirm="dialogConfirm"
					@close="dialogClose"></uni-popup-dialog>
			</uni-popup>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
},
		methods: {

			dialogToggle(type) {
				this.msgType = type
				this.$refs.alertDialog.open()
			}
		}
	}
</script>