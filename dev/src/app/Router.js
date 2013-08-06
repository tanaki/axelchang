
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
