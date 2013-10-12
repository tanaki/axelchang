
AC.View.Portfolio = AC.View.Base.extend({

	id : "portfolio",
	path : "portfolio.html",
	initedLinks : false,
	slug : null,
	detailSwipe : null,

	preloadImg : null,
	preloadedImgAll : false,

	preloadBG : null,
	preloadedBGAll : false,

	initialize : function () {
		this.params.projects = AC.Data.JSON.portfolio;
	},

	hide : function(callback) {
		
		if ( $("body").data("all-img-loaded") === true ) 
			this.preloadedImgAll = true;
		
		if ( $("body").data("all-bg-loaded") === true ) 
			this.preloadedBGAll = true;

		if (callback) {
			callback();
		}
	},

	_displayComplete : function () {

		$(".project a, .project-detail .project-global-nav a").on("click", function(e){
			e.preventDefault();
			AC.AppRouter.navigate($(this).attr("href"), true);
		});

		this.detailSwipe = new Swipe(document.getElementById("detail-slider"), {
			callback : this._callbackSwipe
		});

		if ( !this.preloadedImgAll ) this.initImgPreload();
		else this.prepImages();

		if ( !this.preloadedBGAll ) this.initBGPreload();
		else this.prepBG();

		this.initProjectNav();
	},

	_callbackSwipe : function(index) {
		$(".current-index .current").html( index + 1 );
	},

	initImgPreload : function() {

		var 
			o,
			manifest = [];

		$(".to-load").each(function(index, el) {
			
			o = {};
			o.src = $(el).data("src");
			o.id = $(el).attr("src");

			manifest.push(o);
		});

		this.preloadImg = new createjs.LoadQueue(true);
		this.preloadImg.addEventListener("fileload", this.handleFileLoad );
		this.preloadImg.addEventListener("complete", this.handleComplete );
		this.preloadImg.loadManifest(manifest);
	},

	initBGPreload : function() {

		var 
			o,
			manifest = [];

		$(".to-load-bg").each(function(index, el) {

			console.log("add this", index);
			
			o = {};
			o.src = $(el).data("img");
			o.id = $(el).data("img");

			manifest.push(o);
		});

		this.preloadBG = new createjs.LoadQueue(true);
		this.preloadBG.addEventListener("fileload", this.handleFileLoadBG );
		this.preloadBG.addEventListener("complete", this.handleCompleteBG );
		this.preloadBG.loadManifest(manifest);
	},

	handleComplete : function() {
		$("body").data("all-img-loaded", true);
	},

	handleCompleteBG : function() {
		$("body").data("all-bg-loaded", true);
	},

	handleFileLoad : function (event) {

		$("[src='" + event.item.id + "']")
			.removeClass("to-load")
			.attr("src", event.item.src)
			.addClass("loaded");
	},

	handleFileLoadBG : function (event) {

		console.log("loaded", event.item.id);

		$("[data-img='" + event.item.id + "']")
			.removeClass("to-load-bg")
			.css("background-image", "url(" + event.item.src + ")")
			.addClass("loaded-bg");
	},

	prepImages : function() {

		$(".to-load").each(function(index, el) {
			$(el)
				.removeClass("to-load")
				.attr("src", $(el).data('src'))
				.addClass("loaded");
		});
	},

	prepBG : function() {

		$(".to-load-bg").each(function(index, el) {

			$(el)
				.removeClass("to-load-bg")
				.css("background-image", "url(" + $(el).data('img') + ")")
				.addClass("loaded-bg");
		});
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