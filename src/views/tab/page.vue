<template>
  <div class="app-container">
	<el-tabs tab-position="top" >
		<el-tab-pane label="首页"></el-tab-pane>
		<el-tab-pane label="详情页"></el-tab-pane>
	</el-tabs>
	<el-row>
	  <el-col :span="18">
		  <section class="diy">
			  <aside class="tip">温馨提示：小程序最多只支持10级页面跳转，超过10级无法跳转</aside>
			  <el-scrollbar class="phone">
				  <div class="diy-phone" data-merch="0">
					  <div class="phone-head"></div>
					  <div class="phone-body">
						  <div class="phone-title" id="page" style="color: rgb(0, 0, 0);background-color: rgb(255, 255, 255);background-image: url(http://dudu.raytonecn.com/addons/ewei_shopv2/plugin/app/static/images/wx-top2.png);">diy页面</div>
						  <div class="phone-main ui-sortable" id="phone">
							  <!-- <component :is="items.name" v-for="(items,index) in templateArr.item" :key="index">
								  <component v-bind:is="currentTabComponent"></component>
							  </component> -->
						  </div>
					  </div>
					  <div class="phone-foot"></div>
				  </div>
			  </el-scrollbar>
		  </section>
	  </el-col>
	  <el-col :span="6">
		  <el-scrollbar class="module">
			  <h4>页面模块</h4>
			  <el-row>
			    <el-button data-id="topmenu">顶部菜单</el-button>
			    <el-button data-id="notice">公告</el-button>
			    <el-button data-id="goods">商品组</el-button>
			    <el-button data-id="search">搜索框</el-button>
			    <el-button data-id="fixedsearch">固定搜索框</el-button>
			    <el-button data-id="seckillgroup">秒杀组</el-button>
			    <el-button data-id="copyright">版权</el-button>
			    <el-button data-id="video">视频组</el-button>
			    <el-button data-id="listmenu">列表导航</el-button>
			    <el-button data-id="richtext">富文本</el-button>
			    <el-button data-id="title">标题栏</el-button>
			    <el-button data-id="line">辅助线</el-button>
			    <el-button data-id="blank">辅助空白</el-button>
			    <el-button data-id="menu">按钮组</el-button>
			    <el-button data-id="menu2">按钮组2</el-button>
			    <el-button data-id="picture">单图组</el-button>
			    <el-button data-id="banner">图片轮播</el-button>
			    <el-button data-id="picturew">图片橱窗</el-button>
			    <el-button data-id="coupon">优惠券组</el-button>
			    <el-button data-id="tabbar">选项卡</el-button>
			  </el-row>
		  </el-scrollbar>
	  </el-col>
	</el-row>
  </div>
</template>

<script>
// import Upload from '../../components/Upload'
// import Share from '../../components/Share'
// import Charts from '../../components/Charts'
// import Dropzone from '../../components/Dropzone'

export default {
  name: 'diy',
  components: { Upload, Share, Charts, Dropzone },
  data() {
    return {
		"item": [
			{
			  "sort": 2,
			  "name": "Dropzone",
			  "data": {}            
			},
			{
			  "sort": 3,
			  "name": "Charts",
			  "data": {}            
			},
		]
    }
  },
  computed: {
    
  },
  created() {
    
  }
}
</script>
<style>
	.diy{
		padding: 0 50px;
	}
	.diy .tip{
		color: #259fdc;
		background-color: #d9edf7;
		border-color: #c5dce7;
		font-size: 14px;
	}
	.diy-phone{
		float: left;
		width: 328px;
		height: auto;
		border: 1px solid #ddd;
		border-radius: 10px;
		background: #fff;
		padding: 10px;
	}
	.diy-phone .phone-head{
		height: 44px;
		background: #fff;
		position: relative;
	}
	.diy-phone .phone-head:before {
	    content: "";
	    position: absolute;
	    top: 15px;
	    left: 112px;
	    height: 8px;
	    width: 8px;
	    background: #ddd;
	    border-radius: 8px;
	}
	
	.diy-phone .phone-head:after {
	    content: "";
	    position: absolute;
	    top: 15px;
	    left: 128px;
	    height: 8px;
	    width: 50px;
	    background: #ddd;
	    border-radius: 8px;
	}
	.diy-phone .phone-title{
		height: 54px;
		background: url(http://dudu.raytonecn.com/addons/ewei_shopv2/plugin/app/static/images/wx-top2.png) 0 0 no-repeat;
		background-color: #fff;
		background-size: 100% auto;
		padding: 0 50px;
		font-size: 15px;
		color: #000;
		text-align: center;
		line-height: 68px;
		cursor: default;
		overflow: hidden;
		display: block;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.diy-phone .phone-main{
		min-height: 400px;
		border: 1px solid #ddd;
		border-top: 0;
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		position: relative;
	}
	.diy-phone .phone-foot{
		height: 24px;
		width: 60px;
		margin: 15px auto 5px;
		border: 1px solid #ddd;
		border-radius: 5px;
	}
	.phone .el-scrollbar__wrap{
		height: calc(100vh - 84px - 40px - 54px - 48px - 20px);
	}
	.module .el-scrollbar__wrap{
		height: calc(100vh - 84px - 40px - 54px);
	}
	.el-row button{
		width: 100px;
		margin-left: 0!important;
		margin-right: 10px;
		margin-bottom: 10px;
		padding: 10px 0!important;
	}
</style>