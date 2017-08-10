/* 
 * 	版本：		v20140523-v20150313
 *
 * 	使用要求/影响：		1. 需要轮播的集合的父元素要有定位属性,如没有,则会自动给其添加relative定位属性(示例中的pic)
 *						2. 需要轮播的集合的父元素overflow属性应设为hidden,如没有,则会自动给其设置成hidden(示例中的pic)
 *						3. 需要轮播的元素要有定位应为absolute,如没有,则会自动为其添加absolute定位属性(示例中的pic1,pic2,...picN)
 *						4. 在html页面引入此js之前,应先引入jquery.js(1.10.2版本或其他合适版本)
 *						5. 需要轮播的元素和其父元素的宽高应该一样（示例中的pic1,pic2,...picN和pic宽高一样）
 *
 * 	使用方式:		eg:
 *					<div class="pic">
 *						<div class="pic1"></div>
 *						<div class="pic2"></div>
 *						......
 *						<div class="picN"></div>
 *					</div>
 *					class为pic的div里包含了N个直接子div,每个子div都是一张图片.要使这些图片轮播,只需要如下操作即可:
 *					$(".pic").imgBox({
 *						specialEffectsNo: 2,
 *						intervalTime: 2000,
 *						bottomToolbar: true,
 *						bottomToolbar_bottomPx: "50px",
 *						bottomToolbar_icon_typeNo: 1
 *					});ps:这里的所有选项都是可选的,如不填写,则使用默认的切换方式.支持的预定属性请查看setSettings()
 *
 * 	支持效果:		见action()
 * 
 *	使用建议：	1. 当specialEffectsNo为2时,intervalTime不能过小
 *
 * 	兼容性:		支持 
 *
 * 	碰到的问题:	1. IE6下的样式名称开头不能为'_'(下划线)(已解决)
 * 				2. 当intervalTime过小时(例如100),specialEffectsNo为2的特效会出现不正常现象(待解决) 
 *				3. 在那儿2.0官网时碰到，自动切换时，底部工具栏样式不切换（待解决）（已解决）
 *
 *	作者:		吴庆周
 *
 *	作者邮箱:		wuqingzhou1989@yeah.net(有事请联系)
 *
 */
