
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
	},

	handleFileLoad : function(event) {
		
		if ( event.item.id === "home-bg" ) {

			$("body").data("home-preload", true);

			var $spin = $(".spin-box");
			$spin.fadeOut(100, function(){
				$spin.remove();
			});

			$(".home").addClass("home-loaded");
			$("#img-home").attr("src", "img/bg.jpg");
			$(window).resize();
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
	
	_display : function() {
		
		var self = this;
		
		self.slug = self.params.slug;
		self.prevId = $("body").attr("class");
		
		$("body").removeClass(self.prevId).addClass(self.id);

		if ( $("body").data("home-preload") ) {
			$(".home").addClass("home-loaded");
		}

		$(this.el).html( this.tpl(this.params) ).fadeIn(AC.Data.FADE_IN_DURATION, function() {
			self._displayComplete(self);
			$(window).resize();

			AC.Utils.positionFooter(false);
		});
	}
});