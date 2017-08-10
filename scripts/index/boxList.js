define(["config"], function(Config) {
	var boxListUrl = Config.boxListUrl
		,boxListImgFolder = Config.boxListImgFolder
		,boxListInfo = {};

	var module = {
		init: function(){
			
			this.bindEvent();
			this.loadData();
		},
		bindEvent: function(){
			$('#boxUrl').click(function(){
				window.location.href = $('#boxUrl').attr("clickUrl");
			});
		},
		loadData: function(){
			$.ajax(boxListUrl, {
					dataType: 'json'
				})
				.done(function(res) {
					var results = res.results;
					
					$('#boxList').empty();

					$.each(results,function(index,item){

						boxListInfo[item.boxId] = item;

						if(index === 0){
							$('#boxImage').attr('src',boxListImgFolder + item.boxImage);
							$('#boxTitle').text(item.boxTitle + "整体解决方案");
							$('#boxDesc').text(item.boxDesc);
							$('#boxUrl').attr("clickUrl", item.boxUrl)
						}

						var li = ['<li boxid=' + item.boxId +'>',
							'    <a>',
							'        <i class="item-icon" style="background-image: url(' + boxListImgFolder + item.iconDefault + ')"></i>',
							'        <p>'+ item.boxTitle +'</p> ',
							'    </a>',
							'</li>'
						].join("");

						$('#boxList').append(li);

						$('#boxList').find('li[boxid='+ item.boxId +']').mouseenter(function(){
							$(this).find('.item-icon').css('background-image','url(\'' + boxListImgFolder + item.iconDisplay + '\')');
						});

						$('#boxList').find('li[boxid='+ item.boxId +']').mouseover(function(){
							//2017/04/05添加settimeout
							//setTimeout(function(){
							if(!$(this).find('.item-icon').attr("boxListHover")){
								$("#boxList").find('.item-icon').attr("boxListHover", "");
								$(this).find('.item-icon').attr("boxListHover", "true");
								$(this).find('.item-icon').css('background-image','url(\'' + boxListImgFolder + item.iconDisplay + '\')');
								$('#boxImage').hide();
								$('#boxImage').attr('src',boxListImgFolder + item.boxImage);
								$('#boxTitle').text(item.boxTitle + "整体解决方案");
								$('#boxDesc').text(item.boxDesc);
								$('#boxUrl').attr("clickUrl", item.boxUrl);
								$('#boxImage').fadeIn();
							}
							//},1000)							
						});

						$('#boxList').find('li[boxid='+ item.boxId +']').mouseleave(function(){
							$(this).find('.item-icon').css('background-image','url(\'' + boxListImgFolder + item.iconDefault + '\')');
						});
					});

				})
				.fail(function(err) {
					//document.write(JSON.stringify(err));
				});
		}
	};
	

	return module;
});