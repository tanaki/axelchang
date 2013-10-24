
AC.View.Home = AC.View.Base.extend({

	id : "home",
	path : "home.html",
	preload : null,
	
	initialize : function() {

		this.preload = new createjs.LoadQueue(true);
		
		this.preload.addEventListener("complete", this.handleComplete );
		this.preload.addEventListener("fileload", this.handleFileLoad );
		this.preload.loadFile({"src" : "img/bg.jpg", "id" : "home-bg"});
		this.preload.loadFile("img/axel-chang.jpg");
		this.preload.loadFile("img/axel-chang-tablet.jpg");
	},

	handleComplete : function() {
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

		if (callback) {
			callback();
		}
	},

	_displayComplete : function() {

		if ( $("body").data("home-preload") ) {
			$(".home").addClass("home-loaded");
			$("#img-home").attr("src", "img/bg.jpg");
		}		
	}
	
});