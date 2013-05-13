
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
