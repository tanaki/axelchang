
AC.View.News = AC.View.Base.extend({

	id : "news",
	path : "news.html",

	newsSwipe : null,

	initialize : function () {
		this.params.news = AC.Data.JSON.news;
	},

	hide : function ( callback ) {
		
		var $el = $(this.el);
		$el.fadeOut(AC.Data.FADE_OUT_DURATION, function() {
			if (callback) {
				callback();
			}
		});

		$(document).off( "keydown", $.proxy(this.keyNav, this) );
	},

	_displayComplete : function() {
		
		var $spin = $(".spin-box");
		$spin.fadeOut(100, function(){
			$spin.remove();
		});

		this.newsSwipe = new Swipe(document.getElementById("news-slider"), {
			callback : this._callbackSwipe
		});

		this.initProjectNav();
	},

	initProjectNav : function(){

		var 
			newsSwipe = this.newsSwipe,
			$container = $(".news-list");

		$(".news-next", $container).on("click", function(e){
			e.preventDefault();
			newsSwipe.next();
		});

		$(".news-prev", $container).on("click", function(e){
			e.preventDefault();
			newsSwipe.prev();
		});

		$(document).on( "keydown", $.proxy(this.keyNav, this) );
	},

	keyNav : function(e){
		if ( e.keyCode == 37 ) {
			this.newsSwipe.prev();
		} else if ( e.keyCode == 39 ) {
			this.newsSwipe.next();
		}
	}
	
});