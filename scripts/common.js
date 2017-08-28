$(function () {

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

$(".left_list li").click(function () {
    var value = $(this).attr("id");
    if (!isNull(value))
        parent.vm.main = value + ".html";
});

/**
 * 判断是参数否为""/空格/undefined/null
 * @param arg1
 * @returns
 */
function isNull(str){
    var isNull = false;
    if (null == str || !str)
        isNull = true;
    else if("" == str || 1 > str.length) {
        isNull = true;
    }
    else if(null == JSON.stringify(str))
        isNull = true;

    return isNull;
}