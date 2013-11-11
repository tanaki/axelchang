
// Create Namespace
var AC = window.AC || {};

/* EVENT MANAGER */
AC.EventManager = AC.EventManager || $({});

/* COLLECTIONS */
AC.Collection = AC.Collection || {};

/* MODELS */
AC.Model = AC.Model || {};

/* VIEWS */
AC.View = AC.View || {};
AC.View.Components = AC.View.Components || {};

/* DATA */
AC.Data = AC.Data || {};
AC.Data.FADE_IN_DURATION = 400;
AC.Data.FADE_OUT_DURATION = 100;

/* LOCATIONS */
AC.Locations = AC.Locations || {};
AC.Locations.Templates = '/templates/';
AC.Locations.Images = '/img/';
AC.Locations.JSON = '/data/data.json';
// AC.Locations.JSON = 'http://axelchang.com/koken';

/*
 * EVENTS
 */
AC.Events = {
	APP_LOADING : "APP_LOADING",
    SHOW_HOME : "SHOW_HOME",
    SHOW_PORTFOLIO : "SHOW_PORTFOLIO",
    SHOW_ABOUT : "SHOW_ABOUT",
    SHOW_CONTACT : "SHOW_CONTACT",
    SHOW_NEWS : "SHOW_NEWS"
};

/* Spinner options */
AC.SpinOptions = {
	lines: 15,
	length: 0,
	width: 2,
	radius: 15,
	corners: 1,
	rotate: 0,
	direction: 1,
	color: '#000',
	speed: 1.1,
	trail: 10,
	shadow: false,
	hwaccel: false,
	className: 'spinner',
	zIndex: 2e9,
	top: 'auto',
	left: 'auto'
};

$(window).ready(function(){
	
	AC.Spinner = new Spinner( AC.SpinOptions ).spin();
	
	AC.AppRouter = new AC.Router();
	Backbone.history.start({ pushState : true, root : AC.Locations.Root });

	// TEMP
	// $("html").removeClass("no-touch").addClass("touch");

	if ( AC.Utils.isProd ) {
		$("html").on("contextmenu", function(e){
			e.preventDefault();
			alert("© Copyright 2013 - Content Protected");
		});
	}

	if ( !Modernizr.touch ) {
		AC.loop();
		
		$("body").on('mousemove', function(e){
			AC.MouseY = e.pageY;
		});
	}
});

AC.loop = function() {

	
	var $img = $(".mouse-move.move-current img");
	if ( $img.length === 0 ) {
		setTimeout(AC.loop, 600);
		return;
	}

	var 
		refH = $(window).height() - 15,
		currentY = parseInt($img.css("margin-top"), 10),
		imgH = $img.height(),
		maxM = (imgH - refH),
		targetY = -(maxM * (AC.MouseY / refH));

	if ( refH > imgH ) {
		setTimeout(AC.loop, 600);
		return;
	}
	currentY += (targetY - currentY) * 0.15;
	$img.css("margin-top", currentY);

	requestAnimationFrame(AC.loop);
};


AC.Controller = function() {

	var
		eventHandlers = [],

		currentView = null,

		loadingView = null,
		homeView = null,
		portfolioView = null,
		aboutView = null,
		newsView = null,
		contactView = null,
		
		/*
		 * init
		 * @private
		 */
		init = function() {

			_initEventHandlers();
			_initNav();
			_initLang();
		},

		/*
		 * init event handler
		 * @private
		 */
		_initEventHandlers = function() {

			_.each( AC.Events, function(customEvent) {
				eventHandlers[customEvent] = _show;
			});
			
			AC.EventManager.bind(eventHandlers);
		},
		
		/*
		 * init navigation links
		 * @private
		 */
		_initNav = function() {

			$("body").delegate('a[rel=nav], nav a:not(.external)', "click", function(e){
				e.preventDefault();
				AC.AppRouter.navigate($(this).attr("href"), true);
			});
		},
		
		/*
		 * init language links
		 * @private
		 */
		_initLang = function() {

			$('.lang').on("click", function(e){
				e.preventDefault();

				AC.Lang = $(this).data("lang");

				Backbone.history.stop();
				Backbone.history.start();
			});
		},
		
		/*
		 * display Page
		 * @private
		 */
		displayPage = function ( callbackEvent, hideFirst, urlData ) {

			$("nav .selected").removeClass("selected");
			$("nav a[href='/"+Backbone.history.fragment+"']").addClass("selected");

			if ( currentView && hideFirst ) {
				
				currentView.hide( function() {
					displayPage(callbackEvent, false, urlData);

					/*
					if ( _gaq ) {
						_gaq.push(['_trackPageview', '/'+Backbone.history.fragment ]);
					}
					*/
				});

			} else {

				AC.EventManager.trigger( AC.Events.APP_LOADING );
				AC.DataManager.check( callbackEvent, urlData );
			}
		},

		/*
		 * show the page
		 * @private
		 */
		_show = function ( e, urlData ) {

			var view;
			
			switch ( e.type ) {
				
				case AC.Events.APP_LOADING :
					if ( !loadingView ) loadingView = new AC.View.Loading();
					view = loadingView;
				break;
				
				case AC.Events.SHOW_HOME :
					if ( !homeView ) {
						homeView = new AC.View.Home();
					}
					view = homeView;
				break;
				
				case AC.Events.SHOW_ABOUT :
					if ( !aboutView ) {
						aboutView = new AC.View.About();
					}
					view = aboutView;
				break;
				
				case AC.Events.SHOW_PORTFOLIO :
					if ( !portfolioView ) {
						portfolioView = new AC.View.Portfolio();
					}
					portfolioView.update(urlData.slug, urlData.imgIndex );
					view = portfolioView;
				break;
				
				case AC.Events.SHOW_CONTACT :
					if ( !contactView ) {
						contactView = new AC.View.Contact();
					}
					view = contactView;
				break;
				
				case AC.Events.SHOW_NEWS :
					if ( !newsView ) {
						newsView = new AC.View.News();
					}
					view = newsView;
				break;

			}
			
			view.render();
			currentView = view;
		};

	init();
	return {
		displayPage : displayPage
	};
};


