
AC.View.Home = AC.View.Base.extend({

	id : "home",
	path : "home.html",
	preload : null,
	preloaded : false,
	
	initialize : function() {

		this.preload = new createjs.LoadQueue(true);
		
		this.preload.addEventListener("fileload", this.handleFileLoad );
		this.preload.loadFile("img/bg.jpg");
	},

	handleFileLoad : function() {
		$(".home").addClass("home-loaded");
	},

	hide : function ( callback ) {

		if ( $(".home").hasClass("home-loaded") ) this.preloaded = true;
		$(".home").removeClass("home-loaded");

		if (callback) {
			callback();
		}
	},

	_displayComplete : function() {

		if ( this.preloaded ) {
			$(".home").addClass("home-loaded");
		}		
	}
	
});