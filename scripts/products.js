require.config({
    baseUrl: "scripts",
    paths: {
        "common": "common/common",
        "EventBus": "lib/EventMemory"
    }
});

define(["config", 'EventBus'], function(config, EventBus) {
    var module = {
        pageType: /.*\/(.*)\.html/g.test(location.href) && RegExp.$1,
        newsId: location.search.split('=')[1],
        init: function() {
            this.getArtDetail();
            this.fillTitle();
            if(!this.newsId){
                this.redirection();
                return;
            }
        },
        typeString: "",
        redirection:function(){
            location.href = '404page.html';
        },
        loadBanner: function() {
            switch (this.pageType) {
                case 'products_details':
                    this.typeString = "type=1&";
                    EventBus.on(this, 'GET_PRODUCTSBANNER_DATA', this.showBanner);
                    break;
                case 'solution_details':
                    EventBus.on(this, 'GET_SOLUTIONBANNER_DATA', this.showBanner);
                    break;
            }
        },
        // ajax请求函数
        request: function(url, fn) {
            $.ajax({
                url: url,
                dataType: 'json',
            })
                .done(function(data) {
                    fn(data);
                })
                .fail(function() {
                    console.log("error");
                })
        },
        // 获取所有文章内容
        getArtDetail: function() {

            if (this.pageType == 'products_details') {
                this.typeString = "type=1&";
            }

            var queryString = location.href.split('?')[1];
            var that = this;
            $.ajax({
                url: config.newsDetailsUrl + '?' + (that.typeString||"") + queryString,
                dataType: 'json',
            })
                .done(function(data) {
                    that.fillContent(data);
                    that.getAllLeftNav(data, data.results.newsId);
                })
                .fail(function() {
                    console.log("error");
                })

        },
        // 绑定事件
        bindEvent: function() {
            this.slideBind();
            // 根据页面类型来决定侧栏菜单事件绑定
            switch (this.pageType.split('_')[0]) {
                case "products":
                    this.typeString = "type=1&";
                    this.firstMBind();
                    this.secondMBind();
                    break;
                case "solution":
                    this.solutionfirstMBind();
                    break;
            }
        },
        fillTitle:function(){
            var pageName = '';
            switch(this.pageType){
                case 'solution_details':
                    pageName = '解决方案详情';
                    break;
                case 'products_details' :
                    pageName = '产品详情';
                    this.typeString = "type=1&";
                    break
            }
            document.title = pageName+'-'+ document.title;
        },
        // 绑定一级菜单事件
        firstMBind: function() {
            var slide = $('#slide');
            var firstM = slide.children().find('.first-menu-li');
            var secondM = firstM.children().find('.second-menu-li');
            var slidH = slide.height(); //slide的初始高度
            var nowH = 0; //展开子菜单的高度

            firstM.on('click', function(e) {
                e.stopPropagation();
                var hasdropdownArrow = !!$(this).find('.shangla').length;
                var open = $(this).attr('data-open');
                var height = $(this).outerHeight(); //当前一级菜单的高度
                if (open == 0) {
                    var childLiLength = $(this).find('li').length;
                    var childLiHeight = $(this).find('li').height();
                    nowH = childLiLength * childLiHeight;
                    $(this).css({
                        'height': nowH + height
                    });
                    slidH = nowH + slidH;
                    slide.css({
                        'height': slidH
                    });
                    if (hasdropdownArrow) {
                        $(this).find('.shangla').css({
                            'transform': 'rotate(180deg)'
                        });
                        $(this).attr('data-open', 1);
                        $(this).next().css({ "border-top": 'none' });
                    }
                } else if (open == 1) {
                    var childLiLength = $(this).find('li').length;
                    var childLiHeight = $(this).find('li').outerHeight();
                    var a = childLiLength * childLiHeight; //当前缩起元素子元素的高度
                    $(this).height(56);
                    slidH = slidH - a;
                    slide.css({
                        'height': slidH
                    });
                    if (hasdropdownArrow) {
                        $(this).find('.shangla').css({
                            'transform': 'rotate(0)'
                        });
                        $(this).attr('data-open', 0);
                        $(this).next().css({ "border-top": "1px solid #fcfcfc" });
                    }

                }
            });
        },
        // 绑定二级菜单
        secondMBind: function() {
            var that = this;
            var secondM = $('.first-menu').children().find('.second-menu-li');
            secondM.on('click', function(e) {

                var newsId = $(this).attr('data-id');
                var pathname = window.location.pathname;
                pathname = pathname.substring(pathname.lastIndexOf("/")+1, pathname.length);

                // 无刷新修改链接
                if(history.pushState){
                    history.pushState({}, document.title, pathname+"?newsId="+newsId);
                }else{
                    // 不支持无刷新，就直接刷新页面
                    location.href=pathname+"?newsId="+newsId;
                }

                if (that.pageType == 'products_details') {
                    that.typeString = "type=1&";
                }

                e.stopPropagation();
                // 清楚高亮样式
                $('.first-menu').find('li').removeClass('active');
                $(this).addClass('active').parents('.first-menu-li').addClass('active');
                that.request(config.newsDetailsUrl + '?'+ (that.typeString||"") +'newsId=' + newsId, that.fillContent.bind(that));
            });
        },
        // 解决方案一级菜单特殊绑定
        solutionfirstMBind: function() {
            var that = this;
            $('.first-menu-li').on('click', function(e) {

                var newsId = $(e.currentTarget).attr('data-id');
                if(!(newsId)){
                    newsId = $(e.currentTarget).find("a").attr('data-id');
                }
                var pathname = window.location.pathname;
                pathname = pathname.substring(pathname.lastIndexOf("/")+1, pathname.length);

                // 无刷新修改链接
                if(history.pushState){
                    history.pushState({}, document.title, pathname+"?newsId="+newsId);
                }else{
                    // 不支持无刷新，就直接刷新页面
                    location.href=pathname+"?newsId="+newsId;
                }

                if (that.pageType == 'products_details') {
                    that.typeString = "type=1&";
                }

                e.stopPropagation();
                $(this).addClass('active').siblings().removeClass('active');
                //location.href = location.pathname + '?newsId=' + newsId;
                // history.state = location.pathname + '?newsId=' + newsId;
                that.request(config.newsDetailsUrl + '?'+(that.typeString||"")+'newsId=' + newsId, that.fillContent.bind(that));
            });
        },
        // 侧栏导航事件绑定
        slideBind: function() {
            var slide = $('#slide');
            var slidH = slide.height(); //slide的初始高度
            slide.on('click', function(e) {
                e.stopPropagation();
                var toggle = $(this).attr('data-toggle');
                if (toggle == 0) {
                    //slidH = $(this).height();
                    $(this).height(100);
                    setTimeout(function() {
                        slide.width(80);
                        slide.attr('data-toggle', 1);
                        $('.content_box').css({
                            'width': 1120
                        });
                    }, 200);
                } else if (toggle == 1) {
                    $(this).width(180);
                    $('.content_box').css({
                        'width': 1020
                    });
                    setTimeout(function() {

                        slide.height(slidH);
                        slide.attr('data-toggle', 0);
                    }, 200);
                }
            });
        },
        // 高亮当前文章
        selectCurNav: function(currentId) {
            var liMap = $('.first-menu').find('li');
            _.each(liMap, function(ele, index) {
                if (currentId === $(ele).attr('data-id')) {
                    if ($(ele).parents('.first-menu-li').length) {
                        $(ele).parents('.first-menu-li').click().addClass('active')
                        $(ele).addClass('active');
                    } else {
                        $(ele).addClass('active');
                    }
                }
            })
        },
        // 获取所用侧栏数据
        getAllLeftNav: function(data, currentId) {
            var navData = data.results.navigation[0].children;
            this.makeLeftNav(navData);
            // 高亮当前菜单
            if (data.results.supNews && data.results.supNews.newsId) {
                currentId = data.results.supNews.newsId;
            }
            this.selectCurNav(currentId)
        },
        // 填充文章内容
        fillContent: function(data) {

            var that = this;
            var contentData = data.results;
            var listHTML = [];
            $('#nextPage').css({'display':'none'});
            // 生成面包屑导航
            $('#indexPage')[0].href = 'index.html';

            $('#currentPage').html('<a data-id='+contentData.newsId+'>'+contentData.newsTitle+'</a>')


            $('#parentPage')[0].href = this.pageType.split('_')[0] + '.html?identifiers=' + contentData.navigation[0].identifiers;


            // 填充新闻内容
            listHTML.push('<input type="buttom"><div class="title"><p id="newsTitle">' + contentData.newsTitle + '</p><p></p></div>')
            listHTML.push('<div class="newsContent" id="newsContent">' + contentData.newsContent + '</div>')


            if (that.pageType == 'solution_details') {

                listHTML.push('<div class="case_list"><div class="case_list_title"><img src="images/shu.png"><a>典型案例</a></div>')
                if (contentData.caseList && contentData.caseList.length > 0) {
                    // 根据热度排序

                    caseList = contentData.caseList.sort(function(a, b) {
                        return a.hotType - b.hotType });
                    var maxShow = caseList.slice(0, caseList.length);//3
                    var moreShow = caseList.slice(caseList.length, caseList.length);
                    _.each(maxShow, function(el, index) {
                        listHTML.push('<div class="case_list_content" data-id="' + el.newsId + '"><span class="case_img"><img src="' + config.imgFolder + el.imageurl + '"></span>')
                        listHTML.push('<span class="case_text"><p class="case_text_title">' + el.newsTitle + '</p><p class="isStrat">' + el.description + '</p></span></div>')
                    });
                    listHTML.push('</div>')

                    if (moreShow.length > 0) {
                        listHTML.push('<div class="more_case"><ul>')
                        _.each(moreShow, function(el, index) {
                            listHTML.push('<li><span><img src="' + config.imgFolder + el.imageurl + '"></span><p><a>' + el.newsTitle + '</a></p></li>')
                        })
                    }
                }
            }

            $('.content_box').html(listHTML.join(''));

            // 绑定典型案例点击
            $('.case_list_content,.more_case li').on('click', function(event) {
                var listHTML = [];
                that.request(config.findDetailUrl + '?caseId=' + $(this).attr('data-id'), function(data) {
                    if (data.code === 200 || data.state === 'success') {
                        var caseData = data.results;
                        $('#nextPage').html('典型案例').css({'display':'inline-block'}).addClass('active').siblings().removeClass('active');
                        // $('#nextPage').html(caseData.newsTitle).css({'display':'inline-block'});
                        // 填充新闻内容
                        listHTML.push('<div class="title"><p id="newsTitle">' + caseData.newsTitle + '</p><p></p></div>')
                        listHTML.push('<div class="newsContent" id="newsContent">' + caseData.newsContent + '</div>')

                        $('.content_box').html('').html(listHTML.join(''));

                        location.href = "#header";
                    }
                })
            });

        },
        // 生成侧栏
        makeLeftNav: function(data) {
            var listHTML = [];
            data.forEach(function(item) {
                if (item.children && item.children.length > 0) {
                    listHTML.push('<li class="first-menu-li" data-open="0">' + (item.navigationName || item.newsTitle))
                    listHTML.push('<i class="shangla"></i>')
                    listHTML.push('<ul class="second-menu">')
                    item.children.forEach(function(item) {
                        listHTML.push('<li class="second-menu-li" data-id="' + item.newsId + '">' + item.navigationName + '')
                        listHTML.push('<i class="trangle"></i>' + '</li>')
                    })
                    listHTML.push('</ul>')
                } else {
                    listHTML.push('<li class="first-menu-li" data-open="0" data-id="' + item.newsId + '">' + (item.navigationName || item.newsTitle))
                }
                listHTML.push('</li>')
            })
            $('.first-menu').html(listHTML.join(''));

            // 绑定导航事件
            this.bindEvent();


        }
    }
    return {
        init: module.init.bind(module)
    }
})
