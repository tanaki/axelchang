
AC.View.Portfolio = AC.View.Base.extend({

	id : "portfolio",
	path : "portfolio.html",
	initedLinks : false,
	slug : null,
	detailSwipe : null,
	preload : null,
	preloadedAll : false,

	initialize : function () {
		this.params.projects = AC.Data.JSON.portfolio;
	},

	_displayComplete : function () {

		$(".project a, .project-detail .project-global-nav a").on("click", function(e){
			e.preventDefault();
			AC.AppRouter.navigate($(this).attr("href"), true);
		});

		this.detailSwipe = new Swipe(document.getElementById("detail-slider"), {
			callback : this._callbackSwipe
		});

		this.initPreload();
		this.initProjectNav();
	},

	_callbackSwipe : function(index) {
		$(".current-index .current").html( index + 1 );
	},

	initPreload : function() {

		var 
			o,
			manifest = [];

		$(".to-load").each(function(index, el) {
			
			o = {};
			o.src = $(el).data("src");
			o.id = $(el).attr("src");

			manifest.push(o);
		});

		this.preload = new createjs.LoadQueue(true);
		this.preload.addEventListener("fileload", this.handleFileLoad );
		this.preload.loadManifest(manifest);
	},

	handleFileLoad : function (event) {

		$("[src='" + event.item.id + "']")
			.removeClass("to-load")
			.attr("src", event.item.src)
			.addClass("loaded");
	},
	
	initProjectNav : function(){

		var 
			detailSwipe = this.detailSwipe,
			$container = $(".project-detail .project-nav");

		$(".next", $container).on("click", function(e){
			e.preventDefault();
			detailSwipe.next();
		});

		$(".prev", $container).on("click", function(e){
			e.preventDefault();
			detailSwipe.prev();
		});
	},

	update : function ( slug, imgIndex ){

		var 
			self = this,
			projects = this.params.projects;

		this.imgIndex = imgIndex;
		this.slug = slug;

		if ( this.slug ) {

			this.id = "portfolio-detail";

			_.each( projects, function( project, index ){
				if ( project.slug == self.slug ) {
					self.params.project = project;
					if ( index > 0 ) self.params.previous = projects[index - 1];
					else self.params.previous = null;

					if ( index < projects.length ) self.params.next = projects[index + 1];
					else self.params.next = null;
				}
			});
		} else {
			this.id = "portfolio";
		}
	}
	
});