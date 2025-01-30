<template>
	<div class="mounth">
	        <div class="datatime">
	          <span class="time">{{
	            getDate
	          }}</span>
	        </div>
	      </div>
</template>

<script>
	function current_date() {
			     var nowDate = new Date();
			     let date = {
			       month: nowDate.getMonth() + 1,
								date:nowDate.getDate(),
								hour:nowDate.getHours(),
								minute:nowDate.getMinutes()
			     };
							  const newmonth = date.month>10?date.month:'0'+date.month
							  const day = date.date>10?date.date:'0'+date.date
							  const hour = date.hour>10?date.hour:'0'+date.hour
							  const minute = date.minute>10?date.minute:'0'+date.minute
			     // console.log(date);
			     let systemDate = newmonth + "-" +day+ "  "+date.hour+":"+date.minute;
			     return systemDate;
			   }
	export default {
		data(){
		  return{
			getDate : current_date()
		  }
		},  
		methods:{
		//获取当前年月日
	
		    
		    },

	}
	
</script>

<style>

</style>
