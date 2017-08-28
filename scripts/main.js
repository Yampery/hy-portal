$(function () {
    // 根据boxList数据生成li
   /* for (var i = 0; i < boxList.length; i++) {
        var item = boxList[i];
        var li = ['<li>',
            '    <a>',
            '        <i class="item-icon" style="background-image: url(' + imageFolder + item.iconDefault + ')"></i>',
            '        <p>'+ item.boxTitle +'</p> ',
            '    </a>',
            '</li>'
        ].join("");
        $('#boxList').append(li);
    }

    // 绑定鼠标悬停，鼠标进入和离开事件
    $("#boxList li").hover(function () {
        var index = $(this).index();
        $(this).find('.item-icon').css('background-image','url(\'uploadfiles/' + boxList[index].iconDisplay + '\')');
        $(".article-img img").attr("src", "images/model/" + boxList[index].boxImage);
        $("#boxTitle").html(boxList[index].boxTitle);
        $("#boxDesc").html(boxList[index].boxDesc);

    }).mouseenter(function () {
        var index = $(this).index();
        $(this).find('.item-icon').css('background-image','url(\'uploadfiles/' + boxList[index].iconDisplay + '\')');
    }).mouseleave(function () {
        var index = $(this).index();
        $(this).find('.item-icon').css('background-image','url(\'uploadfiles/' + boxList[index].iconDefault + '\')');
    });*/
});

var boxList = [
    {
        "boxTitle": "三维模型",
        "boxDesc": "三维GIS可以对整个城市的三维立体空间进行统一描述，并充分准确地集成表达地下的地质、管线、构筑物，地上的土地、交通、建筑、植被，以及室内的设施、房产、人口等，形成与现实世界一致的三维立体空间框架，并以其开放性、可量测性和可挖掘性一并成为了信息化服务的基本要求，三维地图也因此成为人们跟空间信息交互的基本方式和各种门户网站信息服务的基本内容。",
        "boxImage": "3d-building.jpg",
        "iconDefault": "201728957552.png",
        "iconDisplay": "20172895755h2.png"
    }
    ,{
        "boxTitle": "飞行平台",
        "boxDesc": "公司拥有自主研发的华遥G-1型汽油动力固定翼无人机、maker one系列电动固定翼无人机、华遥S系列多旋翼无人机，也可租赁欧直H125直升机或罗宾逊R44直升机搭载大型航摄仪。",
        "boxImage": "H125.jpg",
        "iconDefault": "201728101258.png",
        "iconDisplay": "20172810125h8.png"
    }
    ,{
        "boxTitle": "测量方案",
        "boxDesc": "利用高分辨率的倾斜摄影，通过惯导和差分GPS辅助，以及地面高精度航控测量，经服务器集群运算，生成地物的三维模型。航片的分辨率达到2.5cm以内时，三维模型的制作精度为5cm以内，利用立体采集技术，打通了基于三维的倾斜摄影与基于二维的矢量数据采集的通道，在三维模型的基础上可采编最大为1:500的DLG（地形图）。",
        "boxImage": "measure.png",
        "iconDefault": "201728100163.png",
        "iconDisplay": "20172810016h3.png"
    }
    ,{
        "boxTitle": "数字地图",
        "boxDesc": "DLG是与现有线划基本一致的各地图要素的矢量数据集，且保存了各要素间的空间关系信息和相关的属性信息，是4D产品的一种。",
        "boxImage": "DLG.jpg",
        "iconDefault": "201728959294.png",
        "iconDisplay": "20172895929h4.png"
    }
    ,{
        "boxTitle": "基础测绘",
        "boxDesc": "公司进行地籍测绘和工程测量，农村集体土地所有权确权发证、宅基地使用权确权发证、农村经营承包权确权发证、土地调查、土地变更调查等，承接市政、建筑、道路测绘；地形测绘等。",
        "boxImage": "base_measure.jpg",
        "iconDefault": "201728101258.png",
        "iconDisplay": "20172810125h8.png"
    }
];

var imageFolder = "uploadfiles/";