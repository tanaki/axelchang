
AC.View.Home = AC.View.Base.extend({

	id : "home",
	path : "home.html",
	preload : null,
	
	initialize : function() {

		this.params.preloaded = false;

		this.preload = new createjs.LoadQueue(true);
		
		var self = this;
		this.preload.addEventListener("complete", function() {
			self.handleComplete();
		});
		this.preload.addEventListener("fileload", this.handleFileLoad );
		this.preload.loadFile({"src" : "img/bg.jpg", "id" : "home-bg"});
		this.preload.loadFile("img/axel-chang.jpg");
		this.preload.loadFile("img/axel-chang-tablet.jpg");
	},

	handleComplete : function() {

		this.params.preloaded = true;
		$("body").data("home-preload", true);
	},

	handleFileLoad : function(event) {
		
		if ( event.item.id === "home-bg" ) {
			$(".home").addClass("home-loaded");
			$("#img-home").attr("src", "img/bg.jpg");
		}
	},

	hide : function ( callback ) {
		
		$(".home").removeClass("home-loaded");

		var $el = $(this.el);
		$el.fadeOut(AC.Data.FADE_OUT_DURATION, function() {
			if (callback) {
				callback();
			}
		});
	},

	_displayComplete : function() {

		if ( $("body").data("home-preload") ) {
			$(".home").addClass("home-loaded");
		}
	}
	
});