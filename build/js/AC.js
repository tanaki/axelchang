
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
AC.Locations.JSON = '/data/';

/*
 * EVENTS
 */
AC.Events = {
	APP_LOADING : "APP_LOADING",
    SHOW_HOME : "SHOW_HOME"
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
		displayPage = function ( callbackEvent, slug, hideFirst ) {

			if ( currentView && hideFirst ) {
				
				currentView.hide( function() {
					displayPage(callbackEvent, slug, false);
				});

			} else {

				AC.EventManager.trigger( AC.Events.APP_LOADING );
				AC.DataManager.check( callbackEvent, slug );
			}
		},

		/*
		 * show the page
		 * @private
		 */
		_show = function ( e /*, slug*/ ) {

			var view;
			
			switch ( e.type ) {
				
				case AC.Events.APP_LOADING :
					if ( !loadingView ) loadingView = new AC.View.Loading();
					view = loadingView;
				break;
				
				case AC.Events.SHOW_HOME :
					if ( !homeView ) {
						homeView = new AC.View.Home({
							items : AC.Data.Item
						});
					}
					view = homeView;
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

	itemsLoaded : false,

	check : function ( e, slug ) {

		var self = this;
		self.currentEvent = e;
		self.currentSlug = slug;

		switch ( self.currentEvent ) {
			
			case AC.Events.SHOW_HOME :

				if ( !self.itemsLoaded ) {
					self.getItems();
				} else {
					AC.EventManager.trigger( self.currentEvent, self.currentSlug );
				}
			break;

		}
	},

	getItems : function ( ) {

		var self = this;
		AC.Data.Item = new AC.Collection.ItemCollection();
		AC.Data.Item.fetch({
			success : function() {
				self.itemsLoaded = true;
				self.check( self.currentEvent, self.currentSlug );
			}
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
		"*actions" : "_defaultAction"
	},
	
	/*
	 * defaultAction
	 * @private
	 */
	_defaultAction : function () {
		this.controller.displayPage( AC.Events.SHOW_HOME, true );
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
		$el.hide();

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
		$(this.el).html( this.tpl(this.params) ).show({
			complete : self._displayComplete
		});
	},

	_displayComplete : function () {
		// TODO Overwrite
	}
});


AC.View.Home = AC.View.Base.extend({

	id : "home",
	path : "home.html",
	
	initialize : function(data) {
		this.params.items = data.items.models;
	}
	
});

AC.View.Loading = AC.View.Base.extend({

	id : "loading",
	path : "loading.html"
	
});