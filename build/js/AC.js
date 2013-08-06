
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

/* DATA */
AC.Data = AC.Data || {};

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

$(window).ready(function(){
	
	AC.AppRouter = new AC.Router();
	Backbone.history.start({ pushState : true });

});

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
		 * display Page
		 * @private
		 */
		displayPage = function ( callbackEvent, hideFirst, urlData ) {

			if ( currentView && hideFirst ) {
				
				currentView.hide( function() {
					displayPage(callbackEvent, false, urlData);
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
		});
		
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
		console.log("PF");
		this.controller.displayPage( AC.Events.SHOW_PORTFOLIO, true, { "slug" : slug, "imgIndex" : imgIndex } );
	},
	
	/*
	 * _aboutAction
	 * @private
	 */
	_aboutAction : function () {
		console.log("about");
		this.controller.displayPage( AC.Events.SHOW_ABOUT, true );
	},
	
	/*
	 * _contactAction
	 * @private
	 */
	_contactAction : function () {
		console.log("contact");
		this.controller.displayPage( AC.Events.SHOW_CONTACT, true );
	},
	
	/*
	 * _newsAction
	 * @private
	 */
	_newsAction : function (slug) {
		console.log("news");
		this.controller.displayPage( AC.Events.SHOW_NEWS, true, slug );
	},
	
	/*
	 * defaultAction
	 * @private
	 */
	_defaultAction : function () {
		console.log("home");
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

		// var $el = $(this.el);
		// $el.hide();

		if (callback) {
			callback();
		}
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
		
		$("body").attr("class", "").addClass(self.id);

		$(this.el).html( this.tpl(this.params) );
		this._displayComplete();

		// .show({
			// complete : self._displayComplete
		// });
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
	
	initialize : function() {
		
	}
	
});

AC.View.Loading = AC.View.Base.extend({

	id : "loading",
	path : "loading.html"
	
});

AC.View.News = AC.View.Base.extend({

	id : "news",
	path : "news.html",

	initialize : function () {
		this.params.news = AC.Data.JSON.news;
	}
	
});

AC.View.Portfolio = AC.View.Base.extend({

	id : "portfolio",
	path : "portfolio.html",
	initedLinks : false,
	slug : null,

	initialize : function () {
		this.params.projects = AC.Data.JSON.portfolio;
	},

	_displayComplete : function () {

		$(".project a, .project-detail .project-global-nav a").on("click", function(e){
			e.preventDefault();
			AC.AppRouter.navigate($(this).attr("href"), true);
		});

		this.initProjectNav();
	},

	initProjectNav : function(){

		var 
			$container = $(".project-detail .project-nav"),
			max = $(".project-item").length - 1,
			$selected, $selectedIndex, newIndex;

		$(".next", $container).on("click", function(e){

			e.preventDefault();

			$selected = $(".selected");
			$selectedIndex = $selected.data("item");

			if ( $selectedIndex >= max ) return;

			$selected
				.addClass("prev")
				.removeClass("selected");

			newIndex = ($selectedIndex + 1);
			$("[data-item='" + newIndex + "']").addClass("selected");

			$(".current-index .current").html(newIndex+1);
		});

		$(".prev", $container).on("click", function(e){

			e.preventDefault();

			$selected = $(".selected");
			$selectedIndex = $selected.data("item");

			if ( $selectedIndex <= 0 ) return;

			$selected.removeClass("selected");

			newIndex = ($selectedIndex - 1);
			$("[data-item='" + newIndex + "']")
				.addClass("selected")
				.removeClass("prev");

			$(".current-index .current").html(newIndex+1);
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