(function($){
	$.fn.imgBox = function(_options){
		return this.each(function(){
			var property = {};
			var settings = {};
		
			setSettings();
			setProperty(this);
			setStartStatus(this);		
			startLoop();
			
			
			/* 设置settings的值 */
			function setSettings(){
				settings = $.extend({
					specialEffectsNo: 1,					// 要执行的特效的编号
					intervalTime: 3000,						// 切换间隔时间
					
					fadeInSpeed: 800,						// 淡入速度
					fadeOutSpeed: 200,						// 淡出速度	
					
					lineMove_angle: 90,						// 直线推进的方向(0表示正上方,90表示右侧,以此类推)
					lineMove_moveSpeed: 1000,				// 直线推进的速度
					lineMove_callback: null,				// 直线推进后的回调函数
								
					bottomToolbar_enable: false,			// 是否显示底部工具栏
					bottomToolbar_bottomPx: '50px',			// 底部工具栏距离底部的距离(前提是bottomToolbar为true)
					bottomToolbar_align: 'center',			// 底部工具栏水平方向布局方式(left,right,center)(前提是bottomToolbar为true)
					bottomToolbar_icon_typeNo: 0,			// 底部工具栏图标类型(前提是bottomToolbar为true)
					bottomToolbar_a_gap: "20px",			// 底部工具栏子标签a之间的间隙
					bottomToolbar_hoverSwitch: false,		// 底部工具栏子标签a是否通过hover效果来切换图片(默认为click切换)
					
					bothSidesToolbar_enable: false,			// 是否显示两侧工具栏
					bothSidesToolbar_icon_typeNo: 0			// 两侧工具栏图标类型
				},_options);
			};
			
			/* 设置property的值 */
			function setProperty(_this){
				// 初始化property
				property = $.extend({
					imgGroup: new Array(),					// imgBox的子元素集合
					imgGroupIndex: 0,						// 当前显示的dom在dom集合中的索引
					bottomToolbar: {},						// 底部工具栏
					bothSidesToolbar: {},					// 两侧工具栏
					timer: null								// 定时器
				},null);
				
				// 设置property.imgGroup
				$(_this).children().each(function(index,domEle){			
					property.imgGroup[index] = domEle;		
				});
				
				// 设置property.bottomToolbar
				if (settings.bottomToolbar_enable){							// 设置底部工具栏
					property.bottomToolbar = $.extend({						
						enable: 		settings.bottomToolbar_enable,		// 使能
						dom:			null,								// 此底部工具的jQ选择器表达式
						offsetBottom: 	settings.bottomToolbar_bottomPx,	// 底部偏移量(距离父元素的底部的距离)
						align: 			settings.bottomToolbar_align,		// 水平方向布局方式(left,right,center)
						icon_typeNo: 	settings.bottomToolbar_icon_typeNo,	// 栏图标类型
						css:			getBottomToolbar_css(),				// 样式
						a_css:			getBottomToolbar_a_css(),			// 子标签a的样式
						gap:			settings.bottomToolbar_a_gap,		// 子标签a之间的间隙
						hoverSwitch:	settings.bottomToolbar_hoverSwitch
					},null);
					insertBottomToolbar(_this);								// 插入底部工具栏
				};
				
				// 设置property.bothSidesToolbar
				if (settings.bothSidesToolbar_enable){							// 设置两侧工具栏
					property.bothSidesToolbar = $.extend({						
						enable: 		settings.bothSidesToolbar_enable,		// 使能
						dom:			null,									// 此两侧工具的jQ选择器表达式
						icon_typeNo: 	settings.bothSidesToolbar_icon_typeNo,	// 栏图标类型
						css:			getBothSidesToolbar_css(),				// 样式
						left_css:		getBothSidesToolbar_left_css(),			// 左侧样式
						right_css:		getBothSidesToolbar_right_css()
					},null);
					insertBothSidesToolbar(_this);								// 插入底部工具栏
				};
			};
				
			/* 获取底部工具栏的样式 */
			function getBottomToolbar_css(){
				return "wqz_bottomToolbar";
			};
				
			/* 获取底部工具栏中a标签的样式 */
			function getBottomToolbar_a_css(){
				switch(settings.bottomToolbar_icon_typeNo){
					case 0:
						return "wqz_bottomToolbar_a_css0";
						break;
					case 1:
						return "wqz_bottomToolbar_a_css1";
						break;
					case 2:
						return "wqz_bottomToolbar_a_css2";
						break;
					default:
						return "wqz_bottomToolbar_a_css0";
						break;
				}
			};
			
			/* 获取两侧工具栏的样式 */
			function getBothSidesToolbar_css(){
				return "wqz_bothSidesToolbar";
			}
			
			/* 获取两侧工具栏左侧的样式 */
			function getBothSidesToolbar_left_css(){
				return getBothSidesToolbar_css() + "_left_css" + settings.bothSidesToolbar_icon_typeNo;
			}
			
			/* 获取两侧工具栏左侧的样式 */
			function getBothSidesToolbar_right_css(){
				return getBothSidesToolbar_css() + "_right_css" + settings.bothSidesToolbar_icon_typeNo;
			}
			
			/* 插入底部工具栏 */ 
			function insertBottomToolbar(_this){
				var len = property.imgGroup.length;
				var text = "<div class='"+property.bottomToolbar.css+"'>";
				for (var i=0; i<len; i++){
					text += "<a></a>";
				}
				text += "</div>";
				$(_this).append(text);
				setBottomToolbar(_this);										// 设置底部工具栏
				bindEventForBottomToolbar();									// 为底部工具栏绑定事件
			};
				
			/* 设置底部工具栏的属性 */
			function setBottomToolbar(_this){
				// 设置底部工具栏的jQ选择器表达式
				property.bottomToolbar.dom = $(_this).children("."+property.bottomToolbar.css);
				// 设置元素a的样式
				property.bottomToolbar.dom.children().addClass(property.bottomToolbar.a_css);
				// 设置元素间的间隔
				property.bottomToolbar.dom.children().css("margin-right",property.bottomToolbar.gap);
				property.bottomToolbar.dom.children().last().css("margin-right","0px");
				// 设置距离底部的距离
				property.bottomToolbar.dom.css("bottom",property.bottomToolbar.offsetBottom);
				// 设置水平布局方式:right(右对齐),left(左对齐),center(居中,默认)
				if (property.bottomToolbar.align == "center"){
					var margin_left = "-" + property.bottomToolbar.dom.width()/2 + "px";
					property.bottomToolbar.dom.css({"left":"50%","margin-left":margin_left});
				}else if (property.bottomToolbar.align == "right"){
					var margin_left = "-" + property.bottomToolbar.dom.width()/2 + "px";
					property.bottomToolbar.dom.css({"right":"5px","margin-left":margin_left});
				}	
			};
			
			/* 为底部工具栏绑定事件 */
			function bindEventForBottomToolbar(){
				// 为底部工具栏中的a标签绑定mouseenter事件
				property.bottomToolbar.dom.children().mouseenter(function(){
					$(this).addClass(property.bottomToolbar.a_css+"_hover");
					if (property.bottomToolbar.hoverSwitch){
						$(this).click();
					}
				})
				if (property.bottomToolbar.hoverSwitch){
					property.bottomToolbar.dom.children().mouseenter(function(){
						$(this).addClass(property.bottomToolbar.a_css+"_hover");
						$(this).click();
					});
				}else{
					property.bottomToolbar.dom.children().mouseenter(function(){
						$(this).addClass(property.bottomToolbar.a_css+"_hover");
					});
				}
				// 为底部工具栏中的a标签绑定mouseleave事件
				property.bottomToolbar.dom.children().mouseleave(function(){
					$(this).removeClass(property.bottomToolbar.a_css+"_hover");
				})
				
				// 为底部工具栏中的a标签绑定click事件
				property.bottomToolbar.dom.children().each(function(index,domEle){
					$(this).click(function(){
						stopLoop();
						$(property.imgGroup[property.imgGroupIndex]).hide();
						$(property.imgGroup[index]).css({left:"0px", top:"0px"});
						$(property.imgGroup[index]).fadeIn(100);
						property.imgGroupIndex = index;
						switchBottomToolbarACss(property.imgGroupIndex);
						startLoop();
					});
				});
			};
			
			/* 选中底部工具栏中的某个a元素 */
			function switchBottomToolbarACss(index_sel){
//				if (property.bothSidesToolbar.enable){
					property.bottomToolbar.dom.children().removeClass(property.bottomToolbar.a_css+"_sel");
					property.bottomToolbar.dom.children().eq(index_sel).addClass(property.bottomToolbar.a_css+"_sel");
//				}
			}
			
			/* 插入两侧工具栏 */
			function insertBothSidesToolbar(_this){
				//var text = "<div class='"+property.bothSidesToolbar.css+"'></div>";
				//$(_this).append(text);
				setBothSidesToolbar(_this);
				bindEventForBothSidesToolbar();
			}
			
			/* 设置两侧工具栏属性 */
			function setBothSidesToolbar(_this){
				// 设置两侧工具栏的jQ选择器表达
				property.bothSidesToolbar.dom = $(_this); //.children("."+property.bothSidesToolbar.css);
				var childGroup = property.bothSidesToolbar.dom; //.children(); 
				// 设置子元素的样式
				childGroup.append("<div class='"+property.bothSidesToolbar.css+" "+property.bothSidesToolbar.left_css+"'></div>"
					+"<div class='"+property.bothSidesToolbar.css+" "+property.bothSidesToolbar.right_css+"'></div>"); //.eq(0).addClass(property.bothSidesToolbar.left_css);
				// childGroup.append(); //.eq(1).addClass(property.bothSidesToolbar.right_css);
				// 设置子元素的垂直位置
				var margin_top = "-" + childGroup.children().eq(0).height()/2 + "px";
				childGroup.children("."+property.bothSidesToolbar.css).css({top:"50%", "margin-top":margin_top});
			}
			
			/* 为两侧工具栏绑定事件 */
			function bindEventForBothSidesToolbar(){
				var childGroup = property.bothSidesToolbar.dom.children("."+property.bothSidesToolbar.css);
				// 为左侧div绑定mouseenter事件
				childGroup.eq(0).mouseenter(function(){
					$(this).addClass(property.bothSidesToolbar.left_css+"_hover");
				})
				
				// 为左侧div绑定mouseleave事件
				childGroup.eq(0).mouseleave(function(){
					$(this).removeClass(property.bothSidesToolbar.left_css+"_hover");
				})
				
				// 为左侧div绑定click事件
				childGroup.eq(0).click(function(){
					stopLoop();
					$(property.imgGroup[property.imgGroupIndex]).hide();
					$(property.imgGroup[autoMinusOne()]).css({left:"0px", top:"0px"});
					$(property.imgGroup[autoMinusOne()]).fadeIn(400);
					property.imgGroupIndex = autoMinusOne();
					switchBottomToolbarACss(property.imgGroupIndex)
					startLoop();
				});
				
				// 为右侧div绑定mouseenter事件
				childGroup.eq(1).mouseenter(function(){
					$(this).addClass(property.bothSidesToolbar.right_css+"_hover");
				})
				
				// 为右侧div绑定mouseleave事件
				childGroup.eq(1).mouseleave(function(){
					$(this).removeClass(property.bothSidesToolbar.right_css+"_hover");
				})
				
				// 为右侧div绑定click事件
				childGroup.eq(1).click(function(){
					stopLoop();
					$(property.imgGroup[property.imgGroupIndex]).hide();
					$(property.imgGroup[autoAddOne()]).css({left:"0px", top:"0px"});
					$(property.imgGroup[autoAddOne()]).fadeIn(400);
					property.imgGroupIndex = autoAddOne();
					switchBottomToolbarACss(property.imgGroupIndex);
					startLoop();
				});
				
			};
			
			/* 设置初始态 */
			function setStartStatus(_this){
				var childGroup = $(_this).children();
				childGroup.not("."+property.bottomToolbar.css).not("."+property.bothSidesToolbar.css).hide();
				childGroup.first().show();
				childGroup.css("position","absolute");
				
				$(_this).css("overflow","hidden");
				var pst = $(_this).css("position");
				if ( !(pst=="relative" || pst=="absolute" || pst=="fixed") ){
					$(_this).css("position","relative");
				}
				
				// 底部工具栏初始状态
				if (settings.bottomToolbar_enable){
					$(_this).children("."+property.bottomToolbar.css).children().first().addClass(property.bottomToolbar.a_css+"_sel");
					$(_this).children("."+property.bottomToolbar.css).css("z-index","3");
				}
				
				// 层叠关系
				$(_this).children("."+property.bothSidesToolbar.css).css("z-index","2");
			}
			
			/* 开始循环 */
			function startLoop(){
				property.timer = setInterval(action, settings.intervalTime);
			};
			
			/* 停止循环 */
			function stopLoop(){
				clearInterval(property.timer);
			};
		
			/* 返回property.imgGroupIndex加1 */
			function autoAddOne(){
				return (property.imgGroupIndex+1)%property.imgGroup.length;
			};
			
			/* 返回property.imgGroupIndex减1 */
			function autoMinusOne(){			
				return (property.imgGroupIndex-1+property.imgGroup.length)%property.imgGroup.length;
			}
			
			/* 推进. 要求：1. 此元素具有absolute定位,其父元素也要有定位属性,且建议其父元素的overflow为hidden */
			function lineMove(dom, direction, angle, moveSpeed, callback){
				var top;
				var left;
				angle = ( angle+360*(Math.ceil(Math.abs(angle)/360)) )%360;
				$(dom).fadeIn(0);
				if ( (angle>=0 && angle<=45) || (angle>315 && angle<=360) ){
					left = $(dom).height() * Math.tan(Math.PI*angle/180);
					top = "-100%";
				}else if (angle>45 && angle<=135){
					left = "100%";
					top = $(dom).width() * Math.tan((angle-90)*Math.PI/180);
				}else if (angle>135 && angle<=225){
					left = $(dom).height() * Math.tan(Math.PI*angle/180) * (-1);
					top = "100%";
				}else if(angle>225 && angle<=315){
					left = "-100%";
					top = $(dom).width() * Math.tan((90-angle)*Math.PI/180);
				}
				
				if (direction == "in"){
					$(dom).css("left",left);
					$(dom).css("top",top);
					$(dom).animate({"top":"0px", "left":"0px"},moveSpeed, callback);
				}else if (direction == "out"){
					$(dom).css("left","0px");
					$(dom).css("top","0px");
					$(dom).animate({"top":top, "left":left},moveSpeed, callback);
				}
			};
			
			/* 特效 */
			function action(){
				switch(settings.specialEffectsNo){
					case -1:				// 空操作
						break;
					case 0:					// 直接显示
						$(property.imgGroup[property.imgGroupIndex]).hide()
						$(property.imgGroup[autoAddOne()]).show();
						property.imgGroupIndex = autoAddOne();
						switchBottomToolbarACss(property.imgGroupIndex);
						break;
					case 1:					// 淡入
						$(property.imgGroup[property.imgGroupIndex]).fadeOut(settings.fadeOutSpeed);
						$(property.imgGroup[autoAddOne()]).fadeIn(settings.fadeInSpeed);
						property.imgGroupIndex = autoAddOne();
						switchBottomToolbarACss(property.imgGroupIndex);
						break;
					case 2:					// 推进显示
						lineMove($(property.imgGroup[property.imgGroupIndex]),"out",(settings.lineMove_angle+180),settings.lineMove_moveSpeed,settings.lineMove_callback);
						lineMove($(property.imgGroup[autoAddOne()]),"in",settings.lineMove_angle,settings.lineMove_moveSpeed,settings.lineMove_callback);
						property.imgGroupIndex = autoAddOne();
						switchBottomToolbarACss(property.imgGroupIndex);
						break;
					case 3:
						break;
					case 4:
						break;
					case 5:
						break;
				}
			};
			
		});
	};	
	

})(jQuery);


