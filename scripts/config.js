define(function() {
		//var proxy = "/proxy/proxy.jsp?"
		var proxy = ""
		,dataIp = "/"
		,dataServer = proxy + dataIp
		,imgFolder =  dataServer +"uploadfiles/";
		
  	return {
  		imgFolder:imgFolder,
  		boxListImgFolder: imgFolder,
      errorPage: "404page.html",
    	boxListUrl: dataServer + "southgis_ywgl/box/findList.do",
    	navNewsUrl: dataServer + "southgis_ywgl/news/findByNavId.do",
      getNavigationUrl: dataServer + "southgis_ywgl/navigation/getNavigation.do",
    	getNewsDeatailUrl: dataServer + "southgis_ywgl/news/findByNewId.do",
      findIdentifiersNewsList:dataServer + "southgis_ywgl/news/findIdentifiersNewsList.do",
      newsDetailsUrl:dataServer + 'southgis_ywgl/news/findByNewId.do',
      findDetailUrl: dataServer+'southgis_ywgl/case/findDetail.do',
      findCaseDetailUrl: dataServer+'southgis_ywgl/news/findCaseDetail.do',
      findByKeyworld:dataServer + 'southgis_ywgl/news/findBykeyword.do'
    };
});
