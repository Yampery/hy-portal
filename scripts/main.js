'use strict';


$(function () {

        // fixed导航
        $('.header_menu').scrollToFixed(); //初始化

        $('.header .select_btn').on('click', function () {
            $('.select_option').slideToggle();
        });
        $('.header .select_option li').on('click', function () {
            $('.select_option').slideToggle();
        });

        
        // 菜单搜索样式变换
        $('.menu_search_btn').mouseover(function () {
            $('.menu_search_input').css('display', 'block');
            $(this).css('border-color', '#005bac');
            $(this).addClass('ishover');
        });
        $('.menu_search_btn').mouseleave(function () {
            $('.menu_search_input').css('display', 'none');
            $(this).css('border-color', 'transparent');
            $(this).removeClass('ishover');
        });
        $('.menu_search_input').mouseover(function () {
            $('.menu_search_input').css('display', 'block');
            $('.menu_search_btn').css('border-color', '#005bac');
            $('.menu_search_btn').addClass('ishover');
        });
        $('.menu_search_input').mouseleave(function () {
            $('.menu_search_input').css('display', 'none');
            $('.menu_search_btn').css('border-color', 'transparent');
            $('.menu_search_btn').removeClass('ishover');
        });



    //返回顶部效果

    $.scrollUp({
        animation: 'fade',
        activeOverlay: '#0078D7'
    });
    $('.returnTop').on('click', function () {
        var speed = 200;
        $('body,html').animate({ scrollTop: 0 }, speed);
        return false;
    });
    $('.returnTop').mouseover(function () {
        $('.returnTop span').css('top', '0px');
        // $('.returnTop span').animate({'top':'0px'}, 1000);
    });
    $('.returnTop').mouseleave(function () {
        $('.returnTop span').css('top', 'auto');
    });

    //关于我们跳转
    $('.menu_content li').on('click', function () {
        var name = $(this).find('p').text();
        if (name == '企业简介') {
            window.location.href = 'aboutUs_details.html';
        } else if (name == '资质荣誉') {
            window.location.href = 'aboutUs_details.html';
        } else if (name == '企业文化') {
            window.location.href = 'aboutUs_details.html';
        } else if (name == '发展历程') {
            window.location.href = 'aboutUs_details.html';
        } else if (name == '投资者关系') {
            window.location.href = 'aboutUs_details.html';
        } else if (name == '联系我们') {
            window.location.href = 'aboutUs_details.html';
        }
    });

    //技术服务跳转
    $('.menu_box').on('click', function () {
        var name = $(this).find('p').text();
        if (name == '在线反馈') {
            window.location.href = 'technicalService_details.html';
        } else if (name == '全国网点') {
            window.location.href = 'technicalService_details.html';
        } else if (name == '运维中心') {
            window.location.href = 'technicalService_details.html';
        } else if (name == '常见问题') {
            window.location.href = 'technicalService_details.html';
        } else if (name == '软件下载') {
            window.location.href = 'technicalService_details.html';
        } else if (name == '其他下载') {
            window.location.href = 'technicalService_details.html';
        }
    });


    //首页新闻进入详情
    $('.newbox').find('li').on('click', function () {
        window.location.href = 'aboutUs_news.html';
    });

    //菜单栏效果
    $(window).bind('scroll', function () {
        var sTop = $(window).scrollTop();
        var sTop = parseInt(sTop);
        if (sTop >= 100) {
            $('.menu_logo').css('visibility', 'visible');
            $('.menu_search').css('visibility', 'visible');
        } else if (sTop < 100) {
            $('.menu_logo').css('visibility', 'hidden');
            $('.menu_search').css('visibility', 'hidden');
        }
        if (sTop >= 200) {
            if (!$('.returnTop').is(':visible')) {
                $('.returnTop').show().animate({ 'right': '0px' }, 500);
            }
        } else {
            if ($('.returnTop').is(':visible')) {
                $('.returnTop').animate({ 'right': '-5%' }, 300, function () {
                    $('.returnTop').hide();
                });
            }
        }
    });

    $('.returnTop').on('click', function () {
        var speed = 200;
        $('body,html').animate({ scrollTop: 0 }, speed);
        return false;
    });
    $('.returnTop').mouseover(function () {
        $('.returnTop span').css('top', '0px');
        // $('.returnTop span').animate({'top':'0px'}, 1000);
    });
    $('.returnTop').mouseleave(function () {
        $('.returnTop span').css('top', 'auto');
    });
    
});
//# sourceMappingURL=main.js.map