(function(a){a.isScrollToFixed=function(b){return !!a(b).data("ScrollToFixed")};a.ScrollToFixed=function(d,i){var m=this;m.$el=a(d);m.el=d;m.$el.data("ScrollToFixed",m);var c=false;var H=m.$el;var I;var F;var k;var e;var z;var E=0;var r=0;var j=-1;var f=-1;var u=null;var A;var g;function v(){H.trigger("preUnfixed.ScrollToFixed");l();H.trigger("unfixed.ScrollToFixed");f=-1;E=H.offset().top;r=H.offset().left;if(m.options.offsets){r+=(H.offset().left-H.position().left)}if(j==-1){j=r}I=H.css("position");c=true;if(m.options.bottom!=-1){H.trigger("preFixed.ScrollToFixed");x();H.trigger("fixed.ScrollToFixed")}}function o(){var J=m.options.limit;if(!J){return 0}if(typeof(J)==="function"){return J.apply(H)}return J}function q(){return I==="fixed"}function y(){return I==="absolute"}function h(){return !(q()||y())}function x(){if(!q()){var J=H[0].getBoundingClientRect();u.css({display:H.css("display"),width:J.width,height:J.height,"float":H.css("float")});cssOptions={"z-index":m.options.zIndex,position:"fixed",top:m.options.bottom==-1?t():"",bottom:m.options.bottom==-1?"":m.options.bottom,"margin-left":"0px"};if(!m.options.dontSetWidth){cssOptions.width=H.css("width")}H.css(cssOptions);H.addClass(m.options.baseClassName);if(m.options.className){H.addClass(m.options.className)}I="fixed"}}function b(){var K=o();var J=r;if(m.options.removeOffsets){J="";K=K-E}cssOptions={position:"absolute",top:K,left:J,"margin-left":"0px",bottom:""};if(!m.options.dontSetWidth){cssOptions.width=H.css("width")}H.css(cssOptions);I="absolute"}function l(){if(!h()){f=-1;u.css("display","none");H.css({"z-index":z,width:"",position:F,left:"",top:e,"margin-left":""});H.removeClass("scroll-to-fixed-fixed");if(m.options.className){H.removeClass(m.options.className)}I=null}}function w(J){if(J!=f){H.css("left",r-J);f=J}}function t(){var J=m.options.marginTop;if(!J){return 0}if(typeof(J)==="function"){return J.apply(H)}return J}function B(){if(!a.isScrollToFixed(H)||H.is(":hidden")){return}var M=c;var L=h();if(!c){v()}else{if(h()){E=H.offset().top;r=H.offset().left}}var J=a(window).scrollLeft();var N=a(window).scrollTop();var K=o();if(m.options.minWidth&&a(window).width()<m.options.minWidth){if(!h()||!M){p();H.trigger("preUnfixed.ScrollToFixed");l();H.trigger("unfixed.ScrollToFixed")}}else{if(m.options.maxWidth&&a(window).width()>m.options.maxWidth){if(!h()||!M){p();H.trigger("preUnfixed.ScrollToFixed");l();H.trigger("unfixed.ScrollToFixed")}}else{if(m.options.bottom==-1){if(K>0&&N>=K-t()){if(!L&&(!y()||!M)){p();H.trigger("preAbsolute.ScrollToFixed");b();H.trigger("unfixed.ScrollToFixed")}}else{if(N>=E-t()){if(!q()||!M){p();H.trigger("preFixed.ScrollToFixed");x();f=-1;H.trigger("fixed.ScrollToFixed")}w(J)}else{if(!h()||!M){p();H.trigger("preUnfixed.ScrollToFixed");l();H.trigger("unfixed.ScrollToFixed")}}}}else{if(K>0){if(N+a(window).height()-H.outerHeight(true)>=K-(t()||-n())){if(q()){p();H.trigger("preUnfixed.ScrollToFixed");if(F==="absolute"){b()}else{l()}H.trigger("unfixed.ScrollToFixed")}}else{if(!q()){p();H.trigger("preFixed.ScrollToFixed");x()}w(J);H.trigger("fixed.ScrollToFixed")}}else{w(J)}}}}}function n(){if(!m.options.bottom){return 0}return m.options.bottom}function p(){var J=H.css("position");if(J=="absolute"){H.trigger("postAbsolute.ScrollToFixed")}else{if(J=="fixed"){H.trigger("postFixed.ScrollToFixed")}else{H.trigger("postUnfixed.ScrollToFixed")}}}var D=function(J){if(H.is(":visible")){c=false;B()}else{l()}};var G=function(J){(!!window.requestAnimationFrame)?requestAnimationFrame(B):B()};var C=function(){var K=document.body;if(document.createElement&&K&&K.appendChild&&K.removeChild){var M=document.createElement("div");if(!M.getBoundingClientRect){return null}M.innerHTML="x";M.style.cssText="position:fixed;top:100px;";K.appendChild(M);var N=K.style.height,O=K.scrollTop;K.style.height="3000px";K.scrollTop=500;var J=M.getBoundingClientRect().top;K.style.height=N;var L=(J===100);K.removeChild(M);K.scrollTop=O;return L}return null};var s=function(J){J=J||window.event;if(J.preventDefault){J.preventDefault()}J.returnValue=false};m.init=function(){m.options=a.extend({},a.ScrollToFixed.defaultOptions,i);z=H.css("z-index");m.$el.css("z-index",m.options.zIndex);u=a("<div />");I=H.css("position");F=H.css("position");k=H.css("float");e=H.css("top");if(h()){m.$el.after(u)}a(window).bind("resize.ScrollToFixed",D);a(window).bind("scroll.ScrollToFixed",G);if("ontouchmove" in window){a(window).bind("touchmove.ScrollToFixed",B)}if(m.options.preFixed){H.bind("preFixed.ScrollToFixed",m.options.preFixed)}if(m.options.postFixed){H.bind("postFixed.ScrollToFixed",m.options.postFixed)}if(m.options.preUnfixed){H.bind("preUnfixed.ScrollToFixed",m.options.preUnfixed)}if(m.options.postUnfixed){H.bind("postUnfixed.ScrollToFixed",m.options.postUnfixed)}if(m.options.preAbsolute){H.bind("preAbsolute.ScrollToFixed",m.options.preAbsolute)}if(m.options.postAbsolute){H.bind("postAbsolute.ScrollToFixed",m.options.postAbsolute)}if(m.options.fixed){H.bind("fixed.ScrollToFixed",m.options.fixed)}if(m.options.unfixed){H.bind("unfixed.ScrollToFixed",m.options.unfixed)}if(m.options.spacerClass){u.addClass(m.options.spacerClass)}H.bind("resize.ScrollToFixed",function(){u.height(H.height())});H.bind("scroll.ScrollToFixed",function(){H.trigger("preUnfixed.ScrollToFixed");l();H.trigger("unfixed.ScrollToFixed");B()});H.bind("detach.ScrollToFixed",function(J){s(J);H.trigger("preUnfixed.ScrollToFixed");l();H.trigger("unfixed.ScrollToFixed");a(window).unbind("resize.ScrollToFixed",D);a(window).unbind("scroll.ScrollToFixed",G);H.unbind(".ScrollToFixed");u.remove();m.$el.removeData("ScrollToFixed")});D()};m.init()};a.ScrollToFixed.defaultOptions={marginTop:0,limit:0,bottom:-1,zIndex:1000,baseClassName:"scroll-to-fixed-fixed"};a.fn.scrollToFixed=function(b){return this.each(function(){(new a.ScrollToFixed(this,b))})}})(jQuery);
/*!
* Clamp.js 0.5.1
*
* Copyright 2011-2013, Joseph Schmitt http://joe.sh
* Released under the WTFPL license
* http://sam.zoy.org/wtfpl/
*/

