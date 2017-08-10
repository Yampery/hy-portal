require.config({
　baseUrl: "scripts",
  paths: {
	"text":"lib/text",
	"html":"../nav.html",
	"underscore":"lib/underscore-min",
	"EventBus":"lib/EventMemory"
	},
	shim:{
		'underscore':{
			exports:'_'
		}
	}
});

define([
	'config',
	'text!html',
	'underscore',
	'EventBus',
	'print'
	],
	function(
		config,
		html,
		_,
		EventBus,
		print
	){
	var module = {
		// 检测是否为搜索页面
		isSearchPage:(/.*\/(.*)\.html/g.test(location.href) && RegExp.$1 === 'search_result'),
		init:function(){
			// 获取导航数据,生成导航
			this.getNavData();
			// 绑定整站搜索事件
			this.searchInput();
			this.bindFooterLink();
			print.init();
		},
		bind:function(){
			//菜单栏跳转页面
			var that = this;
			$('.menu_ul > ul > li').on('click', function (e) {
				// 修复点击下拉 div 也会跳转的bug
				if($(e.target).parent().parent().is(".menu_ul")){
					var id = $(this).attr('id');
					$('#Menu').children('li').removeClass('on');
					if(id){
						location.href = id + '.html?identifiers='+id;
					}
				}
			});
			$('.input_menu').on('click', '.menu_list', function(evt) {
				var keyword = $(evt.currentTarget).text();
				if(!that.isSearchPage){
					window.open('search_result.html?keyword='+keyword);
				}else{
					EventBus.emit('ISSEARCHPAGE',keyword);
				}
			});
			$('.right_part').on('click', 'a', function(evt) {
				evt.stopPropagation();
				var pageType = $(evt.currentTarget).parents('.secondary_menu').parent().attr('id');
				var dataId = $(evt.currentTarget).attr('data-id');
				location.href = pageType + '_details.html?newsId=' + dataId;
			});
		},
		getNavData:function(){
			var that = this;
			$.ajax({
				url: config.getNavigationUrl,
				dataType: 'json',
			})
			.done(function(data) {
			 	if(data.code === 200 || data.state === 'success'){
			 		that.makeNav(data);
			 		that.EventDistribution(data.results);
			 		that.setHotWorld(data.results);
			 	}
			 	// 绑定事件
				that.bind();
			})
			.fail(function() {
				// console.log("error");
			})
			
		},
		setHotWorld:function(data){
			// 过滤出搜索关键词数据
			var hotworldData = _.filter(data,function(item){
				return item.identifiers === 'keyWords';
			})[0]
			var listHTML = [];
			for (var i = 0; i < hotworldData.children.length; i++) {
				var item = hotworldData.children[i];
				listHTML.push('<a class="menu_list">'+item.navigationName+'</a>')
			}
			$('.input_menu').html(listHTML.join('<a>|</a>'));
		},
		EventDistribution:function(data){
			var eventData = ['products','aboutUs','solution','headBanner','tailBanner','productsBanner','solutionBanner','talent','technicalService'];
			//EventBus.emit('GET_NAV_DATA',item.children);
			var eventName;
			data.forEach(function(item){
				switch(item.identifiers){
					case eventData[0]:
						EventBus.emit('GET_'+eventData[0].toLocaleUpperCase()+'_DATA',item);
						break;
					case eventData[1]:
						EventBus.emit('GET_'+eventData[1].toLocaleUpperCase()+'_DATA',item.children);
						break;
					case eventData[2]:
						EventBus.emit('GET_'+eventData[2].toLocaleUpperCase()+'_DATA',item.children);
						break;
					case eventData[3]:
						EventBus.emit('GET_'+eventData[3].toLocaleUpperCase()+'_DATA',item.children);
						break;
					case eventData[4]:
						EventBus.emit('GET_'+eventData[4].toLocaleUpperCase()+'_DATA',item.children);
						break;
					case eventData[5]:
						EventBus.emit('GET_'+eventData[5].toLocaleUpperCase()+'_DATA',item.children);
						break;
					case eventData[6]:
						EventBus.emit('GET_'+eventData[6].toLocaleUpperCase()+'_DATA',item.children);
						break;
					case eventData[7]:
						EventBus.emit('GET_'+eventData[7].toLocaleUpperCase()+'_DATA',item);
						break;
					case eventData[8]:
						eventName = eventData[8];
						EventBus.emit('GET_'+ eventName.toLocaleUpperCase()+'_DATA',item.children);
						break;

				}
			})
		},
		makeNav:function(navData){
			var data = navData.results.sort(this.sortRule);

			// 解析 template
			var tpl = _.template(html);
			// 传输数据,返回html
			var text = tpl({list:data,config:config});
			$('#Menu').html(text);
			
			$('.header_menu').fadeIn();
		},
		sortRule:function(a,b){		//数组排序
			return a.index - b.index
		},
		searchInput:function(){
			
			$('.header').on('click', '.search_btn,.menu_search_btn', function(evt) {
				var keyword = $(evt.currentTarget).siblings('input').val();
				if(/^\s+$/g.test(keyword) || keyword === ''){
					return;
				}
				if(!this.isSearchPage){
					location.href = 'search_result.html?keyword='+keyword;
				}else{
					EventBus.emit('ISSEARCHPAGE',keyword);
				}
			});

			$('.header').on('keydown', '.search_input input,menu_search_input', function(evt) {
				var code = evt.keyCode;
				var keyword = $(evt.currentTarget).val();
				if(code === 13 && (keyword !== '' || /^\s+$/g.test(keyword))){
					if(!this.isSearchPage){
						location.href = 'search_result.html?keyword='+keyword;
					}else{
						EventBus.emit('ISSEARCHPAGE',keyword);
					}	
				}
			});
		},
		bindFooterLink:function(){
			var aboutUsHtml = ['<li>关于我们</li>',
						'	<li><a href="aboutUs_details.html?type=companyProfile">企业简介</a></li>',
						'	<li><a href="aboutUs_details.html?type=honors">资质荣誉</a></li>',
						'	<li><a href="aboutUs_news.html">企业文化</a></li>',
						'	<li><a href="aboutUs_details.html?type=development">发展历程</a></li>',
						'	<li><a href="aboutUs_details.html?type=investor">投资者关系</a></li>',
						'	<li><a href="aboutUs_details.html?type=contactUs">联系我们</a></li>'
						].join("");
			$('.footer .left_list ul:eq(0)').html(aboutUsHtml);

			var techServiceHtml = ['',
						'	<li>技术服务</li>',
						'	<li><a href="technicalService_details.html?type=nationalOutlets">全国网点</a></li>',
						'	<li><a href="technicalService_details.html?type=onlineFeedBack">在线反馈</a></li>',
						'	<li><a href="technicalService_details.html?type=serviceCenter">运维中心</a></li>',
						'	<li><a href="technicalService_details.html?type=commonProblem">常见问题</a></li>',
						'	<li><a href="technicalService_details.html?type=softwareDownload">软件下载</a></li>',
						'	<li><a href="technicalService_details.html?type=otherDownload">其他下载</a></li>',
						''].join("");
			$('.footer .left_list ul:eq(1)').html(techServiceHtml);

			var recruitHtml = ['',
						'	<li>加入我们</li>',
						'	<li><a href="talent.html?identifiers=talent">员工发展体系</a></li>',
						'	<li><a href="http://www.southgis.com/zt/2017zhaopin/index.html">校园招聘</a></li>',
						'	<li><a href="talent.html?identifiers=talent">社会招聘</a></li>',
						'	<li><a href="talent.html?identifiers=talent">精彩生活</a></li>',
						''].join("");
			$('.footer .left_list ul:eq(2)').html(recruitHtml);
		}
	}

	return {
		init:module.init.bind(module),
	}
})