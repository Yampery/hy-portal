define(["config", "EventBus"], function(Config,EventBus) {
	var navNewsUrl = Config.navNewsUrl,
		navUrl = Config.getNavigationUrl,
		imgFolder = Config.imgFolder;

	var module = {
		init: function() {
			this.bindEvent();

			EventBus.on(this,'GET_ABOUTUS_DATA',function(event){

				var aboutUs = event.data,
					newsIds = {
						companyNews: null,
						industryNews: null
					},
					identifiers, subId, isNotFound = true,
					why = "aboutUs not found.";

				$.each(aboutUs, function(index, item) {
					subId = item.identifiers;
					if (subId == "companyNews") {
						newsIds.companyNews = item.navigationId;
						why = "companyNews not found."
						isNotFound = false;
					}
					if (subId == "industryNews") {
						newsIds.industryNews = item.navigationId;
						why = "industryNews not found."
						isNotFound = false;
					}
				});

				if (isNotFound) {
					return;
				}

				$.when(module.loadCompanyNews(newsIds.companyNews))
					.done(function(results) {
						module.showCompanyNews(results)
					});

				$.when(module.loadIndustryNews(newsIds.industryNews))
					.done(function(results) {
						module.showIndustryNews(results)
					});
				
			});
		},
		bindEvent: function() {
			$('#news .news-more').click(function() {
				var type = $(this).attr('type');
				window.location.href = "aboutUs_news.html?type=" + type;
			});
			$('#news .news-head').click(function() {
				var type = $(this).attr('type');
				window.location.href = "aboutUs_news.html?type=" + type;
			});
			$('#newsBox').click(function() {
				var id = $(this).attr('newsid');
				if (id) {
					window.location.href = "news_details.html?id=" + id;
				}
			});

			$('#navNewsList').on('click', 'li[newsid]', function() {
				var id = $(this).attr('newsid');
				if (id) {
					window.location.href = "news_details.html?id=" + id;
				}
			});

			$('#navIndNewsList').on('click', 'li[newsid]', function() {
				var id = $(this).attr('newsid');
				if (id) {
					window.location.href = "news_details.html?id=" + id;
				}
			});
		},
		getNewsId: function() {

			var deferred = $.Deferred();
			var newsIds = {
				companyNews: null,
				industryNews: null
			};

			$.ajax(navUrl, {
					dataType: 'json'
				})
				.done(function(res) {
					var results = res.results,
						aboutUs, identifiers, subId, isNotFound = true,
						why = "aboutUs not found.";

					$.each(results, function(index, item) {
						identifiers = item.identifiers;
						if (identifiers == "aboutUs") {
							aboutUs = item.children;
							$.each(aboutUs, function(index, item) {
								subId = item.identifiers;
								if (subId == "companyNews") {
									newsIds.companyNews = item.navigationId;
									why = "companyNews not found."
									isNotFound = false;
								}
								if (subId == "industryNews") {
									newsIds.industryNews = item.navigationId;
									why = "industryNews not found."
									isNotFound = false;
								}
							});

						}
					});

					if (isNotFound) {
						deferred.reject(why);
					} else {
						deferred.resolve(newsIds);
					}

				})
				.fail(function(err) {
					deferred.reject();
				});

			return deferred.promise();
		},
		showData: function() {
		},
		loadCompanyNews: function(newsId, pageNo, size) {


			if (!pageNo) {
				pageNo = 1;
			}

			if (!size) {
				size = 10;
			}

			var url = navNewsUrl + "?navigationId=" + newsId + "&page=" + pageNo + "&rows=" + size,
				deferred = $.Deferred();

			$.ajax(url, {
					dataType: 'json'
				})
				.done(function(res) {
					//var results = res.list;
					deferred.resolve(res);
				})
				.fail(function(err) {
					console.error(err);
					deferred.reject();
				});

			return deferred.promise();
		},
		showCompanyNews: function(res) {

			var results = res.list;
			if (results.length > 7) {
				results = results.slice(0, 7);
			}

			$('#navNewsList').empty();
			$.each(results, function(index, item) {

				newsTitle = item.newsTitle;
				newsDate = item.createTime.split('-');
				createTime = newsDate[1] + "-" + newsDate[2];
				newsId = item.newsId;

				if (index === 0) {
					newsImg = imgFolder + item.imageurl;
					$('#newsImg').attr('src', newsImg);
					$('#newsTitle').text(newsTitle);
					$('#newsBox').attr('newsid', newsId);
					return;
				}

				li = ['<li newsid=' + item.newsId + '>' + newsTitle + '<span>' + createTime + '</span></li>'].join("");
				$('#navNewsList').append(li);
			});
		},
		loadIndustryNews: function(newsId, pageNo, size) {

			if (!pageNo) {
				pageNo = 1;
			}

			if (!size) {
				size = 10;
			}

			var url = navNewsUrl + "?navigationId=" + newsId + "&page=" + pageNo + "&rows=" + size,
				deferred = $.Deferred();

			$.ajax(url, {
					dataType: 'json'
				})
				.done(function(res) {
					//var results = res.list;
					deferred.resolve(res);
				})
				.fail(function(err) {
					console.error(err);
					deferred.reject();
				});

			return deferred.promise();
		},
		showIndustryNews: function(res) {
			var results = res.list;
			if (results.length > 6) {
				results = results.slice(0, 6);
			}

			$('#navIndNewsList').empty();
			$.each(results, function(index, item) {

				newsTitle = item.newsTitle;
				newsDate = item.createTime.split('-');
				createTime = newsDate[1] + "-" + newsDate[2];
				newsId = item.newsId;

				li = ['<li newsid=' + item.newsId + '>' + newsTitle + '<span>' + createTime + '</span></li>'].join("");
				$('#navIndNewsList').append(li);
			});
		},
	};

	return module;
});