(function(){
    /**
     * Clamps a text node.
     * @param {HTMLElement} element. Element containing the text node to clamp.
     * @param {Object} options. Options to pass to the clamper.
     */
    function clamp(element, options) {
        options = options || {};

        var self = this,
            win = window,
            opt = {
                clamp:              options.clamp || 2,
                useNativeClamp:     typeof(options.useNativeClamp) != 'undefined' ? options.useNativeClamp : true,
                splitOnChars:       options.splitOnChars || ['.', '-', '–', '—', ' '], //Split on sentences (periods), hypens, en-dashes, em-dashes, and words (spaces).
                animate:            options.animate || false,
                truncationChar:     options.truncationChar || '…',
                truncationHTML:     options.truncationHTML
            },

            sty = element.style,
            originalText = element.innerHTML,

            supportsNativeClamp = typeof(element.style.webkitLineClamp) != 'undefined',
            clampValue = opt.clamp,
            isCSSValue = clampValue.indexOf && (clampValue.indexOf('px') > -1 || clampValue.indexOf('em') > -1),
            truncationHTMLContainer;
            
        if (opt.truncationHTML) {
            truncationHTMLContainer = document.createElement('span');
            truncationHTMLContainer.innerHTML = opt.truncationHTML;
        }


// UTILITY FUNCTIONS __________________________________________________________

        /**
         * Return the current style for an element.
         * @param {HTMLElement} elem The element to compute.
         * @param {string} prop The style property.
         * @returns {number}
         */
        function computeStyle(elem, prop) {
            if (!win.getComputedStyle) {
                win.getComputedStyle = function(el, pseudo) {
                    this.el = el;
                    this.getPropertyValue = function(prop) {
                        var re = /(\-([a-z]){1})/g;
                        if (prop == 'float') prop = 'styleFloat';
                        if (re.test(prop)) {
                            prop = prop.replace(re, function () {
                                return arguments[2].toUpperCase();
                            });
                        }
                        return el.currentStyle && el.currentStyle[prop] ? el.currentStyle[prop] : null;
                    }
                    return this;
                }
            }

            return win.getComputedStyle(elem, null).getPropertyValue(prop);
        }

        /**
         * Returns the maximum number of lines of text that should be rendered based
         * on the current height of the element and the line-height of the text.
         */
        function getMaxLines(height) {
            var availHeight = height || element.clientHeight,
                lineHeight = getLineHeight(element);

            return Math.max(Math.floor(availHeight/lineHeight), 0);
        }

        /**
         * Returns the maximum height a given element should have based on the line-
         * height of the text and the given clamp value.
         */
        function getMaxHeight(clmp) {
            var lineHeight = getLineHeight(element);
            return lineHeight * clmp;
        }

        /**
         * Returns the line-height of an element as an integer.
         */
        function getLineHeight(elem) {
            var lh = computeStyle(elem, 'line-height');
            if (lh == 'normal') {
                // Normal line heights vary from browser to browser. The spec recommends
                // a value between 1.0 and 1.2 of the font size. Using 1.1 to split the diff.
                lh = parseInt(computeStyle(elem, 'font-size')) * 1.2;
            }
            return parseInt(lh);
        }


// MEAT AND POTATOES (MMMM, POTATOES...) ______________________________________
        var splitOnChars = opt.splitOnChars.slice(0),
            splitChar = splitOnChars[0],
            chunks,
            lastChunk;
        
        /**
         * Gets an element's last child. That may be another node or a node's contents.
         */
        function getLastChild(elem) {
            //Current element has children, need to go deeper and get last child as a text node
            if (elem.lastChild.children && elem.lastChild.children.length > 0) {
                return getLastChild(Array.prototype.slice.call(elem.children).pop());
            }
            //This is the absolute last child, a text node, but something's wrong with it. Remove it and keep trying
            else if (!elem.lastChild || !elem.lastChild.nodeValue || elem.lastChild.nodeValue == '' || elem.lastChild.nodeValue == opt.truncationChar) {
                elem.lastChild.parentNode.removeChild(elem.lastChild);
                return getLastChild(element);
            }
            //This is the last child we want, return it
            else {
                return elem.lastChild;
            }
        }
        
        /**
         * Removes one character at a time from the text until its width or
         * height is beneath the passed-in max param.
         */
        function truncate(target, maxHeight) {
            if (!maxHeight) {return;}
            
            /**
             * Resets global variables.
             */
            function reset() {
                splitOnChars = opt.splitOnChars.slice(0);
                splitChar = splitOnChars[0];
                chunks = null;
                lastChunk = null;
            }
            
            var nodeValue = target.nodeValue.replace(opt.truncationChar, '');
            
            //Grab the next chunks
            if (!chunks) {
                //If there are more characters to try, grab the next one
                if (splitOnChars.length > 0) {
                    splitChar = splitOnChars.shift();
                }
                //No characters to chunk by. Go character-by-character
                else {
                    splitChar = '';
                }
                
                chunks = nodeValue.split(splitChar);
            }
            
            //If there are chunks left to remove, remove the last one and see if
            // the nodeValue fits.
            if (chunks.length > 1) {
                // // console.log('chunks', chunks);
                lastChunk = chunks.pop();
                // // console.log('lastChunk', lastChunk);
                applyEllipsis(target, chunks.join(splitChar));
            }
            //No more chunks can be removed using this character
            else {
                chunks = null;
            }
            
            //Insert the custom HTML before the truncation character
            if (truncationHTMLContainer) {
                target.nodeValue = target.nodeValue.replace(opt.truncationChar, '');
                element.innerHTML = target.nodeValue + ' ' + truncationHTMLContainer.innerHTML + opt.truncationChar;
            }

            //Search produced valid chunks
            if (chunks) {
                //It fits
                if (element.clientHeight <= maxHeight) {
                    //There's still more characters to try splitting on, not quite done yet
                    if (splitOnChars.length >= 0 && splitChar != '') {
                        applyEllipsis(target, chunks.join(splitChar) + splitChar + lastChunk);
                        chunks = null;
                    }
                    //Finished!
                    else {
                        return element.innerHTML;
                    }
                }
            }
            //No valid chunks produced
            else {
                //No valid chunks even when splitting by letter, time to move
                //on to the next node
                if (splitChar == '') {
                    applyEllipsis(target, '');
                    target = getLastChild(element);
                    
                    reset();
                }
            }
            
            //If you get here it means still too big, let's keep truncating
            if (opt.animate) {
                setTimeout(function() {
                    truncate(target, maxHeight);
                }, opt.animate === true ? 10 : opt.animate);
            }
            else {
                return truncate(target, maxHeight);
            }
        }
        
        function applyEllipsis(elem, str) {
            elem.nodeValue = str + opt.truncationChar;
        }


// CONSTRUCTOR ________________________________________________________________

        if (clampValue == 'auto') {
            clampValue = getMaxLines();
        }
        else if (isCSSValue) {
            clampValue = getMaxLines(parseInt(clampValue));
        }

        var clampedText;
        if (supportsNativeClamp && opt.useNativeClamp) {
            sty.overflow = 'hidden';
            sty.textOverflow = 'ellipsis';
            sty.webkitBoxOrient = 'vertical';
            sty.display = '-webkit-box';
            sty.webkitLineClamp = clampValue;

            if (isCSSValue) {
                sty.height = opt.clamp + 'px';
            }
        }
        else {
            var height = getMaxHeight(clampValue);
            if (height <= element.clientHeight) {
                clampedText = truncate(getLastChild(element), height);
            }
        }
        
        return {
            'original': originalText,
            'clamped': clampedText
        }
    }

    window.$clamp = clamp;
})(jQuery);
/*!
 * scrollup v2.4.1
 * Url: http://markgoodyear.com/labs/scrollup/
 * Copyright (c) Mark Goodyear — @markgdyr — http://markgoodyear.com
 * License: MIT
 */