AC.DataManager = AC.DataManager || {

	currentEvent : null,
	currentSlug : null,

	dataLoaded : false,

	check : function ( e, slug ) {

		var self = this;
		self.currentEvent = e;
		self.currentSlug = slug;

		switch ( self.currentEvent ) {
			
			case AC.Events.SHOW_HOME :
			case AC.Events.SHOW_ABOUT :
			case AC.Events.SHOW_PORTFOLIO :
			case AC.Events.SHOW_CONTACT :
			case AC.Events.SHOW_NEWS :

				if ( !self.dataLoaded ) {
					self.getData();
				} else {
					AC.EventManager.trigger( self.currentEvent, self.currentSlug );
				}
			break;

		}
	},

	getData : function ( ) {

		var self = this;
		$.get(AC.Locations.JSON, function( data ) {
			
			AC.Data.JSON = data;
						
			self.dataLoaded = true;
			self.check( self.currentEvent, self.currentSlug );
		}, 'json');
		
	}
};


// From http://jsondata.tumblr.com/post/30043887057/backbone-5

AC.TemplateManager = AC.TemplateManager || {

    templates : {},
    get : function (id, path, callback) {

        if (this.templates[id]) {
            return callback(this.templates[id]);
        }

        var 
            url = AC.Locations.Templates + path,
            promise = $.trafficCop(url),
            that = this;

        promise.done(function (template) {
            
            var tmp = _.template(template);
            that.templates[id] = tmp;
            callback(tmp);
        });
    }
};

AC.Router = Backbone.Router.extend({
	
	/*
	 * controller
	 * @private
	 */
	controller : null,

	/*
	 * initialize
	 * @private
	 */
	initialize : function() {

		this.controller = new AC.Controller();
	},

	/*
	 * routes
	 */
	routes : {

		"portfolio" : "_portfolioAction",
		"portfolio/:project" : "_portfolioAction",
		"portfolio/:project/:index" : "_portfolioAction",

		"about" : "_aboutAction",
		"contact" : "_contactAction",

		"news" : "_newsAction",
		"news/:slug" : "_newsAction",

		"*actions" : "_defaultAction"
	},
	
	/*
	 * _portfolioAction
	 * @private
	 */
	_portfolioAction : function (slug, imgIndex) {
		this.controller.displayPage( AC.Events.SHOW_PORTFOLIO, true, { "slug" : slug, "imgIndex" : imgIndex } );
	},
	
	/*
	 * _aboutAction
	 * @private
	 */
	_aboutAction : function () {
		this.controller.displayPage( AC.Events.SHOW_ABOUT, true );
	},
	
	/*
	 * _contactAction
	 * @private
	 */
	_contactAction : function () {
		this.controller.displayPage( AC.Events.SHOW_CONTACT, true );
	},
	
	/*
	 * _newsAction
	 * @private
	 */
	_newsAction : function (slug) {
		this.controller.displayPage( AC.Events.SHOW_NEWS, true, slug );
	},
	
	/*
	 * defaultAction
	 * @private
	 */
	_defaultAction : function () {
		this.controller.displayPage( AC.Events.SHOW_HOME, true );
	}

});


