
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