!function(l,o,e){"use strict";l.fn.scrollUp=function(o){l.data(e.body,"scrollUp")||(l.data(e.body,"scrollUp",!0),l.fn.scrollUp.init(o))},l.fn.scrollUp.init=function(r){var s,t,c,i,n,a,d,p=l.fn.scrollUp.settings=l.extend({},l.fn.scrollUp.defaults,r),f=!1;switch(d=p.scrollTrigger?l(p.scrollTrigger):l("<a/>",{id:p.scrollName,href:"#top"}),p.scrollTitle&&d.attr("title",p.scrollTitle),d.appendTo("body"),p.scrollImg||p.scrollTrigger||d.html(p.scrollText),d.css({display:"none",position:"fixed",zIndex:p.zIndex}),p.activeOverlay&&l("<div/>",{id:p.scrollName+"-active"}).css({position:"absolute",top:p.scrollDistance+"px",width:"100%",borderTop:"1px dotted"+p.activeOverlay,zIndex:p.zIndex}).appendTo("body"),p.animation){case"fade":s="fadeIn",t="fadeOut",c=p.animationSpeed;break;case"slide":s="slideDown",t="slideUp",c=p.animationSpeed;break;default:s="show",t="hide",c=0}i="top"===p.scrollFrom?p.scrollDistance:l(e).height()-l(o).height()-p.scrollDistance,n=l(o).scroll(function(){l(o).scrollTop()>i?f||(d[s](c),f=!0):f&&(d[t](c),f=!1)}),p.scrollTarget?"number"==typeof p.scrollTarget?a=p.scrollTarget:"string"==typeof p.scrollTarget&&(a=Math.floor(l(p.scrollTarget).offset().top)):a=0,d.click(function(o){o.preventDefault(),l("html, body").animate({scrollTop:a},p.scrollSpeed,p.easingType)})},l.fn.scrollUp.defaults={scrollName:"scrollUp",scrollDistance:300,scrollFrom:"top",scrollSpeed:300,easingType:"linear",animation:"fade",animationSpeed:200,scrollTrigger:!1,scrollTarget:!1,scrollText:"",scrollTitle:!1,scrollImg:!1,activeOverlay:!1,zIndex:2147483647},l.fn.scrollUp.destroy=function(r){l.removeData(e.body,"scrollUp"),l("#"+l.fn.scrollUp.settings.scrollName).remove(),l("#"+l.fn.scrollUp.settings.scrollName+"-active").remove(),l.fn.jquery.split(".")[1]>=7?l(o).off("scroll",r):l(o).unbind("scroll",r)},l.scrollUp=l.fn.scrollUp}(jQuery,window,document);