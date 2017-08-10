require.config({
　baseUrl: "scripts",
  paths: {
	"jquery": "jquery.min",
	"underscore": "underscore-min",
	"common":"common/common",
    "EventBus":"lib/EventMemory"
	}
});

require(["config","index/boxList","index/navNews","common","EventBus"],function(Config,BoxList,NavNews,common,EventBus){
	// 初始化头部尾部
	BoxList.init();
	NavNews.init();
    common.init();
    var module = {
        init: function(){
            this.loadBanner();
        },
        loadBanner: function(){
            EventBus.on(this,'GET_HEADBANNER_DATA',this.showHeadBanner);
            EventBus.on(this,'GET_TAILBANNER_DATA',this.showTailBanner);
        },
        showHeadBanner: function(res){
            var img;
            $.each(res.data, function(index, item){
                img = ['<div class="pic"  data-index="'+ item.paths +'">',
                '    <img src="' + Config.imgFolder + item.imageUrl + '" alt="">',
                '</div>'].join("");

                $('#banner1').append(img);
            });

            $("#banner1").imgBox({
                specialEffectsNo:2,                    // 要执行的特效的编号
                intervalTime: 4000,                     // 切换间隔时间
                lineMove_angle: 90,                     // 直线推进的方向(0表示正上方,90表示右侧,以此类推)
                lineMove_moveSpeed: 2000,               // 直线推进的速度
                bottomToolbar_enable: true,             // 是否显示底部工具栏
                bottomToolbar_bottomPx: '7px',          // 底部工具栏距离底部的距离(前提是bottomToolbar为true)
                bottomToolbar_align: 'center',          // 底部工具栏水平方向布局方式(left,right,center)(前提是bottomToolbar为true)
                bottomToolbar_icon_typeNo: 2,           // 底部工具栏图标类型(前提是bottomToolbar为true)
                bottomToolbar_a_gap: "10px",            // 底部工具栏子标签a之间的间隙
                bottomToolbar_hoverSwitch: false,       // 底部工具栏子标签a是否通过hover效果来切换图片(默认为click切换)
                bothSidesToolbar_enable: true,
                bothSidesToolbar_icon_typeNo: 0
            });

            imgReload();

            $(window).resize(function() {
                imgReload();
            });
//						 $(window).resize(function() {
//								var o = $(".banner").find("img").height();
//								$(".banner").height(o);
//								$(".nav_box_display").height(o)
//							})
            function imgReload(){   //轮播自适应高度
                var imgHeight = $('#banner1 img').height();
                if(imgHeight===0){
                    imgHeight = 532;
                }
                $('#banner1').height(imgHeight);
            }

            $('#loading').hide();
            $('#main-body').fadeIn(1500);

            $('#banner1').find('.pic').on('click', function (e) {
                e.stopPropagation();
                var path = $(e.currentTarget).data('index');
				if(path){
					window.open(path);
				}
            });
        },
        showTailBanner: function(res){

            var img;
            $.each(res.data, function(index, item){

                // if(index>0){
                //     return;
                // }

                img = ['<div class="pic">',
                '    <img src="' + Config.imgFolder + item.imageUrl + '" alt="">',
                '</div>'].join("");

                $('#banner2').append(img);
            });

            $("#banner2").imgBox({
                specialEffectsNo: 2,                    // 要执行的特效的编号
                intervalTime: 4000,                 // 切换间隔时间
                lineMove_angle: 90,                     // 直线推进的方向(0表示正上方,90表示右侧,以此类推)
                lineMove_moveSpeed: 2000,               // 直线推进的速度
                bottomToolbar_enable: true,             // 是否显示底部工具栏
                bottomToolbar_bottomPx: '7px',          // 底部工具栏距离底部的距离(前提是bottomToolbar为true)
                bottomToolbar_align: 'right',          // 底部工具栏水平方向布局方式(left,right,center)(前提是bottomToolbar为true)
                bottomToolbar_icon_typeNo: 2,           // 底部工具栏图标类型(前提是bottomToolbar为true)
                bottomToolbar_a_gap: "10px",            // 底部工具栏子标签a之间的间隙
                bottomToolbar_hoverSwitch: false,       // 底部工具栏子标签a是否通过hover效果来切换图片(默认为click切换)
                bothSidesToolbar_icon_typeNo: 0
            });
        }
    };

    module.init();

    
});

$(function(){
    var node = document.getElementById("node");
    // $clamp(node,{clamp:5});  //控制多行超出省略 

    // $("#banner1").imgBox({
    //     specialEffectsNo: 2,                    // 要执行的特效的编号
    //     intervalTime: 4000,                 // 切换间隔时间
    //     lineMove_angle: 90,                     // 直线推进的方向(0表示正上方,90表示右侧,以此类推)
    //     lineMove_moveSpeed: 2000,               // 直线推进的速度
    //     bottomToolbar_enable: true,             // 是否显示底部工具栏
    //     bottomToolbar_bottomPx: '7px',          // 底部工具栏距离底部的距离(前提是bottomToolbar为true)
    //     bottomToolbar_align: 'center',          // 底部工具栏水平方向布局方式(left,right,center)(前提是bottomToolbar为true)
    //     bottomToolbar_icon_typeNo: 2,           // 底部工具栏图标类型(前提是bottomToolbar为true)
    //     bottomToolbar_a_gap: "10px",            // 底部工具栏子标签a之间的间隙
    //     bottomToolbar_hoverSwitch: false,       // 底部工具栏子标签a是否通过hover效果来切换图片(默认为click切换)
    //     bothSidesToolbar_enable: true,
    //     bothSidesToolbar_icon_typeNo: 0
    // });


    
});


