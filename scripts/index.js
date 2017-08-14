/**
 *  主页js文件
 */

/*var menuList =
        [{ "menuId": "index", "name": "主页", "open": "y", "url": "main.html" },
        { "menuId": "product", "name": "产品", "open": "", "url": "product.html" },
        { "menuId": "solution", "name": "解决方案", "open": "", "url": "solution.html" },
        { "menuId": "technicalService", "name": "技术服务", "open": "", "url": "technicalService.html" },
        { "menuId": "talent", "name": "人才招聘", "open": "", "url": "talent.html" }];*/

$(function () {
    $('.header_menu').scrollToFixed(); //初始化

    $('.header .select_btn').on('click', function () {
        $('.select_option').slideToggle();
    });
    $('.header .select_option li').on('click', function () {
        $('.select_option').slideToggle();
    });

    // 返回顶部
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
});
//生成菜单
var menuItem = Vue.extend({
    name: 'menu-item',
    props:{item:{}},
    template:[
        '<li>',
        '<a :href="\'#\'+item.url">{{item.name}}</a>',
        '</li>'
    ].join('')
});


//注册菜单组件
Vue.component('menuItem',menuItem);

var vm = new Vue({
    el:'#app',
    data:{
        menuList:
            [{ "menuId": "index", "name": "主页", "open": "y", "url": "main.html" },
            { "menuId": "product", "name": "产品", "open": "", "url": "product.html" },
            { "menuId": "solution", "name": "解决方案", "open": "", "url": "solution.html" },
            { "menuId": "technicalService", "name": "技术服务", "open": "", "url": "technicalService.html" },
            { "menuId": "talent", "name": "人才招聘", "open": "", "url": "talent.html" }],
        main:"main.html",
    }
});
