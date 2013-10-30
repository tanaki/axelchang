
AC.View.News = AC.View.Base.extend({

	id : "news",
	path : "news.html",

	newsSwipe : null,

	initialize : function () {
		this.params.news = AC.Data.JSON.news;
	},

	_displayComplete : function() {

		this.newsSwipe = new Swipe(document.getElementById("news-slider"), {
			callback : this._callbackSwipe
		});

		this.initProjectNav();
	},

	initProjectNav : function(){

		var 
			newsSwipe = this.newsSwipe,
			$container = $(".news-list .news-nav");

		$(".next", $container).on("click", function(e){
			e.preventDefault();
			newsSwipe.next();
		});

		$(".prev", $container).on("click", function(e){
			e.preventDefault();
			newsSwipe.prev();
		});

		$(".news-content").keydown(function(e){
			if ( e.keyCode == 37 ) {
				newsSwipe.prev();
			} else if ( e.keyCode == 39 ) {
				newsSwipe.next();
			}
		});
	},
	
});