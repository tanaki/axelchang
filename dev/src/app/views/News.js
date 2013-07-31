
AC.View.News = AC.View.Base.extend({

	id : "news",
	path : "news.html",

	initialize : function () {
		this.params.news = AC.Data.JSON.news;
	}
	
});