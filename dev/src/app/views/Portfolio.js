
AC.View.Portfolio = AC.View.Base.extend({

	id : "portfolio",
	path : "portfolio.html",
	initedLinks : false,
	slug : null,
	detailSwipe : null,

	preloadImg : null,
	preloadedImgAll : false,

	preloadBG : null,

	initialize : function () {
		this.params.projects = this._resizeCover( AC.Data.JSON.portfolio );
		this.params.preloaded = false;
	},

	_resizeCover : function( data ) {

		_.each( data, function ( img ) {

			var 
				imgWidth = img.width,
				imgHeight = img.height,
				extraClass = "",
				extraCSS = "";
				
			if ( imgWidth > imgHeight ) {
				var newW = (220 * imgWidth) / imgHeight;
				extraCSS = "margin-left:" + Math.round(( 220 - newW ) * 0.5) + "px;";
				extraClass = "resized";
			} else {
				var newH = (220 * imgHeight) / imgWidth;
				extraCSS = "margin-top:" + Math.round(( 220 - newH ) * 0.5) + "px;";
			}

			img.extraCSS = extraCSS;
			img.extraClass = extraClass;
		} );

		return data;
	},

	hide : function(callback) {
		
		if ( $("body").data("all-img-loaded") === true ) {
			this.preloadedImgAll = true;
			this.params.preloaded = true;
		}
		
		var $el = $(this.el);
		$el.fadeOut(AC.Data.FADE_OUT_DURATION, function() {
			if (callback) {
				callback();
			}
		});
	},

	_displayComplete : function () {

		$(".project a, .project-detail .project-global-nav a:not(.link-credits)").on("click", function(e){
			e.preventDefault();
			AC.AppRouter.navigate($(this).attr("href"), true);
		});

		$(".link-credits").on("click", function(e){
			e.preventDefault();
			$(".move-current .credits").toggle();
		});

		$(".zoomer").on("click", function(e){
			e.preventDefault();
			$(this).siblings("img").toggleClass("unzoom");
		});

		this.detailSwipe = new Swipe(document.getElementById("detail-slider"), {
			callback : this._callbackSwipe
		});

		if ( !this.preloadedImgAll ) {
			this.addLoaders(".project");
			this.initImgPreload();
		}
		else this.prepImages();

		this.addLoaders(".mouse-move");
		this.initBGPreload();
		this.initProjectNav();
	},

	addLoaders : function(selector) {
		
		$(selector).each(function(index, el){
			var spiner = $(AC.Spinner.el).clone();
			$(el).append( spiner );
		});	
	},

	_callbackSwipe : function(index) {

		$(".current-index .current").html( index + 1 );

		var $currentImg = $(".swipe-wrap .move-current");
		$currentImg
			.removeClass("move-current")
			.find(".credits").hide();
		$($(".swipe-wrap .mouse-move").get(index)).addClass("move-current");
	},

	initImgPreload : function() {

		var 
			o,
			manifest = [];

		$(".to-load").each(function(index, el) {
			
			o = {};
			o.src = $(el).data("src");
			o.id = $(el).data("src");

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
			
			o = {};
			o.src = $("img", el).data("src");
			o.id = $("img", el).data("src");

			manifest.push(o);

			if ( Modernizr.touch ) {
				$(this).css("background-image", "url(" + $("img", el).attr('src') + ")");
			}
		});

		this.preloadBG = new createjs.LoadQueue(true);
		this.preloadBG.addEventListener("fileload", this.handleFileLoadBG );
		this.preloadBG.loadManifest(manifest);
	},

	handleComplete : function() {
		$("body").data("all-img-loaded", true);
	},

	handleFileLoad : function (event) {

		var $el = $("[data-src='" + event.item.id + "']");
		$el
			.removeClass("to-load")
			.attr("src", event.item.src)
			.parents(".project").addClass("loaded");

		// TODO RESIZE IMAGES HERE

		$el.parents(".project").find(".spinner").remove();
	},

	handleFileLoadBG : function (event) {

		var $el = $("[data-src='" + event.item.id + "']"),
			$parent = $el.parent(),
			$spinner = $(".spinner", $parent);

		if ( Modernizr.touch ) {
			$parent.css("background-image", "url(" + event.item.src + ")");

		} else {
			$("[data-src='" + event.item.id + "']")
				.attr("src", event.item.src)
				.addClass("loaded-bg");

			$parent.removeClass("to-load-bg");
		}

		$spinner.remove();
	},

	prepImages : function() {

		$(".to-load").each(function(index, el) {
			var $el = $(el);
			$el
				.removeClass("to-load")
				.attr("src", $(el).data('src'))
				.parents(".project").addClass("loaded");

			// TODO RESIZE IMAGES HERE
		});
	},
	
	initProjectNav : function(){

		var 
			detailSwipe = this.detailSwipe,
			$container = $(".project-detail");

		$(".news-next", $container).on("click", function(e){
			e.preventDefault();
			detailSwipe.next();
		});

		$(".news-prev", $container).on("click", function(e){
			e.preventDefault();
			detailSwipe.prev();
		});

		$(document).keydown(function(e){
			if ( e.keyCode == 37 ) {
				detailSwipe.prev();
			} else if ( e.keyCode == 39 ) {
				detailSwipe.next();
			}
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