AC.Model.About = Backbone.Model.extend({
	
	defaults: {
		id : 0,
		title : "",
		slug : ""
	},
	
	update : function (){

		console.log( "test", AC.Data.JSON.about );
		
	}
	
});

AC.Model.Item = Backbone.Model.extend({
	
	defaults: {
		id : 0,
		title : "",
		slug : ""
	},
	
	initialize: function(){

	},

	parse : function(data){
		
		this.id = data.id;
		this.title = data.title;
		this.slug = data.slug;

		return this;
	}
	
});

AC.Model.News = Backbone.Model.extend({
	
	defaults: {
		id : 0,
		title : "",
		slug : ""
	},
	
	initialize: function(){
		this.params.news = AC.Data.JSON.news;
	},

	parse : function(data){
		
		this.id = data.id;
		this.title = data.title;
		this.slug = data.slug;

		return this;
	}
	
});

AC.Collection.ItemCollection = Backbone.Collection.extend({
	
	model : AC.Model.Item,
	url : "/data/items.json",
	
	initialize : function() {
		
	},

	parse : function(data){
		return data.items;
	}
	
});

AC.View.Base = Backbone.View.extend({

	id : "",
	path : "",
	el : ".main-content",
	tpl : null,
	collection : null,
	slug : "",
	params : {},

	hide : function ( callback ) {
		
		var $el = $(this.el);
		$el.fadeOut(AC.Data.FADE_OUT_DURATION, function() {
			if (callback) {
				callback();
			}
		});
	},
	
	render : function() {

		this.params.models = this.collection ? this.collection.models : null;
		this.params.slug = this.slug;
		
		var self = this;
		AC.TemplateManager.get( self.id, self.path, function(tpl) {
			self.tpl = tpl;
			self._display();
		});
	},
	
	_display : function() {

		
		var self = this;
		
		self.slug = self.params.slug;
		self.prevId = $("body").attr("class");
		
		$("body").removeClass(self.prevId).addClass(self.id);
		$(this.el).html( this.tpl(this.params) ).fadeIn(AC.Data.FADE_IN_DURATION, function() {
			self._displayComplete(self);
		});
	},

	_displayComplete : function () {
		// TODO Overwrite
	},

	update : function (){
		
	}
});


AC.View.About = AC.View.Base.extend({

	id : "about",
	path : "about.html",

	initialize : function (){
		this.params.about = AC.Data.JSON.about;
	}
	
});

AC.View.Contact = AC.View.Base.extend({

	id : "contact",
	path : "contact.html",

	initialize : function(){
		this.params.contact = AC.Data.JSON.contact;
	}
	
});

AC.View.Home = AC.View.Base.extend({

	id : "home",
	path : "home.html",
	preload : null,
	
	initialize : function() {

		this.params.preloaded = false;

		$(".spin-box").append( $(AC.Spinner.el) );

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
		$(AC.Spinner.el).remove();
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
			$(AC.Spinner.el).remove();
			// $("#img-home").attr("src", "img/bg.jpg");
		}
	}
	
});

AC.View.Loading = AC.View.Base.extend({

	id : "loading",
	path : "loading.html"
	
});

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

		$(document).keydown(function(e){
			if ( e.keyCode == 37 ) {
				newsSwipe.prev();
			} else if ( e.keyCode == 39 ) {
				newsSwipe.next();
			}
		});
	},
	
});

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
		this.params.projects = this._processText( AC.Data.JSON.portfolio );
		this.params.preloaded = false;
	},

	_processText : function( data ) {

		_.each( data, function ( el ) {
			_.each( el.images, function(img) {
				img.credits = AC.Utils.textToHTML(img.credits);
			} );
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

		$(".project a, .project-detail .project-global-nav a").on("click", function(e){
			e.preventDefault();
			AC.AppRouter.navigate($(this).attr("href"), true);
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
		$(".swipe-wrap .move-current").removeClass("move-current");
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

		if ( $el.height() < $($el.parent()).height() ) {
			$el
				.addClass("resized")
				.css("margin-left", (( $($el.parent()).height() - $el.width()) * 0.5) + "px" );
		}

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
			$(el)
				.removeClass("to-load")
				.attr("src", $(el).data('src'))
				.parents(".project").addClass("loaded");
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

AC.View.Components.Zoom = Backbone.View.extend({

	initialize : function (){
		
	}
	
});
AC.Utils = AC.Utils || {};

AC.Utils.textToHTML = function( text ) {

	return text
		.replace(/\[url\(/g, '<a href="')
		.replace(/\)\]/g, '" target="_blank">')
		.replace(/\[\/url\]/g, '</a>')
		.replace(/\[br\]/g, '<br/>');
};